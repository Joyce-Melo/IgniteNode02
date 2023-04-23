import { it, beforeAll, afterAll, describe, expect, beforeEach } from "vitest";
import { execSync } from "node:child_process";
import request from "supertest";
import { app } from "../src/app";

describe("Transactions routes", () => {
  //Esse describe é uma feature do vitest e serve para categorizarmos nossos testes, então aqui dentro iremos colocar todos os testes relacionados as rotas de transações
  //Posso colocar uma categoria dentro da categoria, criando assim subcategorias

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all"); //O ideal é que sempre tenhamos nosso banco zerado para os testes, então vamos primeiro, antes de cada teste, dar um drop no nosso banco, para depois criarmos ele
    execSync("npm run knex migrate:latest"); //esse execSync serve para que consigamos rodar qualquer comando de terminal dentro do nosso cógigo, então aque nesse caso, antes de cada teste, iremos rodar a última migration para não termos erro nas tabelas do banco de teste
  });

  // Aqui podemos usar tando test() quanto it()
  it("User is able to create a new transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "New Transaction",
        amount: 5000,
        type: "credit",
      })
      .expect(201);
  });

  it("should be able to list all transactions", async () => {
    //JAMAIS podemos escreve um teste que dependa de outro teste. Então como iremos listar as transactions por SessionID? Se um depende do outro, então eles deviam ser o mesmo, então o que faremos é, colocar nesse teste um teste de criação para então fazermos a listagem
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New Transaction",
        amount: 5000,
        type: "credit",
      });
    const cookies = createTransactionResponse.get("Set-Cookie"); //estamos acessando o header e pegando o setcookie que é onde está nosso cookie

    const listTransactionResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies) //o método set é do supertest e serve para setarmos uma informação da requisição caso seja necessária para a realização de algum teste
      .expect(200);

    expect(listTransactionResponse.body.transactions).toEqual([
      //Espero que dentro do corpo dessa nossa reponta esteja um array e dentro desse array, tenha um objeto que contenham as infos abaixo (title e amount) que são a que conhecemos, não colocamos o type pq ele não é salvo e portanto não é retornavel na listagem
      expect.objectContaining({
        // lembrando que o .body retorna um objeto, agora o .body.transactions que retorna de fato um array, por isso colocamos o .body.transactions
        title: "New Transaction",
        amount: 5000,
      }),
    ]);
  });

  it("should be able to get a specific transaction", async () => {
    //JAMAIS podemos escreve um teste que dependa de outro teste. Então como iremos listar as transactions por SessionID? Se um depende do outro, então eles deviam ser o mesmo, então o que faremos é, colocar nesse teste um teste de criação para então fazermos a listagem
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New Transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie"); //estamos acessando o header e pegando o setcookie que é onde está nosso cookie

    const listTransactionResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies) //o método set é do supertest e serve para setarmos uma informação da requisição caso seja necessária para a realização de algum teste
      .expect(200);

    const transactionId = listTransactionResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies) //o método set é do supertest e serve para setarmos uma informação da requisição caso seja necessária para a realização de algum teste
      .expect(200);

    expect(getTransactionResponse.body.transaction).toEqual(
      //Aqui não tem o array, pq lá na nossa rota ele retorna o obejto direto
      expect.objectContaining({
        title: "New Transaction",
        amount: 5000,
      })
    );
  });

  it("should be able to get the summary", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Credit Transaction",
        amount: 5000,
        type: "credit",
      });
    const cookies = createTransactionResponse.get("Set-Cookie");

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "Debit transaction",
        amount: 2000,
        type: "debit",
      });

    const summaryReponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies)
      .expect(200);

    expect(summaryReponse.body.summary).toEqual({
      amount: 3000,
    });
  });
});
