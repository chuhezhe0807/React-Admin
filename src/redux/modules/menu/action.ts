import * as AllTypes from '@/redux/mutation-types'

// updateCollapse
export const updateCollapse = (isCollapse: boolean) => ({
  type: AllTypes.UPDATE_COLLAPSE,
  isCollapse
})

// setMenuList
export const setMenuList = (menuList: Menu.MenuOptions[]) => ({
  type: AllTypes.SET_MENU_LIST,
  menuList
})