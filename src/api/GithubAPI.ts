import IAPI, { Field } from './IAPI';

export interface GithubDataModel {
    info: string;
    commitData: any;
    contributionData: any;
}

export type GithubData = GithubDataModel | null;

export default class GithubAPI extends IAPI<GithubDataModel> {
    private username: string;

    constructor(key: string, username: string) {
        super(
            {
                'Content-Type': 'application/json',
                'x-api-key': key,
            },
            [
                {
                    name: 'username',
                    value: username,
                    regex: /.*/g,
                    errorMsg: 'Username must ',
                },
            ]
        );
        this.username = username;
    }
}
