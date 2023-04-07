/* eslint-disable prettier/prettier */
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import crypto, { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, reply) => {
    // Isso é um pre Handler global dentro desse contexto, ou seja, ee irá valer para todas as rotas DESSE plugin, e não irá interferir nas rotas dos outros plugins
    console.log(`[${request.method}] ${request.url}`); // isso é como se fosse um log
  });

  app.get(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const transactions = await knex("transactions")
        .where("session_id", sessionId)
        .select(); // se eu não pssar nado no select() ele buscará todos

      return {
        // trabalhar com objeto assim ao invés do return direto é melhor, pois se um dia houver necessidade de adicionar mais infos ao return fica mais fácil de faze-lo
        transactions,
      };
    }
  );

  app.get("/:id", { preHandler: [checkSessionIdExists] }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionParamsSchema.parse(request.params);

    const { sessionId } = request.cookies;

    const transaction = await knex("transactions")
      .where({
        session_id: sessionId,
        id,
      })
      .first(); // cada transação terá um id único, como estou procurando apenas por um id, peço para ele me trazer o primeiro que encontrar, se eu não passar o first ele irá retornar um array
    // .where(campo, valor)

    return { transaction };
  });

  app.get(
    "/summary",
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies;

      const summary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first(); // Esse sum é uma função sql que irá somar todos os valores de determinada coluna, para que ele entenda que o retorno é um só coloco o .first, caso contrário ele retornará um array, coloco o as amout pq se não ele traz o sum 'amount' no retorno, assim ele só traz o "amount": valorDoAmount

      return { summary };
    }
  );

  app.post("/", async (request, reply) => {
    // o response o fastfy é o reply, é basicamente a msm coisa com a nomenclatura diferente

    // validando o body da requisição e gerando os tipos
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    // validando os dados do request.body para verificar se ele batem com o schema que eu defini, que é um schema de validação
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    ); // se der ruim o parse dá um throw no erro, etnão nada que está aqui embaixo irá executar se essa linha não passar

    let sessionId = request.cookies.sessionId; // Estou procurando, dentro dos cookies da minha requisição se já existe uma sessionId, se já existir, iremos passar ali emabaixo

    if (!sessionId) {
      // se não existir, se esse user não tiver nos cookies dele uma sessionId, eu irei criar um novo id de sessão para ele e irei salvar nos cookies uma info chamada sesionId com esse valor que acabei de criar
      sessionId = randomUUID();
      reply.cookie("sessionId", sessionId, {
        path: "/", // quais rotas podem acessar, se deixo só / então qualquer rota pode acessar
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        // dica de clean code, o ideal é deixarmos dessa forma, ao invés de colocarmos o valor final, e colocarmos um comentário do que esse número represneta, que no nosso caso é o tempo de 7 dias
        // Passamos em miliseguintos o quanto tempo esse cookie deve durar no navegador desse nosso usuário
      });
    }

    await knex("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1, // se for credito adiciona como recebeu, se for debido multiplica por -1
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
