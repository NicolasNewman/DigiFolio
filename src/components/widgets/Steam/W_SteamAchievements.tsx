/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-continue */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */
/* eslint-disable react/self-closing-comp */
import * as React from 'react';
import { PureComponent } from 'react';
import { ResponsiveBar, Layer } from '@nivo/bar';
import { Select } from 'antd';
import {
    widgetFactory,
    ExternalProps,
    ComponentExtendedProps,
} from '../IWidget';
import { SteamLibraryModel } from '../../../api/SteamAPI';

const { Option } = Select;

// The props should always extend ExternalProps which takes a generic of the type of the data model being given to this widget
type IProps = ExternalProps<SteamLibraryModel> & ComponentExtendedProps<IState>;

export interface IState {
    games: string[];
}
/**
 * Custom layers in Nivo allow you to add your own information anywhere on the chart
 * There is unfortunetly no documentation, so they can be difficult to make
 * There are some examples on code pen
 */
const ProgressLabels = ({ bars, yScale }) => {
    // space between top of stacked bars and total label
    const labelMargin = 20;

    return bars.map(({ data: { data, indexValue }, x, width }, i) => {
        const earned = data.earned ? data.earned : 0;
        const label = `${earned} / ${earned + data.unearned}`;

        const total = Object.keys(data)
            //f ilter out whatever your indexBy value is
            .filter((dataKey) => dataKey !== 'game')
            .reduce((a, key) => a + data[key], 0);

        return (
            <g
                transform={`translate(${x}, ${yScale(total) - labelMargin})`}
                key={`${indexValue}-${i}`}
            >
                <text
                    // add any class to the label here
                    className="bar-total-label"
                    x={width / 2}
                    y={labelMargin / 2}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    // add any style to the label here
                    style={{
                        fill: 'rgb(51, 51, 51)',
                    }}
                    fontSize="0.7rem"
                >
                    {label}
                </text>
            </g>
        );
    });
};

class W_SteamAchievements extends React.Component<IProps, IState> {
    props!: IProps;

    // each widget should have a data field, which is what is passed into the Nivo chart
    // the field is set in compileData()
    data: {
        game: string;
        unearned: number;
        earned: number;
    }[];

    games: string[] = [];

    constructor(props: IProps) {
        super(props);
        this.data = [];
        props.data.games.forEach((game) => {
            this.games.push(game.name);
        });
        const restoredState = props.restoreState();
        this.state = restoredState ||
            props.state || {
                games: [],
            };

        props.setHOCState({ width: 500, height: 300, hover: false });
    }

    componentDidUpdate(_, prevState) {
        this.props.saveState(this.state);
    }

    componentWillUnmount() {
        this.props.saveState(this.state);
    }

    // componentDidUpdate(_, prevState) {
    //     this.props.saveState(this.state);
    // }

    getThemePanel() {
        return (
            <div>
                <span>Games:</span>
                <Select
                    mode="multiple"
                    onChange={(val) => {
                        this.data = [];
                        this.setState({ games: val.toString().split(',') });
                    }}
                    style={{ width: '100%' }}
                    defaultValue={this.state.games}
                >
                    {this.games.map((game) => (
                        <Option value={game} key={game}>
                            {game}
                        </Option>
                    ))}
                </Select>
            </div>
        );
    }

    /**
     * Every widget should have this function
     * It converts the API's data model (SteamLibraryModelMerge in this case) to a format usable by Nivo
     * The function should be called in reder, but MAKE SURE IT IS ONLY CALLED IF this.data.length = 0
     *
     * This particular function extracts the first ten games in your library and their earned / unearned achievements records
     */
    compileData() {
        const dataSource = this.props?.data;
        this.data = [];
        if (dataSource) {
            for (let i = 0; i < dataSource.game_count; i += 1) {
                const game = dataSource.games[i];
                if (
                    this.state.games.length > 0 &&
                    !this.state.games.includes(game.name)
                ) {
                    continue;
                }
                if (game.achievements.length > 0) {
                    // if the game has achievements
                    let total = 0;
                    let earned = 0;
                    // loop through each achievement and increment total. Also increment earned if it has been earned
                    game.achievements.forEach((achievement) => {
                        total += 1;
                        earned += achievement.achievement_achieved ? 1 : 0;
                    });

                    // push the data into the components data field
                    this.data.push({
                        game: game.name.split(':')[0], // hack to get rid of games with long names (e.x. Grand Theft Auto IV: Complete Edition)
                        unearned: total - earned,
                        earned,
                    });
                }

                // Stop saving records after parsing 10 valid ones
                if (this.data.length >= 10) {
                    break;
                }
            }
        }
    }

    render() {
        // If we have no data, compile it. This is needed because props is undefined while the widget is in a dragging state, meaning we can't parse the data in the constructor
        if (this.data.length === 0) {
            this.compileData();
        }

        return (
            <div
                // set the width and height based on if the widget is on the list or the portfolio
                // if it is on the list, width should be 100% and the height should be determined by testing various values in the debugger
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
                <ResponsiveBar
                    data={this.data}
                    indexBy="game"
                    keys={['earned', 'unearned']}
                    // width={500}
                    // height={300}
                    enableGridY
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'achievements',
                        legendPosition: 'middle',
                        legendOffset: -40,
                    }}
                    colors={['#ffee55', '#999']}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -15,
                        legend: 'game',
                        legendPosition: 'middle',
                        legendOffset: 32,
                    }}
                    margin={{ top: 20, right: 0, bottom: 40, left: 45 }}
                    layers={[
                        'grid',
                        'axes',
                        'bars',
                        ProgressLabels, // custom layer that adds a {earned/total} label at the top of each bar
                        'markers',
                        'legends',
                    ]}
                    labelSkipHeight={10}
                />
            </div>
        );
    }
}

export default widgetFactory()<SteamLibraryModel, IProps, IState>(
    W_SteamAchievements
);
