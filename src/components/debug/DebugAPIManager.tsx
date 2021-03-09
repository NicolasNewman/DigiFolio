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

import mainIcon from '../../assets/digifolio_icon.png';
import APIManager from '../../api/APIManager';
import DataStore from '../../classes/DataStore';

interface IProps {
    dataStore: DataStore;
}

export default class DebugAPIManager extends Component<IProps> {
    props!: IProps;

    constructor(props, history) {
        super(props);
    }

    componentDidMount() {
        // eslint-disable-next-line react/destructuring-assignment
        const manager = new APIManager(this.props.dataStore);
        manager.getAPIs().catsAPI?.parse_api();
    }

    render() {
        // if (this.state.toHome) {
        //     return <Redirect to="/home" />;
        // }
        return (
            <div>
                <p>Hello!</p>
            </div>
        );
    }
}
