import { AnyAction } from "redux"
import { BreadcrumbState } from "@/redux/interface"
import produce from "immer"
import * as AllTypes from '@/redux/mutation-types'

const breadcrumbState: BreadcrumbState = {
  breadcrumbList: {}
};

const breadcrumb = (state: BreadcrumbState = breadcrumbState, action: AnyAction) => (
  produce(state, draftState => {
    switch (action.type) {
      case AllTypes.SET_BREADCRUMB_LIST:
        draftState.breadcrumbList = action.breadcrumbList
        break;
      default:
        return draftState;
    }
  })
)

export default breadcrumb;