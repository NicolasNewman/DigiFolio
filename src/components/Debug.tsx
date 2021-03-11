/* eslint-disable react/destructuring-assignment */
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
import DebugAPIManager from './debug/DebugAPIManager';
import DebugRecharts from './debug/DebugRecharts';
import DataStore from '../classes/DataStore';
import routes from '../constants/routes';

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
}

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
        return (
            <div>
                <DebugRecharts dataStore={this.props.dataStore} />
                <Button
                    type="primary"
                    onClick={(e) => this.toPage(routes.HOME, e)}
                >
                    Home
                </Button>
            </div>
        );
    }
}
