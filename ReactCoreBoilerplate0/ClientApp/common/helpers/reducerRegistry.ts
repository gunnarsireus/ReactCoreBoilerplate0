import { Reducer } from "redux";
import {ApplicationState} from "./../../store"

export type Reducers = { [K in keyof ApplicationState]: Reducer<ApplicationState[K]> };

export type ChangeListener = (reducers: Partial<Reducers>) => void;

class ReducerRegistry {
    private _emitChange: ChangeListener | null = null;
    private _reducers: Partial<Reducers> = {};

    constructor(initialReducers?: Partial<Reducers>) {
        if (!initialReducers) return;
        this._reducers = { ...initialReducers };
    }

    get reducers() {
        return { ...this._reducers };
    }

    register<T extends keyof ApplicationState>(
        name: T,
        reducer: Reducer<ApplicationState[T]>
    ) {
        this._reducers = { ...this._reducers, [name]: reducer };

        if (!this._emitChange) return;
        this._emitChange(this.reducers);
    }

    setChangeListener(listener: ChangeListener) {
        this._emitChange = listener;
    }
}

const reducerRegistry = new ReducerRegistry({
});

export default reducerRegistry;



