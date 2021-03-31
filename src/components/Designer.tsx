/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/state-in-constructor */
import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import { Redirect } from 'react-router';
import { Button } from 'antd';
import { LeftCircleOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import DataStore from '../classes/DataStore';
import routes from '../constants/routes';
import Portfolio from './designer/Portfolio';
import Widgets from './designer/Widgets';
import { GithubData } from '../api/GithubAPI';
import { SteamAPIData } from '../api/SteamAPI';

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
    github: GithubData;
    steam: SteamAPIData;
}

interface IState {
    active: { [key: string]: boolean };
}

export default class Designer extends Component<IProps, IState> {
    props!: IProps;

    state: IState;

    constructor(props, history) {
        super(props);
        this.state = { active: {} };
        console.log(this.state);
    }

    updateActiveWidgets = (id: string, active: boolean) => {
        console.log(this.state);
        this.setState(
            update(this.state, {
                active: {
                    $toggle: [id],
                },
            })
        );
    };

    toPage(route: string, e) {
        const { history } = this.props;
        history.push(route);
    }

    render() {
        return (
            <div>
                <div className="designer">
                    <DndProvider backend={HTML5Backend}>
                        <div className="designer__portfolio">
                            <Portfolio
                                hideSourceOnDrag
                                updateActiveWidgets={this.updateActiveWidgets}
                            />
                        </div>
                        <div className="designer__widgets">
                            <Widgets
                                active={this.state.active}
                                github={this.props.github}
                                steam={this.props.steam}
                            />
                        </div>
                    </DndProvider>
                </div>

                <div className="designer-button-container">
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
