import { callbackQueryHandlers, commands } from 'modules/bot/bot.constants'
import { IBotMsgInlineKeyboard, IBotQuery } from 'modules/bot/bot.interface'
import {
  defaultPagination,
  matchTextBetweenSquareBrackets,
} from 'modules/phrase/phrase.constants'
import { IPagination } from 'modules/phrase/phrase.interface'

export const isTextEqual = (phrase: string, msg: string): boolean => {
  const searchPhrase = phrase.toLowerCase()

  return msg.toString().toLowerCase() === searchPhrase
}

export const getReplayMockup = (array = [], subArraySize = 3): any[] => {
  const subarray = []
  for (let i = 0; i < Math.ceil(array.length / subArraySize); i++) {
    subarray[i] = array.slice(i * subArraySize, i * subArraySize + subArraySize)
  }

  return subarray
}

export const getPaginationByPage = (page: number): IPagination => {
  return {
    limit: defaultPagination.limit,
    offset: page * defaultPagination.limit - defaultPagination.limit,
  }
}

export const getPageByPagination = (pagination: IPagination): number => {
  const firstPage = pagination.offset === 0
  const page = pagination.offset / defaultPagination.limit

  return firstPage ? page : page + 1
}

export const getInlineKeyboardsPagination = (
  currentPage = 1,
  totalPages = 1,
): IBotMsgInlineKeyboard[] => {
  const correctCurrentPage = currentPage || 1
  const prevPage = correctCurrentPage - 1
  const nextPage = correctCurrentPage + 1
  const correctPrevPage = prevPage < 1 ? totalPages : prevPage
  const correctNextPage = nextPage > totalPages ? 1 : nextPage
  const correctTotalPages = totalPages < 1 ? 1 : totalPages

  return [
    {
      text: '<',
      callback_data: `[${callbackQueryHandlers.handlePhrasesPagination}]${correctPrevPage}`,
    },
    {
      text: `${correctCurrentPage}/${correctTotalPages}`,
      callback_data: `[${callbackQueryHandlers.handlePhrasesPagination}]${correctCurrentPage}`,
    },
    {
      text: '>',
      callback_data: `[${callbackQueryHandlers.handlePhrasesPagination}]${correctNextPage}`,
    },
  ]
}

export const getCallbackQueryHandler = (query: IBotQuery): string => {
  return query.data.match(matchTextBetweenSquareBrackets)[1]
}

export const getStartMarkup = () => {
  return {
    keyboard: getReplayMockup([commands.getPhrasesList, commands.settings], 1),
  }
}
