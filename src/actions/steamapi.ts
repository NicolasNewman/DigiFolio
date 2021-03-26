import SteamAPIData from '../api/SteamAPI';

export enum SteamAPITypeKeys {
    UPDATE = 'UPDATE_STEAM',
}

interface UpdateAction {
    type: SteamAPITypeKeys.UPDATE;
    data: SteamAPIData;
}

export type SteamAPITypes = UpdateAction;

export function updateCatsAPI(data: SteamAPIData) {
    return {
        type: SteamAPITypeKeys.UPDATE,
        data,
    };
}
