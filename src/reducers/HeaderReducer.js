import {
    FETCH_USER_DETAILS,
    FETCH_USER_DETAILS_SUCCESS,
    MY_PROFILE_CLICKED,
} from '../actions/types';

const INITIAL_STATE = {
    userDetails: '',
    avatarLoading: true
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_USER_DETAILS:
            return { ...state, avatarLoading: true };
        case FETCH_USER_DETAILS_SUCCESS:
            return { ...state, userDetails: action.payload, avatarLoading: false };
        case MY_PROFILE_CLICKED:
            return { ...state, nameAndNumber: action.payload };
        default:
            return state;
    }
};