import React from 'react';
import { render } from 'react-dom';
import { setPassword, getPassword } from 'keytar';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import DataStore from './classes/DataStore';
import './app.global.less';
import IpcInterface from './classes/IpcInterface';
import APIManager from './api/APIManager';
import genKey from './helper/random';

(async () => {
    let storedKey = await getPassword('DigiFolio', 'user');
    if (storedKey === null) {
        const key = genKey(32);
        await setPassword('DigiFolio', 'user', key);
        storedKey = key;
    }

    const dataStore: DataStore = new DataStore(storedKey);
    const initialState = dataStore.get('reduxSave');
    console.log('INITIAL STATE: ');
    console.log(initialState);
    const store = initialState
        ? configureStore(initialState)
        : configureStore();
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
})();
