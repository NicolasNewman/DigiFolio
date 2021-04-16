/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/state-in-constructor */
import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ipcRenderer } from 'electron';
import { Button } from 'antd';
import { LeftCircleOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import DataStore from '../classes/DataStore';
import routes from '../constants/routes';
import Portfolio from './designer/Portfolio';
import Widgets from './designer/Widgets';
import { GithubData } from '../api/GithubAPI';
import { SteamAPIData } from '../api/SteamAPI';
import Theming from './Designer/Theming';
import { Boxes } from '../types/Portfolio';
import { IInitialState } from '../reducers/portfolio';

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
    github: GithubData;
    steam: SteamAPIData;
    portfolio: IInitialState;
    updatePortfolioBoxes: (boxes: Boxes) => void;
    restorePortfolio: (state: IInitialState) => void;
}

interface IState {
    active: { [key: string]: boolean };
    currentThemePanel: React.ReactNode;
}

export default class Designer extends Component<IProps, IState> {
    props!: IProps;

    state: IState;

    constructor(props, history) {
        super(props);
        this.state = {
            active: {},
            currentThemePanel: this.getGlobalThemePanel(),
        };
        ipcRenderer.on('open-workspace', (e, content) => {
            console.log(content);
        });
        console.log(this.state);
    }

    getGlobalThemePanel() {
        return <div>Hello</div>;
    }

    setThemePanel = (panel: React.ReactNode) => {
        this.setState({ currentThemePanel: panel });
    };

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
                    <div className="designer__theming">
                        <Theming themePanel={this.state.currentThemePanel} />
                    </div>
                    <DndProvider backend={HTML5Backend}>
                        <div
                            className="designer__portfolio"
                            onClick={() =>
                                this.setThemePanel(this.getGlobalThemePanel())
                            }
                        >
                            <Portfolio
                                hideSourceOnDrag
                                updateActiveWidgets={this.updateActiveWidgets}
                                setThemePanel={this.setThemePanel}
                                updatePortfolioBoxes={
                                    this.props.updatePortfolioBoxes
                                }
                                portfolio={this.props.portfolio}
                            />
                        </div>
                        <div className="designer__widgets">
                            <Widgets
                                active={this.state.active}
                                github={this.props.github}
                                steam={this.props.steam}
                                setThemePanel={this.setThemePanel}
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
