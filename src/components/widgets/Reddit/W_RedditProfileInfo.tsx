import * as React from 'react';
import { PureComponent } from 'react';
//import { PlayerSummaryModelMerge } from '../../../api/SteamAPI';
import { RedditUserInfo } from '../../../api/RedditAPI';
import { widgetFactory, ExternalProps } from '../IWidget';

type IProps = ExternalProps<RedditUserInfo>;

class GithubUserOverview extends PureComponent<IProps> {
    props!: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { data } = this.props;
        if (data) {
            return (
                <div style={{ display: 'flex' }}>
                    <img
                        style={{
                            width: '4rem',
                            height: '4rem',
                            borderRadius: '8px',
                            marginRight: '0.5rem',
                        }}
                        src={data.avatar}
                        alt="pfp"
                    />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <div>{data.username}</div>
                        {/* <div>
                            Friends since:{' '}
                            {this.unix_tostring(friend.friend_since)}
                        </div> */}
                        <div>Karma: {data.total_karma}</div>
                        <div>Friends count: {data.num_friends}</div>
                        <div>Coins: {data.coins}</div>
                    </div>
                </div>
            );
        }
        return <span />;
    }
}

export default widgetFactory()<RedditUserInfo, IProps>(GithubUserOverview);
