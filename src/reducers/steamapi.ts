import { SteamAPITypeKeys, SteamAPITypes } from '../actions/steamapi';
import { SteamAPIData } from '../api/SteamAPI';

const initialState: SteamAPIData = null;

export default function steamapi(
    state: SteamAPIData = initialState,
    action: SteamAPITypes
) {
    switch (action.type) {
        case SteamAPITypeKeys.UPDATE:
            return action.data;
        default:
            return state;
    }
}
