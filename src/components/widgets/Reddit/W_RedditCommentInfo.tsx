import * as React from 'react';
import { PureComponent } from 'react';
//import { PlayerSummaryModelMerge } from '../../../api/SteamAPI';
import { RedditComment } from '../../../api/RedditAPI';
import { widgetFactory, ExternalProps } from '../IWidget';

type IProps = ExternalProps<RedditComment[]>;

class GithubUserOverview extends PureComponent<IProps> {
    props!: IProps;

    max_length_1 = 32;

    max_length_2 = 25;

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
                        .map((comment) => {
                            if (comment.comment_id) {
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
                                                    comment.comment,
                                                    this.max_length_1
                                                )}
                                            </strong>
                                        </div>
                                        <div>
                                            {'\t'}to{' '}
                                            <strong>
                                                &quot;
                                                {this.circumsize(
                                                    comment.parent_post_title,
                                                    this.max_length_2
                                                )}
                                                &quot;
                                            </strong>
                                        </div>
                                        <div>
                                            {'\t'}on{' '}
                                            <strong>{comment.subreddit}</strong>
                                        </div>
                                        <div>
                                            {'\t'}Upvotes:{' '}
                                            <strong>{comment.updoots}</strong>
                                        </div>
                                        <div>
                                            {'\t'}Downvotes:{' '}
                                            <strong>{comment.downdoots}</strong>
                                        </div>
                                        <div>
                                            {'\t'}Total:{' '}
                                            <strong>
                                                {comment.updoots +
                                                    comment.downdoots}
                                            </strong>
                                        </div>
                                        {/* <div>--------------------</div> */}
                                    </div>
                                );
                            }
                            return null;
                        })
                        .slice(0, 20)}
                </div>
            );
        }
        return <span />;
    }
}

export default widgetFactory()<RedditComment[], IProps>(GithubUserOverview);
