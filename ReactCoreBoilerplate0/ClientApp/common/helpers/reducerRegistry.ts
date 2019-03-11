import { Reducer } from "redux";

export type Reducers = { [K in keyof GlobalState]: Reducer<GlobalState[K]> };

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

    register<T extends keyof GlobalState>(
        name: T,
        reducer: Reducer<GlobalState[T]>
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

declare global {
    interface GlobalState {
     
    }
}


