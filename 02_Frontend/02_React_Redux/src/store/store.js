import { combineReducers, applyMiddleware, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

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
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(customMiddleware, logger)
        // applyMiddleware(logger, thunk) --> this is old in redux method
        // this is new mordern redux toolkit way as it wrap everything and emits a simple way to implement it
    }
);


