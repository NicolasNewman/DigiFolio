// type SteamAPIData = string | number;

// export default SteamAPIData;

import IAPI from './IAPI';

const API_KEY_SIZE = 32;
const STEAM_ID64_SIZE = 17;

export interface SteamDataModel {
    info: SteamInfoModel;
}

export interface SteamInfoModel {
    web_api_key: string;
    steamID64: string;
}

export type SteamAPIData = SteamDataModel | null;

export default class SteamAPI extends IAPI<SteamDataModel> {
    private username: string;

    constructor(key: string, username: string) {
        //what do i put in here
        super({ 'x-webapi-key': key });
        this.username = username;
    }

    static verify_key(key: string): boolean {
        // eslint-disable-next-line no-param-reassign
        key = key.toUpperCase();
        if (key.length !== API_KEY_SIZE) {
            return false;
        }
        return /[A-z0-9]/g.test(key);
    }

    static verify_username(username: string): boolean {
        if (username.length !== STEAM_ID64_SIZE) {
            return false;
        }
        return /[0-9]/g.test(username);
    }

    async parse_api(): Promise<SteamDataModel> {
        const temp: SteamDataModel = {
            info: await this.fetch_user_info(),
        };
        return temp;
    }

    fetch_user_info() {
        const info = null; //add fetching logic here using web api key
        return info;
    }
}

// const API_KEY_SIZE = 32;
// const STEAM_ID64_SIZE = 17;

// function verifySteamAPIKey(key) {
//     if (typeof key !== 'string') {
//         return false;
//     }
//     key = key.toUpperCase();
//     if (key.length !== API_KEY_SIZE) {
//         return false;
//     }
//     // eslint-disable-next-line no-plusplus
//     for (let i = 0; i < API_KEY_SIZE; i++) {
//         // eslint-disable-next-line use-isnan
//         if (parseInt(key[i]) === NaN && !(key[i] >= 'A' && key[i] <= 'Z')) {
//             //not alphanum
//             return false;
//         }
//     }
//     return true;
// }

// function verifySteamID64(id) {
//     if (typeof id !== 'string') {
//         return false;
//     }
//     if (id.length !== STEAM_ID64_SIZE) {
//         return false;
//     }
//     // eslint-disable-next-line no-plusplus
//     for (let i = 0; i < API_KEY_SIZE; i++) {
//         // eslint-disable-next-line use-isnan
//         if (parseInt(id[i]) === NaN) {
//             //not number
//             return false;
//         }
//     }
//     //more code to check if the ID exists here
//     //
//     //
//     return true;
// }
