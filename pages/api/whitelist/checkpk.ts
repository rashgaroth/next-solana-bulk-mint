/* eslint-disable @typescript-eslint/ban-ts-comment */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import crypto from 'crypto'
import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import bs58 from 'bs58.bundle'
import * as web3 from '@solana/web3.js'

interface ICheckerResponse extends NextApiResponse {
  pkArray: string
  pubkey: string
}

export default function handler(req: NextApiRequest, res: ICheckerResponse) {
  if (req.method === 'GET') {
    try {
      const { pk }: any = req.query
      // @ts-ignore
      const { decode } = bs58
      const b = decode(pk)
      const j = new Uint8Array(b.buffer, b.byteOffset, b.byteLength / Uint8Array.BYTES_PER_ELEMENT).toString()
      const parsedString: number[] = JSON.parse(`[${j}]`)
      const pkArray = parsedString.slice(0, 32)
      const pubkeyKeypair = web3.Keypair.fromSeed(Uint8Array.from(pkArray))
      const pubkey = pubkeyKeypair.publicKey.toBase58()

      return res.status(200).json({ pkArray: `[${j}]`, pubkey: pubkey } as ICheckerResponse)
    } catch (error) {
      return res.status(400).json({ msg: error.message || 'An error occured' })
    }
  }

  res.status(405)
}
