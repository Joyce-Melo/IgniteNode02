/* eslint-disable prettier/prettier */
import 'dotenv/config'
import { z } from 'zod'
// Esse z irá criar um schema, que nada mais é que um formato de dado

const envSchema = z.object({
  // coloco aqui qual que é o formato que irei receber das nossas variáveis de ambiente, faremos para todas as variáveis um único schema, tratando-ás como objeto e não para cada uma separadamente
    DATABASE_URL: z.string(), // se essa env pudesse ser vazia, colocariamos deixariamos DATABASE_URL: z.string().nullbale()
    PORT: z.number().default(3333), // caso esteja vazio ele usará a porta 3333
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production')
})

export const _env = envSchema.safeParse(process.env) // quando chamo o método safeParse, o que estamos fazendo é, pegando o nosso schema acima, passando para ele os dados que estão vindo de process.env e o zod irá fazer automaticamente uma validação, ou seja, dentro de process.env ele irá procurar por uma DATABASE_URL e verificar se é uma string e se está preenhida

if(_env.success === false){
    console.error('Invalid enviroment variables!', _env.error.format()) // formatando o erro com a variavel que está com o erro

    throw new Error('Invalid enviroment variables') // Esse throw aqui irá impedir de o código continuar executando
}

export const env = _env.data