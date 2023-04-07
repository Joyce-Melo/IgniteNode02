/* eslint-disable prettier/prettier */
// A pasta @types para sobreescrevermos tipagem de outras bilbiotecas
// d. ts -> Definição de tipos, é uma extensão que não terá códigos js dentro, apenas ts

// eslint-disable-next-line no-unused-vars
import {Knex} from 'knex'

declare module 'knex/types/tables' {
    export interface Tables{ // mapeando as tables do nosso db
        transactions: {
            id: string,
            title: string,
            amount: number,
            created_at: string,
            session_id?: string
        } // quais tabelas temos no nosso db, isso possibilitará ele reconhcer nossa tabela por meio do autocomplete, além de mapear todos os campos da tabela, impossiblitando tbm passar campo que não existe
    }
}
