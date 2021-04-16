import Snoowrap, { RedditUser, Submission } from 'snoowrap';
import IAPI from './IAPI';

export interface RedditDataModel {
    something: any;
    profile: RedditUserInfo;
    karma_distribution: RedditKarmaBySub[];
    submissions: RedditSubmission[]; //recent posts
    comments: RedditComment[];
}

export interface RedditUserInfo {
    username: string; //name
    avatar: string; //icon_img link
    total_karma: number;
    coins: number;
    num_friends: number;
}

export interface RedditKarmaBySub {
    subreddit: string;
    comment_karma: number;
    link_karma: number;
    total_sub_karma: number;
}

export interface RedditSubmission {
    subreddit: string;
    submission_id: string; //id
    title: string;
    is_self: boolean; //true if text post, false if else
    text: string;
    media: string; //url to self if text post, url to media if else
    updoots: number;
    downdoots: number;
    //comments:
}

export interface RedditComment {
    comment_id: string; //link_id, hopefully
    subreddit: string; //subreddit_name_prefixed
    parent_post_title: string; //link_title
    comment: string; //body
    updoots: number;
    downdoots: number;
    //award_count: number;
    //awards: []
}

export type RedditAPIData = RedditDataModel | null;

export default class RedditAPI extends IAPI<RedditDataModel> {
    private userAgent: string;

    private clientId: string;

    private clientSecret: string;

    private token: string;

    private r: Snoowrap;

    constructor(clientId: string, clientSecret: string, token: string) {
        super({ 'x-webapi-key': clientId });
        this.userAgent = 'DigiFolio';
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.token = token;
        // console.log(this.userAgent);
        // console.log(this.clientId);
        // console.log(this.clientSecret);
        // console.log(this.token);
        this.r = new Snoowrap({
            userAgent: this.userAgent,
            clientId: this.clientId,
            clientSecret: this.clientSecret,
            refreshToken: this.token,
        });
        this.r.config({ proxies: false });
    }

    async parse_api(): Promise<RedditDataModel> {
        const me = await this.fetch_me();
        const temp: RedditDataModel = {
            something: 'smaple text',
            profile: await this.parse_profile(me),
            karma_distribution: await this.fetch_karma_distribution(),
            submissions: await this.fetch_submissions(me),
            comments: await this.fetch_comments(me),
        };
        // eslint-disable-next-line promise/catch-or-return
        //this.r.getSubmission('2np694').title.then(console.log);
        return temp;
    }

    // async fetch_profile(): Promise<RedditUserInfo> {
    //     const temp: any = await new Promise((resolve) =>
    //         this.r.getMe().then(resolve)
    //     );
    //     const data: RedditUserInfo = {
    //         username: temp.subreddit.display_name.display_name_prefixed,
    //         avatar: temp.icon_img,
    //         total_karma: temp.total_karma,
    //         coins: temp.coins,
    //         num_friends: temp.num_friends,
    //     };
    //     return data;
    // }

    async fetch_me(): Promise<any> {
        const me: any = await new Promise((resolve) =>
            this.r.getMe().then(resolve)
        );
        return me;
    }

    async parse_profile(temp: any): Promise<RedditUserInfo> {
        // const temp: any = await new Promise((resolve) =>
        //     this.r.getMe().then(resolve)
        // );
        const data: RedditUserInfo = {
            username: temp.subreddit.display_name.display_name_prefixed,
            avatar: temp.icon_img,
            total_karma: temp.total_karma,
            coins: temp.coins,
            num_friends: temp.num_friends,
        };
        return data;
    }

    async fetch_karma_distribution(): Promise<RedditKarmaBySub[]> {
        const temp = await this.r.getKarma().then((karma) => {
            return karma;
        });
        const data: RedditKarmaBySub[] = [];
        for (let i = 0; i < temp.length; i += 1) {
            data.push({
                subreddit: temp[i].sr.display_name,
                comment_karma: temp[i].comment_karma,
                link_karma: temp[i].link_karma,
                total_sub_karma: temp[i].comment_karma + temp[i].link_karma,
            });
        }
        return data;
    }

    async fetch_submissions(me: RedditUser): Promise<RedditSubmission[]> {
        // const me: RedditUser = await new Promise((resolve) =>
        //     this.r.getMe().then(resolve)
        // ); //need to fix this later on
        const temp = await (await me.getSubmissions())
            .fetchAll()
            .then((submissions) => {
                return submissions;
            });
        const data: RedditSubmission[] = [];
        for (let i = 0; i < temp.length; i += 1) {
            data.push({
                subreddit: temp[i].subreddit.display_name,
                submission_id: temp[i].id,
                title: temp[i].title,
                is_self: temp[i].is_self,
                text: temp[i].selftext,
                media: temp[i].url,
                updoots: temp[i].ups,
                downdoots: temp[i].downs,
            });
        }
        return data;
    }

    async fetch_comments(me: RedditUser): Promise<RedditComment[]> {
        const temp = await (await me.getComments())
            .fetchAll()
            .then((comments) => {
                return comments;
            });
        const data: RedditComment[] = [];
        for (let i = 0; i < temp.length; i += 1) {
            data.push({
                comment_id: temp[i].link_id,
                subreddit: temp[i].subreddit_name_prefixed,
                parent_post_title: temp[i].link_title,
                comment: temp[i].body,
                updoots: temp[i].ups,
                downdoots: temp[i].downs,
            });
        }
        return data;
    }

    static verify_client_id(clientId: string): boolean {
        if (clientId.length !== 14) {
            return false;
        }
        return /[A-z0-9]/g.test(clientId);
    }

    static verify_client_secret(clientSecret: string): boolean {
        if (clientSecret.length < 27) {
            return false;
        }
        return true;
    }

    static verify_token(token: string): boolean {
        //not really sure the format just yet
        return true;
    }
}
