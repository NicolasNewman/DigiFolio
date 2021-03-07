import * as React from 'react';
import { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import Routes from '../Routes';
import DataStore from '../classes/DataStore';

type Props = {
    store: any;
    dataStore: DataStore;
    history: History<any>;
};

export default class Root extends PureComponent<Props> {
    render() {
        const { store, history, dataStore } = this.props;
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Routes dataStore={dataStore} />
                </ConnectedRouter>
            </Provider>
        );
    }
}
