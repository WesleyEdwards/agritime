import {Server} from "socket.io"
import {Room} from "./shared"
import {emitEvent} from "./events"

export const generateCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let code = ""
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return code
}

export const reconcileTime = (room: Room, when: number) => {
  room.users.forEach((u) => {
    const userJustTimed = u.id === room.timerOn
    if (userJustTimed) {
      const elapsedTime = when - room.previousSwitch
      const remaining = u.timeRemaining - elapsedTime
      u.timeRemaining = remaining
      room.previousSwitch = Date.now()
    }
  })
}

export const updateConnection = (
  rooms: Map<string, Room>,
  io: Server,
  id: string,
  connected: boolean
) => {
  rooms.forEach((room) => {
    const user = room.users.find((u) => u.id == id)
    if (user) {
      user.connected = connected
      room.users = room.users.map((u) => (u.id === user.id ? user : u))
      reconcileTime(room, Date.now())
      rooms.set(room.id, room)
      emitEvent(io, {upsertRoom: {room: room}})
    }
  })
}
