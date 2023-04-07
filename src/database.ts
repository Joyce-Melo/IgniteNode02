import { knex as setupKnex, Knex } from 'knex'

export const config: Knex.Config = {
  // Infos obrigatorias para conexão com o banco, essas abaixo são as obrigatórias para o sqlite, para os outros olhar a documentação
  client: 'sqlite',
  connection: {
    filename: './db/app.db', // ./ Pois o caminho sempre vai ser relativo de onde estou executando o código, ou seja na raiz
  },
  useNullAsDefault: true, // No sqlite não há uma opção para setar um valor como default, mas podemos setar null como default
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
