/* eslint-disable @typescript-eslint/naming-convention */
import * as React from 'react';
import { PureComponent } from 'react';
import { PlayerSummaryModelMerge } from '../../../api/SteamAPI';
import { widgetFactory, ExternalProps } from '../IWidget';

type IProps = ExternalProps<PlayerSummaryModelMerge>;

class W_SteamProfileInfo extends PureComponent<IProps> {
    props!: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { data } = this.props;
        if (data) {
            return (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 'fit-content',
                    }}
                >
                    <img
                        style={{
                            width: '4rem',
                            height: '4rem',
                            borderRadius: '8px',
                            marginRight: '0.5rem',
                        }}
                        src={data.avatarfull}
                        alt="pfp"
                    />
                    <div style={{ display: 'table' }}>
                        <div style={{ marginBottom: '0' }}>
                            {data.personaname}
                        </div>
                        <div
                            style={{
                                marginBottom: '0',
                                border: '1px solid black',
                                borderRadius: '100%',
                                width: '1.5rem',
                                height: '1.5rem',
                                textAlign: 'center',
                                margin: '0 auto',
                            }}
                        >
                            {data.player_level}
                        </div>
                    </div>
                </div>
            );
        }
        return <span />;
    }
}

export default widgetFactory()<PlayerSummaryModelMerge, IProps>(
    W_SteamProfileInfo
);
