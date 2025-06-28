import express from "express"
import {createServer} from "node:http"
import {Server} from "socket.io"
import cors from "cors"
import {createSimplyServer} from "simply-served"
import {ServerCtx, simplyServerEndpoints} from "./simplyServerEndpoints"
import {emitEvent, logger} from "./events"
import {events, EventsMap, Room, User} from "./shared"
import {reconcileTime} from "./utils"

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

const updateConnection = (id: string, connected: boolean) => {
  rooms.forEach((room) => {
    const user = room.users.find((u) => u.id == id)
    if (user) {
      const newUser: User = {...user, connected}
      room.users = room.users.map((u) => (u.id === newUser.id ? newUser : u))
      reconcileTime(room, Date.now())
      rooms.set(room.id, room)
      emitEvent(io, {upsertRoom: {room: room}})
    }
  })
}

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId
  logger?.("A user is connected", userId)
  updateConnection(userId, true)

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
    logger?.(`Switch time to ${params.newUser}`)
    const room = rooms.get(params.room)
    if (room) {
      reconcileTime(room, params.timeOfSwitch)

      const newUser = room.users.find((u) => u.id === params.newUser)
      room.timerOn = newUser?.id ?? null
      room.previousSwitch = Date.now()

      emitEvent(io, {upsertRoom: {room}})
    }
  })

  socket.on("disconnect", () => {
    const userId = socket.handshake.auth.userId
    logger?.(`User ${userId} has disconnected`)
    updateConnection(userId, false)
  })
})

const server1 = createSimplyServer<ServerCtx>({
  initContext: {db: {rooms}, io},
  getAuth: () => {
    return {}
  },
  controllers: simplyServerEndpoints,
  afterGenerateEndpoints: (app) => {
    app.get("/", (req, res) => {
      res.send("Welcome to agritime!")
    })
  },
})

server1.generateEndpoints(app)

server.listen(8003, () => {
  console.info("server running at http://localhost:8003")
})
