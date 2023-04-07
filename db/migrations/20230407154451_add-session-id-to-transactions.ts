import { Knex } from 'knex'

// Migration para alterar uma tabela, por isso é um alter table
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.uuid('session_id').after('id').index() // Esse index sinaliza que esse campo será muito utilizado no where por exemplo, isso vai fazer com que o knex "guarde" em cash de qualis sessions id possuem quias transações e isso tornará nossas pesquisas mais rápidas
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('session_id')
  })
}
