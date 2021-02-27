export const matchMessage = (phrase, msg) => {
  const searchPhrase = phrase.toLowerCase();

  return msg.toString().toLowerCase() === searchPhrase
}