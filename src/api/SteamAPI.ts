// type SteamAPIData = string | number;

// export default SteamAPIData;

import IAPI from './IAPI';

const API_KEY_SIZE = 32;
const STEAM_ID64_SIZE = 17;

export interface SteamDataModel {
    //info: SteamInfoModel;
    user: SteamUserModel;
    // friends: SteamFriendModel[];
    // library: SteamLibraryModel;
}

// export interface SteamInfoModel {
//     web_api_key: string;
//     steamID64: string;
// }

export interface SteamUserModel {
    //publicly available info
    steamid: number; //steamid64
    personaname: string; //gamertag
    profileurl: string;
    avatarfull: string; //link to a jpg
    personastate: number; //0 offline, 1 online, 2 busy, 3 away, 4 snooze, 5 trade, 6 play
    communityvisibilitystate: number; //1 private, 3 public (dont ask why its like this)
    profilestate: boolean; //whether or not there is a community profile
    lastlogoff: number; //unix time stamp
    //private info, optional
    realname: string;
    primaryclanid: number; //primary group on community profile
    timecreated: number; //account creation unix time
    gameserverip: string; //ip + port of current steam matchmaking
    gameextrainfo: string; //name of current game being played
    loccountrycode: string; //2 char country code
    locstatecode: string; //2 char state code
    loccityid: number;
}

export interface SteamFriendModel {
    steamid: number; //steamid64
    relationship: string;
    friend_since: number; //unix time stamp
}

export interface SteamLibraryModel {
    game_count: number;
    games: SteamGameModel[];
}

export interface SteamGameModel {
    appid: number; //need to reference this to make a string from it somehow
    name: string;
    img_icon_url: string; //alphanum hash
    img_logo_url: string; //alphanum hash (not whole url)
    playtime_2weeks: number; //playtime last 2 weeks (minutes)
    playtime_forever: number; //total playtime
    playtime_windows_forever: number;
    playtime_mac_forever: number;
    playtime_linux_forever: number;
}

export type SteamAPIData = SteamDataModel | null;

export default class SteamAPI extends IAPI<SteamDataModel> {
    private key: string;

    private username: string;

    constructor(key: string, username: string) {
        //what do i put in here
        super({ 'x-webapi-key': key });
        this.key = key;
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
            //info: await this.fetch_info(),
            user: await this.fetch_user(),
        };
        return temp;
    }

    async fetch_user() {
        const data = await this.fetch<{
            response: { players: SteamUserModel[] };
        }>( //how does this.fetch work exactly?
        `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/`, {
            key: this.key,
            steamids: this.username,
        });
        return data.response.players[0];
    }
}

// console.log('testing');
// let something: SteamAPI = new SteamAPI(
//     '0FEB75D2E33E3CBA12F80C0B33745137',
//     '76561198175022679'
// );
// something.fetch_user();
// console.log('persona name:');
// console.log(something.data?.user.personaname);

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
