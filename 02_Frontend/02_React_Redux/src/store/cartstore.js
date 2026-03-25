import { createSlice, configureStore } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: { value: [] },
    reducers: {
        additem: (state, action) => {
            let newItem = action.payload;
            let currIndex = state.value.findIndex(obj => obj.id === newItem.id)

            if (currIndex === -1) {
                state.value.push(newItem)
            }
        },
        removeitem: (state, action) => {
            let removableItem = action.payload;
            state.value = state.value.filter(obj => obj.id !== removableItem.id)
        },
        edititem: (state, action) => {
            let newItem = action.payload;
            let currItem = state.value.find(obj => obj.id === newItem.id)
            currItem.quantity = newItem.quantity;
        }

    }
});

export const { additem, removeitem, edititem } = cartSlice.actions;

export const cartStore = configureStore({ reducer: { cart: cartSlice.reducer } })

export default cartSlice.reducer;