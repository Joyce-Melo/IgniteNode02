import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // O que irá fazer no nosso banco, criar tabela, adicionar um campo em uma tabela existente, remover uma tabela
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary() // table, tipo da coluna e o nome do campo, e como é uma chave primaria colocamos o .primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable() // 10 -> tamanho do numero, 2-> qtd de casas decimais
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  // O contrário do que o up fez, se no up eu criei uma tabela, no down eu removo ela, se no up criei um campo novo, no down removo esse campo
  await knex.schema.dropTable('transactions')
}
