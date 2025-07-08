import {
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  DialogContent,
} from "@mui/joy"
import React from "react"

export const Dialog = ({
  children,
  open,
  setOpen,
  title,
}: {
  children: React.ReactNode
  open: boolean
  setOpen: (o: boolean) => void
  title: React.ReactNode
}) => (
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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{p: 1}}>{children}</DialogContent>
    </ModalDialog>
  </Modal>
)
