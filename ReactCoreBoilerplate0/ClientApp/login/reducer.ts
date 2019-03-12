import { clone } from "@Utils";
import { IServiceUser } from "@Models/IServiceUser";
import { Action, Reducer } from "redux";
import LoginActions from "./actions";
import reducerRegistry from "../common/helpers/reducerRegistry";
import { ActionUnion } from "../common/helpers/createAction";
import * as actionCreators from "./actionCreators";

export interface ILoginState {
    indicators: {
        operationLoading: boolean;
        loginSuccess: boolean;
    };
}

const initialState: ILoginState = {
    indicators: {
        operationLoading: false,
        loginSuccess: false
    }
};

export const reducerName = "login";

export function reducer(
    currentState = initialState,
    action: ActionUnion<typeof actionCreators>
): ILoginState {
    var cloneIndicators = () => clone(currentState.indicators);
    switch (action.type) {
        case LoginActions.Init:
            return initialState;
        case LoginActions.Request:
            var indicators = cloneIndicators();
            indicators.operationLoading = true;
            return { ...currentState, indicators };
        case LoginActions.Response:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            indicators.loginSuccess = true;
            return { ...currentState, indicators };
        case LoginActions.Success:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            indicators.loginSuccess = true;
            return { ...currentState, indicators };
        case LoginActions.Failure:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            indicators.loginSuccess = false;
            return { ...currentState, indicators };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return currentState || initialState;
}

export default () => reducerRegistry.register(reducerName, reducer as any);

declare global {
    interface ApplicationState {
        [reducerName]: ReturnType<typeof reducer>;
    }
}