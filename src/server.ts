/* eslint-disable prettier/prettier */
import fastify from "fastify"; // importando
import { knex } from "./database";
import crypto from 'node:crypto'
import { env } from "./env";

// eslint-disable-next-line no-unused-vars
const app = fastify(); // inicializando -> note que é muito parecido com express

app.get("/hello", async () => {
    const transaction = await knex('transactions').insert({
      id: crypto.randomUUID(), // Gerando um uuid aleatório com a lib de crypto nativa do node
      title: 'Transação de teste',
      amount: 1000,
    }).returning('*') // retornando as infos que foram inseridos, pq por padrão o kenex não faz isso, pois o próprio sql não o faz, e se eu der só o return abaixo ele não irá retornar as info que acabei de inserir

    return transaction
});

app.listen({ port: env.PORT }).then(() => {
  console.log("HTTP Server Running!");
});
