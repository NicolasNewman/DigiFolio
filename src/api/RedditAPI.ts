import Snoowrap, { RedditUser } from 'snoowrap';
import IAPI from './IAPI';

export interface RedditDataModel {
    something: any;
    profile: RedditUserInfo;
}

export interface RedditUserInfo {
    username: string; //name
    avatar: string; //icon_img link
    total_karma: number;
    coins: number;
    num_friends: number;
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
    }

    async parse_api(): Promise<RedditDataModel> {
        const temp: RedditDataModel = {
            something: 'smaple text',
            profile: await this.fetch_profile(),
        };
        return temp;
    }

    async fetch_profile(): Promise<RedditUserInfo> {
        const temp = await new Promise((resolve) =>
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
