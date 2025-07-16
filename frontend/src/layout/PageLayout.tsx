import {Sheet, Stack, Typography} from "@mui/joy"

export const PageLayout = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: React.ReactNode
}) => {
  return (
    <Stack sx={{placeItems: "center", mt: "10vh", mb: "2rem", mx: 1}}>
      <Sheet
        sx={{
          borderRadius: 10,
          p: 2,
          minWidth: 300,
          width: "100%",
          maxWidth: "700px",
        }}
      >
        {typeof title === "string" ? (
          <Typography my={2} level="h1" textAlign={"center"}>
            {title}
          </Typography>
        ) : (
          title
        )}
        {children}
      </Sheet>
    </Stack>
  )
}
