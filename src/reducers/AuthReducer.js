import {
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_NETWORK_ERROR,
    FETCH_ACCESS_TOKEN,
    FETCH_ACCESS_TOKEN_SUCCESS,
    FETCH_ACCESS_TOKEN_FAILED
} from '../actions/types';

const INITIAL_STATE = {
    email: '',
    password: '',
    user: null,
    error: '',
    loading: false,
    allowedAccess: false,
};

export default (state = INITIAL_STATE, action) => {
    console.log(action);
    switch (action.type) {
        case EMAIL_CHANGED:
            return { ...state, email: action.payload };
        case PASSWORD_CHANGED:
            return { ...state, password: action.payload };
        case LOGIN_USER:
            return { ...state, loading: true, error: '' };
        case LOGIN_USER_SUCCESS:
            return { ...state, user: action.payload, loading: false, ...INITIAL_STATE };
        case LOGIN_USER_FAIL:
            return { ...state, error: action.payload, loading: false };
        case LOGIN_NETWORK_ERROR:
            return { ...state, loading: false };
        case FETCH_ACCESS_TOKEN:
            return { ...state, allowedAccess: false };
        case FETCH_ACCESS_TOKEN_SUCCESS:
            return { ...state, allowedAccess: true };
        case FETCH_ACCESS_TOKEN_FAILED:
            return { ...state, allowedAccess: false };
        default:
            return state;
    }
}