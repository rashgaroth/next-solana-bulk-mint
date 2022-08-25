/* eslint-disable @typescript-eslint/ban-ts-comment */
import { exec } from 'child_process'
import { NextApiRequest, NextApiResponse } from 'next'
import { resolve } from 'path'
import { Server, Socket } from 'socket.io'

type IUserData = {
  candyMachineId: string
  collectionAddress: string
  walletAddress: string
}

const getUserPath = (address) => {
  const path = resolve(process.cwd(), 'sugar')
  const assetsPath = `${path}/${address}/assets`

  return assetsPath
}

const runCommand = (cmd, socket: Socket, emitter: string) => {
  const process = exec(cmd)

  process.stdout.on('data', (data) => {
    socket.emit(emitter, data.toString())
  })

  process.stderr.on('data', (data) => {
    socket.emit(emitter, data.toString())
  })

  process.on('exit', (code) => {
    console.log('onClose ==> ', code.toString())
    socket.emit('success')
  })
}

const socketHandler = (io: Server) => {
  const path = resolve(process.cwd(), 'sugar')
  io.on('connection', async (socket) => {
    socket.on('validate', async (address) => {
      try {
        const keypairPath = `${path}/keypair/json/${address}/${address}.json`
        runCommand(`sugar validate ${getUserPath(address)} --keypair ${keypairPath}`, socket, 'validate')
      } catch (err: any) {
        socket.emit('validate', err.message)
      }
    })
    socket.on('upload', async (address) => {
      try {
        const assetsPath = `${path}/${address}/assets`
        const cachePath = `${path}/config/json/${address}/cache-${address}.json`
        const configPath = `${path}/config/json/${address}/${address}.json`
        const keypairPath = `${path}/keypair/json/${address}/${address}.json`
        runCommand(
          `sugar launch ${assetsPath} --cache ${cachePath} --config ${configPath} --keypair ${keypairPath} --log-level debug`,
          socket,
          'upload'
        )
      } catch (err: any) {
        socket.emit('upload', err.message)
      }
    })
    socket.on('verify', async (address) => {
      try {
        console.log('onVerify')
        const cachePath = `${path}/config/json/${address}/cache-${address}.json`
        const keypairPath = `${path}/keypair/json/${address}/${address}.json`
        runCommand(`sugar verify --cache ${cachePath} --keypair ${keypairPath}`, socket, 'verify')
      } catch (err: any) {
        socket.emit('verify', err.message)
      }
    })
    socket.on('show', async (address) => {
      try {
        console.log('onShow')
        const cachePath = `${path}/config/json/${address}/cache-${address}.json`
        const keypairPath = `${path}/keypair/json/${address}/${address}.json`
        runCommand(`sugar show --cache ${cachePath} --keypair ${keypairPath}`, socket, 'show')
      } catch (err: any) {
        socket.emit('show', err.message)
      }
    })
    socket.on('set-collection', async (userData: string) => {
      try {
        const jsonUserData: IUserData = JSON.parse(userData)
        const { walletAddress, collectionAddress } = jsonUserData
        const cachePath = `${path}/config/json/${walletAddress}/cache-${walletAddress}.json`
        const keypairPath = `${path}/keypair/json/${walletAddress}/${walletAddress}.json`
        runCommand(`sugar collection set --cache ${cachePath} --keypair ${keypairPath} ${collectionAddress}`, socket, 'set-collection')
      } catch (error) {
        socket.emit('set-collection', error.message)
      }
    })
    socket.on('mint-one', async (address, candyMachineAddress) => {
      try {
        const keypairPath = `${path}/keypair/json/${address}/${address}.json`
        const cachePath = `${path}/config/json/${address}/cache-${address}.json`
        runCommand(`sugar mint --cache ${cachePath} --keypair ${keypairPath} --candy-machine ${candyMachineAddress}`, socket, 'mint-one')
      } catch (error) {
        socket.emit('mint-one', error.message)
      }
    })
    socket.on('mint-multiple', async (address, candyMachineAddress, n) => {
      try {
        const keypairPath = `${path}/keypair/json/${address}/${address}.json`
        const cachePath = `${path}/config/json/${address}/cache-${address}.json`
        runCommand(
          `sugar mint --cache ${cachePath} --keypair ${keypairPath} --candy-machine ${candyMachineAddress} -n ${n}`,
          socket,
          'mint-multiple'
        )
      } catch (error) {
        socket.emit('mint-multiple', error.message)
      }
    })
    socket.on('remove-collection', async (userData: string) => {
      try {
        const jsonUserData: IUserData = JSON.parse(userData)
        const { walletAddress, candyMachineId } = jsonUserData
        const cachePath = `${path}/config/json/${walletAddress}/cache-${walletAddress}.json`
        const keypairPath = `${path}/keypair/json/${walletAddress}/${walletAddress}.json`
        runCommand(
          `sugar collection remove --cache ${cachePath} --candy-machine ${candyMachineId} --keypair ${keypairPath}`,
          socket,
          'remove-collection'
        )
      } catch (error) {
        socket.emit('remove-collection', error.message)
      }
    })
  })
}

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  if (res.socket.server.io) {
    console.log('socket is already running')
    // @ts-ignore
    const io = res.socket.server.io
    socketHandler(io)
  } else {
    // @ts-ignore
    const io = new Server(res.socket.server)
    socketHandler(io)
    // @ts-ignore
    res.socket.server.io = io
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler
