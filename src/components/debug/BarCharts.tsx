/* eslint-disable react/no-access-state-in-setstate */
import * as React from 'react';
import { Component } from 'react';
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
                            Number.isNaN(
                                parseInt(
                                    this.barChartsInputValue.current?.state
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
                                name: this.barChartsInputName.current?.state
                                    .value,
                                value: parseInt(
                                    this.barChartsInputValue.current?.state
                                        .value,
                                    10
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
