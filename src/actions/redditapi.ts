import { RedditAPIData } from '../api/RedditAPI';

export enum RedditAPITypeKeys {
    UPDATE = 'UPDATE_REDDIT',
}

interface UpdateAction {
    type: RedditAPITypeKeys.UPDATE;
    data: RedditAPIData;
}

export type RedditAPITypes = UpdateAction;

export function updateRedditAPI(data: RedditAPIData) {
    return {
        type: RedditAPITypeKeys.UPDATE,
        data,
    };
}
