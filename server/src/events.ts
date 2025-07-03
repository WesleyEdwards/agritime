import {Server} from "socket.io"
import {EventsMap, Room} from "./shared"

type Logger = ((...data: any[]) => void) | null

export const logger: ((...data: any[]) => void) | null = console.log as Logger

export const emitEvent = (
  io: Server,
  event: Partial<EventsMap>,
  log?: Logger
) => {
  for (const [key, value] of Object.entries(event)) {
    log?.(`Emitting event: ${key}`, value)
    io.emit(key, value)
  }
}
