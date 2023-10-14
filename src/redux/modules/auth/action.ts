import * as types from "@/redux/mutation-types";

type TAuthButtonsAction = {
	type: typeof types.SET_AUTH_BUTTONS,
	authButtons: {[propName: string]: any}
}

type TAuthRouterAction = {
	type: typeof types.SET_AUTH_ROUTER,
	authRouter: Array<string>
}

// * setAuthButtons
export const setAuthButtons = (authButtons: { [propName: string]: any }): TAuthButtonsAction => ({
	type: types.SET_AUTH_BUTTONS,
	authButtons
});

// * setAuthRouter
export const setAuthRouter = (authRouter: string[]): TAuthRouterAction => ({
	type: types.SET_AUTH_ROUTER,
	authRouter
});

export type TAuthStateAction = TAuthButtonsAction | TAuthRouterAction;
