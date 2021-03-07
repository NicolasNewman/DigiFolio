import * as React from 'react';
import { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import SettingsPage from './containers/SettingsPage';
import DesignerPage from './containers/DesignerPage';
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
                    <Route
                        path={routes.SETTINGS}
                        component={() => {
                            IpcInterface.resizeWindow(
                                sizes.settingsWindow.width,
                                sizes.settingsWindow.height
                            );
                            return <SettingsPage dataStore={this.dataStore} />;
                        }}
                    />
                    <Route
                        path={routes.DESIGNER}
                        component={() => {
                            IpcInterface.resizeWindow(
                                sizes.designerWindow.width,
                                sizes.designerWindow.height
                            );
                            return <DesignerPage dataStore={this.dataStore} />;
                        }}
                    />
                    <Redirect from="/" to="/home" />
                </Switch>
            </App>
        );
    }
}
