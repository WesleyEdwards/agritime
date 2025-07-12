import {
  useColorScheme,
  Dropdown,
  MenuButton,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/joy"
import {useEffect} from "react"
import agritimeImg from "../assets/agritime.png"

export const AppSettings = () => {
  const {mode, setMode} = useColorScheme()

  useEffect(() => {
    // const prefersDarkMode = window.matchMedia(
    //   "(prefers-color-scheme: dark)"
    // ).matches
    // setMode(prefersDarkMode === true ? "dark" : "light")
  }, [])

  return (
    <>
      <Dropdown>
        <MenuButton slots={{root: IconButton}}>
            {/* <Settings /> */}
          {/* <img src={agritimeImg} width="50px" height="50px" /> */}
        </MenuButton>
        <Menu sx={{p: "1rem"}}>
          <MenuItem
            slots={{root: Button}}
            sx={{mb: "1rem"}}
            onClick={() => {
              setMode(mode === "dark" ? "light" : "dark")
            }}
          >
            {mode === "dark" ? "Light Mode" : "Dark Mode"}
          </MenuItem>
          {/* <MenuItem onClick={() => setModal(true)}>Change Assignment</MenuItem> */}
        </Menu>
      </Dropdown>
    </>
  )
}
