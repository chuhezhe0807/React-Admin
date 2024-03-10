import { Login } from "../interface"

export const menuList: Menu.MenuOptions[] = [
    {
        icon: "HomeOutlined",
        title: "首页",
        path: "/home/index"
    },
    {
        icon: "AreaChartOutlined",
        title: "数据大屏",
        path: "/dataScreen/index"
    },
    {
        icon: "SnippetsOutlined",
        title: "Canvas画布",
        path: "/canvasDemo/index"
    },
    {
        icon: "OrderedListOutlined",
        title: "一些案例",
        path: "/demos",
        children: [
            {
                icon: "OrderedListOutlined",
                title: "undo redo",
                path: "/demos/undo",
            },
            {
                icon: "OrderedListOutlined",
                title: "empty",
                path: "/demos/empty",
            }
        ]
    },
    {
        icon: "TableOutlined",
        title: "超级表格",
        path: "/proTable",
        children: [
            {
                icon: "AppstoreOutlined",
                title: "使用 Hooks",
                path: "/proTable/useHooks",
            },
            {
                icon: "AppstoreOutlined",
                title: "使用 Component",
                path: "/proTable/useComponent",
            }
        ]
    },
    {
        icon: "FundOutlined",
        title: "Dashboard",
        path: "/dashboard",
        children: [
            {
                icon: "AppstoreOutlined",
                title: "数据可视化",
                path: "/dashboard/dataVisualize",
            },
            {
                icon: "AppstoreOutlined",
                title: "内嵌页面",
                path: "/dashboard/embedded",
            }
        ]
    },
    {
        icon: "FileTextOutlined",
        title: "表单 Form",
        path: "/form",
        children: [
            {
                icon: "AppstoreOutlined",
                title: "基础 Form",
                path: "/form/basicForm",
            },
            {
                icon: "AppstoreOutlined",
                title: "校验 Form",
                path: "/form/validateForm",
            },
            {
                icon: "AppstoreOutlined",
                title: "动态 Form",
                path: "/form/dynamicForm",
            }
        ]
    },
    {
        icon: "PieChartOutlined",
        title: "Echarts",
        path: "/echarts",
        children: [
            {
                icon: "AppstoreOutlined",
                title: "水型图",
                path: "/echarts/waterChart",
            },
            {
                icon: "AppstoreOutlined",
                title: "柱状图",
                path: "/echarts/columnChart",
            },
            {
                icon: "AppstoreOutlined",
                title: "折线图",
                path: "/echarts/lineChart",
            },
            {
                icon: "AppstoreOutlined",
                title: "饼图",
                path: "/echarts/pieChart",
            },
            {
                icon: "AppstoreOutlined",
                title: "雷达图",
                path: "/echarts/radarChart",
            },
            {
                icon: "AppstoreOutlined",
                title: "嵌套环形图",
                path: "/echarts/nestedChart",
            }
        ]
    },
    {
        icon: "ShoppingOutlined",
        title: "常用组件",
        path: "/assembly",
        children: [
            {
                icon: "AppstoreOutlined",
                title: "引导页",
                path: "/assembly/guide",
            },
            {
                icon: "AppstoreOutlined",
                title: "Svg 图标",
                path: "/assembly/svgIcon",
            },
            {
                icon: "AppstoreOutlined",
                title: "Icon 选择",
                path: "/assembly/selectIcon",
            },
            {
                icon: "AppstoreOutlined",
                title: "批量导入数据",
                path: "/assembly/batchImport",
            }
        ]
    },
    {
        icon: "ProfileOutlined",
        title: "菜单嵌套",
        path: "/menu",
        children: [
            {
                icon: "AppstoreOutlined",
                title: "菜单1",
                path: "/menu/menu1",
            },
            {
                icon: "AppstoreOutlined",
                title: "菜单2",
                path: "/menu/menu2",
                children: [
                    {
                        icon: "AppstoreOutlined",
                        title: "菜单2-1",
                        path: "/menu/menu2/menu21",
                    },
                    {
                        icon: "AppstoreOutlined",
                        title: "菜单2-2",
                        path: "/menu/menu2/menu22",
                        children: [
                            {
                                icon: "AppstoreOutlined",
                                title: "菜单2-2-1",
                                path: "/menu/menu2/menu22/menu221",
                            },
                            {
                                icon: "AppstoreOutlined",
                                title: "菜单2-2-2",
                                path: "/menu/menu2/menu22/menu222",
                            }
                        ]
                    },
                    {
                        icon: "AppstoreOutlined",
                        title: "菜单2-3",
                        path: "/menu/menu2/menu23",
                    }
                ]
            },
            {
                icon: "AppstoreOutlined",
                title: "菜单3",
                path: "/menu/menu3",
            }
        ]
    },
    {
        icon: "ExclamationCircleOutlined",
        title: "错误页面",
        path: "/error",
        children: [
            {
                icon: "AppstoreOutlined",
                title: "/404",
                path: "404页面"
            },
            {
                icon: "AppstoreOutlined",
                title: "/403",
                path: "403页面"
            },
            {
                icon: "AppstoreOutlined",
                title: "/500",
                path: "500页面"
            }
        ]
    },
    {
        icon: "PaperClipOutlined",
        title: "外部链接",
        path: "/link",
        children: [
            {
                icon: "AppstoreOutlined",
                title: "GitHub 仓库",
                path: "/link/gitee",
                isLink: "https://github.com/chuhezhe0807"
            },
            // {
            //     icon: "AppstoreOutlined",
            //     title: "GitHub 仓库",
            //     path: "/link/github",
            //     isLink: "https://github.com/HalseySpicy/Hooks-Admin"
            // },
            // {
            //     icon: "AppstoreOutlined",
            //     title: "掘金文档",
            //     path: "/link/juejin",
            //     isLink: "https://juejin.cn/user/3263814531551816/posts"
            // },
            // {
            //     icon: "AppstoreOutlined",
            //     title: "个人博客",
            //     path: "/link/myBlog",
            //     isLink: "http://www.spicyboy.cn"
            // }
        ]
    }
]

export const buttonsList: Login.ResAuthButtons = {
    useHooks: {
        add: true,
        delete: true
    }
}

export const loginReturns: Login.ResLogin = {
    access_token: "bqddxxwqmfncffacvbpkuxvwvqrhln"
}