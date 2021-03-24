import { APIInfo } from '../classes/DataStore';
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

export interface GithubDataModel {
    info: GithubInfoModel;
    repos: any;
}

export type GithubData = GithubDataModel | null;

export default class GithubAPI extends IAPI<GithubDataModel> {
    private username: string;

    constructor(username: string) {
        super({
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
        });
        this.username = username;
    }

    async parse_api(): Promise<GithubDataModel> {
        // const userInfo = await this.fetch_user_info();
        const temp: GithubDataModel = {
            info: await this.fetch_user_info(),
            repos: await this.fetch_user_repos(),
        };
        return temp;
    }

    static verify_username(name: string) {
        if (name.length === 0 || name.length > 39) return false;
        return /(?:(?![-]{2})[\w\d-])+/g.test(name);
        // const url = `https://api.github.com/users/${name}`;
        // const res = await fetch(url);
        // if (res.message && res.message === 'Not Found') {
        //     return false;
        // }
        // return true;
    }

    async fetch_user_info() {
        const info = await this.fetch<GithubInfoModel>(
            `https://api.github.com/users/${this.username}`
        );
        return info;
    }

    async fetch_user_repos() {
        const repos = await this.fetch(
            `https://api.github.com/users/${this.username}/repos`
        );
        return repos;
    }
}
