import { ThemeConfigProp } from '@/redux/interface';
import type { SizeType } from "antd/lib/config-provider/SizeContext";
import * as AllTypes from '@/redux/mutation-types'

type TTokenAction = {
  type: typeof AllTypes.SET_TOKEN,
  token: string
}

type TLanguageAction = {
  type: typeof AllTypes.SET_LANGUAGE,
  language: string
}

type TThemeConfigAction = {
  type: typeof AllTypes.SET_THEME_CONFIG,
  themeConfig: ThemeConfigProp
}

type TAssemblySizeAction = {
  type: typeof AllTypes.SET_ASSEMBLY_SIZE,
  assemblySize: SizeType
}

// 设置token
export const setToken = (token: string): TTokenAction => ({
  type: AllTypes.SET_TOKEN,
  token
})

// * setLanguage
export const setLanguage = (language: string): TLanguageAction => ({
  type: AllTypes.SET_LANGUAGE,
  language
});

// setThemeConfig
export const setThemeConfig = (themeConfig: ThemeConfigProp): TThemeConfigAction => ({
  type: AllTypes.SET_THEME_CONFIG,
  themeConfig
})

// setAssemblySize
export const setAssemblySize = (assemblySize: SizeType): TAssemblySizeAction => ({
  type: AllTypes.SET_ASSEMBLY_SIZE,
  assemblySize
})

export type TGlobalActions = TTokenAction | TLanguageAction | TThemeConfigAction | TAssemblySizeAction;