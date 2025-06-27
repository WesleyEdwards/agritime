import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { createSimplyServer } from "simply-served";
import { ServerCtx, simplyServerEndpoints } from "./simplyServerEndpoints";
import { emitEvent, logger } from "./events";
import { events, EventsMap, Room } from "./shared";

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);

const rooms: Map<string, Room> = new Map();

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://app.agritime.wesleyedwards.xyz"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  logger?.("A user is connected", socket.id);

  socket.on(events.upsertUser, (params: EventsMap["upsertUser"]) => {
    rooms.forEach((r) => {
      const newR = r.users.filter((u) => u.id !== params.user.id);
      if (newR.length !== r.users.length) {
        const n = { ...r, users: newR.concat(params.user) };
        emitEvent(io, {
          upsertRoom: {
            room: { ...r, users: newR.concat(params.user) },
          },
        });
        rooms.set(r.id, n);
      }
    });
    emitEvent(io, { upsertUser: params });
  });

  socket.on("disconnect", () => {
    const userId = socket.handshake.auth.userId;
    logger?.(`User ${userId} has disconnected`);
    rooms.forEach((room) => {
      const newUsers = room.users.filter((user) => user.id !== userId);
      if (newUsers.length !== room.users.length) {
        const updatedRoom = { ...room, users: newUsers };
        rooms.set(room.id, updatedRoom);
        emitEvent(io, { upsertRoom: { room: updatedRoom } });
      }
    });
  });
});

const server1 = createSimplyServer<ServerCtx>({
  initContext: { db: { rooms }, io },
  getAuth: () => {
    return {};
  },
  controllers: simplyServerEndpoints,
  afterGenerateEndpoints: (app) => {
    app.get("/", (req, res) => {
      res.send("Welcome to agritime!");
    });
  },
});

server1.generateEndpoints(app);

server.listen(8003, () => {
  console.log("server running at http://localhost:8003");
});
