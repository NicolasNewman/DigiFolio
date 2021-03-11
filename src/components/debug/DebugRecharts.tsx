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

import {
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
} from 'recharts';
import mainIcon from '../../assets/digifolio_icon.png';
//import DebugRecharts from../../recharts/debugRechartrt';
import DataStore from '../../classes/DataStore';

const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
    },
];

interface IProps {
    dataStore: DataStore;
}

export default class DebugRecharts extends Component<IProps> {
    props!: IProps;

    constructor(props, history) {
        super(props);
    }

    render() {
        return (
            <div>
                <BarChart width={730} height={250} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pv" fill="#8884d8" />
                    <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
            </div>
        );
    }
}
