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
import { exportStore } from "../boot-client";
import * as apiClient from "../helpers/apiHelpers"

import registerReducer from "../login/reducer";

registerReducer();

import {
    weatherForecastsReceive,
    weatherForecastsRequest
} from "../weatherforecasts/actionCreators";  

const mapDispatchToProps = {
    weatherForecastsReceive,
    weatherForecastsRequest
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<{}>;

class WetaherForecastsPage extends React.Component<Props, {}> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        let startDateIndex = this.props.weatherforecasts.startDateIndex || 0;
        this.props.weatherForecastsRequest({ startDateIndex:startDateIndex });
    }

    componentWillReceiveProps(nextProps: Props) {
        // This method runs when incoming props (e.g., route params) change
        let startDateIndex = nextProps.weatherforecasts.startDateIndex || 0;
        this.props.weatherForecastsRequest({ startDateIndex: startDateIndex });
    }

    public render() {
        return <div>
            <h1>Weather forecast</h1>
            <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
            { this.renderForecastsTable() }
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
            {this.props.weatherforecasts.forecasts.map(forecast =>
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
        let prevStartDateIndex = (this.props.weatherforecasts.startDateIndex || 0) - 5;
        let nextStartDateIndex = (this.props.weatherforecasts.startDateIndex || 0) + 5;

        return <p className='clearfix text-center'>
            <Link className='btn btn-default pull-left' to={ `/fetchdata/${ prevStartDateIndex }` }>Previous</Link>
            <Link className='btn btn-default pull-right' to={ `/fetchdata/${ nextStartDateIndex }` }>Next</Link>
            {this.props.weatherforecasts.isLoading ? <span>Loading...</span> : [] }
        </p>;
    }
}

const mapStateToProps = ({ weatherforecasts }: ApplicationState) => ({ weatherforecasts });

export default connect(mapStateToProps, mapDispatchToProps)(WetaherForecastsPage);
