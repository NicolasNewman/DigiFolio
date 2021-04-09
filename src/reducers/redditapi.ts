import { RedditAPITypeKeys, RedditAPITypes } from '../actions/redditapi';
import { RedditAPIData } from '../api/RedditAPI';

const initialState: RedditAPIData = null;

export default function steamapi(
    state: RedditAPIData = initialState,
    action: RedditAPITypes
) {
    switch (action.type) {
        case RedditAPITypeKeys.UPDATE:
            return action.data;
        default:
            return state;
    }
}
