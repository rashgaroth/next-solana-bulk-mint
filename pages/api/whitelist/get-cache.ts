/* eslint-disable @typescript-eslint/ban-ts-comment */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { readFile } from 'fs'
import { ICacheResponse } from 'interfaces/responses/ICacheResponse'
import { NextApiRequest, NextApiResponse } from 'next'
import { resolve } from 'path'

const getUserCache = (address) => {
  const path = resolve(process.cwd(), 'sugar')
  const assetsPath = `${path}/config/json/${address}/cache-${address}.json`

  return assetsPath
}

function getData(fileName: string): Promise<string> {
  return new Promise(function (res, reject) {
    readFile(fileName, 'utf8', (err, data) => {
      err ? reject(err) : res(data)
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { address } = req.query

      const userCachePath = getUserCache(address)
      const data = await getData(userCachePath)

      const jsonData = JSON.parse(data)

      return res.status(200).json({ data: jsonData } as ICacheResponse)
    } catch (error) {
      return res.status(400).json({ msg: error.message || 'An error occured' })
    }
  }

  res.status(405)
}
