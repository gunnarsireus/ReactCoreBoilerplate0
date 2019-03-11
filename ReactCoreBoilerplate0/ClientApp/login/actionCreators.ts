import { CreateAction } from "../common/helpers/createAction";
import LoginActions from "./actions";
import { ILoginModel } from "@Models/ILoginModel";
import { IServiceUser } from "@Models/IServiceUser";

const createAction: CreateAction<LoginActions> = payload => payload;

export const loginInit = () =>
    createAction({
        type: LoginActions.Init
    });


export const loginRequest = (
    payload: ILoginModel
) =>
    createAction({
        payload,
        type: LoginActions.Request
    });

export const loginResponse = (
    payload: IServiceUser
) =>
    createAction({
        payload,
        type: LoginActions.Response
    });

export const loginSuccess = (
    payload: IServiceUser
) =>
    createAction({
        payload,
        type: LoginActions.Success
    });

export const loginFailure = (
) =>
    createAction({
        type: LoginActions.Failure
    });


