import { defineConfig, ConfigEnv, UserConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { wrapperEnv } from './src/utils/getEnv'

import { createHtmlPlugin } from "vite-plugin-html";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import {Plugin} from 'vite-plugin-cdn-import'

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv): UserConfig => {
  const env = loadEnv(mode.mode, process.cwd())
  const viteEnv = wrapperEnv(env)
  
  return {
    // alias config
    resolve: {
			alias: {
				"@": resolve(__dirname, "./src")
			},
      // extensions: ['.js', '.ts', '.tsx']
		},
    // global css
		css: {
			preprocessorOptions: {
				less: {
					// modifyVars: {
					// 	"primary-color": "#1DA57A",
					// },
					javascriptEnabled: true,
					additionalData: `@import "@/styles/globalCss.less";`
				}
			}
		},
    		// server config
		server: {
			host: "0.0.0.0", // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
			port: viteEnv.VITE_PORT,
			open: viteEnv.VITE_OPEN,
			cors: true,
			// https: false,
			// 代理跨域（mock 不需要配置，这里只是个事列）
			proxy: {
				"/api": {
					target: "https://mock.mengxuegu.com/mock/62abda3212c1416424630a45", // easymock
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api/, "")
				}
			}
		},
    // plugins
		plugins: [
			react(),
      // 配置CDN
      Plugin({
        modules: [
          {
            name:"react",
            var:"React",
            path:"https://cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.development.min.js"
          },
          {
            name:"react-dom",
            var:"ReactDom",
            path:"https://cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.development.min.js"
          }
        ]
    }),
			createHtmlPlugin({
      /**
       * 在这里写entry后，你将不需要在`index.html`内添加 script 标签，原有标签需要删除
       * @default src/main.ts
       */
      // entry: 'src/main.ts',
      /**
       * 如果你想将 `index.html`存放在指定文件夹，可以修改它，否则不需要配置
       * @default index.html
       */
      // template: 'public/index.html',
      /**
       * 需要注入 index.html ejs 模版的数据
       */
				inject: {
					data: {
						title: viteEnv.VITE_GLOB_APP_TITLE
					}
				}
			}),
			// * 使用 svg 图标
			createSvgIconsPlugin({
        // 指定要缓存的文件夹
				iconDirs: [resolve(process.cwd(), "src/assets/icons")],
        // 文件签名
				symbolId: "icon-[dir]-[name]"
			}),
			// * EsLint 报错信息显示在浏览器界面上
			// eslintPlugin(),
			// * 是否生成包预览 rollup的包分析工具
			viteEnv.VITE_REPORT && visualizer(),
			// * gzip compress
			viteEnv.VITE_BUILD_GZIP &&
				viteCompression({
          // 过滤器，对哪些类型的文件进行压缩 默认为 /.(js|mjs|json|css|html)$/i’
          // filter: '/.()/',
          // 压缩后是否删除源文件，默认为false
          deleteOriginFile: false,
          // 是否在控制多台输出压缩结果
					verbose: true,
          // 是否禁用压缩
					disable: false,
          // 超过该值（单位 字节）则启用压缩文件
					threshold: 10240,
          // 采用的压缩算法 默认 gzip
					algorithm: "gzip",
          // 生成的压缩包后缀名
					ext: ".gz"
				}),
		],

    // esbuild
    /**
     * esbuild 是 vite 性能快的关键。esbuild 在 vite 中主要被使用在以下场景:
    1、通过入口分析依赖树，收集 node_modules 中的依赖，提前打包处理，并在磁盘持久化缓存处理过后的文件。
    2、对部分业务文件 使用 esbuild 处理转化，比如 ts、jsx、tsx。注意 js 类型文件并不会被处理
    */
    esbuild: {
      // 打包后会在没有使用字段（所配置的）之前加上 /* @__PURE__ */ 并删除他们
			pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : [],
      // 所有的最小化都会被默认应用
      // minify: true
		},
    // build configure
		build: {
			outDir: "dist",
			// esbuild 打包更快，但是不能去除 console.log，去除 console 使用 terser 模式
			minify: "esbuild",
			// minify: "terser",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: viteEnv.VITE_DROP_CONSOLE,
			// 		drop_debugger: true
			// 	}
			// },
			rollupOptions: {
				output: {
					// Static resource classification and packaging
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
				}
			}
		}
  }
})

