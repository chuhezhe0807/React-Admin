import { useRef } from "react"
import { Avatar, Modal, Menu, Dropdown, message, MenuProps } from "antd"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { HOME_URL } from "@/config/config"
import { connect } from "react-redux"
import { setToken } from "@/redux/modules/global/action"
import PasswordModal from "./PasswordModal"
import InfoModal from "./InfoModal"
import avatar from "@/assets/images/avatar.png"

const AvatarIcon = (props: any) => {
  const { setToken } = props
  const navigate = useNavigate()

  interface ModalProps {
    showModal: (prams: { name: number }) => void
  }
  const passRef = useRef<ModalProps>(null)
  const infoRef = useRef<ModalProps>(null)

  // 退出登录
  const logout = () => {
    Modal.confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined></ExclamationCircleOutlined>,
      content: "即将退出登录，是否继续?",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        setToken("")
        message.success("退出登录成功！")
        navigate("/login")
      },
    })
  }

  // Dropdown items
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span className="dropdown-item">首页</span>,
      onClick: () => navigate(HOME_URL),
    },
    {
      key: "2",
      label: <span className="dropdown-item">个人信息</span>,
      onClick: () => infoRef.current!.showModal({ name: 11 }),
    },
    {
      key: "3",
      label: <span className="dropdown-item">修改密码</span>,
      onClick: () => passRef.current!.showModal({ name: 22 }),
    },
    {
      type: "divider",
    },
    {
      key: "4",
      label: <span className="dropdown-item">退出登录</span>,
      onClick: logout,
    },
  ]

  return (
    <>
      <Dropdown menu={{ items }}>
        <Avatar size="large" src={avatar}></Avatar>
      </Dropdown>
      <InfoModal innerRef={infoRef}></InfoModal>
      <PasswordModal innerRef={passRef}></PasswordModal>
    </>
  )
}

const mapDispatchToProps = { setToken }
export default connect(null, mapDispatchToProps)(AvatarIcon)
