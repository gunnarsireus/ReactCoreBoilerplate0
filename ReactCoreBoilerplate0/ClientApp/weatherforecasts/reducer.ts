import { clone } from "@Utils";
import { IWeatherForecastModel } from "@Models/IWeatherForecastModel";
import WeatherForecastActions from "./actions";
import reducerRegistry from "../helpers/reducerRegistry";
import { ActionUnion } from "../helpers/createAction";
import * as actionCreators from "./actionCreators";


export interface IWeatherForecastsState {
    isLoading: boolean;
    startDateIndex?: number;
    forecasts: IWeatherForecastModel[];
}

const initialState: IWeatherForecastsState =  {
    isLoading: false,
    startDateIndex: 0,
    forecasts: []
}

export const reducerName = "weatherforecasts";
const unloadedState: IWeatherForecastsState = { forecasts: [], isLoading: false };

export function reducer(
    currentState = initialState,
    action: ActionUnion<typeof actionCreators>
): IWeatherForecastsState {
    switch (action.type) {
        case WeatherForecastActions.RequestWeatherForecasts:
            return {
                startDateIndex: action.payload.startDateIndex,
                forecasts: currentState.forecasts,
                isLoading: true
            };
        case WeatherForecastActions.ReceiveWeatherForecasts:
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            //if (action.payload. === currentState.startDateIndex) {
                return {
                    startDateIndex: currentState.startDateIndex,
                    forecasts: action.payload,
                    isLoading: false
                };
            //}
        case WeatherForecastActions.weatherForecastsFailure:
            return {
                //startDateIndex: action.payload.startDateIndex,
                forecasts: currentState.forecasts,
                isLoading: true
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return currentState || unloadedState;
};

export default () => reducerRegistry.register(reducerName, reducer as any);

declare global {
    interface ApplicationState {
        [reducerName]: ReturnType<typeof reducer>;
    }
}