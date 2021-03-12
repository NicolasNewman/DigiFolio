import { CatsAPITypeKeys, CatsAPITypes } from '../actions/catsapi';
import { CatsAPIData } from '../api/CatsAPI';

const initialState: CatsAPIData = null;

export default function catsapi(
    state: CatsAPIData = initialState,
    action: CatsAPITypes
) {
    switch (action.type) {
        case CatsAPITypeKeys.UPDATE:
            return action.data;
        default:
            return state;
    }
}
