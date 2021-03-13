import { IPhrase, IPhraseExample } from 'modules/phrase/phrase.interface'

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace)
}

export const formatPhraseForSend = (phrase: IPhrase): string => {
  const title = phrase.text
  let translated = ''
  let examples = ''

  phrase.translation.forEach((translatedText: string, index) => {
    const isLastText = index === phrase.translation.length - 1

    translated = translated + translatedText

    if (!isLastText) {
      translated = translated + ', '
    }
  })
  phrase.examples.forEach((example: IPhraseExample) => {
    examples +=
      '<i>from:</i> ' +
      example.from +
      '\n' +
      '<i>to:</i> ' +
      example.to +
      '\n\n'
  })

  const examplesWithUnderlineTitles = replaceAll(
    examples,
    title,
    `<u>${title}</u>`,
  )

  return `Phrase - <b>${title}</b> \nTranslation: ${translated} \n\nExamples:\n${examplesWithUnderlineTitles}`
}
