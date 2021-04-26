/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import { Component } from 'react';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { Checkbox, Slider } from 'antd';
import { SteamLibraryModel } from '../../../api/SteamAPI';
import {
    widgetFactory,
    ExternalProps,
    ComponentExtendedProps,
} from '../IWidget';

type IProps = ExternalProps<SteamLibraryModel> & ComponentExtendedProps<IState>;

export interface IState {
    orientLabels: boolean;
    opacity: number;
}

class W_SteamTopPlayedGames extends Component<IProps, IState> {
    props!: IProps;

    data: {
        game: 'Top 10';
        children: {
            game: string;
            hours: number;
        }[];
    };

    constructor(props: IProps) {
        super(props);
        this.data = {
            game: 'Top 10',
            children: [],
        };
        const restoredState = props.restoreState();
        this.state = restoredState ||
            props.state || {
                orientLabels: true,
                opacity: 0.33,
            };

        if (props.width === 250) {
            props.setHOCState({ width: 500, height: 300, hover: false });
        }
    }

    componentWillUnmount() {
        this.props.saveState(this.state);
    }

    getThemePanel() {
        return (
            <div>
                <Checkbox
                    onChange={(e) =>
                        this.setState({ orientLabels: e.target.checked })
                    }
                    defaultChecked={this.state.orientLabels}
                >
                    Orient Labels
                </Checkbox>
                <div>
                    <span>Opacity: </span>
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(val) => this.setState({ opacity: val })}
                        defaultValue={this.state.opacity}
                    />
                </div>
            </div>
        );
    }

    compileData() {
        const dataSource = this.props?.data;
        this.data = {
            game: 'Top 10',
            children: [],
        };
        if (dataSource) {
            dataSource.games.sort((a, b) => {
                return b.playtime_forever - a.playtime_forever;
            });
            console.log(dataSource);
            for (let i = 0; i < 10; i += 1) {
                const record = dataSource.games[i];
                if (record.playtime_forever === 0) {
                    break;
                }
                this.data.children.push({
                    game: record.name.split(':')[0],
                    hours: record.playtime_forever,
                });
            }
        }
    }

    render() {
        if (this.data.children.length === 0) {
            this.compileData();
        }
        console.log(this.data);

        return (
            <div
                style={
                    this.props.onWidgetList
                        ? { width: '100%', height: '225px' }
                        : {
                              width: `${this.props.width}px`,
                              height: `${this.props.height}px`,
                          }
                }
                onClick={(e) => {
                    e.stopPropagation();
                    return this.props.setThemePanel
                        ? this.props.setThemePanel(this.getThemePanel())
                        : null;
                }}
            >
                <ResponsiveTreeMap
                    data={this.data}
                    identity="game"
                    value="hours"
                    leavesOnly
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    labelSkipSize={12}
                    // this can be safely ignored. It's an issue with the definition files for Nivo
                    label={(e) => {
                        return `${e.id}`;
                    }}
                    orientLabel={this.state.orientLabels}
                    nodeOpacity={this.state.opacity}
                    labelTextColor={{
                        from: 'color',
                        modifiers: [['darker', 1.2]],
                    }}
                    parentLabelTextColor={{
                        from: 'color',
                        modifiers: [['darker', 2]],
                    }}
                    colors={{ scheme: 'category10' }}
                    borderColor={{
                        from: 'color',
                        modifiers: [['darker', 0.1]],
                    }}
                />
            </div>
        );
    }
}

export default widgetFactory()<SteamLibraryModel, IProps, IState>(
    W_SteamTopPlayedGames
);
