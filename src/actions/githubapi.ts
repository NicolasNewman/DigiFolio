import { GithubData } from '../api/GithubAPI';

export enum GithubAPITypeKeys {
    UPDATE = 'UPDATE',
}

interface UpdateAction {
    type: GithubAPITypeKeys.UPDATE;
    data: GithubData;
}

export type GithubAPITypes = UpdateAction;

export function updateGithubAPI(data: GithubData) {
    return {
        type: GithubAPITypeKeys.UPDATE,
        data,
    };
}
