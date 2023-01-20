import { Dropdown } from "antd"
import { connect } from "react-redux"
import { setAssemblySize } from "@/redux/modules/global/action"

const AssemblySize = (props: any) => {
  const { setAssemblySize, assemblySize } = props

  const onClick = (e: MenuInfo) => {
    setAssemblySize(e.key)
  }

  const items = [
    {
      key: "middle",
      label: <span>默认</span>,
      onClick,
      disabled: assemblySize === "middle",
    },
    {
      key: "large",
      label: <span>大型</span>,
      onClick,
      disabled: assemblySize === "large",
    },
    {
      key: "small",
      label: <span>小型</span>,
      onClick,
      disabled: assemblySize === "small",
    },
  ]

  return (
    <Dropdown menu={{ items }} placement="bottom" trigger={["click"]} arrow={true}>
      <i className="icon-style iconfont icon-contentright"></i>
    </Dropdown>
  )
}

const mapStateToProps = (state: any) => state.global
const mapDispatchToProps = { setAssemblySize }
export default connect(mapStateToProps, mapDispatchToProps)(AssemblySize)
