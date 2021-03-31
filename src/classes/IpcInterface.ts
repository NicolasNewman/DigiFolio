import { ipcRenderer, remote } from 'electron';
import { Store } from 'redux';
import { join } from 'path';
import html2canvas from 'html2canvas';
import cloneDeep from 'clone-deep';
import jsPDF from 'jspdf';
import DataStore from './DataStore';

export default class IpcInterface {
    constructor(electronStore: DataStore, reduxStore: Store<any>) {
        ipcRenderer.on('closing', () => {
            const clone = cloneDeep(reduxStore.getState());
            delete clone.router;
            electronStore.set('reduxSave', clone);
            this.readyToClose();
        });

        ipcRenderer.on('save-as', (e, path, filename) => {
            const portfolio = document.getElementById('portfolio');
            if (portfolio) {
                html2canvas(portfolio, { useCORS: true })
                    .then((canvas) => {
                        const imgData = canvas.toDataURL('image/png');
                        // eslint-disable-next-line new-cap
                        const pdf = new jsPDF('p', 'in');
                        pdf.addImage(imgData, 'JPEG', 0, 0, 8.5, 11);
                        pdf.save('Portfolio.pdf');
                    })
                    .catch((err) => {
                        //TODO handle error
                    });
            }
            console.log(`Filename: ${filename}, File Path: ${path}`);
        });
    }

    private readyToClose() {
        ipcRenderer.send('ready-to-close');
    }

    static resizeWindow(width: number, height: number) {
        ipcRenderer.send('resize', width, height);
    }
}
