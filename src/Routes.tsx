import * as React from 'react';
import { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
// import CounterPage from './containers/CounterPage';
import DataStore from './classes/DataStore';
import IpcInterface from './classes/IpcInterface';
import sizes from './constants/sizes';

export default class Routes extends Component {
    private dataStore: DataStore = new DataStore();

    render() {
        return (
            <App>
                <Switch>
                    <Route
                        path={routes.HOME}
                        component={() => {
                            IpcInterface.resizeWindow(
                                sizes.homeWindow.width,
                                sizes.homeWindow.height
                            );
                            return <HomePage dataStore={this.dataStore} />;
                        }}
                    />
                    <Redirect from="/" to="/home" />
                </Switch>
            </App>
        );
    }
}
