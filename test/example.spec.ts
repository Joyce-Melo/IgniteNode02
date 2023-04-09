/* eslint-disable prettier/prettier */
import {test, beforeAll, afterAll} from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

beforeAll( async () => { // Função que executa uma única vez antes de todos os testes, serve para que tenhamos certeza que todos nossos plugins sejam executados antes, uma vez que obrigatóriamente são todos assincronos, se preciso de um que execute antes de cada teste, o melhor é o beforeEach
    await app.ready() // a função ready devolve um valor válido após o fastify terminar de cadastrar todos os plugins
})

afterAll( async () => {
    await app.close() // Fechar a aplicação, remove-lá da memória
})

test('User is able to create a new transaction', async () => {
   await request(app.server) // O supertest sempre precisa receber como parametro o servidor do node, que é esse que estamos passando
   .post('/transactions')
   .send ({
    title: 'New Transaction',
    amount: 5000,
    type: 'credit'
   })
   .expect(201) // Está validando se o retorno dessa requisição é 201

})