import {Server} from "socket.io"
import {EventsMap, Room} from "./shared"

export const emitEvent = (io: Server, event: Partial<EventsMap>) => {
  for (const [key, value] of Object.entries(event)) {
    io.emit(key, value)
  }
}
