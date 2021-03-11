import { ipcRenderer } from 'electron';
import { Store } from 'redux';
import cloneDeep from 'clone-deep';
import DataStore from './DataStore';

export default class IpcInterface {
    constructor(electronStore: DataStore, reduxStore: Store<any>) {
        ipcRenderer.on('closing', () => {
            const clone = cloneDeep(reduxStore.getState());
            delete clone.router;
            electronStore.set('reduxSave', clone);
            this.readyToClose();
        });
    }

    // eslint-disable-next-line class-methods-use-this
    private readyToClose() {
        ipcRenderer.send('ready-to-close');
    }

    static resizeWindow(width: number, height: number) {
        ipcRenderer.send('resize', width, height);
    }
}
