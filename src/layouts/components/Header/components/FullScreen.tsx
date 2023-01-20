import screenFull from "screenfull"
import { useEffect, useState } from "react"
import { message } from "antd"

const FullScreen = () => {
  const [fullScreen, setFullScreen] = useState<boolean>(screenFull.isFullscreen)

  const onScreenFullChange = () => {
    if (screenFull.isFullscreen) {
      setFullScreen(true)
    } else {
      setFullScreen(false)
    }
  }
  useEffect(() => {
    screenFull.on("change", onScreenFullChange)
    return () => screenFull.off("change", onScreenFullChange)
  }, [])

  const handleClick = () => {
    if (!screenFull.isEnabled) return message.warning("你的浏览器不支持全屏")
    screenFull.toggle()
  }

  return <i className={["icon-style", "iconfont", fullScreen ? "icon-suoxiao" : "icon-fangda"].join(" ")} onClick={handleClick}></i>
}

export default FullScreen
