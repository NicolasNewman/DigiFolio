import * as React from 'react';
import { PureComponent } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
// import CounterPage from './containers/CounterPage';
import DataStore from './classes/DataStore';
import IpcInterface from './classes/IpcInterface';
import sizes from './constants/sizes';
import SettingsPage from './containers/SettingsPage';
import DebugPage from './containers/DebugPage';
import APIManager from './api/APIManager';

interface IProps {
    dataStore: DataStore;
    apiManager: APIManager;
}

export default class Routes extends PureComponent<IProps> {
    props!: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { dataStore, apiManager } = this.props;
        apiManager.printState('State after route render: ');
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
                            return <HomePage dataStore={dataStore} />;
                        }}
                    />
                    <Route
                        path={routes.SETTINGS}
                        component={() => {
                            IpcInterface.resizeWindow(
                                sizes.settingsWindow.width,
                                sizes.settingsWindow.height
                            );
                            return (
                                <SettingsPage
                                    dataStore={dataStore}
                                    apiManager={apiManager}
                                />
                            );
                        }}
                    />
                    <Route
                        path={routes.DEBUG}
                        component={() => {
                            IpcInterface.resizeWindow(
                                sizes.debugWindow.width,
                                sizes.debugWindow.height
                            );
                            return <DebugPage dataStore={dataStore} />;
                        }}
                    />
                    <Redirect from="/" to="/home" />
                </Switch>
            </App>
        );
    }
}
