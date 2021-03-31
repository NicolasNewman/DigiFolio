/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
// type SteamAPIData = string | number;

// export default SteamAPIData;

import IAPI from './IAPI';

const API_KEY_SIZE = 32;
const STEAM_ID64_SIZE = 17;

export interface SteamDataModel {
    //info: SteamInfoModel;
    user: PlayerSummaryModelMerge;
    friends: SteamFriendsModel;
    library: SteamLibraryModelMerge;
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

export type PlayerSummaryModelMerge = PlayerSummaryModel &
    SteamPlayerLevelModel;

/**
 * https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=XXX&steamid=XXX
 *
 * @returns \{ response: SteamPlayerLevelModel }
 *
 */
export interface SteamPlayerLevelModel {
    player_level: number;
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
        avatar_url: string;
    }[];
}

/**
 * https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=XXX&steamid=XXX&include_appinfo=1&include_played_free_games=1
 *
 * @returns \{ response: SteamOwnedGamesModel }
 */
export interface SteamLibraryModel {
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

export type SteamLibraryModelMerge = {
    games: {
        achievements: {
            achievement_id: string;
            achievement_name: string;
            achievement_description: string;
            achievement_icon: string;
            achievement_icon_gray: string;
            achievement_hidden: number;
            achievement_achieved: boolean;
            unlocktime: number;
        }[];
    }[];
} & SteamLibraryModel;

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

        const level = await this.fetch_user_level();

        let user = data.response.players[0] as PlayerSummaryModelMerge;
        user = { ...user, ...level };

        return user;
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
        for (let i = 0; i < data.friendslist.friends.length; i++) {
            const frienddata = await this.fetch<{
                response: { players: PlayerSummaryModel[] };
            }>( //how does this.fetch work exactly?
                `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/`,
                {
                    key: this.key,
                    steamids: data.friendslist.friends[i].steamid,
                }
            );
            data.friendslist.friends[i].avatar_url =
                frienddata.response.players[0].avatarfull;
        }
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

        const library: SteamLibraryModelMerge = data.response as SteamLibraryModelMerge;

        // loop through each game
        for (let i = 0; i < library.games.length; i++) {
            const game = library.games[i];
            game.achievements = [];

            // get the player achievement data for that game
            const playerAchievements = (
                await this.fetch_player_achievement_for_game(game.appid)
            ).achievements;
            // console.log(playerAchievements);

            // if the game has no achievements, skip
            if (!playerAchievements) {
                continue;
            }

            // get the global achievement data for that game
            const gameSchema = (await this.fetch_game_schema(game.appid))
                .availableGameStats.achievements;
            // console.log(gameSchema);

            // loop through each achievement in playerAchievements
            for (let j = 0; j < playerAchievements.length; j++) {
                // loop through each achievement in gameSchema
                for (let k = 0; k < gameSchema.length; k++) {
                    // if the two found objects have the same identifier
                    // let k2 = (j + k) % playerAchievements.length;
                    // console.log(playerAchievements[j]);
                    // console.log(gameSchema[k]);
                    if (playerAchievements[j].apiname === gameSchema[k].name) {
                        // console.log('MATCH');
                        // console.log(playerAchievements[j]);
                        // console.log(gameSchema[k]);
                        game.achievements.push({
                            achievement_id: playerAchievements[j].apiname,
                            achievement_name: gameSchema[k].displayName,
                            achievement_description: gameSchema[k].description,
                            achievement_icon: gameSchema[k].icon,
                            achievement_icon_gray: gameSchema[k].iconGray,
                            achievement_hidden: gameSchema[k].hidden,
                            achievement_achieved:
                                playerAchievements[j].achieved,
                            unlocktime: playerAchievements[j].unlocktime,
                        });
                        break;
                    }
                }
            }
            library.games[i] = game;
        }
        //console.log(data);
        return library;
    }

    async fetch_player_achievement_for_game(appid: number) {
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

    async fetch_game_schema(appid: number) {
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

    async fetch_user_level() {
        const data = await this.fetch<{ response: SteamPlayerLevelModel }>(
            'https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/',
            { key: this.key, steamid: this.username }
        );

        return data.response;
    }
}
