import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import {
    FETCH_DATA
} from './actionTypes';

const initialState = {
    data: [
        {
            id: 'bitcoin',
            name: 'Bitcoin',
        },
        {
            id: 'ethereum',
            name: 'Ethereum',
        }
    ]
};
const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_DATA:
            return {
                ...state,
                data: action.payload
            };
        default:
            return state;
    }
}
const rootReducer = combineReducers({
    formData: formReducer,
    currencys: dataReducer
});

export default rootReducer;