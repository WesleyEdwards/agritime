import {createContext, Dispatch, SetStateAction, useContext} from "react"
import {User} from "./shared"

type UnauthContext = {
  user: User
  setUser: Dispatch<SetStateAction<User>>
}

export const UnauthContext = createContext<UnauthContext>(
  {} as unknown as UnauthContext
)

export const useUnauthContext = () => {
  const ctx = useContext(UnauthContext)
  return ctx
}
