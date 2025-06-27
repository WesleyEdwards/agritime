import React, {createContext, useContext, useEffect, useState} from "react"
import {io, Socket} from "socket.io-client"
import { useUnauthContext } from "./useAuth"

interface SocketContextType {
  socket: Socket
}

export const SocketContext = createContext<SocketContextType | null>(null)

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const {user} = useUnauthContext()

  useEffect(() => {
    console.log("HERE USER IS: $", user)
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket", "polling"], // try websocket first
      secure: true,
      auth: {userId: user.id}
    })
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  if (!socket) return null

  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  )
}

export const useSocketContext = () => {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error("Not defined")

  return ctx
}
