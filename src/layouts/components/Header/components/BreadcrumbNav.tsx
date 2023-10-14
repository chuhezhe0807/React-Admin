import { HOME_URL } from "@/config/config"
import type { RootState } from "@/redux";

import { Breadcrumb } from "antd"
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux";

const BreadcrumbNav = () => {
  const { pathname } = useLocation()
  const { themeConfig } = useSelector((state: RootState) => state.global);
  const breadcrumbList = useSelector((state: RootState) => state.breadcrumb).breadcrumbList[pathname] || [];

  const items = [
    <a href={`#${HOME_URL}`}>首页</a>,
    breadcrumbList.map((item: string) => (
      <a key={item}>{item !== "首页" ? item : null}</a>
    ))
  ];

  return (
    <>
      {themeConfig.breadcrumb && (
        <Breadcrumb items={items}>
          <Breadcrumb.Item href={`#${HOME_URL}`}>首页</Breadcrumb.Item>
          {breadcrumbList.map((item: string) => (
            <Breadcrumb.Item key={item}>{item !== "首页" ? item : null}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}
    </>
  )
}

export default BreadcrumbNav;
