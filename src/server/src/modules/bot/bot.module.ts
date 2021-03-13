import 'reflect-metadata'

import TelegramBot from 'node-telegram-bot-api'

import BotApiService from 'modules/bot/bot-api.service'
import BotController from 'modules/bot/bot.controller'
import { isTextEqual } from 'modules/bot/utils/bot.utils'
import PhraseModule from 'modules/phrase/phrase.module'
import TranslatorModule from 'modules/translator/translator.module'

class BotModule {
  public telegramBot: any
  public botController: BotController
  public phraseModule: PhraseModule
  public translatorModule: TranslatorModule
  public services: Record<string, any> = {}
  private subscribersOfCommands: Record<string, any>[] = []
  private subscribersOfMessages: Record<string, any>[] = []

  constructor() {
    this.init()
    this.initServices()
    this.initController()
    this.initModules()
    this.initCommandSubscribers()
    this.initMessageSubscribers()
  }

  init() {
    const telegramApiToken = process.env.TELEGRAMA_API_TOKEN
    const telegramBot = new TelegramBot(telegramApiToken, { polling: true })

    this.telegramBot = telegramBot
  }

  initModules() {
    this.translatorModule = new TranslatorModule()
    this.phraseModule = new PhraseModule(this)
  }

  initServices() {
    this.services = {
      botApiService: new BotApiService(this),
    }
  }

  initController() {
    this.botController = new BotController(this)
    const controllerProperties = Object.getOwnPropertyNames(
      BotController.prototype,
    )

    controllerProperties.forEach((propertyKey) => {
      const property = this.botController[propertyKey]

      if (typeof property === 'function') {
        const controllerMethod = property.bind(this.botController)
        const metaDataValue = Reflect.getMetadata('metaData', property)
        if (!metaDataValue) return

        const { callMethod, matchText, matchMessage } = metaDataValue

        if (callMethod && matchText) {
          this.subscribersOfCommands.push({
            params: [matchText, controllerMethod],
            callMethod,
          })
        } else if (matchMessage) {
          this.subscribersOfMessages.push({
            matchMessage,
            controllerMethod,
          })
        }
      }
    })
  }

  initCommandSubscribers() {
    this.subscribersOfCommands.forEach((subscriber) => {
      const { callMethod, params } = subscriber

      this.telegramBot[callMethod](...params)
    })
  }

  initMessageSubscribers() {
    this.telegramBot.on('message', async (msg) => {
      console.log('###-msg', msg)

      const foundSubscriber = this.subscribersOfMessages.find((subscriber) => {
        return isTextEqual(subscriber.matchMessage, msg.text)
      })

      if (foundSubscriber) {
        foundSubscriber.controllerMethod(msg)
      } else {
        await this.botController.handleNotMatchedMessages(msg)
      }
    })
  }
}

export default BotModule
