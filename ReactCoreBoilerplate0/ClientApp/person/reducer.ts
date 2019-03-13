import { clone } from "@Utils";
import { IPersonModel } from "@Models/IPersonModel";
import PersonActions from "./actions";
import reducerRegistry from "../helpers/reducerRegistry";
import { ActionUnion } from "../helpers/createAction";
import * as actionCreators from "./actionCreators";


export interface IPersonState {
    people: IPersonModel[],
    indicators: {
        operationLoading: boolean;
    };
}

const initialState: IPersonState = {
    people: [],
    indicators: {
        operationLoading: false
    }
};

export const reducerName = "person";

export function reducer(
    currentState = initialState,
    action: ActionUnion<typeof actionCreators>
): IPersonState {
    var cloneIndicators = () => clone(currentState.indicators);
    switch (action.type) {
        case PersonActions.FailureResponse:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            return { ...currentState, indicators };
        case PersonActions.SearchRequest:
            var indicators = cloneIndicators();
            indicators.operationLoading = true;
            return { ...currentState, indicators };
        case PersonActions.SearchResponse:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            return { ...currentState, indicators, people: action.payload };
        case PersonActions.UpdateRequest:
            var indicators = cloneIndicators();
            indicators.operationLoading = true;
            return { ...currentState, indicators };
        case PersonActions.UpdateResponse:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            var data = clone(currentState.people);
            var itemToUpdate = data.filter(x => x.id === action.payload.id)[0];
            itemToUpdate.firstName = action.payload.firstName;
            itemToUpdate.lastName = action.payload.lastName;
            return { ...currentState, indicators, people: data };
        case PersonActions.AddRequest:
            var indicators = cloneIndicators();
            indicators.operationLoading = true;
            return { ...currentState, indicators };
        case PersonActions.AddResponse:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            var data = clone(currentState.people);
            data.push(action.payload);
            return { ...currentState, indicators, people: data };
        case PersonActions.DeleteRequest:
            var indicators = cloneIndicators();
            indicators.operationLoading = true;
            return { ...currentState, indicators };
        case PersonActions.DeleteResponse:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            var data = clone(currentState.people).filter(x => x.id !== action.payload.id);
            return { ...currentState, indicators, people: data };
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