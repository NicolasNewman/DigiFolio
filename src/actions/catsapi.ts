import { CatsAPIData } from '../api/CatsAPI';

export enum CatsAPITypeKeys {
    UPDATE = 'UPDATE',
}

interface UpdateAction {
    type: CatsAPITypeKeys.UPDATE;
    data: CatsAPIData;
}

export type CatsAPITypes = UpdateAction;

export function updateCatsAPI(data: CatsAPIData) {
    return {
        type: CatsAPITypeKeys.UPDATE,
        data,
    };
}
