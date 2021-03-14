import { get as _get, uniq as _uniq } from 'lodash'

export const getReversoExamples = (reversoResult) => {
  console.log('###-reversoResult', reversoResult)
  
  const examples = _get(reversoResult, 'context.examples', [])
  console.log('###-examples', examples)
  
  return examples.map((item) => ({
    from: item.from,
    to: item.to,
  }))
}
function getTextBetweenSquareBrackets(text) {
  return text.replace(/(^.*\[|\].*$)/g, '')
}

export const getGoogleCorrectedText = (googleResult): string => {
  const correctedText = _get(googleResult, 'from.text.value', '')

  return getTextBetweenSquareBrackets(correctedText)
}

export const getUniqTranslation = (translation: string[] = []): string[] => {
  return _uniq(translation.map((t) => t.toLowerCase()))
}
