import { createSlice, configureStore } from '@reduxjs/toolkit';

const cakeSlice = createSlice({
    name: 'cake',
    initialState: { cakes: 10 },
    reducers: {
        buyCake: (state) => { state.cakes -= 1; }

    }
});

const { buyCake } = cakeSlice.actions;

const store = configureStore({
    reducer: { cake: cakeSlice.reducer }
})

const unsubscribe = store.subscribe(() =>
    console.log('Updated state:', store.getState())
);

console.log('Initial state:', store.getState());
store.dispatch(buyCake());
store.dispatch(buyCake());
store.dispatch(buyCake());
unsubscribe();