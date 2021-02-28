import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import DataStore from 'app/classes/DataStore';
import routes from '../constants/routes';

interface IProps extends RouteComponentProps<any> {
    // IProps extends RouteComponentProps because this is the root component for our window
    dataStore: DataStore;
}

export default class MyComponent extends Component<IProps> {
    props: IProps;

    constructor(props, history) {
        super(props);
    }

    // only include this function if you need to be able to switch pages
    toPage(route: string, e) {
        const { history } = this.props;
        history.push(route);
    }

    render() {
        return (
            <div>
                <h2>Settings</h2>
            </div>
        );
    }
}
