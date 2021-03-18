import IAPI from './IAPI';

export interface GithubDataModel {
    info: any;
    repos: any;
}

export type GithubData = GithubDataModel | null;

export default class GithubAPI extends IAPI<GithubDataModel> {
    private username: string;

    constructor(authToken: string, username: string) {
        super(
            {
                'Content-Type': 'application/json',
                'x-api-key': authToken,
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

    async parse_api(): Promise<GithubDataModel> {
        const temp: GithubDataModel = {
            info: await this.fetch_user_info,
            repos: await this.fetch_user_repos,
        };
        return temp;
    }

    match_key(_key: string): boolean {
        //1c4fb1a1c2b92e14710c6358b17e2e21470b00cb
        const isValid = /[a-z0-9]{40}/g.test(_key);
        return isValid;
    }

    async fetch_user_info() {
        const info = await this.fetch(
            `https://api.github.com/users/${this.username}`,
            {
                sub_id: this.username,
            }
        );
        return info;
    }

    async fetch_user_repos() {
        const repos = await this.fetch(
            `https://api.github.com/users/${this.username}/repos`,
            {
                sub_id: this.username,
            }
        );
        return repos;
    }
}
