import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Space } from "antd"

const DynamicForm = () => {
  const onFinish = (values: any) => {
    console.log("dynamic form values:", values)
  }

  return (
    <div className="card content-box">
      <Form name="dynamic_form_next_item" onFinish={onFinish} autoComplete="off">
        <Form.List name="user">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                  <Form.Item {...restField} name={[name, "first"]}>
                    <Input placeholder="First Name" onClick={() => console.log(key, name, restField, fields)}></Input>
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "last"]} rules={[{ required: true, message: "Missing last name" }]}>
                    <Input placeholder="Last Name"></Input>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)}></MinusCircleOutlined>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" style={{ width: "40%" }} onClick={() => add()} block icon={<PlusOutlined></PlusOutlined>}>
                  Add field
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default DynamicForm
