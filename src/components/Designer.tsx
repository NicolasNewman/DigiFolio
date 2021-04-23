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
import { Button, Popover, Slider, InputNumber, Select } from 'antd';
import { ipcRenderer } from 'electron';
import { LeftCircleOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import copy from 'clone-deep';
import DataStore from '../classes/DataStore';
import routes from '../constants/routes';
// eslint-disable-next-line import/no-named-as-default
import Portfolio from './designer/Portfolio';
import Widgets from './designer/Widgets';
import { GithubData } from '../api/GithubAPI';
import { SteamAPIData } from '../api/SteamAPI';
import { RedditAPIData } from '../api/RedditAPI';
import Theming from './Designer/Theming';
import { Boxes, RestoreBoxes } from '../types/Portfolio';
import { IInitialState } from '../reducers/portfolio';
import resolveWidget from './widgets/WidgetResolver';
import { WidgetComponentType } from './widgets/IWidget';

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
    github: GithubData;
    steam: SteamAPIData;
    portfolio: IInitialState;
    updatePortfolioBoxes: (boxes: Boxes) => void;
    restorePortfolio: (state: IInitialState) => void;
    reddit: RedditAPIData;
}

interface IState {
    active: { [key: string]: boolean };
    currentThemePanel: React.ReactNode;
    background: string;
    gradient: string | undefined;
    angleValue: number;
    colorPercentage: number;
    visible: boolean;
    portfolioKey: number;
    widgetStyle: React.CSSProperties;
}
const { Option } = Select;

export default class Designer extends Component<IProps, IState> {
    props!: IProps;

    state: IState;

    constructor(props) {
        super(props);
        this.state = {
            active: {},
            portfolioKey: 1,
            currentThemePanel: <span />,
            background: '#fff',
            gradient: undefined,
            angleValue: 135,
            colorPercentage: 0,
            visible: false,
            widgetStyle: {
                background: '#fff' || undefined,
                color: '#000' || undefined,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#000',
                //border: '1px solid black',
            },
        };
        this.state.currentThemePanel = this.getGlobalThemePanel();
        ipcRenderer.on('open-workspace', (_e, content) => {
            console.log(content);
            const restoredState = JSON.parse(content) as {
                boxes: RestoreBoxes;
            };
            const state: IInitialState = { boxes: {} };
            Object.keys(restoredState.boxes).forEach((key) => {
                const temp = restoredState.boxes[key];
                state.boxes[key] = {
                    data: temp.data,
                    top: temp.top,
                    left: temp.left,
                    title: temp.title,
                    state: temp.state,
                    component: (resolveWidget(
                        temp.component,
                        temp.data
                    ) as unknown) as WidgetComponentType,
                };
                this.updateActiveWidgets(key, false);
            });
            console.log(restoredState);
            // Object.keys(state);
            this.props.restorePortfolio(state);
            this.setState({ portfolioKey: this.state.portfolioKey + 1 });
            // this.state.active = JSON.parse(content);
        });
        console.log(this.state);
    }

    handleBackgroundChange = (color: ColorResult) => {
        this.setState({ background: color.hex });
    };

    handleGradientChange = (color: ColorResult) => {
        this.setState({ gradient: color.hex });
        this.setThemePanel(this.getGlobalThemePanel());
    };

    handleAngleChange = (value) => {
        this.setState({ angleValue: value });
    };

    handlePercentageChange = (value) => {
        this.setState({ colorPercentage: value });
    };

    handleWidgetBackgroundChange = (color: ColorResult) => {
        const cpy = copy(this.state.widgetStyle);
        cpy.backgroundColor = color.hex;
        this.setState({ widgetStyle: cpy });
    };

    handleWidgetTextChange = (color: ColorResult) => {
        const cpy = copy(this.state.widgetStyle);
        cpy.color = color.hex;
        this.setState({ widgetStyle: cpy });
    };

    handleBorderSize = (val) => {
        const cpy = copy(this.state.widgetStyle);
        cpy.borderWidth = val;
        this.setState({ widgetStyle: cpy });
    };

    handleBorderType = (val) => {
        const cpy = copy(this.state.widgetStyle);
        cpy.borderStyle = val;
        this.setState({ widgetStyle: cpy });
    };

    handleBorderColor = (color: ColorResult) => {
        const cpy = copy(this.state.widgetStyle);
        cpy.borderColor = color.hex;
        this.setState({ widgetStyle: cpy });
    };

    switchTheme = () => {
        const curTheme = this.state.background;
        if (curTheme === '#fff') {
            this.setState({ background: '#333' });
        } else {
            this.setState({ background: '#fff' });
        }
        // setInterval(() => {
        //     console.log('here');
        //     this.setThemePanel(this.getGlobalThemePanel());
        // }, 20);
    };

