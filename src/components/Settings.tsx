import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Tabs, Input, Menu, Dropdown, Button } from 'antd';
import 'antd/dist/antd.css';

import { DownOutlined, LeftCircleOutlined } from '@ant-design/icons';
import DataStore, { APIInfo, SchemaFields } from '../classes/DataStore';
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

const InputLabel = (props: {
    label: string;
    defaultVal: string;
    inputRef: React.RefObject<Input>;
}) => (
    <div>
        <span className="settings-label">{props.label}: </span>
        <Input
            className="settings__input"
            ref={props.inputRef}
            defaultValue={props.defaultVal}
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
    // githubAPIKey: React.RefObject<Input>;
    githubAPIUser: React.RefObject<Input>;

    // Steam API Input Refs

    steamAPIKey: React.RefObject<Input>;

    steamID64: React.RefObject<Input>;

    // Reddit API Input Refs

    redditClientId: React.RefObject<Input>;

    redditClientSecret: React.RefObject<Input>;

    redditToken: React.RefObject<Input>;

    constructor(props, history) {
        super(props);
        this.catsAPIKey = React.createRef();
        this.catsAPIUser = React.createRef();
        this.githubAPIUser = React.createRef();
        this.steamAPIKey = React.createRef();
        this.steamID64 = React.createRef();
        this.redditClientId = React.createRef();
        this.redditClientSecret = React.createRef();
        this.redditToken = React.createRef();
    }

    /**
     * Saves or updates the keys specified by the API tab to the Electron data store
     */
    saveKeys = (api: SchemaFields, options: APIInfo, forced: boolean) => {
        // if (options.key === '') {
        //     this.props.apiManager.updateKey(
        //         api,
        //         { key: '', username: '', other: '' },
        //         forced
        //     );
        // } else {
        //     this.props.apiManager.updateKey(api, options, forced);
        // }
        this.props.apiManager.updateKey(api, options, forced);
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
                                            inputRef={this.catsAPIKey}
                                            defaultVal={
                                                dataStore.getAPIInfo(
                                                    SchemaFields.catsAPI
                                                )?.key || ''
                                            }
                                        />
                                        <InputLabel
                                            label="Username"
                                            inputRef={this.catsAPIUser}
                                            defaultVal={
                                                dataStore.getAPIInfo(
                                                    SchemaFields.catsAPI
                                                )?.username || ''
                                            }
                                        />
                                        <div className="button-container">
                                            <Button
                                                onClick={() =>
                                                    this.saveKeys(
                                                        SchemaFields.catsAPI,
                                                        {
                                                            key: this.catsAPIKey
                                                                .current?.state
                                                                .value,
                                                            username: this
                                                                .catsAPIUser
                                                                .current?.state
                                                                .value,
                                                            other: '',
                                                        },
                                                        false
                                                    )
                                                }
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    this.saveKeys(
                                                        SchemaFields.catsAPI,
                                                        {
                                                            key: this.catsAPIKey
                                                                .current?.state
                                                                .value,
                                                            username: this
                                                                .catsAPIUser
                                                                .current?.state
                                                                .value,
                                                            other: '',
                                                        },
                                                        true
                                                    )
                                                }
                                            >
                                                Refresh Data
                                            </Button>
                                        </div>
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
                                label="Username"
                                inputRef={this.githubAPIUser}
                                defaultVal={
                                    dataStore.getAPIInfo(SchemaFields.githubAPI)
                                        ?.key || ''
                                }
                            />
                            <div className="button-container">
                                <Button
                                    onClick={() =>
                                        this.saveKeys(
                                            SchemaFields.githubAPI,
                                            {
                                                key: this.githubAPIUser.current
                                                    ?.state.value,
                                                username: '',
                                                other: '',
                                            },
                                            false
                                        )
                                    }
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={() =>
                                        this.saveKeys(
                                            SchemaFields.githubAPI,
                                            {
                                                key: this.githubAPIUser.current
                                                    ?.state.value,
                                                username: '',
                                                other: '',
                                            },
                                            true
                                        )
                                    }
                                >
                                    Refresh Data
                                </Button>
                            </div>
                        </TabPane>
                        <TabPane
                            className="settings__tab--api"
                            tab="Steam"
                            key="2"
                        >
                            <InputLabel
                                label="Web API Key"
                                inputRef={this.steamAPIKey}
                                defaultVal={
                                    dataStore.getAPIInfo(SchemaFields.steamAPI)
                                        ?.key || ''
                                }
                            />
                            <InputLabel
                                label="SteamID64"
                                inputRef={this.steamID64}
                                defaultVal={
                                    dataStore.getAPIInfo(SchemaFields.steamAPI)
                                        ?.username || ''
                                }
                            />
                            <div className="button-container">
                                <Button
                                    onClick={() =>
                                        this.saveKeys(
                                            SchemaFields.steamAPI,
                                            {
                                                key: this.steamAPIKey.current
                                                    ?.state.value,
                                                username: this.steamID64.current
                                                    ?.state.value,
                                                other: '',
                                            },
                                            false
                                        )
                                    }
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={() =>
                                        this.saveKeys(
                                            SchemaFields.steamAPI,
                                            {
                                                key: this.steamAPIKey.current
                                                    ?.state.value,
                                                username: this.steamID64.current
                                                    ?.state.value,
                                                other: '',
                                            },
                                            true
                                        )
                                    }
                                >
                                    Refresh Data
                                </Button>
                            </div>
                        </TabPane>
                        <TabPane
                            className="settings__tab--api"
                            tab="Reddit"
                            key="3"
                        >
                            <InputLabel
                                label="Client ID"
                                inputRef={this.redditClientId}
                                defaultVal={
                                    dataStore.getAPIInfo(SchemaFields.redditAPI)
                                        ?.username || ''
                                }
                            />
                            <InputLabel
                                label="Client Secret"
                                inputRef={this.redditClientSecret}
                                defaultVal={
                                    dataStore.getAPIInfo(SchemaFields.redditAPI)
                                        ?.key || ''
                                }
                            />
                            <InputLabel
                                label="Token"
                                inputRef={this.redditToken}
                                defaultVal={
                                    dataStore.getAPIInfo(SchemaFields.redditAPI)
                                        ?.other || ''
                                }
                            />
                            <div className="button-container">
                                <Button
                                    onClick={() =>
                                        this.saveKeys(
                                            SchemaFields.redditAPI,
                                            {
                                                username: this.redditClientId
                                                    .current?.state.value,
                                                key: this.redditClientSecret
                                                    .current?.state.value,
                                                other: this.redditToken.current
                                                    ?.state.value,
                                            },
                                            false
                                        )
                                    }
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={() =>
                                        this.saveKeys(
                                            SchemaFields.redditAPI,
                                            {
                                                username: this.redditClientId
                                                    .current?.state.value,
                                                key: this.redditClientSecret
                                                    .current?.state.value,
                                                other: this.redditToken.current
                                                    ?.state.value,
                                            },
                                            true
                                        )
                                    }
                                >
                                    Refresh Data
                                </Button>
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
