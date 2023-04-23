// import "dotenv/config"; //Dessa forma ele importará única e exclusivamento o .env, porém nós queremos o .env.test também, enrão faremos o seguinte
import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === 'test'){ //quando executamos npm run test, o vitest já preenche automáticamento o NODE_ENV como test
  config({path:'.env.test'}) //Caso seja o teste, estamos passando para o config que o arquivo de variavel de ambiente que ele precisa executar é o .env.test
} else { //caso não o ambiente não seja o de teste
  config() //executamos o cofig direto (lembrando que o config() procura pelo arquivo .env por padrão)
}

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
});

export const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid enviroment variables!", _env.error.format());

  throw new Error("Invalid enviroment variables");
}

export const env = _env.data;
