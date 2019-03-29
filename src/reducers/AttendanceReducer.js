import { colors } from '../config/styles';
import {
    ATTENDANCE_CATEGORY_PICKED,
    ATTENDANCE_MESSAGE_CHANGED,
    ATTENDANCE_MARKED_SUCCESSFULLY,
    ATTENDANCE_MARKING,
    UPDATE_ATTENDANCE,
    UPDATE_ATTENDANCE_SUCCESSFUL,
    ATTENDANCE_IS_MARKED,
    ATTENDANCE_IS_NOT_MARKED,
    FETCH_ATTENDANCE,
    FETCH_ATTENDANCE_SUCCESSFUL,
    FETCH_MY_ATTENDANCE_LIST_SUCCESSFUL,
    FETCH_MY_TODAY_ATTENDANCE,
    FETCH_MY_TODAY_ATTENDANCE_SUCCESS,
    FETCH_MY_TODAY_ATTENDANCE_FAILED,
} from '../actions/types';

const INITIAL_STATE = {
    selectedCategory: 'default',
    message: '',
    loading: false,
    buttonColor: colors.buttonRed,
    buttonText: 'SET',
    disabled: false,
    buttonTextColor: colors.textWhite,
    attendanceList: [],
    attendanceListLoading: false,
};

const ATTENDANCE_SET_STATE = {
    message: '',
    buttonColor: colors.headerBlue,
    buttonText: 'UPDATE',
    disabled: true,
    buttonTextColor: colors.textAsh,
};

const ATTENDANCE_STATUS_CHANGED_STATE = {
    disabled: false,
    buttonTextColor: colors.textWhite,
    buttonColor: colors.buttonRed
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ATTENDANCE_CATEGORY_PICKED:
            return { ...state, selectedCategory: action.payload, ...ATTENDANCE_STATUS_CHANGED_STATE };
        case ATTENDANCE_MESSAGE_CHANGED:
            return { ...state, message: action.payload };
        case ATTENDANCE_MARKING:
            return { ...state, loading: true };
        case ATTENDANCE_MARKED_SUCCESSFULLY:
            return { ...state, loading: false, ...ATTENDANCE_SET_STATE };
        case UPDATE_ATTENDANCE:
            return { ...state, loading: true };
        case UPDATE_ATTENDANCE_SUCCESSFUL:
            return { ...state, loading: false, ...ATTENDANCE_SET_STATE };
        case FETCH_MY_TODAY_ATTENDANCE:
            return { ...state };
        case FETCH_MY_TODAY_ATTENDANCE_SUCCESS:
            return { ...state, status: action.payload };
        case FETCH_MY_TODAY_ATTENDANCE_FAILED:
            return { ...state, status: action.payload };
        case ATTENDANCE_IS_MARKED:
            return { ...state, ...ATTENDANCE_SET_STATE, selectedCategory: action.payload };
        case ATTENDANCE_IS_NOT_MARKED:
            return { ...state, ...INITIAL_STATE };
        case FETCH_ATTENDANCE:
            return { ...state, attendanceListLoading: true };
        case FETCH_ATTENDANCE_SUCCESSFUL:
            return { ...state, attendanceList: action.payload };
        case FETCH_MY_ATTENDANCE_LIST_SUCCESSFUL:
            return { ...state, myAttendanceList: action.payload, attendanceListLoading: false };
        default:
            return state;
    }
}
