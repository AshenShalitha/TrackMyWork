import { Alert } from 'react-native';
import {
    NAME_CHANGED,
    CONTACT_NO_CHANGED,
    OLD_PASSWORD_CHANGED,
    NEW_PASSWORD_CHANGED,
    CONFIRM_CHANGED,
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILED,
    CHANGE_PASSWORD_FORM_IS_VALID,
    CHANGE_PASSWORD_FORM_IS_INVALID,
    SAVE_USER_DETAILS,
    SAVE_USER_DETAILS_SUCCESS,
    SAVE_USER_DETAILS_FAILED,
    FETCH_USER_DETAILS_SUCCESS,
    PROFILE_PICTURE_CHANGED
} from './types';
import {
    CHANGE_MY_PASSWORD,
    UPDATE_PROFILE,
} from '../api/API';

export const profilePictureChanged = () => {
    return {
        type: PROFILE_PICTURE_CHANGED
    };
};

export const nameChanged = text => {
    return {
        type: NAME_CHANGED,
        payload: text
    };
};

export const contactNoChanged = text => {
    return {
        type: CONTACT_NO_CHANGED,
        payload: text
    };
};

export const oldPasswordChanged = text => {
    return {
        type: OLD_PASSWORD_CHANGED,
        payload: text
    };
};

export const newPasswordChanged = text => {
    return {
        type: NEW_PASSWORD_CHANGED,
        payload: text
    };
};

export const confirmChanged = text => {
    return {
        type: CONFIRM_CHANGED,
        payload: text
    };
};

export const activatePaswordChangeButton = () => {
    return {
        type: CHANGE_PASSWORD_FORM_IS_VALID,
    };
};

export const deactivatePaswordChangeButton = () => {
    return {
        type: CHANGE_PASSWORD_FORM_IS_INVALID,
    };
};

export const changePassword = (token, email, oldpw, newpw) => {
    return (dispatch) => {
        dispatch({ type: CHANGE_PASSWORD });
        fetch(CHANGE_MY_PASSWORD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                email,
                oldpw,
                newpw
            }),
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then(() => {
                        dispatch({ type: CHANGE_PASSWORD_SUCCESS });
                        Alert.alert(
                            'Alert',
                            'Password changed successfully!',
                            [
                                { text: 'Ok' },
                            ],
                        );
                    });
            } else {
                return response.json()
                    .then(() => {
                        dispatch({ type: CHANGE_PASSWORD_FAILED });
                        Alert.alert(
                            'Error',
                            'Incorrect password!',
                            [
                                { text: 'Ok' },
                            ],
                        );
                    });
            }
        }).catch(() => {
            Alert.alert(
                'Error',
                'Server error!',
                [
                    { text: 'Ok' },
                ],
            );
        });
    };
};

export const updateMyProfile = (token, fileName, fileType, fileUri, name, contactNo) => {

    const user = JSON.stringify({
        'name': name,
        'contact_no': contactNo,
        'position': null,
        'user_role': null
    });
    const file = {
        uri: fileUri,
        name: fileName,
        type: fileType,
    }
    const formData = new FormData();
    if (fileType === null) {
        formData.append('user', user);
    } else {
        formData.append('file', file);
        formData.append('user', user);
    }

    return (dispatch) => {
        dispatch({ type: SAVE_USER_DETAILS });
        fetch(UPDATE_PROFILE, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then((resJson) => {
                        //updates the header items
                        dispatch({ type: FETCH_USER_DETAILS_SUCCESS, payload: resJson });
                        dispatch({ type: SAVE_USER_DETAILS_SUCCESS, payload: resJson });
                    });
            } else {
                dispatch({ type: SAVE_USER_DETAILS_FAILED });
            }
        }).catch((err) => {
        });
    };
};
