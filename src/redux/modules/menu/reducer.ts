import { TMenuStateActions } from "./action";
import * as AllTypes from '@/redux/mutation-types'
import produce from "immer";
import { MenuState } from "@/redux/interface";

const menuState: MenuState = {
  isCollapse: false,
  menuList: []
}

const menu = (state: MenuState = menuState, action: TMenuStateActions) => (
  produce(state, draftState => {
    switch (action.type) {
      case AllTypes.UPDATE_COLLAPSE:
        draftState.isCollapse = action.isCollapse
        break;
      case AllTypes.SET_MENU_LIST:
        draftState.menuList = action.menuList
        break;
      default:
        return draftState;
    }
  })
)

export default menu;