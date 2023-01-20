import { Layout } from "antd"
import AssemblySize from "./components/AssemblySize"
import AvatarIcon from "./components/AvatarIcon"
import BreadcrumbNav from "./components/BreadcrumbNav"
import CollapseIcon from "./components/CollapseIcon"
import FullScreen from "./components/FullScreen"
import Language from "./components/Language"
import Theme from "./components/Theme"
import "./index.less"

function LayoutHeader() {
  const { Header } = Layout

  return (
    <Header>
      <div className="header-lf">
        <CollapseIcon></CollapseIcon>
        <BreadcrumbNav></BreadcrumbNav>
      </div>
      <div className="header-ri">
        <AssemblySize></AssemblySize>
        <Language></Language>
        <Theme></Theme>
        <FullScreen></FullScreen>
        <span className="username">User</span>
        <AvatarIcon></AvatarIcon>
      </div>
    </Header>
  )
}

export default LayoutHeader
