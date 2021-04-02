/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { textAlign } from 'html2canvas/dist/types/css/property-descriptors/text-align';
import * as React from 'react';
import { PureComponent } from 'react';
import { SteamFriendsModel } from '../../../api/SteamAPI';
import { widgetFactory, ExternalProps } from '../IWidget';

type IProps = ExternalProps<SteamFriendsModel>;

class SteamFriendsInfo extends PureComponent<IProps> {
    props!: IProps;

    constructor(props: IProps) {
        super(props);
    }

    unix_tostring(timestamp: number): string {
        //console.log('timestamp:');
        //console.log(timestamp);
        const date = new Date(timestamp * 1000);
        return date.toDateString();
    }

    render() {
        const { data } = this.props;
        if (data) {
            return (
                <div>
                    {data.friends
                        .map((friend) => {
                            if (friend.avatar_url) {
                                return (
                                    <div style={{ display: 'flex' }}>
                                        <img
                                            style={{
                                                width: '4rem',
                                                height: '4rem',
                                                borderRadius: '8px',
                                                marginRight: '0.5rem',
                                            }}
                                            src={friend.avatar_url}
                                            alt="pfp"
                                        />
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <div>{friend.personaname}</div>
                                            <div>
                                                Friends since:{' '}
                                                {this.unix_tostring(
                                                    friend.friend_since
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })
                        .slice(0, 10)}
                </div>
            );
        }
        return <span />;
    }
}

export default widgetFactory()<SteamFriendsModel, IProps>(SteamFriendsInfo);
