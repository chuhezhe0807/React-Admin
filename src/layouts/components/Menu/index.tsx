import Logo from "./components/Logo"
import { findAllBreadcrumb, getOpenKeys, handleRouter, searchRoute } from "@/utils/utils"
import { getMenuList } from "@/api/modules/login"
import * as AllTypes from "@/redux/mutation-types";
import type {RootDispatch, RootState} from "@/redux/index";

import * as Icons from "@ant-design/icons"
import { Menu, Spin } from "antd"
import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import type { MenuProps } from "antd"

import "./index.less"

const LayoutMenu = () => {
  const { pathname } = useLocation()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname])
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const dispatch = useDispatch<RootDispatch>();
  const { isCollapse, menuList: menuListFromStore } = useSelector((state: RootState) => state.menu);

  const setBreadcrumbList = (breadcrumbList: { [propName: string]: any }) => 
        dispatch({type: AllTypes.SET_BREADCRUMB_LIST, breadcrumbList});
  const setAuthRouter = (authRouter: string[]) => 
        dispatch({type: AllTypes.SET_AUTH_ROUTER, authRouter});
  const setMenuListDispatch = (menuList: Menu.MenuOptions[]) => 
        dispatch({type: AllTypes.SET_MENU_LIST, menuList});

  // 刷新页面菜单保持高亮
  useEffect(() => {
    setSelectedKeys([pathname])
    isCollapse ? null : openKeys.length > 0 ? null : setOpenKeys(getOpenKeys(pathname))
  }, [pathname, isCollapse])

  // 设置当前展开的 submenu
  const onOpenChange = (AntdOpenKeys: string[]) => {
    if (AntdOpenKeys.length === 0 || AntdOpenKeys.length === 1) return setOpenKeys(AntdOpenKeys)
    if (AntdOpenKeys.at(-2)?.includes(AntdOpenKeys.at(-1) as string)) {
      setOpenKeys(AntdOpenKeys)
    } else {
      setOpenKeys([AntdOpenKeys.at(-1) as string])
    }
  }

  // 定义 menu 类型 Required 是把 MenuProps 中的所有属性都设置成必选
  type MenuItem = Required<MenuProps>["items"][number]
  const getItem = (label: React.ReactNode, key?: React.Key | null, icon?: React.ReactNode, children?: MenuItem[], type?: "group"): MenuItem => {
    return { key, icon, children, label, type } as MenuItem
  }

  // 动态渲染 Icon 图标
  const customIcons: { [key: string]: any } = Icons
  const addIcon = (name: string) => {
    return React.createElement(customIcons[name])
  }

  // 处理后台返回菜单 key 值为antd菜单需要的key值
  const deepLoopFloat = (menuList: Menu.MenuOptions[], newArr: MenuItem[] = []) => {
    for (let item of menuList) {
      if (item?.children?.length) {
        newArr.push(getItem(item.title, item.path, addIcon(item.icon!), deepLoopFloat(item.children)))
      } else {
        newArr.push(getItem(item.title, item.path, addIcon(item.icon!)))
      }
    }
    return newArr
  }

  // 获取菜单列表，并处理成 antd menu 需要的格式
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const getMenuData = async () => {
    setLoading(true)
    try {
      // const { data } = await getMenuList()
      const data = await getMenuList()
      if (!data) return
      setMenuList(deepLoopFloat(data))
      // 存储处理过后的所有面包屑导航栏到redux中
      setBreadcrumbList(findAllBreadcrumb(data))
      // 把路由菜单处理成一维数组，存储到redux中，做单路由权限判断
      const dynamicRouter = handleRouter(data)
      setAuthRouter(dynamicRouter)
      setMenuListDispatch(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMenuData()
  }, [])

  // 点击当前菜单跳转页面
  const navigate = useNavigate()
  const clickMenu: MenuProps["onClick"] = ({ key }: { key: string }) => {
    const route = searchRoute(key, menuListFromStore)
    if (route.isLink) window.open(route.isLink, "_blank")
    navigate(key)
  }

  return (
    <div className="menu">
      <Spin spinning={loading} tip="Loading....">
        <Logo></Logo>
        <Menu
          theme="dark"
          mode="inline"
          triggerSubMenuAction="click"
          openKeys={isCollapse ? [] : openKeys}
          selectedKeys={selectedKeys}
          items={menuList}
          onClick={clickMenu}
          onOpenChange={onOpenChange}
        ></Menu>
      </Spin>
    </div>
  )
}

export default LayoutMenu;
