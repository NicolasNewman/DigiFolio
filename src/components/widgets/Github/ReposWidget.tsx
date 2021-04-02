/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { PureComponent } from 'react';
import { YAxis } from 'recharts';
import { GithubRepoModel } from '../../../api/GithubAPI';
import { widgetFactory, ExternalProps } from '../IWidget';

type IProps = ExternalProps<GithubRepoModel>;

class ReposWidget extends PureComponent<IProps> {
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
                    <h2>Repo Info</h2>
                    {data.map((GithubRepo, i) => {
                        return (
                            <div key={`${i}`}>
                                <h4>{GithubRepo.name}</h4>
                                {GithubRepo.description ? (
                                    <p>{GithubRepo.description}</p>
                                ) : (
                                    <p>(No description)</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }
        return <span />;
    }
}

export default widgetFactory()<GithubRepoModel, IProps>(ReposWidget);
