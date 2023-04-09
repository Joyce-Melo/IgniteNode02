/* eslint-disable prettier/prettier */
import fastify from "fastify"; // importando
import cookie from '@fastify/cookie'
import { transactionRoutes } from "./routes/transactions";

// eslint-disable-next-line no-unused-vars
export const app = fastify(); // inicializando -> note que é muito parecido com express

app.register(cookie) // O cadastro dos cookies deve vir antes das rotas
app.register(transactionRoutes, {
  prefix: 'transactions', // Estamos definindo que todas as rotas desse nooso plguin terão o prefixo de transactions, então será localhost:port/transaction/OQueEstáDentroDoPlugin
}) // nosso plugin
