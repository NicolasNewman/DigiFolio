import Snoowrap from 'snoowrap';
import IAPI from './IAPI';

export interface RedditDataModel {
    something: any;
}

// export interface RedditUserInfo {
//     name: string;
// }

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
        this.r = new Snoowrap({
            userAgent: this.userAgent,
            clientId: this.clientId,
            clientSecret: this.clientSecret,
            refreshToken: this.token,
            // username: 'MassiveFire',
            // password: '',
        });
    }

    async parse_api(): Promise<RedditDataModel> {
        const temp: RedditDataModel = {
            something: 'smaple text',
        };
        // eslint-disable-next-line promise/catch-or-return
        //this.r.getMe().then(console.log);
        return temp;
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
