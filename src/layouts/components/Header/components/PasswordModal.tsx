import { useState, useImperativeHandle, Ref } from "react"
import { message, Modal } from "antd"

interface Props {
  innerRef: Ref<{ showModal: (params: any) => void }>
}

export default (props: Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  // 与 React.forwardRef 的区别是，暴露指定方法给父组件而不是将整个组件暴露给父组件，使得组件可控
  useImperativeHandle(props.innerRef, () => ({ showModal }))

  const showModal = (params: { name: number }) => {
    console.log(params)
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    message.success("修改密码成功!")
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <Modal title="修改密码" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <p>some password</p>
      <p>some password</p>
      <p>some password</p>
    </Modal>
  )
}
