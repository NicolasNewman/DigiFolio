/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/state-in-constructor */
import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SketchPicker, ColorResult } from 'react-color';
import { Button, Popover, Slider } from 'antd';
import { LeftCircleOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import DataStore from '../classes/DataStore';
import routes from '../constants/routes';
// eslint-disable-next-line import/no-named-as-default
import Portfolio from './designer/Portfolio';
import Widgets from './designer/Widgets';
import { GithubData } from '../api/GithubAPI';
import { SteamAPIData } from '../api/SteamAPI';
import Theming from './Designer/Theming';
import { Boxes } from '../types/Portfolio';

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
    github: GithubData;
    steam: SteamAPIData;
    updatePortfolioBoxes: (boxes: Boxes) => void;
}

interface IState {
    active: { [key: string]: boolean };
    currentThemePanel: React.ReactNode;
    background: string;
    gradient: string | undefined;
    angleValue: number;
    visible: boolean;
}

export default class Designer extends Component<IProps, IState> {
    props!: IProps;

    state: IState;

    constructor(props) {
        super(props);
        this.state = {
            active: {},
            currentThemePanel: <span />,
            background: '#fff',
            gradient: undefined,
            angleValue: 0,
            visible: false,
        };
        this.state.currentThemePanel = this.getGlobalThemePanel();
    }

    handleBackgroundChange = (color: ColorResult) => {
        this.setState({ background: color.hex });
    };

    handleGradientChange = (color: ColorResult) => {
        this.setState({ gradient: color.hex });
    };

    handleAngleChange = (value) => {
        console.log('changing angle value to', value);
        this.setState({ angleValue: value });
    };

    getGlobalThemePanel = () => {
        return (
            <div>
                <Popover
                    content={
                        <SketchPicker
                            className="sketch-picker-override"
                            color={this.state.background}
                            onChangeComplete={this.handleBackgroundChange}
                            disableAlpha
                        />
                    }
                    title="Background"
                    trigger="click"
                >
                    <Button>Change Theme</Button>
                </Popover>
                <hr />
                <Popover
                    content={
                        <SketchPicker
                            className="sketch-picker-override"
                            color={this.state.gradient || '#fff'}
                            onChangeComplete={this.handleGradientChange}
                            disableAlpha
                        />
                    }
                    title="Gradient"
                    trigger="click"
                >
                    <Button>Add Gradient</Button>
                </Popover>
                {this.state.gradient ? (
                    <div>
                        <hr />
                        <Popover
                            content={
                                <Slider
                                    min={0}
                                    max={360}
                                    onAfterChange={this.handleAngleChange}
                                    value={this.state.angleValue}
                                />
                            }
                            title="Angle"
                            trigger="click"
                        >
                            <Button>Change Angle</Button>
                        </Popover>
                    </div>
                ) : null}
            </div>
        );
    };

    setThemePanel = (panel: React.ReactNode) => {
        this.setState({ currentThemePanel: panel });
    };

    updateActiveWidgets = (id: string, active: boolean) => {
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
                                background={this.state.background}
                                gradient={this.state.gradient}
                                updatePortfolioBoxes={
                                    this.props.updatePortfolioBoxes
                                }
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
