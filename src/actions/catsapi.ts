import { CatsAPIDataModel } from '../api/CatsAPI';

export enum CatsAPITypeKeys {
    UPDATE = 'UPDATE',
}

interface UpdateAction {
    type: CatsAPITypeKeys.UPDATE;
    data: CatsAPIDataModel;
}

export type CatsAPITypes = UpdateAction;

export function updateCatsAPI(data: CatsAPIDataModel) {
    return {
        type: CatsAPITypeKeys.UPDATE,
        data,
    };
}
