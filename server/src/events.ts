import {Server} from "socket.io"
import {EventsMap, Room} from "./shared"

export const logger: ((...data: any[]) => void) | null = console.log as
  | ((...data: any[]) => void)
  | null

export const emitEvent = (io: Server, event: Partial<EventsMap>) => {
  for (const [key, value] of Object.entries(event)) {
    logger?.(`Emitting event: ${key}`, value)
    io.emit(key, value)
  }
}
