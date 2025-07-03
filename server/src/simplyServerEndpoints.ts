import {buildRoute, NotFoundError} from "simply-served"
import {Controller} from "simply-served/build/types"
import {Server} from "socket.io"
import {generateCode, reconcileTime} from "./utils"
import {z} from "zod"
import {v4 as uuidv4} from "uuid"
import {emitEvent, logger} from "./events"
import {Room, User} from "./shared"

export type ServerCtx = {
  db: {rooms: Map<string, Room>}
  auth: any
  io: Server
}

export const simplyServerEndpoints: Controller<ServerCtx>[] = [
  {
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
        .build(async ({res, db, body}) => {
          if (body.id) {
            const room = db.rooms.get(body.id)
            if (!room) {
              throw new NotFoundError()
            }
            return res.json(room)
          }
          const room = db.rooms
            .values()
            .find((r) => r.code.toLowerCase() === body.code?.toLowerCase())
          if (!room) {
            throw new NotFoundError()
          }
          return res.json(room)
        }),
      buildRoute<ServerCtx>("post")
        .path("/create-room")
        .build(async ({res, db}) => {
          const room: Room = {
            id: uuidv4(),
            code: generateCode(),
            initTime: 20 * 60 * 1000,
            previousSwitch: Date.now(),
            timerOn: null,
            users: [],
          }
          db.rooms.set(room.id, room)
          logger?.(`Created room ${room.id}`)
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
        .build(async ({res, body, db, io}) => {
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
                reconcileTime(r, Date.now())
                emitEvent(io, {upsertRoom: {room: r}})
              }
            }
          })
          const room = Array.from(db.rooms.values()).find(
            (r) => r.code === body.code
          )
          if (!room) {
            return res.status(404).json({error: "Room not found"})
          }
          return res.json(room)
        }),
      buildRoute<ServerCtx>("post")
        .path("/leave-room")
        .withBody({
          validator: z.object({
            roomId: z.string(),
            userId: z.string(),
          }),
        })
        .build(async ({body, res, db, io}) => {
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
  },
]
