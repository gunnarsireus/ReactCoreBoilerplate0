import { getHelper } from "../common/helpers/apiHelpers";
import * as Common from "./commonTypes";

/** List function permissions */
export async function listWeatherForecasts(startDateIndex: number): Promise<
   Common.Response.ListWeatherForcasts
    > {
    return getHelper("fetchdata/" + startDateIndex);
}
