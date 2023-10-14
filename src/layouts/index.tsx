import LayoutHeader from "./components/Header"
import LayoutMenu from "./components/Menu"
import LayoutFooter from "./components/Footer"
import * as AllTypes from "@/redux/mutation-types";
import { getAuthorButtons } from "@/api/modules/login"
import type {RootState, RootDispatch} from "@/redux/index";

import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { Layout } from "antd"
import { useSelector, useDispatch } from "react-redux"

import "./index.less"

const { Sider, Content } = Layout;

const LayoutIndex = () => {
  const dispatch = useDispatch<RootDispatch>();
  const { isCollapse } = useSelector((state: RootState) => state.menu);

  const setAuthButtons = (authButtons: { [propName: string]: any }) => dispatch({type: AllTypes.SET_AUTH_BUTTONS, authButtons});

  const getAuthButtonsList = async () => {
    const data = await getAuthorButtons()
    setAuthButtons(data)
  }

  useEffect(() => {
    getAuthButtonsList()
  }, [])

  return (
    <section className="container">
      <Sider trigger={null} collapsed={isCollapse} width={220} theme="dark">
        <LayoutMenu></LayoutMenu>
      </Sider>
      <Layout>
        <LayoutHeader></LayoutHeader>
        <Content>
          <Outlet></Outlet>
        </Content>
        <LayoutFooter></LayoutFooter>
      </Layout>
    </section>
  )
}

export default LayoutIndex;
