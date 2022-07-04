/* eslint-disable prefer-const */
export const decimalNFT = 16
export const decimalBNB = 18

export const makeRandomDeg = (): number => {
  return Math.random() * 10
}

export const toSmallUnit = (price: number, decimal: number): number => {
  return price / Math.pow(10, decimal)
}

export const hideBalance = (price: number, dcm: number) => {
  return toSmallUnit(price, dcm).toString().replace(/[0-9]/g, '*')
}

export const truncate = (str: string, n: number, useWordBoundary: string): string => {
  if (str.length <= n) {
    return str
  }
  const subString = str.substr(0, n - 1) // the original check
  return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString) + '...'
}

export const truncateWalletAddress = (input = '', n = 10): string => {
  if (input.length > n) {
    const sbstr = input.substring(0, n - 1)
    const revSbstr = input
      .split('')
      .reverse()
      .join('')
      .substring(0, n - 2)
    const finalString = `${sbstr} ... ${revSbstr}`
    return finalString
  } else {
    return input
  }
}

export const toNormalUnit = (price: number, decimal: number): number => {
  let unit
  if (typeof price === 'string') {
    parseInt(price)
  }
  unit = BigInt(price * Math.pow(10, decimal))

  return unit
}

export const generateRandomString = (length: number): string => {
  let result = ''
  const characters = '1234567890'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const generatePurchase = (): bigint => BigInt(Math.random() * 61 + Date.now())
export const generateId = (n: number): string => {
  const add = 1
  let max = 12 - add
  // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.
  if (n > max) {
    return generateId(max) + generateId(n - max)
  }

  max = Math.pow(10, n + add)
  const min = max / 10 // Math.pow(10, n) basically
  const number = Math.floor(Math.random() * (max - min + 1)) + min

  return ('' + number).substring(add)
}

export const randomString = (length: number): string => {
  let result = ''
  const characters = 'abcdef1234567890'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const toCodeUnit = (str: string): number[] => {
  const arr: number[] = []
  const buf = new Buffer(str, 'utf16le')
  for (let i = 0; i < buf.length; i++) {
    arr.push(buf[i])
  }
  return arr
}

export const fancyTimeFormat = (duration: number): string => {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600)
  const mins = ~~((duration % 3600) / 60)
  const secs = ~~duration % 60

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = ''

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '')
  ret += '' + secs
  return ret
}
