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

interface IInit {
    type: LoginActions.Init;
}

interface IRequest {
    type: LoginActions.Request;
}

interface IResponse {
    type: LoginActions.Response
    payload: IServiceUser;
}

interface ISuccess {
    type: LoginActions.Success
    payload: IServiceUser;
}

interface IFailure {
    type: LoginActions.Failure
    payload: IServiceUser;
}


type KnownAction = IInit | IRequest | IResponse | ISuccess | IFailure | never;

const initialState: ILoginState = {
    indicators: {
        operationLoading: false,
        loginSuccess: false
    }
};

export const reducerName = "login";

export function reducer(
    currentState = initialState,
    incomingAction: ActionUnion<typeof actionCreators>
): ILoginState {
    var cloneIndicators = () => clone(currentState.indicators);
    var action = incomingAction as KnownAction;
    switch (action.type) {
        case LoginActions.Init:
            return initialState;
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