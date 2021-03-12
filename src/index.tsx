import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import DataStore from './classes/DataStore';
import './app.global.less';
import './components/Random';

const keytar = require('keytar');

if (keytar.getPassword('digifolio', 'user') == null) {
    const key = randomAlphaNum(128);
    keytar.setPassword('digifolio', 'user', key);
}

const dataStore: DataStore = new DataStore(
    keytar.getPassword('digifolio', 'user')
);
const initialState = dataStore.get('reduxSave');

const store = initialState ? configureStore(initialState) : configureStore();

render(
    <Root store={store} history={history} dataStore={dataStore} />,
    document.getElementById('root')
);
