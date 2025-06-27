import React, {createContext, useContext, useEffect, useState} from "react"
import {io, Socket} from "socket.io-client"

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

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket", "polling"], // try websocket first
      secure: true,
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

export type User = {
  name: string | undefined
  id: string
}

export type EventsMap = {
  createRoom: {room: Room; user: User}
  joinRoom: {room: string; user: User}
  upsertUser: {user: User}
}

export const events: {[K in keyof EventsMap]: K} = {
  joinRoom: "joinRoom",
  createRoom: "createRoom",
  upsertUser: "upsertUser",
}

export type Room = {
  id: string
  name: string
  users: User[]
}
