import { Store } from 'redux';
import { message } from 'antd';
import DataStore, { SchemaFields } from '../classes/DataStore';
import CatsAPI, { CatsAPIData } from './CatsAPI';
import { updateCatsAPI } from '../actions/catsapi';

export interface APIMap {
    [SchemaFields.catsAPIKey]: {
        api: CatsAPI;
        dispatch: (data: CatsAPIData) => void;
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
            [SchemaFields.catsAPIKey]: null,
        };

        // ===== init catsAPI =====
        const catsAPIKey = dataStore.get(SchemaFields.catsAPIKey);
        if (catsAPIKey && catsAPIKey !== '') {
            this.apis[SchemaFields.catsAPIKey] = {
                api: new CatsAPI(catsAPIKey, 'quantum'),
                dispatch: (data: CatsAPIData) =>
                    this.reduxStore.dispatch(updateCatsAPI(data)),
            };
        }

        console.log(this.apis);
    }

    updateKey(api: SchemaFields, key: string | null = null) {
        if (key && !this.apis[api]?.api.match_key(key)) {
            message.error(
                `Error: the key does not follow the proper format for ${api}`
            );
            return;
        }

        const savedKey = this.dataStore.get(api);
        console.log(`The currently saved key is: ${savedKey}`);
        if (key === null) {
            console.log(
                `The new key is empty, removing the api and saved data`
            );
            switch (api) {
                case SchemaFields.catsAPIKey:
                    this.apis[SchemaFields.catsAPIKey]?.dispatch(null);
                    break;
                default:
                    return;
            }
            this.apis[api] = null;
            this.dataStore.set(api, '');
        } else if (!savedKey || key !== savedKey) {
            console.log(
                `The passed key is different from the saved key, updating`
            );
            switch (api) {
                case SchemaFields.catsAPIKey:
                    this.apis[SchemaFields.catsAPIKey] = {
                        api: new CatsAPI(key, 'quantum'),
                        dispatch: (data: CatsAPIData) =>
                            this.reduxStore.dispatch(updateCatsAPI(data)),
                    };
                    this.apis[SchemaFields.catsAPIKey]?.api
                        .parse_api()
                        .then((data) => {
                            this.apis[SchemaFields.catsAPIKey]?.dispatch(data);
                            this.printState('State after parsing...');
                        });
                    break;
                default:
                    return;
            }
            this.dataStore.set(api, key);
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
