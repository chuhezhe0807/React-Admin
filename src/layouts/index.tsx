import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { Layout } from "antd"
import { setAuthButtons } from "@/redux/modules/auth/action"
import { updateCollapse } from "@/redux/modules/menu/action"
import { getAuthorButtons } from "@/api/modules/login"
import { connect } from "react-redux"
import LayoutHeader from "./components/Header"
import LayoutMenu from "./components/Menu"
import LayoutFooter from "./components/Footer"
import "./index.less"

const LayoutIndex = (props: any) => {
  const { Sider, Content } = Layout
  const { setAuthButtons, updateCollapse, isCollapse } = props

  const getAuthButtonsList = async () => {
    // const { data } = await getAuthorButtons()
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

const mapStateToProps = (state: any) => state.menu
const mapDispatchToProps = { setAuthButtons, updateCollapse }
export default connect(mapStateToProps, mapDispatchToProps)(LayoutIndex)
