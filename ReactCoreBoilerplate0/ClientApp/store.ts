//import * as  LoginStore from "./login/reducer";
//import * as PersonStore from "./person/reducer";
import * as LoginStore from "./login/reducer";
import * as PersonStore from "./person/reducer";
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
