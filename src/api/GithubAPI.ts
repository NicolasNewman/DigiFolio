import IAPI, { Field } from './IAPI';

export interface GithubDataModel {
    info: string;
    commitData: any;
    contributionData: any;
}

export type GithubData = GithubDataModel | null;

export default class GithubAPI extends IAPI<GithubDataModel> {
    private username: string;

    constructor(key: string, username: string) {
        super(
            {
                'Content-Type': 'application/json',
                'x-api-key': key,
            },
            [
                {
                    name: 'username',
                    value: username,
                    regex: /.*/g,
                    errorMsg: 'Username must ',
                },
            ]
        );
        this.username = username;
    }

    parse_api(): Promise<GithubDataModel> {
        throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    match_key(_key: string): boolean {
        throw new Error('Method not implemented.');
    }

    async fetch_user_repos() {
        const repos = await this.fetch(
            `https://api.github.com/${this.username}/repos`,
            {
                sub_id: this.username,
            }
        );
        return repos;
    }
}
