import CounterActions from "./actions";
import reducerRegistry from "../helpers/reducerRegistry";
import { ActionUnion } from "../helpers/createAction";
import * as actionCreators from "./actionCreators";

export interface ICounterState {
    count:number
}

const initialState: ICounterState = {
    count: 0
};

export const reducerName = "counter";

export function reducer(
    currentState = initialState,
    action: ActionUnion<typeof actionCreators>
): ICounterState {
    switch (action.type) {
        case CounterActions.IncrementCounter:
            return { count: currentState.count + 1 };
        case CounterActions.DecrementCounter:
            return { count: currentState.count - 1 };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return currentState || { count: 0 };
};

export default () => reducerRegistry.register(reducerName, reducer as any);

declare global {
    interface ApplicationState {
        [reducerName]: ReturnType<typeof reducer>;
    }
}