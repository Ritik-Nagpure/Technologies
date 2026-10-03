// Old method 
// currently Redux does not work without Redux toolkit

const redux = require('redux');
const createstore = redux.legacy_createStore;

const initialState = {
    cakes: 10
}

function buyCake() {
    return {
        type: 'BUY_CAKE',
        info: 'sold a cake'
    }
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'BUY_CAKE': return {
            ...state,
            cakes: state.cakes - 1
        }
        default: return state
    }

}

const store = createstore(reducer);
const unsubscribe = store.subscribe(() => console.log('Updated state', store.getState()));
console.log(`Current Store status :`, store.getState());
store.dispatch(buyCake());
store.dispatch(buyCake());
store.dispatch(buyCake());
unsubscribe();