// having multiple contexts/states with multiple reducers under one store using combine reducers.
// Applying middlewares

import { createSlice, configureStore } from '@reduxjs/toolkit';

// Manual thunk: simulate fetching cake stock
const restockCakesAsync = () => {
    return async (dispatch, getState) => {
        console.log('Fetching cake stock...');

        // Simulate API call with delay
        const response = await new Promise((resolve) =>
            setTimeout(() => resolve({ cakes: 15 }), 1500)
        );

        // Dispatch a normal action after async work
        dispatch({ type: 'cake/restock', payload: response.cakes });

        console.log('Cake stock updated:', getState().cakes);
    };
};


const cakeSlice = createSlice({
    name: 'cake',
    initialState: { cakes: 10 },
    reducers: {
        buyCake: (state) => { state.cakes -= 1; },
        restock: (state, action) => { state.cakes = action.payload; }
    }
});

const { buyCake } = cakeSlice.actions;


// Custom logger middleware
// () => () => () => this is a standard redux middle writting pattern 
const loggerMiddleware = (storeAPI) => (next) => (action) => {
    // console.log('Dispatching:', action);
    const result = next(action);
    console.log('Next state:', storeAPI.getState());
    return result;
};

const store = configureStore({
    reducer: cakeSlice.reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(loggerMiddleware)  // “Take the default middleware array, then add my custom middleware to it.”

});

const unsubscribe = store.subscribe(() =>
    console.log('--> Updated state:', store.getState())
);

console.log('--> Initial state:', store.getState());

(async () => {
    await store.dispatch(restockCakesAsync()).then(() => {
        console.log('--> After async restock:', store.getState())
    });

    store.dispatch(buyCake(2)); // here 2 is the payload basically it the argument of function.
    store.dispatch(buyCake());
    store.dispatch(buyCake());
})()

unsubscribe();