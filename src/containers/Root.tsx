import * as React from 'react';
import { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import Routes from '../Routes';
import DataStore from '../classes/DataStore';
import APIManager from '../api/APIManager';

type Props = {
    store: any;
    dataStore: DataStore;
    history: History<any>;
    apiManager: APIManager;
};

export default class Root extends PureComponent<Props> {
    render() {
        const { store, history, dataStore, apiManager } = this.props;
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Routes dataStore={dataStore} apiManager={apiManager} />
                </ConnectedRouter>
            </Provider>
        );
    }
}
