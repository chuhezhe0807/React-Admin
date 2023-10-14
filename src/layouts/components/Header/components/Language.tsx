import * as AllTypes from "@/redux/mutation-types";
import type {RootState, RootDispatch} from "@/redux/index";

import { Dropdown } from "antd";
import {useSelector, useDispatch} from "react-redux";

const Language = () => {
  const dispatch = useDispatch<RootDispatch>();
  const { language } = useSelector((state: RootState) => state.global);

  const setLanguage = (language: string) => dispatch({type: AllTypes.SET_LANGUAGE, language});

  const items = [
    {
      key: "1",
      label: <span>简体中文</span>,
      onClick: () => setLanguage("zhCN"),
      disabled: language === "zhCN",
    },
    {
      key: "2",
      label: <span>English</span>,
      onClick: () => setLanguage("enUS"),
      disabled: language === "enUS",
    },
    {
      key: "3",
      label: <span>繁體中文</span>,
      onClick: () => setLanguage("zhTW"),
      disabled: language === "zhTW",
    },
    {
      key: "4",
      label: <span>日本語</span>,
      onClick: () => setLanguage("jaJP"),
      disabled: language === "jaJP",
    },
  ]

  return (
    <Dropdown menu={{ items }} placement="bottom" trigger={["click"]} arrow={true}>
      <i className="icon-style iconfont icon-zhongyingwen"></i>
    </Dropdown>
  )
}

export default Language;

/** 
 * mapStateToProps 和 mapDispatchToProps示例
 */
// const mapStateToProps = (state: any) => state.global
// mapDispatchToProps 函数形式
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     setLanguage: dispatch({type: "SET_LANGUAGE"})
//   }
// }
// mapDispatchToProps 对象形式 这种形式在使用时直接调用即可，react-redux会自动调用dispatch 
// eg: <div onClick={props.setLanguage} />
// const mapDispatchToProps = {setLanguage}
// export default connect(mapStateToProps, mapDispatchToProps)(Language)
