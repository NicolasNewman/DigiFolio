import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import createRootReducer from '../reducers';
import * as catsapiActions from '../actions/catsapi';
import * as githubapiActions from '../actions/githubapi';
import * as steamapiActions from '../actions/steamapi';
import * as portfolioActions from '../actions/portfolio';
import * as redditapiActions from '../actions/redditapi';

const history = createHashHistory();

const rootReducer = createRootReducer(history);

const configureStore = (initialState?: any) => {
    // Redux Configuration
    const middleware: Array<Middleware | ThunkMiddleware> = [];
    const enhancers: Array<any> = [];

    // Thunk Middleware
    middleware.push(thunk);

    // Logging Middleware
    const logger = createLogger({
        level: 'info',
        collapsed: true,
    });

    // Skip redux logs in console during the tests
    if (process.env.NODE_ENV !== 'test') {
        middleware.push(logger);
    }

    // Router Middleware
    const router = routerMiddleware(history);
    middleware.push(router);

    // Redux DevTools Configuration
    const actionCreators = {
        ...catsapiActions,
        ...githubapiActions,
        ...steamapiActions,
        ...portfolioActions,
        ...redditapiActions,
        ...routerActions,
    };
    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers = (window as any)
        .__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              // Options: http://extension.remotedev.io/docs/API/Arguments.html
              actionCreators,
          })
        : compose;
    /* eslint-enable no-underscore-dangle */

    // Apply Middleware & Compose Enhancers
    enhancers.push(applyMiddleware(...middleware));
    const enhancer = composeEnhancers(...enhancers);

    // Create Store
    const store = createStore(rootReducer, initialState, enhancer);

    if ((module as any).hot) {
        (module as any).hot.accept(
            '../reducers', // eslint-disable-next-line global-require
            () => store.replaceReducer(require('../reducers').default)
        );
    }

    return store;
};

export default { configureStore, history };
