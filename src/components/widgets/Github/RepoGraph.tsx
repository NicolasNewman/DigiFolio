/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */
/* eslint-disable react/self-closing-comp */
import * as React from 'react';
import { PureComponent } from 'react';
import { ResponsiveBar, Layer } from '@nivo/bar';
import { widgetFactory, ExternalProps } from '../IWidget';
import { SteamLibraryModelMerge } from '../../../api/SteamAPI';
import { GithubRepoModel } from '../../../api/GithubAPI';

// The props should always extend ExternalProps which takes a generic of the type of the data model being given to this widget
type IProps = ExternalProps<GithubRepoModel>;

class ChartWidget extends PureComponent<IProps> {
    props!: IProps;

    // each widget should have a data field, which is what is passed into the Nivo chart
    // the field is set in compileData()
    data: {
        repo: string;
        commits: number;
    }[];

    constructor(props: IProps) {
        super(props);
        this.data = [];
    }

    /**
     * Every widget should have this function
     * It converts the API's data model (SteamLibraryModelMerge in this case) to a format usable by Nivo
     * The function should be called in reder, but MAKE SURE IT IS ONLY CALLED IF this.data.length = 0
     *
     * This particular function extracts the first ten games in your library and their earned / unearned achievements records
     */
    compileData() {
        const repoList = this.props?.data;
        this.data = [];
        if (repoList) {
            for (let i = 0; i < repoList.length; i += 1) {
                const repo = repoList[i];

                // if the game has achievements
                if (repo.data_commits.length > 0) {
                    const total = repo.data_commits.length;

                    // push the data into the components data field
                    this.data.push({
                        repo: repo.name,
                        commits: total,
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
                        : { width: '500px', height: '300px' }
                }
            >
                <h2>Commits by Repo</h2>
                <ResponsiveBar
                    data={this.data}
                    indexBy="repo"
                    keys={['commits']}
                    // width={500}
                    // height={300}
                    enableGridY
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'commits',
                        legendPosition: 'middle',
                        legendOffset: -40,
                    }}
                    colors={['#ffee55', '#999']}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -15,
                        legend: 'repo',
                        legendPosition: 'middle',
                        legendOffset: 32,
                    }}
                    margin={{ top: 20, right: 0, bottom: 40, left: 45 }}
                    layers={['grid', 'axes', 'bars', 'markers', 'legends']}
                    labelSkipHeight={10}
                />
            </div>
        );
    }
}

export default widgetFactory()<GithubRepoModel, IProps>(ChartWidget);