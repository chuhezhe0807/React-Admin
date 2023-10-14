

import * as types from "@/redux/mutation-types";
import type { TAuthStateAction } from "./action";
import type { AuthState } from "@/redux/interface";

import produce from "immer";

const authState: AuthState = {
  authButtons: {},
  authRouter: []
};

// auth reducer
const auth = (state: AuthState = authState, action: TAuthStateAction) =>
  produce(state, draftState => {
    switch (action.type) {
      case types.SET_AUTH_BUTTONS:
        draftState.authButtons = action.authButtons;
        break;
      case types.SET_AUTH_ROUTER:
        draftState.authRouter = action.authRouter;
        break;
      default:
        return draftState;
    }
  });

export default auth;
