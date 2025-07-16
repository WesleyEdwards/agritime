import {IosShare, Share, CopyAll} from "@mui/icons-material"
import {IconButton, Stack, Typography, Card, CardProps} from "@mui/joy"
import {useState} from "react"
import {Room} from "../../shared"
import {useToast} from "../../components/Toast"
import {QRCodeImg} from "./qrCode"
import {Dialog} from "../../components/Dialog"

export const ShareRoom = ({room}: {room: Room}) => {
  const [open, setOpen] = useState(false)

  const url = `${location.origin}/accept-code?code=${room.code}`

  return (
    <>
      <IconButton
        onClick={() => {
          setOpen(true)
        }}
      >
        {getMobileOperatingSystem() === "iOS" ? <IosShare /> : <Share />}
      </IconButton>
      <Dialog open={open} setOpen={setOpen} title={"Invite"}>
        <Stack gap={2} alignItems={"center"}>
          <Stack>
            <Typography level="body-sm">Share Code</Typography>
            <Typography sx={{mt: 1, mb: 2, textAlign: "center"}} level="h3">
              {room.code}
            </Typography>
          </Stack>
          <QRCodeImg url={url} />
          <ShareLink
            code={room.code}
            sx={{
              display: "flex",
              p: 1,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              gap: 1,
            }}
          />
        </Stack>
      </Dialog>
    </>
  )
}

export const ShareLink = ({code, ...rest}: {code: string} & CardProps) => {
  const url = `${location.origin}/accept-code?code=${code}`

  const toast = useToast()
  return (
    <Card variant="soft" {...rest}>
      <Typography
        sx={{
          lineBreak: "anywhere",
          color: "text.secondary",
        }}
        level={"body-xs"}
      >
        {url}
      </Typography>
      <IconButton
        size="sm"
        sx={{padding: 0}}
        onClick={() => {
          navigator.clipboard.writeText(url)
          toast({
            message: "Copied to clipboard!",
          })
        }}
      >
        <CopyAll />
      </IconButton>
    </Card>
  )
}

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone"
  }

  if (/android/i.test(userAgent)) {
    return "Android"
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return "iOS"
  }

  return "unknown"
}
