/* eslint-disable react/jsx-pascal-case */
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
import DemoChart from '../widgets/Steam/W_SteamAchievements';
import GithubUserOverview from '../widgets/Github/GithubUserOverview';

import SteamProfileInfo from '../widgets/Steam/W_SteamProfileInfo';
import W_SteamFriendsInfo from '../widgets/Steam/W_SteamFriendsInfo';
import W_SteamTopPlayedGames from '../widgets/Steam/W_SteamTopPlayedGames';

import RedditProfileInfo from '../widgets/Reddit/W_RedditProfileInfo';
import RedditSubmissionInfo from '../widgets/Reddit/W_RedditSubmissionInfo';
import RedditCommentInfo from '../widgets/Reddit/W_RedditCommentInfo';

import { GithubData } from '../../api/GithubAPI';
import { SteamAPIData } from '../../api/SteamAPI';
import ReposWidget from '../widgets/Github/ReposWidget';
import CommitsWidget from '../widgets/Github/CommitsWidget';
import RepoGraph from '../widgets/Github/RepoGraph';
import { RedditAPIData } from '../../api/RedditAPI';

const { TabPane } = Tabs;
const { Header, Content } = Layout;

function callback(key) {
    console.log(key);
}

interface IProps {
    github: GithubData;
    steam: SteamAPIData;
    reddit: RedditAPIData;
    active: { [key: string]: boolean };
    setThemePanel: (panel: React.ReactNode) => void;
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
                        <Tabs onChange={callback}>
                            {this.props.github ? (
                                <TabPane
                                    className="widget-list__tab"
                                    tab="Github"
                                    key="1"
                                >
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
                                    <WidgetEntry
                                        component={
                                            <ReposWidget
                                                id="ReposWidget"
                                                component={ReposWidget}
                                                onWidgetList
                                                data={this.props.github.repos}
                                            />
                                        }
                                        active={this.props.active.ReposWidget}
                                    />
                                    <WidgetEntry
                                        component={
                                            <CommitsWidget
                                                id="CommitsWidget"
                                                component={CommitsWidget}
                                                onWidgetList
                                                data={this.props.github.repos}
                                            />
                                        }
                                        active={this.props.active.CommitsWidget}
                                    />
                                    <WidgetEntry
                                        component={
                                            <RepoGraph
                                                id="RepoGraph"
                                                component={RepoGraph}
                                                onWidgetList
                                                data={this.props.github.repos}
                                            />
                                        }
                                        active={this.props.active.RepoGraph}
                                    />
                                </TabPane>
                            ) : null}
                            {this.props.steam ? (
                                <TabPane
                                    className="widget-list__tab"
                                    tab="Steam"
                                    key="2"
                                >
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
                                            <W_SteamFriendsInfo
                                                id="steam_friends_info"
                                                component={W_SteamFriendsInfo}
                                                onWidgetList
                                                data={this.props.steam.friends}
                                            />
                                        }
                                        active={
                                            this.props.active.steam_friends_info
                                        }
                                    />
                                    <WidgetEntry
                                        component={
                                            <W_SteamTopPlayedGames
                                                id="steam_top_games"
                                                component={
                                                    W_SteamTopPlayedGames
                                                }
                                                onWidgetList
                                                data={this.props.steam.library}
                                            />
                                        }
                                        active={
                                            this.props.active.steam_top_games
                                        }
                                    />
                                </TabPane>
                            ) : (
                                <span />
                            )}
                            {this.props.reddit ? (
                                <TabPane
                                    className="widget-list__tab"
                                    tab="Reddit"
                                    key="3"
                                >
                                    <WidgetEntry
                                        component={
                                            <RedditProfileInfo
                                                id="reddit_profile_info"
                                                component={RedditProfileInfo}
                                                onWidgetList
                                                data={this.props.reddit.profile}
                                            />
                                        }
                                        active={
                                            this.props.active
                                                .reddit_profile_info
                                        }
                                    />
                                    <WidgetEntry
                                        component={
                                            <RedditSubmissionInfo
                                                id="reddit_submission_info"
                                                component={RedditSubmissionInfo}
                                                onWidgetList
                                                data={
                                                    this.props.reddit
                                                        .submissions
                                                }
                                            />
                                        }
                                        active={
                                            this.props.active
                                                .reddit_submission_info
                                        }
                                    />
                                    <WidgetEntry
                                        component={
                                            <RedditCommentInfo
                                                id="reddit_comment_info"
                                                component={RedditCommentInfo}
                                                onWidgetList
                                                data={
                                                    this.props.reddit.comments
                                                }
                                            />
                                        }
                                        active={this.props.active.comments}
                                    />
                                </TabPane>
                            ) : (
                                <span />
                            )}
                            {/* <TabPane
                                className="widget-list__tab"
                                tab="Reddit"
                                key="3"
                            >
                            </TabPane> */}
                        </Tabs>
                    </div>
                </Content>
            </div>
        );
    }
}
