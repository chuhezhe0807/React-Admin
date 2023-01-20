import { connect } from "react-redux"
import { Switch } from "antd"
import { setThemeConfig } from "@/redux/modules/global/action"

const SwitchDark = (props: any) => {
  const { themeConfig, setThemeConfig } = props
  const onChange = (checked: boolean) => {
    setThemeConfig({ ...themeConfig, isDark: checked })
  }

  return <Switch className="dark" defaultChecked={themeConfig.isDark} checkedChildren={<>🌞</>} unCheckedChildren={<>🌜</>} onChange={onChange}></Switch>
}

const mapStateToProps = (state: any) => state.global
const mapDispatchToProps = { setThemeConfig }
export default connect(mapStateToProps, mapDispatchToProps)(SwitchDark)
