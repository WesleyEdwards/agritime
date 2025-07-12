import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
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

type Encoder<T> = {
  encode: (s: T) => string
  decode: (s: string) => T
}

export function usePersistentState<T>(
  key: string,
  initValue: T,
  encoder: Encoder<T> = {
    encode: (v) => JSON.stringify(v),
    decode: (v) => JSON.parse(v),
  }
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [s, setS] = useState<T>(null as T)
  const loaded = useRef(false)
  const actualKey = useMemo(() => `${key}`, [key])

  useEffect(() => {
    if (loaded.current) {
      localStorage.setItem(actualKey, encoder.encode(s))
      setS(s)
    }
  }, [s, actualKey])

  useEffect(() => {
    if (!loaded.current) {
      const prev = window.localStorage.getItem(actualKey)

      const actualValue = prev === null ? initValue : encoder.decode(prev)

      setS(actualValue)
      // wait for the next render
      new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
        loaded.current = true
      })
    }
  }, [actualKey])
  if (s === null || s === undefined) {
    const prev = window.localStorage.getItem(actualKey)
    const actualValue = prev === null ? initValue : encoder.decode(prev)
    if (actualValue) {
      return [actualValue, setS] as const
    }
  }

  return [s, setS] as const
}
