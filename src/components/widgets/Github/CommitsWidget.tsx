/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { PureComponent } from 'react';
import { GithubRepoModel } from '../../../api/GithubAPI';
import { widgetFactory, ExternalProps } from '../IWidget';

type IProps = ExternalProps<GithubRepoModel>;

class CommitsWidget extends PureComponent<IProps> {
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
                        height: '200px',
                        overflowY: 'scroll',
                    }}
                >
                    <h2>Repo Commits</h2>
                    {data.map((GithubRepo, i) => {
                        return (
                            <div key={`repo-${i}`}>
                                <h4>{GithubRepo.name}</h4>
                                <p>Commits: {GithubRepo.data_commits.length}</p>
                            </div>
                        );
                    })}
                </div>
            );
        }
        return <span />;
    }
}

export default widgetFactory()<GithubRepoModel, IProps>(CommitsWidget);
