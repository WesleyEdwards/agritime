export type User = {
  name: string | undefined
  anonymous: boolean
  connected: boolean
  timeRemaining: number
  order: number
  id: string
}
export type Room = {
  id: string
  code: string
  users: User[]
  // Milliseconds
  initTime: number
  previousSwitch: number
  timerOn: string | null
}

export type EventsMap = {
  upsertRoom: {room: Room}
  upsertUser: {user: User}
  leaveRoom: {}
  switchTime: {
    room: string
    newUser: string | null
    timeOfSwitch: number
  }
}

export const events: {[K in keyof EventsMap]: K} = {
  upsertRoom: "upsertRoom",
  leaveRoom: "leaveRoom",
  upsertUser: "upsertUser",
  switchTime: "switchTime"
}

