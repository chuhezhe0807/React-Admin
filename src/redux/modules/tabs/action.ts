import * as AllTypes from '@/redux/mutation-types'

type TTabsListAction = {
  type: typeof AllTypes.SET_TABS_LIST,
  tabsList: Menu.MenuOptions[]
}

// setTabsList
export const setTabsList = (tabsList: Menu.MenuOptions[]): TTabsListAction => ({
  type: AllTypes.SET_TABS_LIST,
  tabsList
})

export type TTabsListActions = TTabsListAction;