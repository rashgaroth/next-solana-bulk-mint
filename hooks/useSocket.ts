import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export default function useSocket(url: string) {
  const [socket, setSocket] = useState<Socket>(null)

  useEffect(() => {
    const socketIo = io(url)

    setSocket(socketIo)

    function cleanup() {
      socketIo.disconnect()
    }
    return cleanup

    // should only run once and not on every re-render,
    // so pass an empty array
  }, [])

  return socket
}
