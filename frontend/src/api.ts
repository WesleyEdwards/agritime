import {Room, User} from "./shared"

export const api = {
  getRoom: (body: {code?: string; id?: string}, aborter?: AbortController): Promise<Room> =>
    fetch(`${import.meta.env.VITE_BACKEND_URL}/rest/get-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: aborter?.signal
    }).then((r) => r.json()),

  joinRoom: (body: {code: string; user: User}): Promise<Room> =>
    fetch(`${import.meta.env.VITE_BACKEND_URL}/rest/join-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  createRoom: (body: {user: User}): Promise<Room> =>
    fetch(`${import.meta.env.VITE_BACKEND_URL}/rest/create-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  leaveRoom: (body: {roomId: string; userId: string}): Promise<unknown> =>
    fetch(`${import.meta.env.VITE_BACKEND_URL}/rest/leave-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
}
