/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from 'react';
import { Component } from 'react';
import { Button, Input } from 'antd';

import { PieChart, Pie } from 'recharts';
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
                <PieChart width={730} height={250}>
                    <Pie
                        data={this.state.data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#82ca9d"
                        label={({
                            cx,
                            cy,
                            midAngle,
                            innerRadius,
                            outerRadius,
                            value,
                            index,
                        }) => {
                            const RADIAN = Math.PI / 180;
                            const radius =
                                25 + innerRadius + (outerRadius - innerRadius);
                            const x =
                                cx + radius * Math.cos(-midAngle * RADIAN);
                            const y =
                                cy + radius * Math.sin(-midAngle * RADIAN);

                            return (
                                <text
                                    x={x}
                                    y={y}
                                    fill="#82ca9d"
                                    textAnchor={x > cx ? 'start' : 'end'}
                                    dominantBaseline="central"
                                >
                                    {this.state.data[index].name} ({value})
                                </text>
                            );
                        }}
                    />
                </PieChart>
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
