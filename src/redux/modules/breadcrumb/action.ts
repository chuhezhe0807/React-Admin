import * as AllTypes from '@/redux/mutation-types'

// setBreadcrumbList
export const setBreadcrumbList = (breadcrumbList: { [propName: string]: any }) => ({
  type: AllTypes.SET_BREADCRUMB_LIST,
  breadcrumbList
})