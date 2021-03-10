import { get as _get } from 'lodash'

export const getReversoExamples = (reversoResult) => {
  const examples = _get(reversoResult, 'context.examples', [])

  return examples.map((item) => ({
    from: item.from,
    to: item.to,
  }))
}
function getTextBetweenSquareBrackets(text) {
  return text.replace( /(^.*\[|\].*$)/g, '' );
}

export const getGoogleCorrectedText = (googleResult): string => {
  const correctedText = _get(googleResult, 'from.text.value', '')

  return getTextBetweenSquareBrackets(correctedText)
}
