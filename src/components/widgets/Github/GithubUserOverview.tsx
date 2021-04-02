import * as React from 'react';
import { PureComponent } from 'react';
import { GithubInfoModel } from '../../../api/GithubAPI';
import { widgetFactory, ExternalProps } from '../IWidget';

type IProps = ExternalProps<GithubInfoModel>;

class GithubUserOverview extends PureComponent<IProps> {
    props!: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { data } = this.props;
        if (data) {
            return (
                <div>
                    <img
                        style={{ width: '1rem', height: '1rem' }}
                        src={data.avatar_url}
                        alt="pfp"
                    />
                    <p>{data.name}</p>
                    <p>{data.bio}</p>
                </div>
            );
        }
        return <span />;
    }
}

export default widgetFactory()<GithubInfoModel, IProps>(GithubUserOverview);
