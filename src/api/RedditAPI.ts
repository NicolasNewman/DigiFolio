import IAPI from './IAPI';

export interface RedditDataModel {
    something: any;
}

export type RedditAPIData = RedditDataModel | null;

export default class RedditAPI extends IAPI<RedditDataModel> {
    private userAgent: string;

    private clientId: string;

    private clientSecret: string;

    private token: string;

    constructor(clientId: string, clientSecret: string, token: string) {
        super({ 'x-webapi-key': clientId });
        this.userAgent = 'DigiFolio';
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.token = token;
    }

    async parse_api(): Promise<RedditDataModel> {
        const temp: RedditDataModel = {
            something: 'smaple text',
        };
        return temp;
    }

    static verify_client_id(clientId: string): boolean {
        return true;
    }

    static verify_client_secret(clientSecret: string): boolean {
        return true;
    }

    static verify_token(token: string): boolean {
        return true;
    }
}
