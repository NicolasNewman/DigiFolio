import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
// import { Redirect } from 'react-router';
import DataStore from 'app/classes/DataStore';
// import routes from '../constants/routes';

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
}

export default class Home extends Component<IProps> {
    props: IProps;

    constructor(props, history) {
        super(props);
    }

    toPage(route: string, e) {
        const { history } = this.props;
        history.push(route);
    }

    render() {
        // if (this.state.toHome) {
        //     return <Redirect to="/home" />;
        // }
        return (
            <div>
                <h2>Home</h2>
            </div>
        );
    }
}
