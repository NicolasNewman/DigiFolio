import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Tabs, Input, Menu, Dropdown, Button } from 'antd';
import 'antd/dist/antd.css';

import { DownOutlined, LeftCircleOutlined } from '@ant-design/icons';
import DataStore from '../classes/DataStore';
import routes from '../constants/routes';

interface IProps extends RouteComponentProps<any> {
    // IProps extends RouteComponentProps because this is the root component for our window
    dataStore: DataStore;
}

const menu = (
    <Menu>
        <Menu.Item>Light Mode</Menu.Item>
        <Menu.Item>Dark Mode</Menu.Item>
    </Menu>
);

const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
}

const TabsPane = () => (
    <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane className="inputPane" tab="API Keys" key="1">
            Insert/Remove API Key
            <Input className="input" placeholder="Insert API Key" />
            <Input className="input" placeholder="Remove API Key" />
        </TabPane>

        <TabPane className="generalPane" tab="General" key="2">
            General Settings
            <div className="colorTheme">
                <Dropdown overlay={menu}>
                    <div
                        className="ant-dropdown-link themeButton"
                        //onClick={(e) => e.preventDefault()}
                    >
                        Color Theme <DownOutlined />
                    </div>
                </Dropdown>
            </div>
        </TabPane>
    </Tabs>
);

export default class Settings extends Component<IProps> {
    props!: IProps;

    constructor(props, history) {
        super(props);
    }

    // only include this function if you need to be able to switch pages
    toPage(route: string, e) {
        const { history } = this.props;
        history.push(route);
    }

    render() {
        return (
            <div className="settingsPanel">
                <h2>Settings</h2>
                <div className="tabPane">
                    <TabsPane />
                </div>
                <div className="returnButton">
                    <Button
                        type="primary"
                        shape="round"
                        icon={<LeftCircleOutlined />}
                        size="middle"
                    >
                        Return
                    </Button>
                </div>
            </div>
        );
    }
}
