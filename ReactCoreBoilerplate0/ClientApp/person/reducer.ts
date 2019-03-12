import { clone } from "@Utils";
import { IPersonModel } from "@Models/IPersonModel";
import { Action, Reducer } from "redux";
import PersonActions from "./actions";
import reducerRegistry from "../common/helpers/reducerRegistry";
import { ActionUnion } from "../common/helpers/createAction";
import * as actionCreators from "./actionCreators";


export interface IPersonState {
    people: IPersonModel[],
    indicators: {
        operationLoading: boolean;
    };
}
interface IFailureResponse {
    type: PersonActions.FailureResponse;
}

interface IGetAllRequest {
    type: PersonActions.SearchRequest;
}

interface IGetAllResponse {
    type: PersonActions.SearchResponse;
    payload: IPersonModel[];
}

interface IAddRequest {
    type: PersonActions.AddRequest;
}

interface IAddResponse {
    type: PersonActions.AddResponse;
    payload: IPersonModel;
}

interface IUpdateRequest {
    type: PersonActions.UpdateRequest;
}

interface IUpdateResponse {
    type: PersonActions.UpdateResponse;
    payload: IPersonModel;
}

interface IDeleteRequest {
    type: PersonActions.DeleteRequest;
}

interface IDeleteResponse {
    type: PersonActions.DeleteResponse;
    id: number;
}

type KnownAction =
    IFailureResponse |
    IGetAllRequest | IGetAllResponse |
    IAddRequest | IAddResponse |
    IUpdateRequest | IUpdateResponse |
    IDeleteRequest | IDeleteResponse;

const initialState: IPersonState = {
    people: [],
    indicators: {
        operationLoading: false
    }
};

export const reducerName = "person";

export function reducer(
    currentState = initialState,
    incomingAction: ActionUnion<typeof actionCreators>
): IPersonState {
    console.log("reducer, incomingAction: ", incomingAction, ", currentState: ", currentState);
    var cloneIndicators = () => clone(currentState.indicators);
    var action = incomingAction as KnownAction;
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
            console.log("reducer action.payload: ", action.payload)
            return { ...currentState, indicators, people: action.payload };
        case PersonActions.UpdateRequest:
            var indicators = cloneIndicators();
            indicators.operationLoading = true;
            return { ...currentState, indicators };
        case PersonActions.UpdateResponse:
            var indicators = cloneIndicators();
            indicators.operationLoading = false;
            var data = clone(currentState.people);
            var act = action;
            var itemToUpdate = data.filter(x => x.id === act.payload.id)[0];
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
            var acti = action;
            var data = clone(currentState.people).filter(x => x.id !== acti.id);
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