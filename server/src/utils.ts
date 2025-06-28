import {Room} from "./shared"

export const generateCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let code = ""
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return code
}

export const reconcileTime = (room: Room, when: number) => {
  room.users.forEach((u) => {
    const userJustTimed = u.id === room.timerOn
    if (userJustTimed) {
      const elapsedTime = (when - room.previousSwitch) / 1000
      const remaining = u.timeRemaining - elapsedTime
      u.timeRemaining = Math.floor(remaining)
    }
  })
}
