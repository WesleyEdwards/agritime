import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);

const rooms: Map<string, Room> = new Map();

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://app.agritime.wesleyedwards.xyz"],
    methods: ["GET", "POST"],
    credentials: true
  },
});

const logger: ((...data: any[]) => void) | null = console.log as
  | ((...data: any[]) => void)
  | null;

app.get("/", (req, res) => {
  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = dirname(__filename);
  // logger?.(__dirname);
  res.send("Welcome!");
});

io.on("connection", (socket) => {
  logger?.("A user is connected");

  addConnectedListeners(socket);
});

function addConnectedListeners(socket: Socket) {
  socket.on(events.joinRoom, (params: EventsMap["joinRoom"]) => {
    logger?.("joinRoom", params);
    rooms.forEach((r) => {
      if (r.id == params.room) {
        if (!r.users.includes(params.user)) {
          r.users.push(params.user);
          io.emit(events.joinRoom, params);
        }
      }
    });
  });

  socket.on(events.createRoom, (params: EventsMap["createRoom"]) => {
    rooms.set(params.room.id, params.room);
    // rooms.push(params.room);
    logger?.("createRoom", params);
    io.emit(events.createRoom, params);
  });

  socket.on(events.upsertUser, (params: EventsMap["upsertUser"]) => {
    rooms.forEach((r) => {
      const newR = r.users.filter((u) => u.id !== params.user.id);

      if (newR.length !== r.users.length) {
        const n = { ...r, users: newR.concat(params.user) };
        logger?.("Updated user name", n);
        rooms.set(r.id, n);
      }
    });

    logger?.("upsertUser", params);
    io.emit(events.upsertUser, params);
  });

  socket.on("disconnect", () => {
    logger?.("A user is disconnected");
  });
}

app.get("/getRooms", async (req, res) => {
  res.send(Array.from(rooms.values()));
});

server.listen(8003, () => {
  console.log("server running at http://localhost:8003");
});

export type User = {
  name: string | undefined;
  id: string;
};

export type EventsMap = {
  createRoom: { room: Room; user: User };
  joinRoom: { room: string; user: User };
  upsertUser: { user: User };
};

export const events: { [K in keyof EventsMap]: K } = {
  joinRoom: "joinRoom",
  createRoom: "createRoom",
  upsertUser: "upsertUser",
};

export type Room = {
  id: string;
  name: string;
  users: User[];
};
