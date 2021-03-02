import IAPI from './IAPI';

export interface CatsAPIDataModel {
    info: string;
}

export default class CatsAPI extends IAPI<CatsAPIDataModel> {
    private username: string;

    constructor(name: string, key: string, username: string) {
        super(name, key);
        this.username = username;
    }

    // eslint-disable-next-line class-methods-use-this
    async parse_api(): Promise<CatsAPIDataModel> {
        const temp: CatsAPIDataModel = {
            info: 'Test',
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
