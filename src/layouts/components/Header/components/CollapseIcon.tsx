import * as AllTypes from "@/redux/mutation-types";
import type {RootDispatch, RootState} from "@/redux/index";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"

const CollapseIcon = () => {
  const dispatch = useDispatch<RootDispatch>();
  const { isCollapse } = useSelector((state: RootState) => state.menu);
  
  const updateCollapse = (isCollapse: boolean) => dispatch({type: AllTypes.UPDATE_COLLAPSE, isCollapse});

  return (
    <div className="collapsed" onClick={() => updateCollapse(!isCollapse)}>
      {isCollapse ? <MenuUnfoldOutlined id="isCollapse"></MenuUnfoldOutlined> : <MenuFoldOutlined id="isCollapse"></MenuFoldOutlined>}
    </div>
  )
}

export default CollapseIcon;
