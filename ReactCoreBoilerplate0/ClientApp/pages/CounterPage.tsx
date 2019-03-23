import * as React from 'react';
import { RouteComponentProps } from "react-router";
import { connect } from 'react-redux';
import registerReducer from "../counter/reducer";

registerReducer();

import {
    decrementCounter,
    incrementCounter
} from "../counter/actionCreators";

const mapDispatchToProps = {
    decrementCounter,
    incrementCounter
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<{}>;

class CounterPage extends React.Component<Props, {}> {
    public render() {
        return <div>
            <h1>Counter</h1>

            <p>This is a simple example of a React component.</p>

            <p>Current count: <strong>{ this.props.counter.count }</strong></p>

            <button onClick={ () => { this.props.incrementCounter() } }>Increment</button>
        </div>;
    }
}

// Wire up the React component to the Redux store

const mapStateToProps = ({ counter }: ApplicationState) => ({ counter });

export default connect(mapStateToProps, mapDispatchToProps)(CounterPage);