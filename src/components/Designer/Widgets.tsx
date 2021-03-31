/* eslint-disable react/prop-types */
import * as React from 'react';
import { Component, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import { Disposable } from 'custom-electron-titlebar/lib/common/lifecycle';
// import DataStore from '../classes/DataStore';
import { Tabs, Button, Layout } from 'antd';
import 'antd/dist/antd.css';
import Demo from '../widgets/TestWidget';
import Demo2 from '../widgets/TestWidget2';
import DemoChart from '../widgets/Tests/NivoTest';
import GithubUserOverview from '../widgets/Github/GithubUserOverview';
import SteamProfileInfo from '../widgets/Steam/W_SteamProfileInfo';
import SteamFriendsInfo from '../widgets/Steam/W_SteamFriendsInfo';
import { GithubData } from '../../api/GithubAPI';
import { SteamAPIData } from '../../api/SteamAPI';

const { TabPane } = Tabs;
const { Header, Content } = Layout;

function callback(key) {
    console.log(key);
}

interface IProps {
    github: GithubData;
    steam: SteamAPIData;
    active: { [key: string]: boolean };
}

const WidgetEntry: React.FC<{
    component: React.ReactNode;
    active: boolean;
}> = (props) => {
    if (!props.active) {
        return <div style={{ marginBottom: '1rem' }}>{props.component}</div>;
    }
    return <span />;
};

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
                {/* <Header>
                    <p>Add New Widget!</p>
                </Header> */}
                <Content>
                    <div className="widgetTabs">
                        <Tabs defaultActiveKey="1" onChange={callback}>
                            {this.props.github ? (
                                <TabPane className="" tab="Github" key="1">
                                    {/* <Widget />
                                <Widget />
                                <Widget /> */}
                                    <Demo
                                        id="bob"
                                        component={Demo}
                                        onWidgetList
                                        data={[]}
                                    />
                                    <Demo2
                                        id="bob2"
                                        component={Demo2}
                                        onWidgetList
                                        data={[]}
                                    />
                                    <WidgetEntry
                                        component={
                                            <GithubUserOverview
                                                id="UserOverview"
                                                component={GithubUserOverview}
                                                onWidgetList
                                                data={this.props.github.info}
                                            />
                                        }
                                        active={this.props.active.UserOverview}
                                    />
                                </TabPane>
                            ) : (
                                <span />
                            )}
                            {this.props.steam ? (
                                <TabPane className="" tab="Steam" key="2">
                                    <WidgetEntry
                                        component={
                                            <DemoChart
                                                id="steam_achievements"
                                                component={DemoChart}
                                                onWidgetList
                                                data={this.props.steam.library}
                                            />
                                        }
                                        active={
                                            this.props.active.steam_achievements
                                        }
                                    />
                                    <WidgetEntry
                                        component={
                                            <SteamProfileInfo
                                                id="steam_profile_info"
                                                component={SteamProfileInfo}
                                                onWidgetList
                                                data={this.props.steam.user}
                                            />
                                        }
                                        active={
                                            this.props.active.steam_profile_info
                                        }
                                    />
                                    <WidgetEntry
                                        component={
                                            <SteamFriendsInfo
                                                id="steam_friends_info"
                                                component={SteamFriendsInfo}
                                                onWidgetList
                                                data={this.props.steam.friends}
                                            />
                                        }
                                        active={
                                            this.props.active.steam_friends_info
                                        }
                                    />
                                </TabPane>
                            ) : (
                                <span />
                            )}
                            <TabPane
                                className="settings__tab--general"
                                tab="Reddit"
                                key="3"
                            >
                                {/* <Widget />
                                <Widget />
                                <Widget /> */}
                            </TabPane>
                        </Tabs>
                    </div>
                </Content>
            </div>
        );
    }
}
