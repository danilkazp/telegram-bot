import { callbackQueryHandlers } from 'modules/bot/bot.controller'

export const matchMessage = (phrase, msg) => {
  const searchPhrase = phrase.toLowerCase()

  return msg.toString().toLowerCase() === searchPhrase
}

export const getInlineKeyboards = (array = [], subArraySize = 3): any[] => {
  const subarray = []
  for (let i = 0; i < Math.ceil(array.length / subArraySize); i++) {
    subarray[i] = array.slice(i * subArraySize, i * subArraySize + subArraySize)
  }

  return subarray
}

export const getInlineKeyboardsPagination = (
  currentPage = 1,
  totalPages = 1,
): any[] => {
  const prevPage = currentPage - 1
  const next = currentPage + 1
  const correctCurrentPage = currentPage || 1
  const correctTotalPages = totalPages < 1 ? 1 : totalPages

  return [
    {
      text: '<',
      callback_data: `[${callbackQueryHandlers.handlePhrasesPagination}]${prevPage}`,
    },
    {
      text: `${correctCurrentPage}/${correctTotalPages}`,
      callback_data: `[${callbackQueryHandlers.handlePhrasesPagination}]${correctCurrentPage}`,
    },
    {
      text: '>',
      callback_data: `[${callbackQueryHandlers.handlePhrasesPagination}]${next}`,
    },
  ]
}
