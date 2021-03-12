/* eslint-disable prefer-const */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable radix */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-empty-interface */

import * as React from 'react';
import { Component } from 'react';
import { Button, Input } from 'antd';

import {
    ScatterChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ZAxis,
    Tooltip,
    Legend,
    Scatter,
} from 'recharts';
import DataStore from '../../classes/DataStore';

interface IProps {
    dataStore: DataStore;
}

interface IState {
    data: any;
}

export default class Scatterplots extends Component<IProps, IState> {
    props!: IProps;

    scatterplotsInputX: React.RefObject<Input>;

    scatterplotsInputY: React.RefObject<Input>;

    constructor(props, history) {
        super(props);
        this.scatterplotsInputX = React.createRef();
        this.scatterplotsInputY = React.createRef();
        this.state = {
            data: [],
            // data: [
            //     {
            //         x: 100,
            //         y: 200,
            //     },
            //     {
            //         x: 120,
            //         y: 100,
            //     },
            //     {
            //         x: 170,
            //         y: 300,
            //     },
            //     {
            //         x: 140,
            //         y: 250,
            //     },
            //     {
            //         x: 150,
            //         y: 400,
            //     },
            //     {
            //         x: 110,
            //         y: 280,
            //     },
            // ],
        };
    }

    render() {
        return (
            <div>
                <ScatterChart
                    width={730}
                    height={250}
                    margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        dataKey="x"
                        name="X axis"
                        unit=" x units"
                    />
                    <YAxis
                        type="number"
                        dataKey="y"
                        name="Y axis"
                        unit=" y units"
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter
                        name="Data"
                        data={this.state.data}
                        fill="#82ca9d"
                    />
                </ScatterChart>
                <Input placeholder="x value" ref={this.scatterplotsInputX} />
                <Input placeholder="y value" ref={this.scatterplotsInputY} />
                <Button
                    type="primary"
                    onClick={(e) => {
                        if (
                            Number.isNaN(
                                parseInt(
                                    this.scatterplotsInputX.current?.state.value
                                )
                            ) ||
                            Number.isNaN(
                                parseInt(
                                    this.scatterplotsInputY.current?.state.value
                                )
                            )
                        ) {
                            alert('Invalid Input');
                        } else {
                            let copy = JSON.parse(
                                JSON.stringify(this.state.data)
                            );
                            copy.push({
                                x: parseInt(
                                    this.scatterplotsInputX.current?.state.value
                                ),
                                y: parseInt(
                                    this.scatterplotsInputY.current?.state.value
                                ),
                            });
                            this.scatterplotsInputX.current?.setState({
                                value: '',
                            });
                            this.scatterplotsInputY.current?.setState({
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
                        this.scatterplotsInputX.current?.setState({
                            value: '',
                        });
                        this.scatterplotsInputY.current?.setState({
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
