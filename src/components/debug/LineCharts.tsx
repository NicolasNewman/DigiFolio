/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from 'react';
import { app, remote, BrowserWindow } from 'electron';
import { Component } from 'react';
import { writeFile } from 'fs';
import { join } from 'path';
import { RouteComponentProps } from 'react-router';
import { Button, Input } from 'antd';

import {
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
} from 'recharts';
import mainIcon from '../../assets/digifolio_icon.png';
import DataStore from '../../classes/DataStore';

interface IProps {
    dataStore: DataStore;
}

interface IState {
    data: any;
    newName: string;
    newValue: number;
}

export default class LineCharts extends Component<IProps, IState> {
    props!: IProps;

    constructor(props, history) {
        super(props);
        this.state = {
            newName: 'group',
            newValue: 0,
            data: [],
            // data: [
            //     {
            //         name: 'Page A',
            //         value: 4000,
            //     },
            //     {
            //         name: 'Page B',
            //         value: 3000,
            //     },
            //     {
            //         name: 'Page C',
            //         value: 2000,
            //     },
            //     {
            //         name: 'Page D',
            //         value: 2780,
            //     },
            //     {
            //         name: 'Page E',
            //         value: 1890,
            //     },
            //     {
            //         name: 'Page F',
            //         value: 2390,
            //     },
            //     {
            //         name: 'Page G',
            //         value: 3490,
            //     },
            // ],
        };
    }

    render() {
        return (
            <div>
                <LineChart
                    width={730}
                    height={250}
                    data={this.state.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                </LineChart>
                <Input
                    placeholder="Name"
                    onChange={(e) => this.setState({ newName: e.target.value })}
                />
                <Input
                    placeholder="Value"
                    onChange={(e) =>
                        this.setState({ newValue: parseInt(e.target.value) })
                    }
                />
                <Button
                    type="primary"
                    onClick={(e) => {
                        let copy = JSON.parse(JSON.stringify(this.state.data));
                        copy.push({
                            name: this.state.newName,
                            value: this.state.newValue,
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
