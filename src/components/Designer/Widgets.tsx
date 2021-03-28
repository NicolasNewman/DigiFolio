/* eslint-disable react/prop-types */
import * as React from 'react';
import { Component, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import { Disposable } from 'custom-electron-titlebar/lib/common/lifecycle';
// import DataStore from '../classes/DataStore';
import { Tabs, Button, Layout } from 'antd';
import 'antd/dist/antd.css';
import GithubUserOverview from '../widgets/Github/GithubUserOverview';
import { GithubData } from '../../api/GithubAPI';

const { TabPane } = Tabs;
const { Header, Content } = Layout;

function callback(key) {
    console.log(key);
}

interface IProps {
    github: GithubData;
    active: { [key: string]: boolean };
}

const WidgetEntry: React.FC<{
    component: React.ReactNode;
    active: boolean;
}> = (props) => {
    if (!props.active) {
        return <div>{props.component}</div>;
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
                <Header>
                    <p>Add New Widget!</p>
                </Header>
                <Content>
                    <div className="widgetTabs">
                        <Tabs defaultActiveKey="1" onChange={callback}>
                            {this.props.github ? (
                                <TabPane
                                    className="settings__tab--api"
                                    tab="Github"
                                    key="1"
                                >
                                    {/* <Widget />
                                <Widget />
                                <Widget /> */}
                                    {/* <GithubUserOverview
                                        id="UserOverview"
                                        component={GithubUserOverview}
                                        onWidgetList
                                        data={this.props.github.info}
                                    /> */}
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
                            <TabPane
                                className="settings__tab--general"
                                tab="Stream"
                                key="2"
                            >
                                {/* <Widget />
                                <Widget />
                                <Widget /> */}
                            </TabPane>
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
