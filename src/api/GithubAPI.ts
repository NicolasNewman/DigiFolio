import { APIInfo } from '../classes/DataStore';
import IAPI from './IAPI';

export interface GithubInfoModel {
    info: GithubInfoModel;
    avatar_url: string;
    bio: string;
    company: string;
    created_at: string;
    followers: any;
    name: string;
    public_repos: any;
}

export type GithubData = GithubInfoModel | null;

export default class GithubAPI extends IAPI<GithubInfoModel> {
    private username: string;

    constructor(username: string) {
        super({
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
        });
        this.username = username;
    }

    async parse_api(): Promise<GithubInfoModel> {
        const temp: GithubInfoModel = {
            info: await this.fetch_user_info(),
            avatar_url: await this.fetch_avatar_url(),
            bio: await this.fetch_user_bio(),
            company: await this.fetch_user_company(),
            created_at: await this.fetch_created_at(),
            followers: await this.fetch_user_followers(),
            name: await this.fetch_user_name(),
            public_repos: await this.fetch_user_repos(),
        };
        return temp;
    }

    static async verify_username(name: string) {
        if (name.length === 0 || name.length > 39) return false;
        if (/^(?:(?![-]{2})[\w\d-])+$/g.test(name) === false) return false;
        const url = `https://api.github.com/users/${name}`;
        console.log('response being fetched');
        const res = await fetch(url);
        console.log('returning ', res.status === 404);
        return !(res.status === 404);
    }

    async fetch_user_info() {
        const info = await this.fetch<GithubInfoModel>(
            `https://api.github.com/users/${this.username}`
        );
        return info;
    }

    async fetch_user_name() {
        const res = await fetch(
            `https://api.github.com/users/${this.username}`
        );
        const response = await res.json();
        return response.name;
    }

    async fetch_avatar_url() {
        const res = await fetch(
            `https://api.github.com/users/${this.username}`
        );
        const response = await res.json();
        return response.avatar_url;
    }

    async fetch_user_bio() {
        const res = await fetch(
            `https://api.github.com/users/${this.username}`
        );
        const response = await res.json();
        return response.bio;
    }

    async fetch_user_company() {
        const res = await fetch(
            `https://api.github.com/users/${this.username}`
        );
        const response = await res.json();
        return response.company;
    }

    async fetch_created_at() {
        const res = await fetch(
            `https://api.github.com/users/${this.username}`
        );
        const response = await res.json();
        return response.created_at;
    }

    async fetch_user_repos() {
        const repos = await this.fetch(
            `https://api.github.com/users/${this.username}/repos`
        );
        return repos;
    }

    async fetch_user_followers() {
        const followers = await this.fetch(
            `https://api.github.com/users/${this.username}/followers`
        );
        return followers;
    }

    async fetch_repo_commits(repo_id) {
        const commits = await this.fetch(
            `https://api.github.com/users/${this.username}/${repo_id}/commits`
        );
        return commits;
    }
}
