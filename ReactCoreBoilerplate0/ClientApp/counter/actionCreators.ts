import { CreateAction } from "../helpers/createAction";
import CounterActions from "./actions";
import { ICounterModel } from "@Models/ICounterModel";
import { IServiceUser } from "@Models/IServiceUser";

const createAction: CreateAction<CounterActions> = payload => payload;

export const incrementCounter = (
) =>
    createAction({
        type: CounterActions.IncrementCounter
    });

export const decrementCounter = (
    payload: IServiceUser
) =>
    createAction({
        type: CounterActions.DecrementCounter
    });



