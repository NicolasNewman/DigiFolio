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
        // const getRepos = () => {
        //     const repos: JSX.Element[] = [];
        //     const i = 0;
        //     while (i < 10) {
        //         repos.push(<p>{data[i].name}</p>);
        //     }
        // };

        if (data) {
            return (
                <div>
                    {data
                        .map((GithubRepo) => {
                            return (
                                <div key="Repo">
                                    <h4>{GithubRepo.name}</h4>
                                    <p>
                                        Commits:
                                        {GithubRepo.data_commits.length}
                                    </p>
                                </div>
                            );
                        })
                        .slice(0, 5)}
                </div>
            );
        }
        return <span />;
    }
}

export default widgetFactory()<GithubRepoModel, IProps>(CommitsWidget);
