import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Disposable } from 'custom-electron-titlebar/lib/common/lifecycle';
// import DataStore from '../classes/DataStore';
import { Tabs, Input, Menu, Dropdown, Button } from 'antd';
import 'antd/dist/antd.css';

const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {}

export default class Widgets extends Component<IProps> {
    props!: IProps;

    constructor(props, history) {
        super(props);
    }

    render() {
        return (
            <div className="widgetPanel">
                <p>Add New Widget!</p>
                <div>
                    <Tabs defaultActiveKey="1" onChange={callback}>
                        <TabPane
                            className="settings__tab--api"
                            tab="'Widget#1'"
                            key="1"
                        >
                            <div className="widgetContainer">
                                Widget Number 1
                            </div>
                        </TabPane>
                        <TabPane
                            className="settings__tab--general"
                            tab="'Widget#2'"
                            key="2"
                        >
                            <div className="widgetContainer">
                                Widget Number 2
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}
