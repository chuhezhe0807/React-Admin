import * as AllTypes from "@/redux/mutation-types";
import type {RootState, RootDispatch} from "@/redux/index";

import { Switch } from "antd";
import { useSelector, useDispatch } from "react-redux";

const SwitchDark = () => {
  const dispatch = useDispatch<RootDispatch>();
  const { themeConfig } = useSelector((state: RootState) => state.global);

  const onChange = (checked: boolean) => {
    dispatch({type: AllTypes.SET_THEME_CONFIG, themeConfig: {...themeConfig, isDark: checked}});
  }

  return <Switch className="dark" defaultChecked={themeConfig.isDark} checkedChildren={<>🌞</>} unCheckedChildren={<>🌜</>} onChange={onChange}></Switch>
}

export default SwitchDark;
