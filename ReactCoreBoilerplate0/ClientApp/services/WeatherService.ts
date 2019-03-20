import { ServiceBase } from "@Services/ServiceBase";
import Result from "@Models/Result";
import { IWeatherForecastModel } from "@Models/IWeatherForecastModel";

export default class WeatherService extends ServiceBase {
    public static async forecasts(startDateIndex: number = 0): Promise<Result<IWeatherForecastModel[]>> {

        var result = await this.requestJson<IWeatherForecastModel[]>({
        url: `/api/Weather/Forecasts?startDateIndex=${startDateIndex}`,
            method: "GET"
        });
        return result;
    }
}