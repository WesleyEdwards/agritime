import {useEffect, useState} from "react"
import {Room} from "../../shared"
import {QRCodeImg} from "./qrCode"
import {ShareLink} from "./ShareRoom"
import {Dialog} from "../../components/Dialog"
import {Button, Stack, Typography} from "@mui/joy"
import agritimeEmoji from "../../assets/agritime-sundial-nobg.png"

export const WelcomeDialog = ({room}: {room: Room}) => {
  const [seeState, setSeeState] = useState<"hasSeen" | "seeing" | "hasNotSeen">(
    "hasNotSeen"
  )

  useEffect(() => {
    if (
      room.users.filter((u) => u.connected).length === 1 &&
      seeState !== "hasSeen"
    ) {
      setSeeState("seeing")
    }
  }, [room.users])

  return (
    <>
      <Dialog
        open={seeState === "seeing"}
        setOpen={() => setSeeState("hasSeen")}
        title={
          <Typography
            endDecorator={
              <img src={agritimeEmoji} width={"16px"} height={"16px"} />
            }
          >
            Welcome to your timer!
          </Typography>
        }
      >
        <Stack gap={2} mt={4} alignItems={"center"}>
          <Typography textAlign={"center"}>
            You can share this link so your friends can join
          </Typography>
          <ShareLink
            code={room.code}
            sx={{
              my: 2,
              mx: 0,
              width: "fit-content",
              display: "flex",
              p: "8px",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              gap: 1,
            }}
          />
          <QRCodeImg url={`${location.origin}/accept-code?code=${room.code}`} />

          <Button
            sx={{width: "100%"}}
            onClick={() => {
              setSeeState("hasSeen")
            }}
          >
            Got it!
          </Button>
        </Stack>
      </Dialog>
    </>
  )
}
