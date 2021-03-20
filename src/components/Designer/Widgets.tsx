import * as React from 'react';
import { Component, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import { Disposable } from 'custom-electron-titlebar/lib/common/lifecycle';
// import DataStore from '../classes/DataStore';
import { Tabs, Button, Layout } from 'antd';
import 'antd/dist/antd.css';
import Widget from './Widget';

const { TabPane } = Tabs;
const { Header, Content } = Layout;

function callback(key) {
    console.log(key);
}

interface IProps {}

export default class Widgets extends Component<IProps> {
    props!: IProps;

    constructor(props, history) {
        super(props);
    }

    render() {
        return (
            // <div className="widget">
            //     <span>Widget 1</span>
            // </div>
            <div className="widgetPanel">
                <Header>
                    <p>Add New Widget!</p>
                </Header>
                <Content>
                    <div className="widgetTabs">
                        <Tabs defaultActiveKey="1" onChange={callback}>
                            <TabPane
                                className="settings__tab--api"
                                tab="Github"
                                key="1"
                            >
                                <Widget />
                                <Widget />
                                <Widget />
                            </TabPane>
                            <TabPane
                                className="settings__tab--general"
                                tab="Stream"
                                key="2"
                            >
                                <Widget />
                                <Widget />
                                <Widget />
                            </TabPane>
                            <TabPane
                                className="settings__tab--general"
                                tab="Reddit"
                                key="3"
                            >
                                <Widget />
                                <Widget />
                                <Widget />
                            </TabPane>
                        </Tabs>
                    </div>
                </Content>
            </div>
        );
    }
}