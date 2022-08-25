import NextAuth, { Awaitable, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { NextApiRequest, NextApiResponse } from 'next'

const nextAuthOptions = (req: NextApiRequest, res: NextApiResponse) => {
  return {
    providers: [
      CredentialsProvider({
        name: 'credentials',
        authorize: async (credentials, _req) => {
          const nonce = req.cookies['auth-nonce']

          const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`
          const messageBytes = new TextEncoder().encode(message)

          const publicKeyBytes = bs58.decode(credentials.publicKey)
          const signatureBytes = bs58.decode(credentials.signature)

          const result = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes)
          if (!result) {
            throw new Error('user can not be authenticated')
          }

          const user = { name: credentials.publicKey }

          return user
        },
        credentials: {
          publicKey: { type: 'text' },
          signature: { type: 'text' }
        }
      })
    ]
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse<unknown>) => {
  return NextAuth(req, res, nextAuthOptions(req, res))
}
