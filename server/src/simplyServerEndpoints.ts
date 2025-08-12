import {
  addContext,
  addController,
  buildRoute,
  NotFoundError,
} from "simply-served"
import {Server} from "socket.io"
import {generateCode, reconcileTime} from "./utils"
import {z} from "zod"
import {v4 as uuidv4} from "uuid"
import {emitEvent} from "./events"
import {Room} from "./shared"
import {Express} from "express"

export type ServerCtx = {
  db: {rooms: Map<string, Room>}
  auth: any
  io: Server
}

export const createAgritimeServer = (
  app: Express,
  rooms: Map<string, Room>,
  io: Server
) => {
  app.use(addContext<ServerCtx>({db: {rooms}, io}))

  app.get("/", (req, res) => {
    res.send("Welcome to Agritime!")
  })

  addController<ServerCtx>(app, {
    path: "/rest",
    routes: [
      buildRoute<ServerCtx>("post")
        .path("/get-room")
        .withBody({
          validator: z.object({
            id: z.string().optional(),
            code: z.string().optional(),
          }),
        })
        .build(async ({db, body}, res) => {
          if (body.id) {
            const room = db.rooms.get(body.id)
            if (!room) {
              throw new NotFoundError()
            }
            return res.json(room)
          }
          for (const [_, room] of db.rooms) {
            if (room.code.toLowerCase() === body.code?.toLowerCase()) {
              return res.json(room)
            }
          }
          throw new NotFoundError()
        }),

      buildRoute<ServerCtx>("post")
        .path("/create-room")
        .withBody({
          validator: z.object({
            initTime: z.number(),
            additionalUsers: z
              .object({
                id: z.string(),
                anonymous: z.boolean(),
                connected: z.boolean(),
                name: z.string(),
              })
              .array(),
          }),
        })
        .build(async ({db, body}, res) => {
          const room: Room = {
            id: uuidv4(),
            code: generateCode(),
            initTime: body.initTime,
            previousSwitch: Date.now(),
            timerOn: null,
            users: body.additionalUsers.map((u, i) => ({
              ...u,
              connected: false,
              anonymous: true,
              timeRemaining: body.initTime,
              order: i,
            })),
          }
          db.rooms.set(room.id, room)
          return res.json(room)
        }),

      buildRoute<ServerCtx>("post")
        .path("/join-room")
        .withBody({
          validator: z.object({
            code: z.string(),
            user: z.object({
              id: z.string(),
              anonymous: z.boolean(),
              connected: z.boolean(),
              name: z.string(),
            }),
          }),
        })
        .build(async ({body, db, io}, res) => {
          db.rooms.forEach((r) => {
            if (r.code == body.code) {
              if (!r.users.some((u) => u.id === body.user.id)) {
                const len = r.users.length
                r.users.push({
                  ...body.user,
                  connected: true,
                  anonymous: false,
                  timeRemaining: r.initTime,
                  order: len,
                })
                r.users = r.users
                  .sort((a, b) => {
                    if (a.connected && !b.connected) return -1
                    if (!a.connected && b.connected) return 1
                    return 0
                  })
                  .map((u, i) => ({...u, order: i}))
                reconcileTime(r, Date.now())
                emitEvent(io, {upsertRoom: {room: r}})
              }
            }
          })
          for (const [_, value] of db.rooms) {
            if (value.code === body.code) {
              return res.json(value)
            }
          }
          return res.status(404).json({error: "Room not found"})
        }),

      buildRoute<ServerCtx>("post")
        .path("/leave-room")
        .withBody({
          validator: z.object({
            roomId: z.string(),
            userId: z.string(),
          }),
        })
        .build(async ({body, db, io}, res) => {
          const room = db.rooms.get(body.roomId)
          if (!room) return res.status(404).json({error: "Room not found"})
          const user = room.users.find((u) => u.id === body.userId)
          if (user) {
            user.connected = false
            user.timeRemaining = -1
            emitEvent(io, {upsertUser: {user: user}})
            room.users = room.users.filter((u) => u.id !== body.userId)
            emitEvent(io, {upsertRoom: {room}})
          }
          return res.json({ok: true})
        }),
    ],
  })
}
