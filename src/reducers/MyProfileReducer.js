import {
    OLD_PASSWORD_CHANGED,
    NEW_PASSWORD_CHANGED,
    NAME_CHANGED,
    CONTACT_NO_CHANGED,
    CONFIRM_CHANGED,
    MY_PROFILE_CLICKED,
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILED,
    CHANGE_PASSWORD_FORM_IS_VALID,
    CHANGE_PASSWORD_FORM_IS_INVALID,
    SAVE_USER_DETAILS,
    SAVE_USER_DETAILS_SUCCESS,
    SAVE_USER_DETAILS_FAILED,
    PROFILE_PICTURE_CHANGED
} from '../actions/types';
import { colors } from '../config/styles';

const INITIAL_STATE = {
    name: '',
    contactNo: '0',
    oldPassword: '',
    newPassword: '',
    confirm: '',
    changePasswordLoading: false,
    saveDetailsLoading: false,
};

const DETAILS_CHANGED_STATE = {
    saveBtnIsDisabled: false,
    saveBtnColor: colors.buttonRed,
    saveBtnTextColor: colors.textWhite
};

const DETAILS_UNCHANGED_STATE = {
    saveBtnIsDisabled: true,
    saveBtnColor: colors.headerBlue,
    saveBtnTextColor: colors.textAsh
};

const CHANGE_PASSWORD_INITIAL_STATE = {
    oldPassword: '',
    newPassword: '',
    confirm: '',
    pwChangeBtnIsDisabled: true,
    pwChangeBtnColor: colors.headerBlue,
    pwChangeButtonTextColor: colors.textAsh
};

const CHANGE_PASSWORD_VALID_STATE = {
    pwChangeBtnIsDisabled: false,
    pwChangeBtnColor: colors.buttonRed,
    pwChangeButtonTextColor: colors.textWhite
};

const CHANGE_PASSWORD_INVALID_STATE = {
    pwChangeBtnIsDisabled: true,
    pwChangeBtnColor: colors.headerBlue,
    pwChangeButtonTextColor: colors.textAsh
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MY_PROFILE_CLICKED:
            return { ...state, ...CHANGE_PASSWORD_INITIAL_STATE, ...DETAILS_UNCHANGED_STATE, name: action.payload.name, contactNo: action.payload.contact_no };
        case PROFILE_PICTURE_CHANGED:
            return { ...state, ...DETAILS_CHANGED_STATE };
        case NAME_CHANGED:
            return { ...state, ...DETAILS_CHANGED_STATE, name: action.payload };
        case CONTACT_NO_CHANGED:
            return { ...state, ...DETAILS_CHANGED_STATE, contactNo: action.payload };
        case SAVE_USER_DETAILS:
            return { ...state, saveDetailsLoading: true };
        case SAVE_USER_DETAILS_SUCCESS:
            return { ...state, ...DETAILS_UNCHANGED_STATE, ...CHANGE_PASSWORD_INITIAL_STATE, saveDetailsLoading: false, name: action.payload.name, contactNo: action.payload.contact_no };
        case SAVE_USER_DETAILS_FAILED:
            return { ...state, ...DETAILS_CHANGED_STATE, saveDetailsLoading: false };
        case OLD_PASSWORD_CHANGED:
            return { ...state, oldPassword: action.payload };
        case NEW_PASSWORD_CHANGED:
            return { ...state, newPassword: action.payload };
        case CONFIRM_CHANGED:
            return { ...state, confirm: action.payload };
        case CHANGE_PASSWORD:
            return { ...state, changePasswordLoading: true };
        case CHANGE_PASSWORD_FORM_IS_INVALID:
            return { ...state, ...CHANGE_PASSWORD_INVALID_STATE };
        case CHANGE_PASSWORD_FORM_IS_VALID:
            return { ...state, ...CHANGE_PASSWORD_VALID_STATE };
        case CHANGE_PASSWORD_SUCCESS:
            return { ...state, ...CHANGE_PASSWORD_INITIAL_STATE, changePasswordLoading: false };
        case CHANGE_PASSWORD_FAILED:
            return { ...state, changePasswordLoading: false };
        default:
            return { state };

    }
};
