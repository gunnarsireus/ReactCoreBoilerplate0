import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import { IWeatherForecastModel } from "@Models/IWeatherForecastModel";
import { Helmet } from "react-helmet";
import { PagingBar } from "@Components/shared/PagingBar";
import Loader from "@Components/shared/Loader";
import bind from 'bind-decorator';
import { ModalComponent } from "@Components/shared/ModalComponent";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import * as apiClient from "../helpers/apiHelpers"

import registerReducer from "../weatherforecasts/reducer";

registerReducer();

import {
    weatherForecastsReceive,
    weatherForecastsRequest,
    weatherForecastsFailure
} from "../weatherforecasts/actionCreators";  

const mapDispatchToProps = {
    weatherForecastsReceive,
    weatherForecastsRequest,
    weatherForecastsFailure
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<{}>;

class WetaherForecastsPage extends React.Component<Props, {}> {
    private debouncedSearch: () => void;
    constructor(props: Props) {
        super(props);
        this.state = {
        };
        this.debouncedSearch = AwesomeDebouncePromise(() => {
            this.getForecasts();
        }, 500);
    }
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.getForecasts();
    }

    @bind
    private async getForecasts(startDateIndex: number = 0) {
        this.props.weatherForecastsRequest({ startDateIndex: startDateIndex });
        const result = await apiClient.getHelper(`api/Weather/Forecasts?startDateIndex=${startDateIndex}`);
        if (!result.hasErrors) {
            this.props.weatherForecastsReceive(result.value)
        } else {
            this.props.weatherForecastsFailure({ errors: result.errors });
        }
        return;
    }
    public render() {
        return <div>
            <h1>Weather forecast</h1>
            <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
            {this.renderForecastsTable() }
            { this.renderPagination() }
        </div>;
    }

    private renderForecastsTable() {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Temp. (F)</th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
                {this.props.weatherforecast.forecasts.map(forecast =>
                <tr key={ forecast.dateFormatted }>
                    <td>{ forecast.dateFormatted }</td>
                    <td>{ forecast.temperatureC }</td>
                    <td>{ forecast.temperatureF }</td>
                    <td>{ forecast.summary }</td>
                </tr>
            )}
            </tbody>
        </table>;
    }

    private renderPagination() {
        let prevStartDateIndex = (this.props.weatherforecast.startDateIndex || 0) - 5;
        let nextStartDateIndex = (this.props.weatherforecast.startDateIndex || 0) + 5;

        return <p className='clearfix text-center'>
            <button type="button" className="btn btn-default pull-left" onClick={()=> this.getForecasts(prevStartDateIndex)}>Previous</button>
            <button type="button" className="btn btn-default pull-right" onClick={()=> this.getForecasts(nextStartDateIndex)}>Next</button>
            {this.props.weatherforecast.isLoading ? <span>Loading...</span> : [] }
        </p>;
    }
}

const mapStateToProps = ({ weatherforecast }: ApplicationState) => ({ weatherforecast });

export default connect(mapStateToProps, mapDispatchToProps)(WetaherForecastsPage);
