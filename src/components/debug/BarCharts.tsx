/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from 'react';
import { Component } from 'react';
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
import DataStore from '../../classes/DataStore';

interface IProps {
    dataStore: DataStore;
}

interface IState {
    data: any;
    newName: string;
    newValue: number;
}

export default class BarCharts extends Component<IProps, IState> {
    props!: IProps;
    barChartsInputName: React.RefObject<Input>;
    barChartsInputValue: React.RefObject<Input>;

    constructor(props, history) {
        super(props);
        this.barChartsInputName = React.createRef();
        this.barChartsInputValue = React.createRef();
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
                <BarChart width={730} height={250} data={this.state.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
                <Input placeholder="Name" ref={this.barChartsInputName} />
                <Input placeholder="Value" ref={this.barChartsInputValue} />
                <Button
                    type="primary"
                    onClick={(e) => {
                        if (
                            this.barChartsInputName.current?.state.value
                                .length === 0 ||
                            isNaN(
                                parseInt(
                                    this.barChartsInputValue.current?.state
                                        .value
                                )
                            )
                        ) {
                            alert('Invalid Input');
                        } else {
                            let copy = JSON.parse(
                                JSON.stringify(this.state.data)
                            );
                            copy.push({
                                name: this.barChartsInputName.current?.state
                                    .value,
                                value: parseInt(
                                    this.barChartsInputValue.current?.state
                                        .value
                                ),
                            });
                            this.barChartsInputName.current?.setState({
                                value: '',
                            });
                            this.barChartsInputValue.current?.setState({
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
                        let copy = JSON.parse(JSON.stringify(this.state.data));
                        copy.pop();
                        this.setState({ data: copy });
                    }}
                >
                    Pop
                </Button>
                <Button
                    type="primary"
                    onClick={(e) => {
                        let copy = [];
                        this.setState({ data: copy });
                        this.barChartsInputName.current?.setState({
                            value: '',
                        });
                        this.barChartsInputValue.current?.setState({
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
