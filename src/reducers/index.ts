import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import catsapi from './catsapi';
import githubapi from './githubapi';
import steamapi from './steamapi';
import portfolio from './portfolio';
import redditapi from './redditapi';

export default function createRootReducer(history: History) {
    return combineReducers({
        router: connectRouter(history),
        catsapi,
        githubapi,
        steamapi,
        portfolio,
        redditapi,
    });
}
