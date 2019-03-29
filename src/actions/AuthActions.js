import { Alert } from 'react-native';
import jwt_decode from 'jwt-decode';
import NavigationService from '../services/NavigationService';
import { setData } from '../config/session';
import { LOGIN, GET_ACCESS_TOKEN } from '../api/API';
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
} from './types';
import { ADMIN, USER } from '../config/userConfig';


export const emailChanged = (text) => {
    return {
        type: EMAIL_CHANGED,
        payload: text
    };
};

export const passwordChanged = (text) => {
    return {
        type: PASSWORD_CHANGED,
        payload: text
    };
};

export const loginUser = ({ email, password }) => {
    return (dispatch) => {
        dispatch({ type: LOGIN_USER });
        fetch(LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            }),
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then((resJson) => {
                        loginUserSuccess(dispatch, resJson);
                    });
            } else {
                return response.json()
                    .then((resJson) => {
                        loginUserFail(dispatch, resJson);
                    });
            }
        }).catch(() => {
            dispatch({ type: LOGIN_NETWORK_ERROR });
            Alert.alert(
                'Login Failed',
                'Internal server error!',
                [
                    { text: 'Ok' },
                ],
            );
        });
    };
};

const loginUserSuccess = (dispatch, user) => {
    setData('token', user.token).then(() => {
        dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
        decodeToken(user.token);
    });
    setData('userId', user.userId);
    setData('refreshToken', user.refreshToken);
};

const loginUserFail = (dispatch, res) => {
    dispatch({ type: LOGIN_USER_FAIL, payload: res.errorMessage });
    Alert.alert(
        'Login Failed',
        res.errorMessage,
        [
            { text: 'Ok' },
        ],
    );
};

export const fetchAccessToken = (refreshToken) => {
    return (dispatch) => {
        dispatch({ type: FETCH_ACCESS_TOKEN });
        fetch(GET_ACCESS_TOKEN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refreshToken
            })
        }).then((response) => {
            if (response.ok) {
                console.log('response ok');
                dispatch({ type: FETCH_ACCESS_TOKEN_SUCCESS });
                return response.json()
                    .then((resJson) => {
                        setData('token', resJson.token);
                        setData('refreshToken', resJson.refreshToken);
                        setData('userId', resJson.userId);
                        decodeToken(resJson.token);
                    });
            } else {
                dispatch({ type: FETCH_ACCESS_TOKEN_FAILED });
                NavigationService.replace('LoginScreen');
            }
        }).catch(() => {
            dispatch({ type: FETCH_ACCESS_TOKEN_FAILED });
            NavigationService.replace('LoginScreen');
        });
    };
};

const decodeToken = (token) => {
    if (jwt_decode(token).sub === ADMIN) {
        NavigationService.replace('MainTabNavigator');
    } else if (jwt_decode(token).sub === USER) {
        NavigationService.replace('NonAdminTabNavigator');
    }
}