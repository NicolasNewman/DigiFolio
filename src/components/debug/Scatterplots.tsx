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
    newX: number;
    newY: number;
}

export default class LineCharts extends Component<IProps, IState> {
    props!: IProps;

    constructor(props, history) {
        super(props);
        this.state = {
            newX: 0,
            newY: 0,
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
                <Input
                    placeholder="x value"
                    onChange={(e) =>
                        this.setState({ newX: parseInt(e.target.value) })
                    }
                />
                <Input
                    placeholder="y value"
                    onChange={(e) =>
                        this.setState({ newY: parseInt(e.target.value) })
                    }
                />
                <Button
                    type="primary"
                    onClick={(e) => {
                        let copy = JSON.parse(JSON.stringify(this.state.data));
                        copy.push({
                            x: this.state.newX,
                            y: this.state.newY,
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
