import { AnyAction } from "redux";
import { GlobalState } from '@/redux/interface'
import produce from 'immer'
import * as AllTypes from '@/redux/mutation-types'

const globalState: GlobalState = {
  token: '',
  userInfo: '',
  assemblySize: 'middle', // 装配、组件大小
  language: '',
  themeConfig: {
    // 默认 primary 主题颜色
    primary: "#1890ff",
    // 深色模式
    isDark: false,
    // 色弱模式(weak) || 灰色模式(gray)
    weakOrGray: "",
    // 面包屑导航
    breadcrumb: true,
    // 标签页
    tabs: true,
    // 页脚
    footer: true
  }
}

// global reducer
const global = (state: GlobalState = globalState, action: AnyAction) =>
  produce(state, draftState => {
    switch (action.type) {
      case AllTypes.SET_TOKEN:
        draftState.token = action.token;
        break;
      case AllTypes.SET_ASSEMBLY_SIZE:
        draftState.assemblySize = action.assemblySize;
        break;
      case AllTypes.SET_LANGUAGE:
        draftState.language = action.language;
        break;
      case AllTypes.SET_THEME_CONFIG:
        draftState.themeConfig = action.themeConfig;
        break;
      default:
        return draftState;
    }
  })

export default global;