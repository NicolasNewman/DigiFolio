import { message } from 'antd';
import IAPI from './IAPI';

export interface GithubInfoModel {
    avatar_url: string;
    bio: string;
    company: string;
    created_at: string;
    followers: string;
    name: string;
    public_repos: number;
}

interface GithubCommits {
    commit: {
        author: {
            name: string;
            date: string;
        };
        message: string;
    };
}

export type GithubCommitsModel = GithubCommits[];

interface GithubRepo {
    fork: boolean;
    created_at: string;
    default_branch: string;
    description: string;
    forks: number;
    forks_count: number;
    full_name: string;
    languages: string;
    license: {
        key: string;
        name: string;
    };
    name: string;
    open_issues: number;
    open_issues_count: number;
    owner: {
        login: string;
    };
    private: boolean;
    url: string;
    branches_url: string;
    commits_url: string;
    data_commits: GithubCommitsModel;
    contributors_url: string;
    forks_url: string;
    issues_url: string;
}

export type GithubRepoModel = GithubRepo[];

export interface GithubDataModel {
    info: GithubInfoModel;
    repos: GithubRepoModel;
}

export type GithubData = GithubDataModel | null;

export default class GithubAPI extends IAPI<GithubDataModel> {
    private username: string;

    private map: Map<string, number>;

    private GITHUB_CLIENT_ID = '906c9a0acdc7858a7123';

    private GITHUB_CLIENT_SECRET = 'db15ee958316d61fea5cb26ea343670e5f9a5045';

    constructor(username: string) {
        super({
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
        });
        this.username = username;
        this.map = new Map<string, number>();
    }

    private filter_url(url: string): string {
        // replace {/foobar} from the string
        return url.replace(/\{\/.*\}/g, '');
    }

    async parse_api(): Promise<GithubDataModel> {
        const temp: GithubDataModel = {
            info: await this.fetch_user_info(),
            repos: await this.fetch_user_repos(),
        };
        return temp;
    }

    static verify_username(name: string) {
        if (name.length === 0 || name.length > 39) return false;
        const re = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
        const found = name.match(re);
        if (found === null || found === undefined) return false;
        return true;
    }

    async fetch_user_info() {
        console.log('client id ', this.GITHUB_CLIENT_ID);
        const info = await this.fetch<GithubInfoModel>(
            `https://api.github.com/users/${this.username}?client_id=${this.GITHUB_CLIENT_ID}&client_secret=${this.GITHUB_CLIENT_SECRET}`
        );
        return info;
    }

    async fetch_user_repos() {
        const repos = await this.fetch<GithubRepoModel>(
            `https://api.github.com/users/${this.username}/repos?client_id=${this.GITHUB_CLIENT_ID}&client_secret=${this.GITHUB_CLIENT_SECRET}`
        );

        try {
            repos.forEach(async (repo) => {
                const commits = await this.fetch<GithubCommitsModel>(
                    `${this.filter_url(repo.commits_url)}?client_id=${
                        this.GITHUB_CLIENT_ID
                    }&client_secret=${this.GITHUB_CLIENT_SECRET}`
                );
                repo.data_commits = commits;
            });
        } catch {
            message.error('Username does not exist');
            throw new Error('Username does not Exist');
        }
        return repos;
    }
}
