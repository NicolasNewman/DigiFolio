import IAPI from './IAPI';

export interface CatsAPIDataModel {
    info: string;
    voteData: any;
}

export type CatsAPIData = CatsAPIDataModel | null;

export default class CatsAPI extends IAPI<CatsAPIDataModel> {
    private username: string;

    constructor(key: string, username: string) {
        super(key);
        this.username = username;
    }

    async parse_api(): Promise<CatsAPIDataModel> {
        const temp: CatsAPIDataModel = {
            info: 'Test',
            voteData: await this.process_votes(),
        };
        return temp;
    }

    async process_votes() {
        const votes = await this.fetch('https://api.thecatapi.com/v1/votes', {
            sub_id: this.username,
        });
        return votes;
    }
}
