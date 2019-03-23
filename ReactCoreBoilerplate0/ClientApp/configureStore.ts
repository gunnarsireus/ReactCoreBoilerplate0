import { createStore, applyMiddleware, compose, combineReducers, StoreEnhancer, Store, StoreEnhancerStoreCreator, ReducersMapObject } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware, LOCATION_CHANGE } from 'connected-react-router';
//var routerReducer = require("connected-react-router/lib/reducer");
import reducerRegistry from "./helpers/reducerRegistry";
import * as StoreModule from './store';
import { ApplicationState, reducers } from './store';
import { History } from 'history';

function isClientSide(object:any):boolean {
    return (typeof object !== 'undefined');
}

export default function configureStore(history: History, initialState?: ApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    let createStoreWithMiddleware;
    if (isClientSide(initialState)) {
        // Preserve initial state for not-yet-loaded reducers
        const combine = (reducers) => {
            const reducerNames = Object.keys(reducers);
            Object.keys(initialState).forEach(item => {
                if (reducerNames.indexOf(item) === -1) {
                    reducers[item] = (state = null) => state;
                }
            });
            return combineReducers(reducers);
        };

        const reducer = combine(reducerRegistry.getReducers());
        const Window = window as any;
        // If devTools is installed, connect to it
        const devToolsExtension = Window.__REDUX_DEVTOOLS_EXTENSION__ as () => StoreEnhancer;
        createStoreWithMiddleware = compose(
            applyMiddleware(thunk, routerMiddleware(history)),
            devToolsExtension ? devToolsExtension() : <S>(next: StoreEnhancerStoreCreator<S>) => next
        )(createStore);
    }
    else {
        createStoreWithMiddleware = compose(
            applyMiddleware(thunk, routerMiddleware(history)),
            <S>(next: StoreEnhancerStoreCreator<S>) => next
        )(createStore);
    }

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducers, history);
    const store = createStoreWithMiddleware(allReducers, initialState as any) as Store<ApplicationState>;

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./store', () => {
            const nextRootReducer = require<typeof StoreModule>('./store');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers, history));
        });
    }

    return store;
}

const routerReducer = (history) => {
    const initialState = {
        location: history.location,
        action: history.action,
    };
    return (state = initialState, arg: any = {}) => {
        if (arg.type === LOCATION_CHANGE) {
            return { ...state, ...arg.payload };
        }
        return state;
    }
};

function buildRootReducer(allReducers: ReducersMapObject, history) {
    return combineReducers<ApplicationState>({...allReducers, ...{ router: routerReducer(history) }} as any);
}
