import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary(); // table, tipo da coluna e o nome do campo, e como é uma chave primaria colocamos o .primary()
    table.text("title").notNullable();
    table.decimal("amount", 10, 2).notNullable(); // 10 -> tamanho do numero, 2-> qtd de casas decimais
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transactions");
}
