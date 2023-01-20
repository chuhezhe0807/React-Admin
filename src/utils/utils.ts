import { RouteObject } from "@/routes/interface";

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export const getBrowserLang = () => {
  let browserLang = navigator.language
  let defaultBrowserLang = "";
  if (browserLang.toLowerCase() === "cn" || browserLang.toLowerCase() === "zh" || browserLang.toLowerCase() === "zh-cn") {
    defaultBrowserLang = "zh";
  } else {
    defaultBrowserLang = "en";
  }
  return defaultBrowserLang;
};

/**
 * @description 递归查询对应的路由
 * @param {String} path 当前访问地址
 * @param {Array} routes 路由列表
 * @returns array
 */
export const searchRoute = (path: string, routes: RouteObject[]) => {
  let result: RouteObject = {}
  for (let item of routes) {
    // 使用useRoutes,父路由添加了 * 例如 /home/*
    if ((item.path == path) || (item.path == `${path}/*`)) return item
    if (item.children) {
      const res = searchRoute(path, item.children)
      if (Object.keys(res).length > 0) result = res;
    }
  }
  return result;
}

/**
 * @description 递归当前路由的 所有 关联的路由，生成面包屑导航栏
 * @param {String} path 当前访问地址
 * @param {Array} menuList 菜单列表
 * @returns array
 */
export const getBreadcrumbList = (path: string, menuList: Menu.MenuOptions[]) => {
  let tempArray: any[] = []
  try {
    const getNodePath = (node: Menu.MenuOptions) => {
      tempArray.push(node);
      // 找到符合的节点，通过 throw Error 终止掉递归
      if (node.path == path) throw new Error('GOT IT!F')

      if (node.children && node.children.length > 0) {
        for (let item of node.children) {
          getNodePath(item)
        }
        // 当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
        tempArray.pop()
      } else {
        // 找到叶子节点时，删除路径当中的该叶子节点
        tempArray.pop()
      }
    }
    for (let node of menuList) {
      getNodePath(node)
    }
  } catch (error) {
    return tempArray.map(item => item.title);
  }
}

/**
 * @description 双重递归 找出所有 面包屑 生成对象存到 redux 中，就不用每次都去递归查找了
 * @param {String} menuList 当前菜单列表
 * @returns object
 */
export const findAllBreadcrumb = (menuList: Menu.MenuOptions[]): { [key: string]: any } => {
  let handleBreadcrumbList: any = {};
  const loop = (menuItem: Menu.MenuOptions) => {
    // 下面判断代码解释 *** !item?.children?.length   ==>   (item.children && item.children.length > 0)
    if (menuItem?.children?.length) menuItem.children.forEach(item => loop(item));
    else handleBreadcrumbList[menuItem.path] = getBreadcrumbList(menuItem.path, menuList);
  };
  menuList.forEach(item => loop(item));
  return handleBreadcrumbList;
};

/**
 * @description 获取需要展开的 subMenu, 获取路径
 * @param {String} path 当前访问地址
 * @returns array
 */
export const getOpenKeys = (path: string) => {
  let newStr: string = ''
  let newArr: any[] = []
  const arr = path.split('/').map(item => '/' + item)
  for (let item of arr) {
    newStr += item
    newArr.push(newStr)
  }
  return newArr;
}

/**
 * @description 使用递归处理路由菜单，生成一维数组，做菜单权限判断
 * @param {Array} menuList 所有菜单列表
 * @param {Array} newArr 菜单的一维数组
 * @return array
 */
export function handleRouter(routerList: Menu.MenuOptions[], newArr: string[] = []) {
  routerList.forEach((item: Menu.MenuOptions) => {
    typeof item === 'object' && item.path && newArr.push(item.path);
    item.children && item.children.length > 0 && handleRouter(item.children, newArr);
  })
  return newArr;
}

/**
 * @description 生成两个数之间的随机整数
 * @param {Number} min
 * @param {Number} max
*/
export function randomNum(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}