import { CreateAction } from "../common/helpers/createAction";
import PersonActions from "./actions";
import { IPersonModel } from "@Models/IPersonModel";

const createAction: CreateAction<PersonActions> = payload => payload;

export const personSearchRequest = (
    payload: { term?: string }
) =>
    createAction({
        payload,
        type: PersonActions.SearchRequest
    });

export const personSearchResponse = (
    payload: IPersonModel[]
) => 
    createAction({
        payload,
        type: PersonActions.SearchResponse
    });



export const personAddRequest = (payload:IPersonModel) =>
    createAction({
        payload,
        type: PersonActions.AddRequest
    });

export const personAddResponse = (payload:IPersonModel) =>
    createAction({
        payload,
        type: PersonActions.AddResponse
    });

export const personFailureResponse = (payload: { error: string }) =>
    createAction({
        payload,
        type: PersonActions.FailureResponse
    });

export const personUpdateRequest = (payload:IPersonModel) =>
    createAction({
        payload,
        type: PersonActions.UpdateRequest
    });

export const personUpdateResponse = (payload:IPersonModel) =>
    createAction({
        payload,
        type: PersonActions.UpdateResponse
    });

export const personDeleteRequest = (payload: { id: number}) =>
    createAction({
        payload,
        type: PersonActions.DeleteRequest
    });

export const personDeleteResponse = (payload: { id: number }) =>
    createAction({
        payload,
        type: PersonActions.DeleteResponse
    });
