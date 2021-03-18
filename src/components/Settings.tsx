import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Tabs, Input, Menu, Dropdown, Button } from 'antd';
import 'antd/dist/antd.css';

import { DownOutlined, LeftCircleOutlined } from '@ant-design/icons';
import DataStore, { SchemaFields } from '../classes/DataStore';
import routes from '../constants/routes';
import APIManager from '../api/APIManager';

const { TabPane } = Tabs;

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
    apiManager: APIManager;
}

const menu = (
    <Menu>
        <Menu.Item>Light Mode</Menu.Item>
        <Menu.Item>Dark Mode</Menu.Item>
    </Menu>
);

const InputLabel = (props: { label: string; ref: React.RefObject<Input> }) => (
    <div>
        <span className="settings-label">{props.label}: </span>
        <Input
            className="settings__input"
            placeholder="Steam ID"
            ref={props.ref}
        />
    </div>
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

    // Cats API Input Refs

    /** React reference to the catsapi key input */
    catsAPIKey: React.RefObject<Input>;

    catsAPIUser: React.RefObject<Input>;

    // Github API Input Refs
    githubAPIKey: React.RefObject<Input>;

    // Steam API Input Refs

    steamAPIKey: React.RefObject<Input>;

    steamAPIUser: React.RefObject<Input>;

    constructor(props, history) {
        super(props);
        this.catsAPIKey = React.createRef();
        this.catsAPIUser = React.createRef();
        this.githubAPIKey = React.createRef();
        this.steamAPIKey = React.createRef();
        this.steamAPIUser = React.createRef();
    }

    /**
     * Saves or updates the keys specified by the API tab to the Electron data store
     */
    saveKeys = () => {
        const { dataStore, apiManager } = this.props;
        const saveKey = (name, value) => {
            console.log(`Saving key: ${name}`);
            // console.log(`Processing key for ${name}`);
            // const savedKey = dataStore.get(name);
            // console.log(`Stored value is: ${savedKey}`);
            if (value === '') {
                apiManager.updateKey(name);
            } else {
                apiManager.updateKey(name, value);
            }
            // if (!savedKey) {
            //     console.log('Setting value...');
            //     apiManager.updateKey(name, value);
            //     // dataStore.set(name, value);
            // } else if (savedKey !== value) {
            //     console.log('Updating value...');
            //     apiManager.updateKey(name, value);
            //     // dataStore.set(name, value);
            // } else {
            //     console.log('No change');
            //     return;
            // }
            // console.log(`New value is: ${dataStore.get(name)}`);
        };

        // saveKey(
        //     SchemaFields.catsAPIKey,
        //     this.catsAPIInput.current?.state.value
        // );
    };

    toPage(route: string, e) {
        const { history } = this.props;
        history.push(route);
    }

    render() {
        const { dataStore } = this.props;
        return (
            <div className="settings">
                <h2>Settings</h2>
                <div className="settings__tab-container">
                    <Tabs defaultActiveKey="1" onChange={callback}>
                        {(() => {
                            if (process.env.NODE_ENV === 'development') {
                                return (
                                    <TabPane
                                        className="settings__tab--api"
                                        tab="catsapi"
                                        key="cats"
                                    >
                                        <InputLabel
                                            label="API Key"
                                            ref={this.catsAPIKey}
                                        />
                                        <InputLabel
                                            label="Username"
                                            ref={this.catsAPIUser}
                                        />
                                    </TabPane>
                                );
                            }
                            return <span />;
                        })()}
                        <TabPane
                            className="settings__tab--api"
                            tab="Github"
                            key="1"
                        >
                            <InputLabel
                                label="Personal Access Token"
                                ref={this.githubAPIKey}
                            />
                            <div className="button-container">
                                <Button onClick={this.saveKeys}>Save</Button>
                                <Button>Refresh Data</Button>
                            </div>
                        </TabPane>
                        <TabPane
                            className="settings__tab--api"
                            tab="Steam"
                            key="2"
                        >
                            <div>
                                <span className="settings-label">
                                    Steam API Key:{' '}
                                </span>
                                <Input
                                    className="settings__input"
                                    placeholder="Steam ID"
                                    ref={this.steamAPIKey}
                                />
                            </div>
                            <InputLabel
                                label="API Key"
                                ref={this.steamAPIKey}
                            />
                            <InputLabel
                                label="SteamID"
                                ref={this.steamAPIUser}
                            />
                            <div className="button-container">
                                <Button onClick={this.saveKeys}>Save</Button>
                                <Button>Refresh Data</Button>
                            </div>
                        </TabPane>
                        <TabPane
                            className="settings__tab--api"
                            tab="Reddit"
                            key="3"
                        >
                            <div className="button-container">
                                <Button onClick={this.saveKeys}>Save</Button>
                                <Button>Refresh Data</Button>
                            </div>
                        </TabPane>
                        <TabPane
                            className="settings__tab--general"
                            tab="General"
                            key="4"
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
