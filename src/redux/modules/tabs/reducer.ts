import { HOME_URL } from "@/config/config";
import { TabsState } from "@/redux/interface";
import produce from "immer";
import { AnyAction } from "redux";
import * as AllTypes from '@/redux/mutation-types'


const tabsState: TabsState = {
  tabsActive: HOME_URL,
  tabsList: [{title: '首页', path: HOME_URL}]
}

// tabs reducer
const tabs = (state: TabsState = tabsState, action: AnyAction) => (
  produce(state, (draftState) => {
    switch(action.type) {
      case AllTypes.SET_TABS_LIST:
        draftState.tabsList = action.tabsList;
        break;
        default: 
        return draftState;
    }
  })
)

export default tabs;