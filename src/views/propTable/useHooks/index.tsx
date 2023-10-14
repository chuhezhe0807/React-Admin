import type {RootState} from "@/redux/index";
import useAuthButtons from "@/hooks/useAuthButtons"
import {LOCALE_STR_ENUM} from "@/enum/ReduxEnum"

import {useSelector} from "react-redux";
import { Table, DatePicker, Button, Space } from "antd";
import dayjs from "dayjs";

import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/ja';
import 'dayjs/locale/en';
import "./index.less"

const dateFormat = "YYYY-MM-DD";

const UseHooks = () => {
  const {language} = useSelector((state: RootState) => state.global);

  (function() {
    switch(language) {
      case LOCALE_STR_ENUM.zhCN:
        dayjs.locale("zh-cn");
        break;
      case LOCALE_STR_ENUM.zhTW:
        dayjs.locale("zh-tw");
        break;
      case LOCALE_STR_ENUM.enUS:
        dayjs.locale("en");
        break;
      case LOCALE_STR_ENUM.jaJP:
        dayjs.locale("ja");
        break;
      default:
        dayjs.locale("zh-cn");
        break;
    }
  })();

  // 按钮权限
  const { BUTTONS } = useAuthButtons()
  // const { RangePicker } = DatePicker

  const dataSource = [
    {
      key: "1",
      name: "胡彦斌",
      age: 32,
      address: "西湖区湖底公园1号",
    },
    {
      key: "2",
      name: "胡彦祖",
      age: 42,
      address: "西湖区湖底公园1号",
    },
    {
      key: "3",
      name: "刘彦祖",
      age: 18,
      address: "西湖区湖底公园1号",
    },
    {
      key: "4",
      name: "刘彦祖",
      age: 18,
      address: "翻斗大街翻斗花园二号楼1001室",
    },
    {
      key: "5",
      name: "刘彦祖",
      age: 18,
      address: "翻斗大街翻斗花园二号楼1001室",
    },
  ]

  const columns: any[] = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      align: "center",
    },
    {
      title: "住址",
      dataIndex: "address",
      key: "address",
      align: "center",
      width: "50%",
    },
  ]

  return (
    <div className="card content-box">
      <div className="date">
        <span>切换国际化的时候看我 😎 ：</span>
        <DatePicker defaultValue={dayjs("2023-10-13", dateFormat)} />
      </div>
      <div className="auth">
        <Space>
          {BUTTONS.add && <Button type="primary">我是 Admin && User 能看到的按钮</Button>}
          {BUTTONS.delete && <Button type="primary">我是 Admin 能看到的按钮</Button>}
          {BUTTONS.edit && <Button type="primary">我是 User 能看到的按钮</Button>}
        </Space>
      </div>
      <Table bordered dataSource={dataSource} columns={columns}></Table>
    </div>
  )
}

export default UseHooks
