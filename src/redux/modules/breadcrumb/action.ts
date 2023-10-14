import * as AllTypes from '@/redux/mutation-types'

type TBreadcrumbListAction = {
  type: typeof AllTypes.SET_BREADCRUMB_LIST,
  breadcrumbList: { [propName: string]: any }
}

// setBreadcrumbList
export const setBreadcrumbList = (breadcrumbList: { [propName: string]: any }): TBreadcrumbListAction => ({
  type: AllTypes.SET_BREADCRUMB_LIST,
  breadcrumbList
})

export type TBreadcrumbActions = TBreadcrumbListAction;