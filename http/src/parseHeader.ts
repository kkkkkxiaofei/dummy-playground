export default function(rawHeader: string) {
  return rawHeader
    .split('\n')
    .filter(Boolean)
    .reduce(function(result: any, current: string) {
      const keyAndValue = current.split(':')
      return { ...result, [keyAndValue[0]]: keyAndValue[1].trim() }
    }, {})
}