import { ThemeConfigProp } from '@/redux/interface';
import * as AllTypes from '@/redux/mutation-types'

// 设置token
export const setToken = (token: string) => ({
  type: AllTypes.SET_TOKEN,
  token
})

// * setLanguage
export const setLanguage = (language: string) => ({
  type: AllTypes.SET_LANGUAGE,
  language
});

// setThemeConfig
export const setThemeConfig = (themeConfig: ThemeConfigProp) => ({
  type: AllTypes.SET_THEME_CONFIG,
  themeConfig
})

// setAssemblySize
export const setAssemblySize = (assemblySize: string) => ({
  type: AllTypes.SET_ASSEMBLY_SIZE,
  assemblySize
})