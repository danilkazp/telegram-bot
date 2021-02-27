import bodyParser from 'body-parser'
import express from 'express'
import BotModule from 'modules/bot/bot.module'
import mongoose from 'mongoose'


class App {
  public app: express.Application

  constructor() {
    this.app = express()

    this.connectToTheDatabase()
    this.initializeMiddlewares()
    this.initializeErrorHandling()
    this.initializeTelegramAPI()
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`)
    })
  }

  public getServer() {
    return this.app
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json())
  }

  private initializeErrorHandling() {
  }

  private initializeTelegramAPI() {
    new BotModule()
  }

  private connectToTheDatabase() {
    const { MONGO_PATH, MONGO_PORT } = process.env
    mongoose
      .connect(`mongodb://${MONGO_PATH}:${MONGO_PORT}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('MongoDB: successfully connected')
      })
      .catch(e => {
        console.error(e)
      })
  }
}

export default App
