import { CreateAction } from "../common/helpers/createAction";
import PersonActions from "./actions";
import { IPersonModel } from "@Models/IPersonModel";

const createAction: CreateAction<PersonActions> = payload => payload;

export const personSearchRequest = (payload: { term?: string }) =>
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


export const personAddRequest = (payload: { person:IPersonModel }) =>
    createAction({
        payload,
        type: PersonActions.AddRequest
    });

export const personUpdateRequest = (payload: { person: IPersonModel }) =>
    createAction({
        payload,
        type: PersonActions.UpdateRequest
    });

export const personDeleteRequest = (payload: { id: number}) =>
    createAction({
        payload,
        type: PersonActions.DeleteRequest
    });
