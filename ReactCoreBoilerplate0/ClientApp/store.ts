import reducerRegistry from "./helpers/reducerRegistry";
import {
    RouterState,
    routerReducer as router,
} from "react-router-redux";


reducerRegistry.register("router", router);

declare global {
    interface ApplicationState {
        router: RouterState;
    }
}


export const reducers = {
    router
};
