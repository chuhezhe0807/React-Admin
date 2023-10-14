import SwitchDark from "@/components/SwitchDark"
import * as AllTypes from "@/redux/mutation-types";
import type {RootDispatch, RootState} from "@/redux/index";

import { useState } from "react"
import { Drawer, Divider, Switch } from "antd"
import { useSelector, useDispatch } from "react-redux";
import { FireOutlined, SettingOutlined } from "@ant-design/icons"

const Theme = () => {
  const dispatch = useDispatch<RootDispatch>();
  const [visible, setVisible] = useState<boolean>(false);
  const {isCollapse} = useSelector((state: RootState) => state.menu);
  const {themeConfig, themeConfig: {weakOrGray, breadcrumb, tabs, footer}} = useSelector((state: RootState) => state.global);

  const onChange = (checked: boolean, keyName: string) => dispatch({type: AllTypes.SET_THEME_CONFIG, themeConfig: {...themeConfig, [keyName]: !checked}});
  const setThemeConfigWeakOrGray = (weakOrGray: string) => dispatch({type: AllTypes.SET_THEME_CONFIG, themeConfig: {...themeConfig, weakOrGray}});

  const setWeakOrGray = (checked: boolean, theme: string) => {
    if (checked) {
      setThemeConfigWeakOrGray(theme);

      return;
    }

    setThemeConfigWeakOrGray("");
  }


  return (
    <>
      <i
        className="icon-style iconfont icon-zhuti"
        onClick={() => {
          setVisible(true)
        }}
      ></i>
      <Drawer
        title="布局配置"
        closable={false}
        onClose={() => {
          setVisible(false)
        }}
        open={visible}
        width={320}
      >
        {/* 全局主题 */}
        <Divider className="divider">
          <FireOutlined>全局主题</FireOutlined>
        </Divider>
        <div className="theme-item">
          <span>暗黑模式</span>
          <SwitchDark></SwitchDark>
        </div>
        <div className="theme-item">
          <span>灰色模式</span>
          <Switch
            checked={weakOrGray === "gray"}
            onChange={(e) => {
              setWeakOrGray(e, "gray")
            }}
          ></Switch>
        </div>
        <div className="theme-item">
          <span>色弱模式</span>
          <Switch
            checked={weakOrGray == "weak"}
            onChange={(e) => {
              setWeakOrGray(e, "weak")
            }}
          ></Switch>
        </div>
        <br />
        {/* 界面设置 */}
        <Divider className="divider">
          <SettingOutlined></SettingOutlined>
          界面设置
        </Divider>
        <div className="theme-item">
          <span>折叠菜单</span>
          <Switch
            checked={isCollapse}
            onChange={(isCollapse) => {
              dispatch({type: AllTypes.UPDATE_COLLAPSE, isCollapse});
            }}
          />
        </div>
        <div className="theme-item">
          <span>面包屑导航</span>
          <Switch
            checked={!breadcrumb}
            onChange={(e) => {
              onChange(e, "breadcrumb")
            }}
          />
        </div>
        <div className="theme-item">
          <span>标签栏</span>
          <Switch
            checked={!tabs}
            onChange={(e) => {
              onChange(e, "tabs")
            }}
          />
        </div>
        <div className="theme-item">
          <span>页脚</span>
          <Switch
            checked={!footer}
            onChange={(e) => {
              onChange(e, "footer")
            }}
          />
        </div>
      </Drawer>
    </>
  )
}

export default Theme;
