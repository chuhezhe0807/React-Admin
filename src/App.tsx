import AuthRouter from "@/routes/utils/authRouter"
import Router from "@/routes/index"
import useTheme from "@/hooks/useTheme"
import {LANGUAGE_ENUM as TLocaleType} from "@/enum/ReduxEnum"
import type {RootState} from "@/redux/index";

import i18n from "i18next"
import zhCN from "antd/lib/locale/zh_CN"
import enUS from "antd/lib/locale/en_US"
import zhTW from "antd/lib/locale/zh_TW"
import jaJP from "antd/lib/locale/ja_JP"
import { useEffect } from "react"
import { getBrowserLang } from "./utils/utils"
import { ConfigProvider } from "antd"
import { useSelector } from "react-redux"
import { HashRouter } from "react-router-dom"
import type { Locale } from "antd/lib/locale"

const LOCALE_MAP: {[key in TLocaleType]: Locale} = {
  zhCN,
  enUS,
  zhTW,
  jaJP
}

const App = () => {
  const { language, assemblySize, themeConfig } = useSelector((state: RootState) => state.global);

  // 使用全局主题
  useTheme(themeConfig);

  useEffect(() => {
    // 全局使用国际化
    i18n.changeLanguage(language || getBrowserLang())
  }, [language]);

  return (
    <HashRouter>
      <ConfigProvider locale={LOCALE_MAP[language as TLocaleType]} componentSize={assemblySize}>
        <AuthRouter>
          <Router></Router>
        </AuthRouter>
      </ConfigProvider>
    </HashRouter>
  )
}

export default App;
