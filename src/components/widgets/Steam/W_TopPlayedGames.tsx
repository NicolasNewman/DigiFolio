import * as React from 'react';
import { PureComponent } from 'react';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { SteamLibraryModel } from '../../../api/SteamAPI';
import { widgetFactory, ExternalProps } from '../IWidget';

type IProps = ExternalProps<SteamLibraryModel>;

class GithubUserOverview extends PureComponent<IProps> {
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
                        : { width: '500px', height: '300px' }
                }
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

export default widgetFactory()<SteamLibraryModel, IProps>(GithubUserOverview);
