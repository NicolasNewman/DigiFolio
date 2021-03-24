import { Store } from 'redux';
import { message } from 'antd';
import DataStore, { APIInfo, SchemaFields } from '../classes/DataStore';
import CatsAPI, { CatsAPIData } from './CatsAPI';
import GithubAPI, { GithubData } from './GithubAPI';
import { updateCatsAPI } from '../actions/catsapi';
import { updateGithubAPI } from '../actions/githubapi';

const validateAPIObject = (
    obj: APIInfo,
    expected: (keyof APIInfo)[]
): boolean => {
    if (!obj) {
        return false;
    }

    let result = true;
    expected.forEach((key) => {
        if (!obj[key]) {
            result = false;
        } else if (obj[key] === '') {
            result = false;
        }
    });
    return result;
};

export interface APIMap {
    [SchemaFields.catsAPI]: {
        api: CatsAPI;
        dispatch: (data: CatsAPIData) => void;
    } | null;
    [SchemaFields.githubAPI]: {
        api: GithubAPI;
        dispatch: (data: GithubData) => void;
    } | null;
}

export default class APIManager {
    private dataStore: DataStore;

    private reduxStore: Store<any>;

    private apis: APIMap;

    constructor(dataStore: DataStore, reduxStore: Store<any>) {
        this.dataStore = dataStore;
        this.reduxStore = reduxStore;

        this.apis = {
            [SchemaFields.catsAPI]: null,
            [SchemaFields.githubAPI]: null,
        };

        // ===== init catsAPI =====
        const catsAPIObject = dataStore.getAPIInfo(SchemaFields.catsAPI);
        if (validateAPIObject(catsAPIObject, ['key', 'username'])) {
            this.apis[SchemaFields.catsAPI] = {
                api: new CatsAPI(catsAPIObject.key, catsAPIObject.username),
                dispatch: (data: CatsAPIData) =>
                    this.reduxStore.dispatch(updateCatsAPI(data)),
            };
        }

        // ==== init GithubAPi ====
        const githubAPIObjct = dataStore.getAPIInfo(SchemaFields.githubAPI);
        if (validateAPIObject(githubAPIObjct, ['key'])) {
            this.apis[SchemaFields.githubAPI] = {
                api: new GithubAPI(githubAPIObjct.username),
                dispatch: (data: GithubData) =>
                    this.reduxStore.dispatch(updateGithubAPI(data)),
            };
        }

        console.log(this.apis);
    }

    updateKey(api: SchemaFields, options: APIInfo) {
        // if (values.key && !this.apis[api]?.api.match_key(values.key)) {
        //     message.error(
        //         `Error: the key does not follow the proper format for ${api}`
        //     );
        //     return;
        // }

        const apiInfo = this.dataStore.getAPIInfo(api);
        let canCommit = true;

        // console.log(`The currently saved key is: ${savedKey}`);
        if (
            options.key === null ||
            options.key === undefined ||
            options.key === ''
        ) {
            // The user wants to delete an integration
            console.log(
                `The new key is empty, removing the api and saved data`
            );
            this.apis[api]?.dispatch(null);
            this.apis[api] = null;
            this.dataStore.set(api, {});
        } else if (
            !apiInfo ||
            !validateAPIObject(apiInfo, ['key']) ||
            apiInfo.key !== options.key
        ) {
            // There is no record of the api existing
            console.log(
                `The passed key is different from the saved key, updating`
            );
            console.log('api ', api);
            switch (api) {
                case SchemaFields.catsAPI:
                    if (options.key && options.username) {
                        if (!CatsAPI.verify_key(options.key)) {
                            message.error('The API key is not valid');
                            canCommit = false;
                        }
                        if (!CatsAPI.verify_username(options.username)) {
                            message.error('The username is not valid');
                            canCommit = false;
                        }

                        if (canCommit) {
                            this.apis[SchemaFields.catsAPI] = {
                                api: new CatsAPI(options.key, options.username),
                                dispatch: (data: CatsAPIData) =>
                                    this.reduxStore.dispatch(
                                        updateCatsAPI(data)
                                    ),
                            };
                            this.apis[SchemaFields.catsAPI]?.api
                                .parse_api()
                                .then((data) => {
                                    this.apis[SchemaFields.catsAPI]?.dispatch(
                                        data
                                    );
                                    this.printState('State after parsing');
                                });
                        }
                    } else {
                        message.error(
                            'Both a key and username must be specified!'
                        );
                        canCommit = false;
                    }
                    break;
                case SchemaFields.githubAPI:
                    if (options.key) {
                        if (!GithubAPI.verify_username(options.key)) {
                            message.error('The username is not valid');
                            canCommit = false;
                        }

                        if (canCommit) {
                            this.apis[SchemaFields.githubAPI] = {
                                api: new GithubAPI(options.key),
                                dispatch: (data: GithubData) =>
                                    this.reduxStore.dispatch(
                                        updateGithubAPI(data)
                                    ),
                            };
                            this.apis[SchemaFields.githubAPI]?.api
                                .parse_api()
                                .then((data) => {
                                    this.apis[SchemaFields.githubAPI]?.dispatch(
                                        data
                                    );
                                    this.printState('State after parsing...');
                                });
                        }
                    } else {
                        message.error('A username must be specified!');
                        canCommit = false;
                    }
                    break;
                default:
                    return;
            }

            if (canCommit) {
                this.dataStore.setAPIInfo(api, options);
                message.success('Successfully updated API information');
            }
        } else {
            console.log('The saved and new key are the same. Doing nothing');
        }
        this.printState('State after update...');
    }

    printState(header = 'Redux state: ') {
        console.log(header);
        console.log(this.reduxStore.getState());
    }
}
