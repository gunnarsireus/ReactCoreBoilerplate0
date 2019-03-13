import { ActionCreatorsMapObject } from "redux";

export type ActionUnion<T extends ActionCreatorsMapObject> = ReturnType<
    T[keyof T]
    >;

export type ActionByType<
    ActionUnionType,
    ActionType
    > = ActionUnionType extends {
        type: ActionType;
    }
    ? ActionUnionType
    : never;

export interface Payload<A> {
    type: A;
}

export type CreateAction<A> = <P extends Payload<A>>(payload: P) => P;