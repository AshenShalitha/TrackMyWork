import {
    FETCH_USER_DETAILS,
    FETCH_USER_DETAILS_SUCCESS,
    MY_PROFILE_CLICKED
} from './types';
import { GET_USER_DETAILS } from '../api/API';

export const getUserDetails = (token, userId) => {
    return (dispatch) => {
        dispatch({ type: FETCH_USER_DETAILS });
        fetch(`${GET_USER_DETAILS}${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((resJson) => {
                        dispatch({ type: FETCH_USER_DETAILS_SUCCESS, payload: resJson });
                    });
            } else {

            }
        }).then((resJson) => {

        }).catch((err) => { });
    };
};

export const myProfileClicked = user => {
    return {
        type: MY_PROFILE_CLICKED,
        payload: user
    };
};