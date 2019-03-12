//import * as  LoginStore from "./login/reducer";
//import * as PersonStore from "./person/reducer";
import * as LoginStore from "./login/reducer";
import { PersonStore } from "@Store/PersonStore";
import reducerRegistry, { Reducers } from "./common/helpers/reducerRegistry";
import {
    RouterState,
    routerReducer as router,
    routerMiddleware
} from "react-router-redux";


reducerRegistry.register("router", router);

// The top-level state object
export interface ApplicationState {
    login: LoginStore.ILoginState;
    person: PersonStore.IPersonState;
    router: RouterState
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    login: LoginStore.reducer,
    person: PersonStore.reducer,
    router
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}

export interface AppThunkActionAsync<TAction, TResult> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState) : Promise<TResult>
}