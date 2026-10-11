import { combineReducers, applyMiddleware, configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

import cartred from './cartstore';
import cities from './cityLists';

const customMiddleware = storeAPI => next => action => {
    console.log('Before:', storeAPI, action);
    const result = next(action);
    console.log('After:', storeAPI, action);
    return result;
};

export const rootReducer = combineReducers({
    cart: cartred,
    citylist: cities,
})

export const stateStore = configureStore(
    {
        // old method of using combine reducers 
        // reducer: rootReducer,
        // new method does not need combine reducers can handle this on its own
        reducer: {
            cart: cartred,
            citylist: cities,
        },

        // applyMiddleware(logger, thunk) --> this is old in redux method
        // this is new mordern redux toolkit way as it wrap everything and emits a simple way to implement it
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(customMiddleware, logger)
    }
);


