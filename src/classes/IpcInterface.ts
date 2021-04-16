import { ipcRenderer } from 'electron';
import { Store } from 'redux';
import html2canvas from 'html2canvas';
import cloneDeep from 'clone-deep';
import jsPDF from 'jspdf';
import DataStore from './DataStore';

export default class IpcInterface {
    constructor(electronStore: DataStore, reduxStore: Store<any>) {
        ipcRenderer.on('closing', () => {
            const clone = cloneDeep(reduxStore.getState());
            delete clone.router;
            delete clone.portfolio;
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

        ipcRenderer.on('save-ws-as', (e) => {
            const portfolioState = JSON.stringify(
                reduxStore.getState().portfolio
            );
            const b64 = Buffer.from(portfolioState, 'utf-8').toString('base64');
            console.log(b64);

            ipcRenderer.send('save-file', b64);

            // const str = Buffer.from(b64, 'base64').toString();
            // console.log(str);
        });
    }

    private readyToClose() {
        ipcRenderer.send('ready-to-close');
    }

    static resizeWindow(width: number, height: number) {
        ipcRenderer.send('resize', width, height);
    }
}
