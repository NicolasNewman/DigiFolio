import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Tabs, Input, Menu, Dropdown, Button } from 'antd';
import 'antd/dist/antd.css';

import { DownOutlined, LeftCircleOutlined } from '@ant-design/icons';
import DataStore, { SchemaFields } from '../classes/DataStore';
import routes from '../constants/routes';

const { TabPane } = Tabs;

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
}

const menu = (
    <Menu>
        <Menu.Item>Light Mode</Menu.Item>
        <Menu.Item>Dark Mode</Menu.Item>
    </Menu>
);

function callback(key) {
    console.log(key);
}

// const TabsPane = function (this: Settings) {
//     return (
//         <Tabs defaultActiveKey="1" onChange={callback}>
//             <TabPane className="settings__tab--api" tab="API Keys" key="1">
//                 <div>
//                     <span className="settings__label">CatsAPI: </span>
//                     <Input
//                         className="settings__input"
//                         placeholder="catsapi key"
//                     />
//                 </div>
//                 <Button onClick={this}>Save</Button>
//             </TabPane>

//             <TabPane className="settings__tab--general" tab="General" key="2">
//                 General Settings
//                 <div className="tab-general__colorTheme">
//                     <Dropdown overlay={menu}>
//                         <div
//                             className="ant-dropdown-link tab-general__themeButton"
//                             //onClick={(e) => e.preventDefault()}
//                         >
//                             Color Theme <DownOutlined />
//                         </div>
//                     </Dropdown>
//                 </div>
//             </TabPane>
//         </Tabs>
//     );
// };

export default class Settings extends Component<IProps> {
    props!: IProps;

    /** React reference to the catsapi key input */
    catsAPIInput: React.RefObject<Input>;

    constructor(props, history) {
        super(props);
        this.catsAPIInput = React.createRef();
    }

    toPage(route: string, e) {
        const { history } = this.props;
        history.push(route);
    }

    /**
     * Saves or updates the keys specified by the API tab to the Electron data store
     */
    saveKeys() {
        const { dataStore } = this.props;
        const saveKey = (name, value) => {
            const savedKey = dataStore.get(name);
            if (!savedKey) {
                dataStore.set(name, value);
            } else if (savedKey !== value) {
                dataStore.set(name, value);
            }
        };
        saveKey(
            SchemaFields.catsAPIKey,
            this.catsAPIInput.current?.state.value
        );
    }

    render() {
        return (
            <div className="settings">
                <h2>Settings</h2>
                <div className="settings__tab-container">
                    <Tabs defaultActiveKey="1" onChange={callback}>
                        <TabPane
                            className="settings__tab--api"
                            tab="API Keys"
                            key="1"
                        >
                            <div>
                                <span className="settings__label">
                                    CatsAPI:{' '}
                                </span>
                                <Input
                                    className="settings__input"
                                    placeholder="catsapi key"
                                    ref={this.catsAPIInput}
                                />
                            </div>
                            <Button onClick={this.saveKeys}>Save</Button>
                        </TabPane>
                        <TabPane
                            className="settings__tab--general"
                            tab="General"
                            key="2"
                        >
                            General Settings
                            <div className="tab-general__colorTheme">
                                <Dropdown overlay={menu}>
                                    <div
                                        className="ant-dropdown-link tab-general__themeButton"
                                        //onClick={(e) => e.preventDefault()}
                                    >
                                        Color Theme <DownOutlined />
                                    </div>
                                </Dropdown>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
                <div className="settings__button-container">
                    <Button
                        type="primary"
                        shape="round"
                        icon={<LeftCircleOutlined />}
                        size="middle"
                        onClick={(e) => this.toPage(routes.HOME, e)}
                    >
                        Return
                    </Button>
                </div>
            </div>
        );
    }
}
