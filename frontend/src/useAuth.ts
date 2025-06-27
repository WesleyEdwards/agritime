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
import {User} from "./sockets"

type AuthContextType = {}

export const AuthContext = createContext<AuthContextType>(
  {} as unknown as AuthContextType
)

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

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  return ctx
}

// const timedToken = (refresh: string) => {
//   let lastPull = new Date();
//   let expires_in = 0;
//   let accessToken = "";

//   return async () => {
//     const timedOut =
//       new Date().getTime() - lastPull.getTime() > 1_000 * 60 * expires_in; //  1_000 * 60 * 3;

//     if (!accessToken || timedOut) {
//       lastPull = new Date();
//       return new LiveApi(createBasicFetcher("http://localhost:8080")).userAuth
//         .getTokenSimple(refresh)
//         .then((token) => {
//           accessToken = token;
//           return token;
//         });
//     }
//     return accessToken;
//   };
// };

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
  const [s, setS] = useState<T>((initValue ?? null) as T)
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

  return [s, setS] as const
}
