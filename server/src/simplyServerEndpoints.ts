import { buildRoute } from "simply-served";
import { Controller } from "simply-served/build/types";
import { Server } from "socket.io";
import { generateCode } from "./utils";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { emitEvent, logger } from "./events";
import { Room } from "./shared";

export type ServerCtx = {
  db: { rooms: Map<string, Room> };
  auth: any;
  io: Server;
};

export const simplyServerEndpoints: Controller<ServerCtx>[] = [
  {
    path: "/rest",
    routes: [
      buildRoute<ServerCtx>("get")
        .path("/get-rooms")
        .build(async ({ res, db }) => {
          return res.json(Array.from(db.rooms.values()));
        }),
      buildRoute<ServerCtx>("post")
        .path("/create-room")
        .build(async ({ res, db }) => {
          const room = {
            id: uuidv4(),
            code: generateCode(),
            users: [],
          };
          db.rooms.set(room.id, room);
          logger?.("createRoom", room);
          return res.json(room);
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
        .build(async ({ res, body, db, io }) => {
          db.rooms.forEach((r) => {
            if (r.code == body.code) {
              if (!r.users.some((u) => u.id === body.user.id)) {
                r.users.push(body.user);
                emitEvent(io, { upsertRoom: { room: r } });
              }
            }
          });
          const room = Array.from(db.rooms.values()).find(
            (r) => r.code === body.code
          );
          if (!room) {
            return res.status(404).json({ error: "Room not found" });
          }
          return res.json(room);
        }),
    ],
  },
];
