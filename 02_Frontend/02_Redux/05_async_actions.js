//
// Add extraReducers to handle pending, fulfilled, and rejected states


import { createSlice, configureStore, combineReducers, createAsyncThunk } from '@reduxjs/toolkit';

const fetchCakeStock = createAsyncThunk(
    'cake/fetchCakeStock',
    async () => {
        // Simulate API call with a delay
        const response = await new Promise((resolve) =>
            setTimeout(() => resolve({ cakes: 20 }), 1000)
        );
        return response.cakes;
    }
);

const cakeSlice = createSlice({
    name: 'cake',
    initialState: { cakes: 10 },
    reducers: {
        buyCake: (state) => { state.cakes -= 1; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCakeStock.pending, (state) => {
                state.cakes = 0;
                state.status = 'loading';
            })
            .addCase(fetchCakeStock.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cakes = action.payload; // update with fetched stock
            })
            .addCase(fetchCakeStock.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

const { buyCake } = cakeSlice.actions;


const fetchIceCreamStock = createAsyncThunk(
    'cake/fetchIceCreamStock',
    async () => {
        // Simulate API call with a delay
        const response = await new Promise((resolve) =>
            setTimeout(() => resolve({ iceCreams: 25 }), 1000)
        );
        return response.iceCreams;
    }
);


const iceCreamSlice = createSlice({
    name: 'Ice Cream',
    initialState: { iceCreams: 10 },
    reducers: {
        buyIceCream: (state) => { state.iceCreams -= 1; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIceCreamStock.pending, (state) => {
                state.iceCreams = 0;
                state.status = 'loading';
            })
            .addCase(fetchIceCreamStock.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.iceCreams = action.payload; // update with fetched stock
            })
            .addCase(fetchIceCreamStock.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
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
    // console.log('Dispatching:', action);
    const result = next(action);
    console.log('Current state:', storeAPI.getState());
    // return result;
};

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(loggerMiddleware)  // “Take the default middleware array, then add my custom middleware to it.”

});

const unsubscribe = store.subscribe(() =>
    console.log('     Updated state:', store.getState())
);

console.log('     Initial state:', store.getState());

(async function () {
    await store.dispatch(fetchCakeStock()).then(() => {
        console.log('--> After async fetch:', store.getState());
    });
    await store.dispatch(fetchIceCreamStock()).then(() => {
        console.log('--> After async fetch:', store.getState());
    });

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
})();

unsubscribe();