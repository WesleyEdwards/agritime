import {Button, ButtonProps} from "@mui/joy"
import {useState} from "react"

export const AutoLoadingButton = (props: ButtonProps) => {
  const [loading, setLoading] = useState(false)

  const handleClick: ButtonProps["onClick"] = async (e) => {
    setLoading(true)
    await props.onClick?.(e)
    setLoading(false)
  }
  return <Button {...props} loading={loading} onClick={handleClick} />
}
