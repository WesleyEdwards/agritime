import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy"
import {FC} from "react"
import {AutoLoadingButton} from "./AutoLoadingButton"

export const GenericModal: FC<{
  title: string
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<unknown>
  disableConfirm?: boolean
  confirmButton?: (onConfirm: () => Promise<unknown>) => React.ReactNode
  confirmLabel?: string
  subtext?: string
  error?: string
  hideActions?: boolean
  children: React.ReactNode
}> = ({
  title,
  open,
  onClose,
  onConfirm,
  confirmButton,
  confirmLabel = "Save",
  disableConfirm = false,
  subtext,
  error = "",
  hideActions,
  children,
}) => {
  // https://stackoverflow.com/questions/75644447/autofocus-not-working-on-open-form-dialog-with-button-component-in-material-ui-v
  return (
    <Modal open={open} onClose={onClose} disableRestoreFocus>
      {/* <form onSubmit={onConfirm}> */}
      <ModalDialog variant="outlined" role="alertdialog">
        <ModalClose sx={{zIndex: 8}} />
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Stack gap="2rem" mt="1rem">
            <Typography>{subtext}</Typography>

            {children}
            {error && (
              <Alert variant="soft" color="danger">
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        {!hideActions && (
          <DialogActions>
            {confirmButton ? (
              confirmButton(onConfirm)
            ) : (
              <AutoLoadingButton
                disabled={disableConfirm}
                variant="soft"
                color="success"
                onClick={onConfirm}
              >
                {confirmLabel}
              </AutoLoadingButton>
            )}

            <Button variant="plain" color="neutral" onClick={onClose}>
              Cancel
            </Button>
          </DialogActions>
        )}
      </ModalDialog>
      {/* </form> */}
    </Modal>
  )
}
