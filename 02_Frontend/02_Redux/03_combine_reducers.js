// having multiple contexts/states with multiple reducers under one store using combine reducers.

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

const store = configureStore({ reducer: rootReducer });

const unsubscribe = store.subscribe(() =>
    console.log('Updated state:', store.getState())
);

console.log('Initial state:', store.getState());
store.dispatch(buyCake());
store.dispatch(buyCake());
store.dispatch(buyIceCream());
store.dispatch(buyIceCream());
store.dispatch(buyCake());
store.dispatch(buyIceCream());
store.dispatch(buyIceCream());
store.dispatch(buyIceCream());
store.dispatch(buyIceCream());
store.dispatch(buyCake());
unsubscribe();