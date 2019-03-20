import { CreateAction } from "../helpers/createAction";
import WeatherForecastActions from "./actions";
import { IWeatherForecastModel } from "@Models/IWeatherForecastModel";

const createAction: CreateAction<WeatherForecastActions> = payload => payload;

export const weatherForecastsRequest = (
    payload: { startDateIndex:number }
) =>
    createAction({
        payload,
        type: WeatherForecastActions.RequestWeatherForecasts
    });

export const weatherForecastsReceive = (
    payload: IWeatherForecastModel[]
) =>
    createAction({
        payload,
        type: WeatherForecastActions.ReceiveWeatherForecasts
    });

