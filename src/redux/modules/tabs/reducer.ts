import { HOME_URL } from "@/config/config";
import { TabsState } from "@/redux/interface";
import { TTabsListActions } from "./action";
import * as AllTypes from '@/redux/mutation-types'

import produce from "immer";


const tabsState: TabsState = {
  tabsActive: HOME_URL,
  tabsList: [{title: '首页', path: HOME_URL}]
}

// tabs reducer
const tabs = (state: TabsState = tabsState, action: TTabsListActions) => (
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