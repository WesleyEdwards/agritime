// Generate a random code of 5 char

import {Autorenew} from "@mui/icons-material"
import {IconButton} from "@mui/joy"
import {useState, useRef, useMemo, useEffect} from "react"

export const RandomNameEndAdornment = ({
  setName,
}: {
  setName: (n: string) => void
}) => {
  return (
    <IconButton
      onClick={() => {
        setName(generateRandomName())
      }}
    >
      <Autorenew />
    </IconButton>
  )
}

// Creates a name for a user, "Anonymous <random animal name>"
export const generateRandomName = () => {
  return `Anonymous ${
    animalNames[Math.floor(Math.random() * animalNames.length)]
  }`
}

export const animalNames = [
  "Dog",
  "Cat",
  "Rat",
  "Bat",
  "Elephant",
  "Hamster",
  "Dragon",
  "Giraffe",
  "Chinchilla",
  "Axolotl",
  "Cheetah",
  "Liger",
  "Tiger",
  "Lion",
  "Badger",
  "Possum",
  "Dire wolf",
  "Raven",
  "Racoon",
  "Panda",
  "Cockatiel",
  "Toucan",
  "Crane",
  "Frog",
  "Spider",
  "Rabbit",
  "Hare",
  "Bear",
  "Deer",
  "Horse",
  "Squirrel",
  "Mouse",
  "Boar",
  "Fox",
  "Owl",
  "Butterfly",
  "Jaguar",
  "Boa",
  "Peacock",
  "Antelope",
  "Leopard",
  "Polar bear",
  "Crocodile",
  "Pistol shrimp",
  "Eagle",
  "Magpie",
  "Whale",
  "Swan",
  "Bobcat",
  "Rattlesnake",
  "Zebra",
  "Vulture",
  "Koala",
  "Shark",
  "Octopus",
  "Squid",
  "Crab",
  "Cuttlefish",
  "Hedgehog",
  "Lizard",
  "Wildebeest",
  "Buffalo",
  "Warthog",
  "Bison",
  "Impala",
  "Pheasant",
  "Mole",
  "Chameleon",
  "Guinea pig",
  "Capybara",
  "Kangaroo",
  "Penguin",
  "Monkey",
  "Ape",
  "Snail",
  "Sandworm",
  "Jellyfish",
  "Sea Cucumber",
  "Moth",
  "Crow",
  "Donkey",
  "Wallaby",
  "Starfish",
  "Hyena",
  "Boobie",
  "Robin",
  "Hippo",
  "Rhino",
  "Cougar",
  "Cow",
  "Turtle",
  "Dingo",
  "Flamingo",
  "Coyote",
  "Fennec fox",
  "Dragon fly",
  "Porcupine",
  "Condor",
  "Kiwi",
  "Emu",
]

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
