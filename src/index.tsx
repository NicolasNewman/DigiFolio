import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import DataStore from './classes/DataStore';
import './app.global.less';

const dataStore: DataStore = new DataStore();
const initialState = dataStore.get('reduxSave');

const store = initialState ? configureStore(initialState) : configureStore();

render(
    <Root store={store} history={history} dataStore={dataStore} />,
    document.getElementById('root')
);
