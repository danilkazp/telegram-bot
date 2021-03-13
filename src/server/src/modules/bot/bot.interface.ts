export interface IBotMsgFrom {
  id: number
  is_bot: boolean
  first_name: string
  last_name: string
  username: string
  language_code: string
}

export interface IBotMsgChat {
  id: number
  first_name: string
  last_name: string
  username: string
  type: string
}

export interface IBotMsgInlineKeyboard {
  text: string
  callback_data: string
}

export interface IBotMsgReplyMarkup {
  inline_keyboard: IBotMsgInlineKeyboard[]
}

export interface IBotMsg {
  message_id: number
  from: IBotMsgFrom
  chat: IBotMsgChat
  data: number
  text: string
  reply_markup?: IBotMsgReplyMarkup
}

export interface IBotQuery {
  id: string
  from: IBotMsgFrom
  message: IBotMsg
  chat_instance: string
  data: string
}
