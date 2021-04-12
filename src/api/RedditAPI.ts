import Snoowrap, { RedditUser } from 'snoowrap';
import IAPI from './IAPI';

export interface RedditDataModel {
    something: any;
    profile: RedditUserInfo;
    karma_distribution: RedditKarmaBySub[];
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
        const temp: RedditDataModel = {
            something: 'smaple text',
            profile: await this.fetch_profile(),
            karma_distribution: await this.fetch_karma_distribution(),
        };
        // eslint-disable-next-line promise/catch-or-return
        //this.r.getKarma().then(console.log);
        return temp;
    }

    async fetch_profile(): Promise<RedditUserInfo> {
        const temp: any = await new Promise((resolve) =>
            this.r.getMe().then(resolve)
        );
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
