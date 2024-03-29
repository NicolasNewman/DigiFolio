import Store from 'electron-store';

export interface APIInfo {
    key: string;
    username: string;
    // clientId: string;
    // clientSecret: string;
    other: string;
}
export enum SchemaFields {
    // catsAPIKey = 'catsAPIKey',
    // catsAPIUser = 'catsAPIUser',
    // githubAPIKey = 'githubAPIKey',
    // steamAPIKey = 'steamAPIKey',
    // steamAPIUser = 'steamAPIUser',
    catsAPI = 'catsAPI',
    githubAPI = 'githubAPI',
    steamAPI = 'steamAPI',
    redditAPI = 'redditAPI',
}

/**
 * Wrapper for electron-store\'s Store object
 */
export default class DataStore {
    private store;

    private schema;

    /**
     * Creates the data schema and initializes it
     * @constructor
     */
    constructor(key) {
        this.schema = {
            // catsAPIKey: {
            //     type: 'string',
            //     description: 'The API key used for the catsapi',
            // },
            // catsAPIUser: {
            //     type: 'string',
            //     description: 'Username used for the catsapi',
            // },
            // githubAPIKey: {
            //     type: 'string',
            //     description: 'The API key used for Github',
            // },
            // steamAPIKey: {
            //     type: 'string',
            //     description: 'The API key used for Steam',
            // },
            // steamAPIUser: {
            //     type: 'string',
            //     description: 'SteamID of the user',
            // },
            catsAPI: {
                type: 'object',
                description: 'The object containing the cats API key',
            },
            githubAPI: {
                type: 'object',
                description: 'The object containing github key information',
            },
            steamAPI: {
                type: 'object',
                description: 'The object containing steam key information',
            },
            redditAPI: {
                type: 'object',
                description:
                    'The object containing reddit id, secret, and token information',
            },
            reduxSave: {
                type: 'object',
                description: 'The saved state of the redux store',
            },
            key: {
                type: 'string',
                description:
                    'The API key used to authenticate with Google cloud',
            },
            validKey: {
                type: 'boolean',
                description: 'Wheather or not the API key is valid',
                default: false,
            },
            defaultPath: {
                type: 'string',
                description:
                    'The default path to open to when the program launches',
                default: 'C:\\Users\\Nicolas Newman\\Documents',
            },
            uiTheme: {
                type: 'string',
                enum: ['light', 'dark'],
                default: 'light',
                description: 'The targeted theme for the UI',
            },
        };

        this.store = new Store({
            schema: this.schema,
            encryptionKey: key,
        });
        // this.schema.key = key;
    }

    /**
     * Updates the value of the given key in the Store
     * @param {string} key - the key the data is stored under
     * @param {*} value - the new value for the data
     */
    set = (key: string, value: any): void => {
        if (this.schema[key]) {
            // console.log('contains key ', key);
            this.store.set(key, value);
        }
    };

    /**
     * @param {string} key - the key the data is stored under
     * @returns {*} the information stored at the given key
     */
    get = (key: string): any => {
        return this.schema[key] ? this.store.get(key) : undefined;
    };

    getAPIInfo = (api: SchemaFields): APIInfo => {
        return this.schema[api] ? this.store.get(api) : undefined;
    };

    setAPIInfo = (api: SchemaFields, value: APIInfo) => {
        // const reduxSave = this.get('reduxSave');
        // reduxSave[api] = value;
        this.store.set(api, value);
    };
}
