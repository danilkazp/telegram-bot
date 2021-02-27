import { cleanEnv, port, str } from 'envalid'

function validateEnv() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    MONGO_PATH: str(),
    MONGO_PORT: port(),
    PORT: port(),
  })
}

export default validateEnv
