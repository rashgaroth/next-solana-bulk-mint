// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import { exec, ExecException } from 'child_process'
import { resolve } from 'path'

interface ILoginResponse extends NextApiResponse {
  nonce: string
}

const execAsync = async (cmd) =>
  await new Promise((res, reject) => {
    exec(cmd, (error: ExecException, stdout: string, stderr: string) => {
      if (error) {
        reject(error)
      } else {
        res(stdout)
      }
    })
  })

export default async function handler(req: NextApiRequest, res: ILoginResponse) {
  if (req.method === 'GET') {
    const { type, address } = req.query

    const path = resolve(process.cwd(), 'sugar')
    const filePath = `${path}/${address}/assets`
    try {
      switch (type) {
        case 'version': {
          const exc = await execAsync('sugar --version')
          res.status(200).json({ msg: exc })
          res.end()
          break
        }
        case 'verify': {
          const exc = await execAsync(`sugar validate ${filePath}`)
          res.status(200).json({ msg: exc })
          res.end()
          break
        }
        case 'solana-config': {
          const exc = await execAsync(`solana config get`)
          res.status(200).json({ msg: exc })
          res.end()
          break
        }
        default: {
          res.status(200).json({ msg: 'nothing to exec' })
          res.end()
          break
        }
      }
    } catch (err) {
      res.status(400).json({ msg: err.message || 'an error occured' })
      res.end()
    }
  }

  res.status(405)
}
