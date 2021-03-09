import DataStore, { SchemaFields } from '../classes/DataStore';
import CatsAPI from './CatsAPI';

export interface APIMap {
    catsAPI: CatsAPI | null;
}

export default class APIManager {
    private dataStore: DataStore;

    private apis: APIMap;

    constructor(dataStore: DataStore) {
        this.dataStore = dataStore;
        this.apis = {
            catsAPI: null,
        };
        const catsAPIKey = dataStore.get(SchemaFields.catsAPIKey);
        if (catsAPIKey) {
            this.apis.catsAPI = new CatsAPI(catsAPIKey, 'quantum');
        }

        console.log(this.apis);
    }

    getAPIs() {
        return this.apis;
    }
}
