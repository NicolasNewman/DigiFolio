/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from 'react';
import { app, remote, BrowserWindow } from 'electron';
import { Component } from 'react';
import { writeFile } from 'fs';
import { join } from 'path';
import { RouteComponentProps } from 'react-router';
// import { Redirect } from 'react-router';
import { Button, Input } from 'antd';

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

// const data = [
//     {
//         name: 'Page A',
//         uv: 4000,
//         pv: 2400,
//     },
//     {
//         name: 'Page B',
//         uv: 3000,
//         pv: 1398,
//     },
//     {
//         name: 'Page C',
//         uv: 2000,
//         pv: 9800,
//     },
//     {
//         name: 'Page D',
//         uv: 2780,
//         pv: 3908,
//     },
//     {
//         name: 'Page E',
//         uv: 1890,
//         pv: 4800,
//     },
//     {
//         name: 'Page F',
//         uv: 2390,
//         pv: 3800,
//     },
//     {
//         name: 'Page G',
//         uv: 3490,
//         pv: 4300,
//     },
// ];

interface IProps {
    dataStore: DataStore;
}

interface IState {
    data: any;
    newName: string;
    newUV: number;
    newPV: number;
}

export default class DebugRecharts extends Component<IProps, IState> {
    props!: IProps;

    constructor(props, history) {
        super(props);
        this.state = {
            newName: 'group',
            newUV: 0,
            newPV: 0,
            data: [
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
            ],
        };
    }

    render() {
        return (
            <div>
                <BarChart width={730} height={250} data={this.state.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pv" fill="#8884d8" />
                    <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
                <Input
                    placeholder="Name"
                    onChange={(e) => this.setState({ newName: e.target.value })}
                />
                <Input
                    placeholder="Name"
                    onChange={(e) =>
                        this.setState({ newUV: parseInt(e.target.value) })
                    }
                />
                <Input
                    placeholder="Name"
                    onChange={(e) =>
                        this.setState({ newPV: parseInt(e.target.value) })
                    }
                />
                <Button
                    type="primary"
                    onClick={(e) => {
                        let copy = JSON.parse(JSON.stringify(this.state.data));
                        copy.push({
                            name: this.state.newName,
                            uv: this.state.newUV,
                            pv: this.state.newPV,
                        });
                        this.setState({ data: copy });
                    }}
                >
                    Push
                </Button>
                <Button
                    type="primary"
                    onClick={(e) => {
                        let copy = JSON.parse(JSON.stringify(this.state.data));
                        copy.pop();
                        this.setState({ data: copy });
                    }}
                >
                    Pop
                </Button>
            </div>
        );
    }
}
