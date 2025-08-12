import express from "express"
import {createServer} from "node:http"
import {Server} from "socket.io"
import cors from "cors"
import {createAgritimeServer} from "./simplyServerEndpoints"
import {emitEvent} from "./events"
import {events, EventsMap, Room, User} from "./shared"
import {reconcileTime, updateConnection} from "./utils"

const app = express()
app.use(cors())
app.use(express.json())

const server = createServer(app)

const rooms: Map<string, Room> = new Map()

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://app.agritime.wesleyedwards.xyz"],
    methods: ["GET", "POST"],
    credentials: true,
  },
})

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId
  updateConnection(rooms, io, userId, true)

  socket.on(events.upsertUser, (params: EventsMap["upsertUser"]) => {
    rooms.forEach((r) => {
      const newR = r.users.filter((u) => u.id !== params.user.id)
      if (newR.length !== r.users.length) {
        const user: User = {
          ...params.user,
          connected: true,
          anonymous: false,
          timeRemaining: r.initTime,
        }
        const n = {...r, users: newR.concat(user)}
        emitEvent(io, {upsertRoom: {room: n}})
        rooms.set(r.id, n)
      }
    })
    emitEvent(io, {upsertUser: params})
  })

  socket.on(events.switchTime, (params: EventsMap["switchTime"]) => {
    const room = rooms.get(params.room)
    if (room) {
      reconcileTime(room, params.timeOfSwitch)

      const newUser = room.users.find((u) => u.id === params.newUser)
      room.timerOn = newUser?.id ?? null
      room.previousSwitch = Date.now()

      emitEvent(io, {upsertRoom: {room}})
    }
  })

  socket.on(events.upsertRoom, (params: EventsMap["upsertRoom"]) => {
    rooms.set(params.room.id, params.room)
    emitEvent(io, {upsertRoom: params})
  })

  socket.on("disconnect", () => {
    const userId = socket.handshake.auth.userId
    updateConnection(rooms, io, userId, false)
  })
})

// REST Endpoints
createAgritimeServer(app, rooms, io)

server.listen(8003, () => {
  console.info("listening on port 8003")
})
