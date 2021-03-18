/* eslint-disable react/no-access-state-in-setstate */
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
}

export default class LineCharts extends Component<IProps, IState> {
    props!: IProps;

    lineChartsInputName: React.RefObject<Input>;

    lineChartsInputValue: React.RefObject<Input>;

    constructor(props, history) {
        super(props);
        this.lineChartsInputName = React.createRef();
        this.lineChartsInputValue = React.createRef();
        this.state = {
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
                <Input placeholder="Name" ref={this.lineChartsInputName} />
                <Input placeholder="Value" ref={this.lineChartsInputValue} />
                <Button
                    type="primary"
                    onClick={(e) => {
                        if (
                            this.lineChartsInputName.current?.state.value
                                .length === 0 ||
                            Number.isNaN(
                                parseInt(
                                    this.lineChartsInputValue.current?.state
                                        .value,
                                    10
                                )
                            )
                        ) {
                            alert('Invalid Input');
                        } else {
                            const copy = JSON.parse(
                                JSON.stringify(this.state.data)
                            );
                            copy.push({
                                name: this.lineChartsInputName.current?.state
                                    .value,
                                value: parseInt(
                                    this.lineChartsInputValue.current?.state
                                        .value,
                                    10
                                ),
                            });
                            this.lineChartsInputName.current?.setState({
                                value: '',
                            });
                            this.lineChartsInputValue.current?.setState({
                                value: '',
                            });
                            this.setState({ data: copy });
                        }
                    }}
                >
                    Push
                </Button>
                <Button
                    type="primary"
                    onClick={(e) => {
                        const copy = JSON.parse(
                            JSON.stringify(this.state.data)
                        );
                        copy.pop();
                        this.setState({ data: copy });
                    }}
                >
                    Pop
                </Button>
                <Button
                    type="primary"
                    onClick={(e) => {
                        const copy = [];
                        this.setState({ data: copy });
                        this.lineChartsInputName.current?.setState({
                            value: '',
                        });
                        this.lineChartsInputValue.current?.setState({
                            value: '',
                        });
                    }}
                >
                    Clear
                </Button>
            </div>
        );
    }
}
