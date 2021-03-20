import { GithubAPITypeKeys, GithubAPITypes } from '../actions/githubapi';
import { GithubData } from '../api/GithubAPI';

const initialState: GithubData = null;

export default function githubapi(
    state: GithubData = initialState,
    action: GithubAPITypes
) {
    switch (action.type) {
        case GithubAPITypeKeys.UPDATE:
            return action.data;
        default:
            return state;
    }
}
