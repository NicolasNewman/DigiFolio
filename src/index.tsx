import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import DataStore from './classes/DataStore';
import './app.global.less';
import IpcInterface from './classes/IpcInterface';
import APIManager from './api/APIManager';

const dataStore: DataStore = new DataStore();
const initialState = dataStore.get('reduxSave');
console.log('INITIAL STATE: ');
console.log(initialState);
const store = initialState ? configureStore(initialState) : configureStore();
console.log(store.getState());
const ipc = new IpcInterface(dataStore, store);

const apiManager = new APIManager(dataStore, store);
render(
    <Root
        store={store}
        history={history}
        dataStore={dataStore}
        apiManager={apiManager}
    />,
    document.getElementById('root')
);
