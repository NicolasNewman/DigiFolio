import IAPI from './IAPI';

export interface CatsAPIDataModel {
    info: string;
    voteData: any;
}

export default class CatsAPI extends IAPI<CatsAPIDataModel> {
    private username: string;

    constructor(key: string, username: string) {
        super(key);
        this.username = username;
    }

    // eslint-disable-next-line class-methods-use-this
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
