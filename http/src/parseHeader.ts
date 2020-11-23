export default function(rawHeader) {
  return rawHeader
    .split('\n')
    .filter(Boolean)
    .reduce(function(result, current) {
      const keyAndValue = current.split(':')
      return { ...result, [keyAndValue[0]]: keyAndValue[1].trim() }
    }, {})
}