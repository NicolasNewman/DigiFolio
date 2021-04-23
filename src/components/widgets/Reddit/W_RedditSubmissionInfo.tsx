import * as React from 'react';
import { PureComponent } from 'react';
//import { PlayerSummaryModelMerge } from '../../../api/SteamAPI';
import { RedditSubmission } from '../../../api/RedditAPI';
import { widgetFactory, ExternalProps } from '../IWidget';

type IProps = ExternalProps<RedditSubmission[]>;

class GithubUserOverview extends PureComponent<IProps> {
    props!: IProps;

    max_length_1 = 32;

    constructor(props: IProps) {
        super(props);
    }

    circumsize(input: string, max_length: number): string {
        if (input.length <= max_length + 3) {
            return input;
        }
        let res = input.slice(0, max_length);
        res = res.concat('...');
        return res;
    }

    render() {
        const { data } = this.props;
        if (data) {
            return (
                <div>
                    {data
                        .map((submission) => {
                            if (submission.submission_id) {
                                return (
                                    <div
                                        style={{
                                            whiteSpace: 'pre',
                                        }}
                                    >
                                        <div>--------------------</div>
                                        <div>
                                            <strong>
                                                {this.circumsize(
                                                    submission.title,
                                                    this.max_length_1
                                                )}
                                            </strong>
                                        </div>
                                        <div>
                                            {'\t'}to{' '}
                                            <strong>
                                                {submission.subreddit}
                                            </strong>
                                        </div>
                                        <div>
                                            {'\t'}Upvotes:{' '}
                                            <strong>
                                                {submission.updoots}
                                            </strong>
                                        </div>
                                        <div>
                                            {'\t'}Downvotes:{' '}
                                            <strong>
                                                {submission.downdoots}
                                            </strong>
                                        </div>
                                        <div>
                                            {'\t'}Total:{' '}
                                            <strong>
                                                {submission.updoots +
                                                    submission.downdoots}
                                            </strong>
                                        </div>
                                        {/* <div>--------------------</div> */}
                                    </div>
                                );
                            }
                            return null;
                        })
                        .slice(0, 10)}
                </div>
            );
        }
        return <span />;
    }
}

export default widgetFactory()<RedditSubmission[], IProps>(GithubUserOverview);
