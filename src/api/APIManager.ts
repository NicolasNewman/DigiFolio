import { Store } from 'redux';
import { Alert, message } from 'antd';
import DataStore, { APIInfo, SchemaFields } from '../classes/DataStore';
import CatsAPI, { CatsAPIData } from './CatsAPI';
import GithubAPI, { GithubData } from './GithubAPI';
import SteamAPI, { SteamAPIData } from './SteamAPI';
import RedditAPI, { RedditAPIData } from './RedditAPI';
import { updateCatsAPI } from '../actions/catsapi';
import { updateGithubAPI } from '../actions/githubapi';
import { updateSteamAPI } from '../actions/steamapi';
import { updateRedditAPI } from '../actions/redditapi';
// eslint-disable-next-line import/order
import { error } from 'electron-log';

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
    [SchemaFields.steamAPI]: {
        api: SteamAPI;
        dispatch: (data: SteamAPIData) => void;
    } | null;
    [SchemaFields.redditAPI]: {
        api: RedditAPI;
        dispatch: (data: RedditAPIData) => void;
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
            [SchemaFields.steamAPI]: null,
            [SchemaFields.redditAPI]: null,
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

        // ==== init SteamAPI ====
        const steamAPIObjct = dataStore.getAPIInfo(SchemaFields.steamAPI);
        if (validateAPIObject(steamAPIObjct, ['key', 'username'])) {
            this.apis[SchemaFields.steamAPI] = {
                api: new SteamAPI(steamAPIObjct.key, steamAPIObjct.username),
                dispatch: (data: SteamAPIData) =>
                    this.reduxStore.dispatch(updateSteamAPI(data)),
            };
        }

        // ==== init RedditAPI ====
        const redditAPIObjct = dataStore.getAPIInfo(SchemaFields.redditAPI);
        if (validateAPIObject(redditAPIObjct, ['username', 'key', 'other'])) {
            this.apis[SchemaFields.redditAPI] = {
                api: new RedditAPI(
                    redditAPIObjct.username,
                    redditAPIObjct.key,
                    redditAPIObjct.other
                ),
                dispatch: (data: RedditAPIData) =>
                    this.reduxStore.dispatch(updateRedditAPI(data)),
            };
        }

        console.log(this.apis);
    }

    updateKey(api: SchemaFields, options: APIInfo, forced: boolean) {
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
            // options.key === null ||
            // options.key === undefined ||
            // options.key === ''
            (options.key === null ||
                options.key === undefined ||
                options.key === '') &&
            (options.username === null ||
                options.username === undefined ||
                options.username === '') &&
            (options.other === null ||
                options.other === undefined ||
                options.other === '')
        ) {
            // The user wants to delete an integration
            console.log(
                `The new values empty, removing the api and saved data`
            );
            this.apis[api]?.dispatch(null);
            this.apis[api] = null;
            this.dataStore.set(api, {});
            message.success('Removed stored API keys and saved data');
        } else if (
            !apiInfo ||
            !validateAPIObject(apiInfo, ['key']) ||
            apiInfo.key !== options.key ||
            apiInfo.username !== options.username ||
            apiInfo.other !== options.other ||
            forced === true
        ) {
            // There is no record of the api existing
            console.log(
                `The passed keys are different from the saved keys (or foced update), updating`
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
                        } else {
                            canCommit = true;
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
                        const usernameVerified = GithubAPI.verify_username(
                            options.key
                        );

                        console.log('username_verified is ', usernameVerified);

                        if (usernameVerified) {
                            canCommit = true;
                        } else {
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
                                })
                                .catch((err) => {
                                    console.log(err);
                                    canCommit = false;
                                });
                        }
                    } else {
                        message.error('A username must be specified!');
                        canCommit = false;
                    }
                    break;
                case SchemaFields.steamAPI:
                    if (options.key && options.username) {
                        // console.log(`key: ${options.key}`);
                        // console.log(`username: ${options.username}`);
                        if (!SteamAPI.verify_key(options.key)) {
                            message.error('Invalid Web API Key');
                            canCommit = false;
                        }
                        if (!SteamAPI.verify_username(options.username)) {
                            message.error('Invalid SteamID64');
                            canCommit = false;
                        }

                        if (canCommit) {
                            this.apis[SchemaFields.steamAPI] = {
                                api: new SteamAPI(
                                    options.key,
                                    options.username
                                ),
                                dispatch: (data: SteamAPIData) =>
                                    this.reduxStore.dispatch(
                                        updateSteamAPI(data)
                                    ),
                            };
                            this.apis[SchemaFields.steamAPI]?.api
                                .parse_api()
                                .then((data) => {
                                    this.apis[SchemaFields.steamAPI]?.dispatch(
                                        data
                                    );
                                    this.printState('State after parsing');
                                })
                                .catch((err) => {
                                    console.log(err);
                                    canCommit = false;
                                    message.error('Non-existent key');
                                });
                        }
                    } else {
                        message.error(
                            'Both a key and username must be specified!'
                        );
                        canCommit = false;
                    }
                    break;
                case SchemaFields.redditAPI:
                    if (options.key && options.username && options.other) {
                        if (!RedditAPI.verify_client_id(options.username)) {
                            message.error('Invalid Client ID');
                            canCommit = false;
                        }

                        if (!RedditAPI.verify_client_secret(options.key)) {
                            message.error('Invalid Client Secret');
                            canCommit = false;
                        }

                        if (!RedditAPI.verify_token(options.other)) {
                            message.error('Invalid Token');
                            canCommit = false;
                        }

                        if (canCommit) {
                            this.apis[SchemaFields.redditAPI] = {
                                api: new RedditAPI(
                                    options.username,
                                    options.key,
                                    options.other
                                ),
                                dispatch: (data: RedditAPIData) =>
                                    this.reduxStore.dispatch(
                                        updateRedditAPI(data)
                                    ),
                            };
                            this.apis[SchemaFields.redditAPI]?.api
                                .parse_api()
                                .then((data) => {
                                    this.apis[SchemaFields.redditAPI]?.dispatch(
                                        data
                                    );
                                    this.printState('State after parsing');
                                })
                                .catch((err) => {
                                    console.log(err);
                                    canCommit = false;
                                    message.error('Non-existent key');
                                });
                        }
                    } else {
                        message.error(
                            'All of the ID, secret, and token must be specified!'
                        );
                        canCommit = false;
                    }
                    break;
                default:
                    console.log('updateKey() defaulted on switch');
                    return;
            }

            if (canCommit) {
                this.dataStore.setAPIInfo(api, options);
                message.success('Updated API information');
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
