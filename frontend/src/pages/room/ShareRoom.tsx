import {IosShare, Share, CopyAll} from "@mui/icons-material"
import {
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  Card,
} from "@mui/joy"
import {useState} from "react"
import {Room} from "../../shared"
import {useToast} from "../../components/Toast"
import {QRCodeShare} from "./qrCode"

export const ShareRoom = ({room}: {room: Room}) => {
  const [open, setOpen] = useState(false)
  const toast = useToast()

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
      <Modal open={open} onClose={() => setOpen(false)} disableRestoreFocus>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{
            width: "100%",
          }}
          maxWidth={"400px"}
        >
          <ModalClose sx={{zIndex: 8}} />
          <DialogTitle>Invite</DialogTitle>
          <DialogContent sx={{p: 1}}>
            <Stack gap={2} alignItems={"center"}>
              <Typography sx={{mt: 2}} level="body-md">
                Invite others to join the timer
              </Typography>
              <Typography sx={{my: 2, textAlign: "center"}} level="h3">
                {room.code}
              </Typography>
              <QRCodeShare url={url} />
              <Card
                variant="soft"
                sx={{
                  display: "flex",
                  p: 1,
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
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
                    navigator.clipboard.writeText(
                      `${location.origin}/accept-code?code=${room.code}`
                    )
                    toast({
                      message: "Copied to clipboard!",
                    })
                  }}
                >
                  <CopyAll />
                </IconButton>
              </Card>
            </Stack>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
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
