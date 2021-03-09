/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from 'react';
import { app, remote, BrowserWindow } from 'electron';
import { Component } from 'react';
import { writeFile } from 'fs';
import { join } from 'path';
import { RouteComponentProps } from 'react-router';
// import { Redirect } from 'react-router';
import { Button } from 'antd';
import DataStore from '../classes/DataStore';
import routes from '../constants/routes';

import mainIcon from '../../assets/digifolio_icon.png';

interface IProps extends RouteComponentProps<any> {}

export default class Debug extends Component<IProps> {
    props!: IProps;

    constructor(props, history) {
        super(props);
    }

    toPage(route: string, e) {
        const { history } = this.props;
        history.push(route);
    }

    render() {
        const onClickHandler = () => {
            // Resolves to a Promise<Object>
            remote.dialog
                .showSaveDialog({
                    title: 'Select the File Path to save',
                    defaultPath: join(__dirname, '../../assets/sample.txt'),
                    // defaultPath: path.join(__dirname, '../assets/'),
                    buttonLabel: 'Save',
                    // Restricting the user to only Text Files.
                    filters: [
                        {
                            name: 'Text Files',
                            extensions: ['txt', 'docx'],
                        },
                    ],
                    properties: [],
                })
                .then((file) => {
                    // Stating whether dialog operation was cancelled or not.
                    console.log(file.canceled);
                    if (!file.canceled && file.filePath) {
                        console.log(file.filePath.toString());

                        // Creating and Writing to the sample.txt file
                        writeFile(
                            file.filePath.toString(),
                            'This is a Sample File',
                            function (err) {
                                if (err) throw err;
                                console.log('Saved!');
                            }
                        );
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        // if (this.state.toHome) {
        //     return <Redirect to="/home" />;
        // }
        return (
            <div>
                <p>Debug Page</p>
                <Button onClick={onClickHandler}>Save file</Button>
            </div>
        );
    }
}
