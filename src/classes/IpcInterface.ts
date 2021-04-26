import { ipcRenderer } from 'electron';
import { Store } from 'redux';
import html2canvas from 'html2canvas';
import cloneDeep from 'clone-deep';
import jsPDF from 'jspdf';
import DataStore from './DataStore';
import { IInitialState } from '../reducers/portfolio';
import { WidgetComponentType } from '../components/widgets/IWidget';
import { RestoreBoxes } from '../types/Portfolio';

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
                        const pdf = new jsPDF('p', 'in', [8.5, 11]);
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
            const portfolio = reduxStore.getState().portfolio as IInitialState;
            const newPortfolio: { boxes: RestoreBoxes } = { boxes: {} };
            Object.keys(portfolio.boxes).forEach((key) => {
                const temp = portfolio.boxes[key];
                newPortfolio.boxes[key] = {
                    data: temp.data,
                    top: temp.top,
                    left: temp.left,
                    title: temp.title,
                    component: temp.component.displayName || 'unknown',
                    state: temp.state,
                };
            });
            const portfolioState = JSON.stringify(newPortfolio);
            console.log(newPortfolio);
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
