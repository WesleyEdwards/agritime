import {Button, FormControl, Input, Stack} from "@mui/joy"
import React, {useState} from "react"
import {Dialog} from "../../components/Dialog"

export const AddUser = ({
  save,
  renderButton,
}: {
  renderButton: (onClick: () => void) => React.ReactNode
  save: (name: string) => void
}) => {
  const [name, setName] = useState("")
  const [open, setOpen] = useState(false)
  return (
    <>
      {renderButton(() => {
        setOpen(true)
      })}

      <Dialog title={"Add Person"} open={open} setOpen={setOpen}>
        <Stack gap={4} sx={{mt: 2}}>
          <FormControl>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </FormControl>
          <Button
            onClick={() => {
              setOpen(false)
              save(name)
              setName("")
            }}
            disabled={name === ""}
          >
            Add
          </Button>
        </Stack>
      </Dialog>
    </>
  )
}
