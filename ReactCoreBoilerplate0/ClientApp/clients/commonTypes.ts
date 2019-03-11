
export namespace Response {
    export interface ListWeatherForcasts {
        forecasts: Array<IWeatherForecast>;
    }
}


export interface IWeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

