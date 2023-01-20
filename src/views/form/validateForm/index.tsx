import { Button, Form, Input, Select, Space, message } from "antd"

const validateForm = () => {
  const { Option } = Select
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    message.success("提交的数据为：" + JSON.stringify(values))
  }

  const onReset = () => {
    form.resetFields()
  }

  const onFill = () => {
    form.setFieldsValue({
      user: "mark",
      note: "Hello world!",
      gender: "male",
    })
  }

  const onGenderChange = (value: string) => {
    switch (value) {
      case "male":
        form.setFieldsValue({ note: "Hi, man!" })
        break
      case "female":
        form.setFieldsValue({ note: "Hi, lady!" })
        break
      case "other":
        form.setFieldsValue({ note: "Hi, there!" })
        break
      default:
        break
    }
  }

  return (
    <div className="card content-box">
      <Form form={form} onFinish={onFinish} labelCol={{ span: 1 }} wrapperCol={{ span: 8 }}>
        <Form.Item label="User" name="user" rules={[{ required: true }]}>
          <Input placeholder="Plase enter a user"></Input>
        </Form.Item>
        <Form.Item label="Note" name="note" rules={[{ required: true }]}>
          <Input placeholder="Plase enter a user note"></Input>
        </Form.Item>
        <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
          <Select placeholder="Select a option and change input text above" onChange={onGenderChange} allowClear>
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 1 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
            <Button type="link" onClick={onFill}>
              Fill form
            </Button>{" "}
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default validateForm
