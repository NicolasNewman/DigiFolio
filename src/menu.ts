import {
    app,
    dialog,
    Menu,
    shell,
    BrowserWindow,
    MenuItemConstructorOptions,
    ipcMain,
    ipcRenderer,
} from 'electron';
import { join, basename } from 'path';
import { electron } from 'process';

import routes from './Routes';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
    selector?: string;
    submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
    // mainWindow: BrowserWindow;

    mainWindow = new BrowserWindow({
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
        },
    });

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    buildMenu(): Menu {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG_PROD === 'true'
        ) {
            this.setupDevelopmentEnvironment();
        }

        const template =
            process.platform === 'darwin'
                ? this.buildDarwinTemplate()
                : this.buildDefaultTemplate();

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        return menu;
    }

    setupDevelopmentEnvironment(): void {
        this.mainWindow.webContents.on('context-menu', (_, props) => {
            const { x, y } = props;

            Menu.buildFromTemplate([
                {
                    label: 'Inspect element',
                    click: () => {
                        this.mainWindow.webContents.inspectElement(x, y);
                    },
                },
            ]).popup({ window: this.mainWindow });
        });
    }

    buildDarwinTemplate(): MenuItemConstructorOptions[] {
        const subMenuAbout: DarwinMenuItemConstructorOptions = {
            label: 'Electron',
            submenu: [
                {
                    label: 'About ElectronReact',
                    selector: 'orderFrontStandardAboutPanel:',
                },
                { type: 'separator' },
                { label: 'Services', submenu: [] },
                { type: 'separator' },
                {
                    label: 'Hide ElectronReact',
                    accelerator: 'Command+H',
                    selector: 'hide:',
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    selector: 'hideOtherApplications:',
                },
                { label: 'Show All', selector: 'unhideAllApplications:' },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: () => {
                        app.quit();
                    },
                },
            ],
        };
        const subMenuEdit: DarwinMenuItemConstructorOptions = {
            label: 'Edit',
            submenu: [
                { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
                {
                    label: 'Redo',
                    accelerator: 'Shift+Command+Z',
                    selector: 'redo:',
                },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
                { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
                {
                    label: 'Paste',
                    accelerator: 'Command+V',
                    selector: 'paste:',
                },
                {
                    label: 'Select All',
                    accelerator: 'Command+A',
                    selector: 'selectAll:',
                },
            ],
        };
        const subMenuViewDev: MenuItemConstructorOptions = {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Command+R',
                    click: () => {
                        this.mainWindow.webContents.reload();
                    },
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(
                            !this.mainWindow.isFullScreen()
                        );
                    },
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'Alt+Command+I',
                    click: () => {
                        this.mainWindow.webContents.toggleDevTools();
                    },
                },
            ],
        };
        const subMenuViewProd: MenuItemConstructorOptions = {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Full Screen',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(
                            !this.mainWindow.isFullScreen()
                        );
                    },
                },
            ],
        };
        const subMenuWindow: DarwinMenuItemConstructorOptions = {
            label: 'Window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'Command+M',
                    selector: 'performMiniaturize:',
                },
                {
                    label: 'Close',
                    accelerator: 'Command+W',
                    selector: 'performClose:',
                },
                { type: 'separator' },
                { label: 'Bring All to Front', selector: 'arrangeInFront:' },
            ],
        };
        const subMenuHelp: MenuItemConstructorOptions = {
            label: 'Help',
            submenu: [
                {
                    label: 'Learn More',
                    click() {
                        shell.openExternal('https://electronjs.org');
                    },
                },
                {
                    label: 'Documentation',
                    click() {
                        shell.openExternal(
                            'https://github.com/electron/electron/tree/master/docs#readme'
                        );
                    },
                },
                {
                    label: 'Community Discussions',
                    click() {
                        shell.openExternal(
                            'https://www.electronjs.org/community'
                        );
                    },
                },
                {
                    label: 'Search Issues',
                    click() {
                        shell.openExternal(
                            'https://github.com/electron/electron/issues'
                        );
                    },
                },
            ],
        };

        const subMenuView =
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG_PROD === 'true'
                ? subMenuViewDev
                : subMenuViewProd;

        return [
            subMenuAbout,
            subMenuEdit,
            subMenuView,
            subMenuWindow,
            subMenuHelp,
        ];
    }

    buildDefaultTemplate() {
        const saveClickHandler = () => {
            // dialog
            //     .showSaveDialog({
            //         title: 'Select the File Path to save',
            //         defaultPath: join(__dirname, '../assets/sample.txt'),
            //         // defaultPath: path.join(__dirname, '../assets/'),
            //         buttonLabel: 'Save',
            //         // Restricting the user to only Text Files.
            //         filters: [
            //             {
            //                 name: '.difo Files',
            //                 extensions: ['txt', 'docx'],
            //             },
            //         ],
            //         properties: [],
            //     })
            //     .then((file) => {
            //         if (!file.canceled && file.filePath) {
            //             this.mainWindow.webContents.send(
            //                 'save-as',
            //                 file.filePath,
            //                 basename(file.filePath)
            //             );
            //         }
            //     })
            //     .catch((err) => {
            //         ipcRenderer.send('error', err);
            //     });
            this.mainWindow.webContents.send('save-as', 'temp', 'temp');
        };

        const createNewPortfolio = () => {
            // Do nothing
            console.log('Create New Portfolio');
            /*
                history.push(routes.DESIGNER);
            */
        };

        const exportClickHandler = () => {
            // dialog
            //     .showSaveDialog({
            //         title: 'Select the File Path to export',
            //         defaultPath: join(__dirname, '../assets/sample.txt'),
            //         // defaultPath: path.join(__dirname, '../assets/'),
            //         buttonLabel: 'Export',
            //         // Restricting the user to only Text Files.
            //         filters: [
            //             {
            //                 name: '.pdf Files',
            //                 extensions: ['pdf'],
            //             },
            //         ],
            //         properties: [],
            //     })
            //     .then((file) => {
            //         if (!file.canceled && file.filePath) {
            //             this.mainWindow.webContents.send(
            //                 'save-as',
            //                 file.filePath,
            //                 basename(file.filePath)
            //             );
            //         }
            //     })
            //     .catch((err) => {
            //         ipcRenderer.send('error', err);
            //     });
            this.mainWindow.webContents.send(
                'save-as',
                'blah',
                basename('blah')
            );
        };

        const templateDefault = [
            {
                label: '&File',
                submenu: [
                    {
                        label: 'New Portfolio',
                        accelerator: 'Ctrl+N',
                        click: createNewPortfolio,
                    },
                    {
                        label: 'Open Portfolio',
                        accelerator: 'Ctrl+O',
                    },
                    // {
                    //     label: 'Save Portfolio',
                    //     accelerator: 'Ctrl+S',
                    //     click: saveClickHandler,
                    // },
                    {
                        label: 'Save Portfolio As',
                        accelerator: 'Ctrl+Shift+S',
                        click: saveClickHandler,
                    },
                    // {
                    //     label: 'Export Portfolio',
                    //     accelerator: 'Ctrl+E',
                    //     click: exportClickHandler,
                    // },
                    {
                        label: 'Export Portfolio As',
                        accelerator: 'Ctrl+Shift+E',
                        click: exportClickHandler,
                    },
                    {
                        label: 'Print',
                        accelerator: 'Ctrl+P',
                    },
                ],
            },
            {
                label: 'Edit',
                submenu:
                    process.env.NODE_ENV === 'development' ||
                    process.env.DEBUG_PROD === 'true'
                        ? [
                              {
                                  label: 'Add Theme',
                                  accelerator: 'F1',
                              },
                              {
                                  label: 'Edit Theme',
                                  accelerator: 'F2',
                              },
                              {
                                  label: 'Change Theme',
                                  accelerator: 'F3',
                              },
                              {
                                  label: 'Edit Widgets',
                                  accelerator: 'F4',
                              },
                          ]
                        : [
                              {
                                  label: 'Toggle &Full Screen',
                                  accelerator: 'F11',
                                  click: () => {
                                      this.mainWindow.setFullScreen(
                                          !this.mainWindow.isFullScreen()
                                      );
                                  },
                              },
                          ],
            },
            {
                label: 'Insert',
                submenu: [
                    {
                        label: 'Service',
                        accelerator: 'Alt+Ctrl+S',
                    },
                    {
                        label: 'Widgets',
                        accelerator: 'Alt+Ctrl+W',
                    },
                ],
            },
            {
                label: 'Tools',
                submenu: [
                    {
                        label: 'Learn More',
                        click() {
                            shell.openExternal('https://electronjs.org');
                        },
                    },
                    {
                        label: 'Documentation',
                        click() {
                            shell.openExternal(
                                'https://github.com/electron/electron/tree/master/docs#readme'
                            );
                        },
                    },
                    {
                        label: 'Community Discussions',
                        click() {
                            shell.openExternal(
                                'https://www.electronjs.org/community'
                            );
                        },
                    },
                    {
                        label: 'Search Issues',
                        click() {
                            shell.openExternal(
                                'https://github.com/electron/electron/issues'
                            );
                        },
                    },
                ],
            },
        ];

        return templateDefault;
    }
}
