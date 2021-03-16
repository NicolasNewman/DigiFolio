import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
// import { Redirect } from 'react-router';
import { Button, Tabs } from 'antd';
import BarCharts from './debug/BarCharts';
import LineCharts from './debug/LineCharts';
import PieCharts from './debug/PieCharts';
import Scatterplots from './debug/Scatterplots';
import DataStore from '../classes/DataStore';
import routes from '../constants/routes';

const { TabPane } = Tabs;

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
}

export default class Debug extends Component<IProps> {
    props!: IProps;

    constructor(props, history) {
        super(props);
    }

    toPage(route: string, e) {
        const { history } = this.props;
        history.push(route);
    }

    render() {
        return (
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Bar Chart" key="1">
                        <BarCharts dataStore={this.props.dataStore} />
                    </TabPane>
                    <TabPane tab="Line Chart" key="2">
                        <LineCharts dataStore={this.props.dataStore} />
                    </TabPane>
                    <TabPane tab="Pie Chart" key="3">
                        <PieCharts dataStore={this.props.dataStore} />
                    </TabPane>
                    <TabPane tab="Scatterplot" key="4">
                        <Scatterplots dataStore={this.props.dataStore} />
                    </TabPane>
                </Tabs>
                <Button
                    type="primary"
                    onClick={(e) => this.toPage(routes.HOME, e)}
                >
                    Home
                </Button>
            </div>
        );
    }
}
