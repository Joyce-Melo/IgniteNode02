/* eslint-disable prettier/prettier */
import fastify from "fastify"; // importando
import { knex } from "./database";

// eslint-disable-next-line no-unused-vars
const app = fastify(); // inicializando -> note que é muito parecido com express

app.get("/hello", async () => {
    const tables = await knex('sqlite_schema').select('*')

    return tables
});

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP Server Running!");
});
