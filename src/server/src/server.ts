import 'dotenv/config'

import App from 'src/app'
import validateEnv from 'src/utils/validateEnv'

validateEnv()
try {
  const app = new App()
  app.listen()
} catch (e) {
  console.error('Global error handler', e)
}
