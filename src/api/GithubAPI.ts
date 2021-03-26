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

interface GithubCommits {}

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

    constructor(username: string) {
        super({
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
        });
        this.username = username;
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

    async fetch_user_repos() {
        const repos = await this.fetch<GithubRepoModel>(
            `https://api.github.com/users/${this.username}/repos`
        );
        const branches = await this.fetch(
            this.filter_url(repos[0].branches_url)
        );
        console.log(branches);
        const commits = await this.fetch<GithubCommitsModel>(
            this.filter_url(repos[0].commits_url)
        );
        repos[0].data_commits = commits;
        return repos;
    }

    // async fetch_user_info() {
    //     const info = await this.fetch<GithubDataModel>(
    //         `https://api.github.com/users/${this.username}`
    //     );
    //     return info;
    // }

    // async fetch_user_name() {
    //     const res = await fetch(
    //         `https://api.github.com/users/${this.username}`
    //     );
    //     const response = await res.json();
    //     return response.name;
    // }

    // async fetch_avatar_url() {
    //     const res = await fetch(
    //         `https://api.github.com/users/${this.username}`
    //     );
    //     const response = await res.json();
    //     return response.avatar_url;
    // }

    // async fetch_user_bio() {
    //     const res = await fetch(
    //         `https://api.github.com/users/${this.username}`
    //     );
    //     const response = await res.json();
    //     return response.bio;
    // }

    // async fetch_user_company() {
    //     const res = await fetch(
    //         `https://api.github.com/users/${this.username}`
    //     );
    //     const response = await res.json();
    //     return response.company;
    // }

    // async fetch_created_at() {
    //     const res = await fetch(
    //         `https://api.github.com/users/${this.username}`
    //     );
    //     const response = await res.json();
    //     return response.created_at;
    // }

    // async fetch_user_repos() {
    //     const repos = await this.fetch(
    //         `https://api.github.com/users/${this.username}/repos`
    //     );
    //     return repos;
    // }

    // async fetch_user_followers() {
    //     const followers = await this.fetch(
    //         `https://api.github.com/users/${this.username}/followers`
    //     );
    //     return followers;
    // }

    // async fetch_repo_commits(repo_id) {
    //     const commits = await this.fetch(
    //         `https://api.github.com/users/${this.username}/${repo_id}/commits`
    //     );
    //     return commits;
    // }
}
