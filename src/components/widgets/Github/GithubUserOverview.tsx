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
                    <p>Name: {data.name}</p>
                    <p>Bio: {data.bio}</p>
                    <p>Followers: {data.followers}</p>
                    <p>Public Repos: {data.public_repos}</p>
                </div>
            );
        }
        return <span />;
    }
}

export default widgetFactory()<GithubInfoModel, IProps>(GithubUserOverview);
