// type SteamAPIData = string | number;

// export default SteamAPIData;

import IAPI from './IAPI';

const API_KEY_SIZE = 32;
const STEAM_ID64_SIZE = 17;

export interface SteamDataModel {
    //info: SteamInfoModel;
    user: PlayerSummaryModel;
    friends: SteamFriendsModel;
    library: SteamLibraryModel;
}

export type SteamAPIData = SteamDataModel | null;

/**
 * https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=XXX&steamids=XXX
 *
 * @returns \{ response: players: PlayerSummaryModel[] }
 *
 */
export interface PlayerSummaryModel {
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
    // gameserverip: string; //ip + port of current steam matchmaking
    // gameextrainfo: string; //name of current game being played
    loccountrycode?: string; //2 char country code
    locstatecode?: string; //2 char state code
    loccityid?: number;
}

/**
 * https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=XXX&steamid=XXX
 *
 * @returns \{ friendslist: SteamFriendsModel }
 */
export interface SteamFriendsModel {
    friends: {
        steamid: number; //steamid64
        relationship: string;
        friend_since: number; //unix time stamp
    }[];
}

export interface Temp {
    bob: string;
}
/**
 * https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=XXX&steamid=XXX&include_appinfo=1&include_played_free_games=1
 *
 * @returns \{ response: SteamOwnedGamesModel }
 */
export interface SteamLibraryModel extends Temp {
    game_count: number;
    games: {
        appid: number; //need to reference this to make a string from it somehow
        name: string;
        playtime_forever: number; //total playtime
        img_icon_url: string; //alphanum hash
        img_logo_url: string; //alphanum hash (not whole url)
        playtime_2weeks?: number; //playtime last 2 weeks (minutes)
        playtime_windows_forever: number;
        playtime_mac_forever: number;
        playtime_linux_forever: number;
    }[];
}

/**
 * https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=XXX&steamid=XXX&appid=XXX
 *
 * @returns \{ playerstats: SteamPlayerAchievementsModel }
 * @error \{ playerstats: { error: string, success: boolean } }
 * @causes private profile
 */
export interface SteamPlayerAchievementsModel {
    gameName: string;
    achievements: {
        apiname: string;
        achieved: boolean;
        unlocktime: number;
        // description: string;
    }[];
}

/**
 * https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=XXX&appid=XXX
 *
 * @returns \{ game: SteamGameSchema }
 */
export interface SteamGameSchema {
    gameName: string;
    gameVersion: string;
    availableGameStats: {
        achievements: {
            name: string;
            displayName: string;
            description: string;
            hidden: number;
            icon: string;
            iconGray: string;
        }[];
    };
}

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
            friends: await this.fetch_friends(),
            library: await this.fetch_library(),
        };
        return temp;
    }

    async fetch_user() {
        const data = await this.fetch<{
            response: { players: PlayerSummaryModel[] };
        }>( //how does this.fetch work exactly?
        `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/`, {
            key: this.key,
            steamids: this.username,
        });
        return data.response.players[0];
    }

    async fetch_friends() {
        const data = await this.fetch<{
            friendslist: SteamFriendsModel;
        }>( //how does this.fetch work exactly?
        `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/`, {
            key: this.key,
            steamid: this.username,
            relationship: 'friend',
        });
        return data.friendslist;
    }

    async fetch_library() {
        const data = await this.fetch<{
            response: SteamLibraryModel;
        }>( //how does this.fetch work exactly?
        `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`, {
            key: this.key,
            steamid: this.username,
        });
        //console.log(data);
        return data.response;
    }

    async fetch_player_achievement_for_game(appid: string) {
        const data = await this.fetch<{
            playerstats: SteamPlayerAchievementsModel;
        }>(
            'https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/',
            {
                key: this.key,
                steamid: this.username,
                appid,
            }
        );

        return data.playerstats;
    }

    async fetch_game_schema(appid: string) {
        const data = await this.fetch<{
            game: SteamGameSchema;
        }>(
            'https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/',
            {
                key: this.key,
                steamid: this.username,
                appid,
            }
        );

        return data.game;
    }
}
