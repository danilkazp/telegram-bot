Example methods:
bot.sendMessage(msg.chat.id, `Введите настройки для sms провайдера. api-id:`, {
  reply_markup: {
    force_reply: true
  }
}).then(addApiId => {
  console.log('###-addApiId', addApiId)
})