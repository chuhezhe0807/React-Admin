import * as AllTypes from '@/redux/mutation-types'

// setTabsList
export const setTabsList = (tabList: Menu.MenuOptions[]) => ({
  type: AllTypes.SET_TABS_LIST,
  tabList
})