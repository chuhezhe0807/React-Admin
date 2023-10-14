import * as AllTypes from "@/redux/mutation-types";
import type {RootDispatch, RootState} from "@/redux/index";

import { Dropdown } from "antd"
import { useSelector, useDispatch } from "react-redux"
import type { SizeType } from "antd/lib/config-provider/SizeContext";

const AssemblySize = (props: any) => {
  const dispatch = useDispatch<RootDispatch>();
  const { assemblySize } = useSelector((state: RootState) => state.global)

  const onClick = (e: MenuInfo) => {
    dispatch({type: AllTypes.SET_ASSEMBLY_SIZE, assemblySize: e.key as SizeType});
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

export default AssemblySize;
