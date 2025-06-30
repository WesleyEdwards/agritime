import QRCode from "qrcode"
import {useEffect, useState} from "react"

const generateQR = async (text: string): Promise<string> => {
  return await QRCode.toDataURL(text)
}

export const QRCodeShare = ({url}: {url: string}) => {
  const [qr, setQr] = useState<string>()

  useEffect(() => {
    generateQR(url).then(setQr)
  }, [url])

  if (!qr) {
    return <div style={{width: "200px", height: "200px"}}></div>
  }

  return <img width="200px" height="200px" src={qr} />
}