    getGlobalThemePanel = () => {
        const theme = this.state.background === '#fff' ? 'Dark' : 'Light';
        return (
            <div>
                <div>
                    <h2>Portfolio Theme</h2>
                    <Button
                        onClick={this.switchTheme}
                        type="primary"
                        style={{ margin: '0.3rem 0' }}
                    >
                        {theme} Mode
                    </Button>
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
                        trigger="hover"
                    >
                        <Button type="primary" style={{ margin: '0.3rem 0' }}>
                            Portfolio Color
                        </Button>
                    </Popover>
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
                        trigger="hover"
                    >
                        <Button type="primary" style={{ margin: '0.3rem 0' }}>
                            Add Gradient
                        </Button>
                    </Popover>
                    {this.state.gradient ? (
                        <div>
                            <div>
                                <span>Angle: </span>
                                <Slider
                                    min={0}
                                    max={360}
                                    onAfterChange={this.handleAngleChange}
                                    defaultValue={this.state.angleValue}
                                    style={{
                                        width: '60%',
                                        margin: '-3px 2px',
                                        display: 'inline-block',
                                    }}
                                />
                            </div>
                            {/* <Popover
                                content={
                                    <Slider
                                        min={0}
                                        max={360}
                                        onAfterChange={this.handleAngleChange}
                                        defaultValue={this.state.angleValue}
                                    />
                                }
                                title="Angle"
                                trigger="hover"
                            >
                                <Button
                                    type="primary"
                                    style={{ margin: '0.3rem 0' }}
                                >
                                    Gradient Angle
                                </Button>
                            </Popover> */}
                            <div>
                                {/* <Slider
                                    min={0}
                                    max={100}
                                    onAfterChange={this.handlePercentageChange}
                                    defaultValue={this.state.colorPercentage}
                                /> */}
                                <span>Percentage: </span>
                                <InputNumber
                                    min={0}
                                    max={100}
                                    defaultValue={this.state.colorPercentage}
                                    onChange={this.handlePercentageChange}
                                    formatter={(value) => `${value}%`}
                                    parser={(value) => value?.replace('%', '')}
                                    style={{ margin: '0.3rem 0' }}
                                />
                            </div>

                            {/* <Popover
                                content={
                                    <Slider
                                        min={0}
                                        max={100}
                                        onAfterChange={
                                            this.handlePercentageChange
                                        }
                                        defaultValue={
                                            this.state.colorPercentage
                                        }
                                    />
                                }
                                title="Color %"
                                trigger="hover"
                            >
                                <Button
                                    type="primary"
                                    style={{ margin: '0.3rem 0' }}
                                >
                                    Gradient %
                                </Button>
                            </Popover> */}
                        </div>
                    ) : null}
                </div>
                <hr />
                <div>
                    <h2>Widget Theme</h2>
                    <Popover
                        content={
                            <SketchPicker
                                className="sketch-picker-override"
                                color={
                                    this.state.widgetStyle.background || '#fff'
                                }
                                onChangeComplete={
                                    this.handleWidgetBackgroundChange
                                }
                                disableAlpha
                            />
                        }
                        title="Widget Background"
                        trigger="hover"
                    >
                        <Button type="primary" style={{ margin: '0.3rem 0' }}>
                            Widget Color
                        </Button>
                    </Popover>
                    <Popover
                        content={
                            <SketchPicker
                                className="sketch-picker-override"
                                color={this.state.widgetStyle.color || '#000'}
                                onChangeComplete={this.handleWidgetTextChange}
                                disableAlpha
                            />
                        }
                        title="Widget Background"
                        trigger="hover"
                    >
                        <Button type="primary" style={{ margin: '0.3rem 0' }}>
                            Widget Text Color
                        </Button>
                    </Popover>
                    <div>
                        <span style={{ marginTop: '0.5rem' }}>
                            Border size:
                        </span>
                        <InputNumber
                            min={0}
                            max={36}
                            defaultValue={1}
                            onChange={this.handleBorderSize}
                            formatter={(value) => `${value}px`}
                            parser={(value) => value?.replace('px', '')}
                            style={{ margin: '0.3rem 0' }}
                        />
                    </div>
                    <Select
                        showSearch
                        style={{ width: 200, margin: '0.3rem 0' }}
                        placeholder="Select a Type"
                        optionFilterProp="children"
                        onChange={this.handleBorderType}
                    >
                        <Option value="solid">Solid</Option>
                        <Option value="dotted">Dotted</Option>
                        <Option value="dashed">Dashed</Option>
                        <Option value="double">Double</Option>
                    </Select>
                    <Popover
                        content={
                            <SketchPicker
                                className="sketch-picker-override"
                                color={this.state.widgetStyle.borderColor}
                                onChangeComplete={this.handleBorderColor}
                                disableAlpha
                            />
                        }
                        title="Widget Background"
                        trigger="hover"
                    >
                        <Button type="primary" style={{ margin: '0.3rem 0' }}>
                            Border Color
                        </Button>
                    </Popover>
                </div>
            </div>
        );
    };

    setThemePanel = (panel: React.ReactNode) => {
        this.setState({ currentThemePanel: panel });
    };

    updateActiveWidgets = (id: string, _active: boolean) => {
        this.setState(
            update(this.state, {
                active: {
                    $toggle: [id],
                },
            })
        );
    };

    toPage(route: string, _e) {
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
                                key={this.state.portfolioKey}
                                hideSourceOnDrag
                                updateActiveWidgets={this.updateActiveWidgets}
                                setThemePanel={this.setThemePanel}
                                background={this.state.background}
                                gradient={this.state.gradient}
                                angleValue={this.state.angleValue}
                                colorPercent={this.state.colorPercentage}
                                updatePortfolioBoxes={
                                    this.props.updatePortfolioBoxes
                                }
                                portfolio={this.props.portfolio}
                                widgetStyle={this.state.widgetStyle}
                            />
                        </div>
                        <div className="designer__widgets">
                            <Widgets
                                active={this.state.active}
                                github={this.props.github}
                                steam={this.props.steam}
                                setThemePanel={this.setThemePanel}
                                reddit={this.props.reddit}
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
