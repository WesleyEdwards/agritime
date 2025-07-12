import {extendTheme} from "@mui/joy/styles"

declare module "@mui/joy/styles" {
  // No custom tokens found, you can skip the theme augmentation.
}

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          "50": "#efebe9",
          "100": "#d7ccc8",
          "200": "#bcaaa4",
          "300": "#a1887f",
          "400": "#8d6e63",
          "500": "#795548",
          "600": "#6d4c41",
          "700": "#5d4037",
          "800": "#4e342e",
          "900": "#3e2723",
          outlinedHoverBorder: "white", // TODO
        },
      },
    },
    dark: {
      palette: {
        primary: {
          "50": "#efebe9",
          "100": "#d7ccc8",
          "200": "#bcaaa4",
          "300": "#a1887f",
          "400": "#8d6e63",
          "500": "#795548",
          "600": "#6d4c41",
          "700": "#5d4037",
          "800": "#4e342e",
          "900": "#3e2723",
        },
      },
    },
  },
  fontFamily: {
    display: "Manrope",
    body: "Manrope",
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: () => ({
          borderRadius: "100rem",
        }),
      },
    },
  },
})

export default theme
