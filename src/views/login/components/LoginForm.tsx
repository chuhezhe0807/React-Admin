import md5 from "js-md5"
import { useState } from "react"
import { Button, Form, Input, message } from "antd"
import { useNavigate } from "react-router-dom"
import { Login } from "@/api/interface"
import { HOME_URL } from "@/config/config"
import { loginApi } from "@/api/modules/login"
import { connect } from "react-redux"
import { setToken } from "@/redux/modules/global/action"
import { useTranslation } from "react-i18next"
import { setTabsList } from "@/redux/modules/tabs/action"
import { UserOutlined, LockOutlined, CloseCircleOutlined } from "@ant-design/icons"

const LoginForm = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { setToken, setTabsList } = props
  const { t } = useTranslation()
  // 类似于 ref 可以获得Form这个组件的一个组件实例对象
  const [form] = Form.useForm()

  const onFinish = async (loginForm: Login.ReqLoginForm) => {
    try {
      setLoading(true)
      loginForm.password = md5(loginForm.password)
      // const { data } = await loginApi(loginForm)
      const data = await loginApi(loginForm)
      setToken(data?.access_token)
      // setToken("data?.access_token")
      setTabsList([])
      message.success("登陆成功！")
      navigate(HOME_URL)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed", errorInfo)
  }

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 5 }}
      initialValues={{ remember: true, username: "admin", password: "123456" }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      size="large"
      autoComplete="off"
    >
      <Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}>
        <Input placeholder="用户名：" prefix={<UserOutlined></UserOutlined>}></Input>
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
        <Input type="password" placeholder="密码：" prefix={<LockOutlined></LockOutlined>}></Input>
      </Form.Item>

      <Form.Item className="login-btn">
        <Button icon={<CloseCircleOutlined></CloseCircleOutlined>} onClick={() => form.resetFields()}>
          {t("login.reset")}
        </Button>
        <Button type="primary" htmlType="submit" loading={loading} icon={<UserOutlined></UserOutlined>}>
          {t("login.confirm")}
        </Button>
      </Form.Item>
    </Form>
  )
}

const mapDispatchToProps = { setToken, setTabsList }
export default connect(null, mapDispatchToProps)(LoginForm)
