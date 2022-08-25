/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as crypto from 'crypto'

const key = '🔑nV$-🔑-n@t1v3-🔑-prOducti0nS-🔑'
const replaceAll = (str: string, searchValue: string, replaceValue: string) => str.split(searchValue).join(replaceValue)
const swap = (str: string, input: string, output: string) => {
  for (let i = 0; i < input.length; i++) str = replaceAll(str, input[i], output[i])

  return str
}
const createBase64Hmac = (message: string) =>
  swap(
    crypto.createHmac('sha1', key).update(`${message}`).digest('hex'),
    '+=/', // Used to avoid characters that aren't safe in URLs
    '-_,'
  )
const sign = (message: string) => `${new Date().getTime()}-!!-${createBase64Hmac(message)}`
const verify = (message: string, hash: string) => {
  const matches = hash.match(/(.+?)-!!-(.+)/)
  if (!matches) return false

  const hmac = matches[2]

  const expectedHmac = createBase64Hmac(message)
  // Byte lengths must equal, otherwise crypto.timingSafeEqual will throw an exception
  if (hmac.length !== expectedHmac.length) return false

  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))
}

function createDigest(encodedData: string, format: any) {
  return crypto.createHmac('sha256', key).update(encodedData).digest(format)
}

function encode(sourceData: {}) {
  const json = JSON.stringify(sourceData)
  const encodedData = Buffer.from(json).toString('base64')
  return `${encodedData}!${createDigest(encodedData, 'base64')}`
}

function decode(value: string) {
  const [encodedData, sourceDigest] = value.split('!')
  if (!encodedData || !sourceDigest) throw new Error('invalid value(s)')
  const json = Buffer.from(encodedData, 'base64').toString('utf8')
  const decodedData = JSON.parse(json)
  // @ts-ignore
  const checkDigest = createDigest(encodedData)
  const digestsEqual = crypto.timingSafeEqual(
    Buffer.from(sourceDigest, 'base64'),
    // @ts-ignore
    checkDigest
  )
  if (!digestsEqual) throw new Error('invalid value(s)')
  return decodedData
}

export { replaceAll, swap, createBase64Hmac, sign, verify, createDigest, encode, decode }
