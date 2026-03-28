import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getdata = createAsyncThunk('jsdata/getdata', async () => {
    const res = await axios.get("https://sarvum.onrender.com/api/rihal/rides")
    return res.data.cities
})

// thunks are not required anymore due to adcase, builder and extrareducers concept of redux toolkit
// it makes writing code simpler and out put as it is by giving builtin : pending, fulfilled, rejected methods 
// input of addcase is a function with api call, callback function for state update

const jsdataSlice = createSlice({
    name: 'jsdata',
    initialState: {
        loading: false,
        cities: ['dcd ye ky hogya'],
        err: '',
        iserror: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getdata.pending, (state) => {
                state.loading = true
                state.cities = ['Requesting ...']
            })
            .addCase(getdata.fulfilled, (state, action) => {                
                state.loading = false   
                state.cities = action.payload
            })
            .addCase(getdata.rejected, (state, action) => {
                state.loading = false
                state.cities = ['no data fetched']
                state.err = action.payload
                state.iserror = true
            })
    }
})

export default jsdataSlice.reducer;
