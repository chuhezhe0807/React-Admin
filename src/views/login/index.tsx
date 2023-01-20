import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import { message } from "antd"
import LoginForm from "./components/LoginForm"
import SwitchDark from "@/components/SwitchDark"
import loginLeft from "@/assets/images/login_left.png"
import logo from "@/assets/images/logo.png"
import "./index.less"

export default function Login() {
  const { state } = useLocation()
  useEffect(() => {
    if (state?.isShowInfo) {
      message.warning("您还未登录或者登录信息过期，请重新登录。")
    }
  }, [])

  return (
    <div className="login-container">
      <SwitchDark></SwitchDark>
      <div className="login-box">
        <div className="login-left">
          <img src={loginLeft} alt="login" />
        </div>
        <div className="login-form">
          <div className="login-logo">
            <img src={logo} alt="logo" className="login-icon" />
            <span className="logo-text">Create-Admin</span>
          </div>
          <LoginForm></LoginForm>
        </div>
      </div>
    </div>
  )
}
