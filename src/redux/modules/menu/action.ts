import * as AllTypes from '@/redux/mutation-types'

type TCollapseAction = {
  type: typeof AllTypes.UPDATE_COLLAPSE,
  isCollapse: boolean
}

type TMenuListAction = {
  type: typeof AllTypes.SET_MENU_LIST,
  menuList: Menu.MenuOptions[]
}

// updateCollapse
export const updateCollapse = (isCollapse: boolean): TCollapseAction => ({
  type: AllTypes.UPDATE_COLLAPSE,
  isCollapse
})

// setMenuList
export const setMenuList = (menuList: Menu.MenuOptions[]): TMenuListAction => ({
  type: AllTypes.SET_MENU_LIST,
  menuList
})

export type TMenuStateActions = TCollapseAction | TMenuListAction; 