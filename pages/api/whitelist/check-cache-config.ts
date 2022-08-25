/* eslint-disable @typescript-eslint/ban-ts-comment */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { readFile } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { resolve } from 'path'

const path = resolve(process.cwd(), 'sugar')
const getUserCache = (address) => `${path}/config/json/${address}/cache-${address}.json`
const getUserConfig = (address) => `${path}/config/json/${address}/${address}.json`
const getUserKeyPair = (address) => `${path}/keypair/json/${address}/${address}.json`

function getData(fileName: string): Promise<boolean> {
  return new Promise(function (res) {
    readFile(fileName, 'utf8', (err) => {
      err ? res(false) : res(true)
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { address }: any = req.query

      const isConfigExist = await getData(getUserConfig(address))
      const isCacheExist = await getData(getUserCache(address))
      const isKeypairExist = await getData(getUserKeyPair(address))

      if (isConfigExist && isCacheExist) {
        return res.status(200).json({ isExist: true, isKeypairExist })
      }
      return res.status(200).json({ isExist: false, isKeypairExist })
    } catch (error) {
      return res.status(400).json({ msg: error.message || 'An error occured' })
    }
  }

  res.status(405)
}
