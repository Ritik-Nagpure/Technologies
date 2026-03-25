// having multiple contexts/states with multiple reducers under one store using combine reducers.
// Applying middlewares

import { createSlice, configureStore, combineReducers } from '@reduxjs/toolkit';

const cakeSlice = createSlice({
    name: 'cake',
    initialState: { cakes: 10 },
    reducers: {
        buyCake: (state) => { state.cakes -= 1; }
    }
});

const { buyCake } = cakeSlice.actions;

const iceCreamSlice = createSlice({
    name: 'Ice Cream',
    initialState: { iceCreams: 10 },
    reducers: {
        buyIceCream: (state) => { state.iceCreams -= 1; }
    }
});

const { buyIceCream } = iceCreamSlice.actions;

const rootReducer = combineReducers({
    cake: cakeSlice.reducer,
    iceCream: iceCreamSlice.reducer
});

// Custom logger middleware
// () => () => () => this is a standard redux middle writting pattern 
const loggerMiddleware = (storeAPI) => (next) => (action) => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('Next state:', storeAPI.getState());
  return result;
};

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(loggerMiddleware)  // “Take the default middleware array, then add my custom middleware to it.”

});

const unsubscribe = store.subscribe(() =>
    console.log('--> Updated state:', store.getState())
);

console.log('--> Initial state:', store.getState());
store.dispatch(buyCake(2)); // here 2 is the payload basically it the argument of function.
store.dispatch(buyCake(2));
store.dispatch(buyIceCream());
store.dispatch(buyIceCream());
store.dispatch(buyCake());
store.dispatch(buyIceCream());
store.dispatch(buyIceCream());
store.dispatch(buyIceCream());
store.dispatch(buyIceCream());
store.dispatch(buyCake());
unsubscribe();