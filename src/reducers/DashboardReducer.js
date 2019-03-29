import moment from 'moment';
import {
    FETCH_ALL_USERS,
    FETCH_ALL_USERS_SUCCESS,
    FETCH_ALL_TASKS,
    FETCH_ALL_TASKS_SUCCESS,
    FETCH_ALL_USERS_FAILED,
    FETCH_ALL_TASKS_FAILED,
    ADD_TASK_SUCCESS,
    ADD_TASK_FAILED,
    EDIT_TASK,
    EDIT_TASK_SUCCESS,
    EDIT_TASK_FAILED,
    YEAR_CHANGED,
    MONTH_CHANGED,
    FETCH_ATTENDANCE_SUMMARY,
    FETCH_ATTENDANCE_SUMMARY_SUCCESS,
    FETCH_ATTENDANCE_SUMMARY_FAILED,
    ADMIN_ATTENDANCE_TYPE_CHANGED,
    ADMIN_ATTENDANCE_REASON_CHANGED,
    ADMIN_ATTENDANCE_DATE_SET,
    ADMIN_ATTENDANCE_UPDATE,
    ADMIN_ATTENDANCE_UPDATE_SUCCESS,
    ADMIN_ATTENDANCE_UPDATE_FAILED,
    TASK_ID_CHANGED,
    ADMIN_TASK_STATUS_UPDATED,
    USER_TASK_ARRAY_SET,
    SET_USER_TASK_ARRAYHOLDER,
    USER_TASK_SEARCH_FIELD_CHANGED,
    ATTENDANCE_SEARCH_FIELD_CHANGED,
    SET_ATTENDANCE_ARRAYHOLDER,
    FETCH_ATTENDANCE_INFO,
    FETCH_ATTENDANCE_INFO_SUCCESS,
    FETCH_ATTENDANCE_INFO_FAILED,
    ENABLE_SAVE_BUTTON,
    ENABLE_BUTTON,
    ADMIN_ATTENDANCE_MODAL_CLOSED,
    ON_ADD_TASK_MODAL_OPENED,
    ON_EDIT_TASK_MODAL_OPENED,
    ENABLE_TASK_BUTTON,
    ADMIN_TASK_MODAL_CLOSED,
} from '../actions/types';
import { ADD_TASK } from '../api/API';
import { colors } from '../config/styles';

const currentYear = moment().format('YYYY');
const currentMonth = moment().format('YYYY-MM-DD');

const INITIAL_STATE = {
    taskId: '',
    allTasks: [],
    allUsers: [],
    usersLoading: false,
    allTasksLoading: false,
    adminAddTaskLoading: false,
    adminEditTaskLoading: false,
    allAttendanceLoading: false,
    year: currentYear,
    date: currentMonth,
    attendance: [],
    attendanceArrayHolder: [],
    attendanceCategory: 'default',
    attendanceReason: '',
    attendanceDate: '',
    attendanceUpdateLoading: false,
    userTaskArray: [],
    userTaskArrayHolder: [],
    fetchAttendanceInfoLoading: false,
    saveBtnColor: colors.headerBlue,
    saveBtnTextColor: colors.textAsh,
    buttonDisabled: true,
};

const ADD_TASK_MODAL_INITIAL_STATE = {
    addCardBtnColor: colors.headerBlue,
    addCardBtnTextColor: colors.textAsh,
    taskButtonDisabled: true,
    adminAddTaskLoading: false,
};

const EDIT_TASK_MODAL_INITIAL_STATE = {
    addCardBtnColor: colors.headerBlue,
    addCardBtnTextColor: colors.textAsh,
    taskButtonDisabled: true,
    adminEditTaskLoading: false,
};

const TASK_BUTTON_ENABLE_STATE = {
    addCardBtnColor: colors.buttonRed,
    addCardBtnTextColor: colors.textWhite,
    taskButtonDisabled: false
};

const MODAL_INITIAL_STATE = {
    attendanceCategory: 'default',
    attendanceReason: '',
    saveBtnColor: colors.headerBlue,
    saveBtnTextColor: colors.textAsh,
    buttonDisabled: true,
};

const BUTTON_ENABLE_STATE = {
    saveBtnColor: colors.buttonRed,
    saveBtnTextColor: colors.textWhite,
    buttonDisabled: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ON_ADD_TASK_MODAL_OPENED:
            return { ...state, ...ADD_TASK_MODAL_INITIAL_STATE };
        case ON_EDIT_TASK_MODAL_OPENED:
            return { ...state, ...EDIT_TASK_MODAL_INITIAL_STATE };
        case ENABLE_TASK_BUTTON:
            return { ...state, ...TASK_BUTTON_ENABLE_STATE };
        case ADMIN_TASK_MODAL_CLOSED:
            return { ...state, ...ADD_TASK_MODAL_INITIAL_STATE, ...EDIT_TASK_MODAL_INITIAL_STATE };
        case TASK_ID_CHANGED:
            return { ...state, taskId: action.payload };
        case FETCH_ALL_USERS:
            return { ...state, usersLoading: true };
        case FETCH_ALL_USERS_SUCCESS:
            return { ...state, usersLoading: false, allUsers: action.payload };
        case FETCH_ALL_USERS_FAILED:
            return { ...state, usersLoading: false };
        case FETCH_ALL_TASKS:
            return { ...state, allTasksLoading: true };
        case FETCH_ALL_TASKS_SUCCESS:
            return { ...state, allTasksLoading: false, allTasks: action.payload };
        case FETCH_ALL_TASKS_FAILED:
            return { ...state, allTasksLoading: false };
        case USER_TASK_ARRAY_SET:
            return { ...state, userTaskArray: action.payload };
        case SET_USER_TASK_ARRAYHOLDER:
            return { ...state, userTaskArrayHolder: action.payload };
        case USER_TASK_SEARCH_FIELD_CHANGED:
            return { ...state, userTaskArray: action.payload };
        case ADD_TASK:
            return { ...state, adminAddTaskLoading: true, payload: true };
        case ADD_TASK_SUCCESS:
            return { ...state, adminAddTaskLoading: false, ...ADD_TASK_MODAL_INITIAL_STATE };
        case ADD_TASK_FAILED:
            return { ...state, adminAddTaskLoading: false };
        case EDIT_TASK:
            return { ...state, adminEditTaskLoading: true };
        case EDIT_TASK_SUCCESS:
            return { ...state, adminEditTaskLoading: false, ...EDIT_TASK_MODAL_INITIAL_STATE };
        case EDIT_TASK_FAILED:
            return { ...state, adminEditTaskLoading: false };
        case YEAR_CHANGED:
            return { ...state, year: action.payload };
        case MONTH_CHANGED:
            return { ...state, date: action.payload };
        case FETCH_ATTENDANCE_SUMMARY:
            return { ...state, allAttendanceLoading: true };
        case FETCH_ATTENDANCE_SUMMARY_SUCCESS:
            return { ...state, allAttendanceLoading: false, attendance: action.payload };
        case FETCH_ATTENDANCE_SUMMARY_FAILED:
            return { ...state, allAttendanceLoading: false };
        case SET_ATTENDANCE_ARRAYHOLDER:
            return { ...state, attendanceArrayHolder: action.payload };
        case ATTENDANCE_SEARCH_FIELD_CHANGED:
            return { ...state, attendance: action.payload };
        case ADMIN_ATTENDANCE_TYPE_CHANGED:
            return { ...state, attendanceCategory: action.payload };
        case ADMIN_ATTENDANCE_REASON_CHANGED:
            return { ...state, attendanceReason: action.payload };
        case ADMIN_ATTENDANCE_DATE_SET:
            return { ...state, attendanceDate: action.payload };
        case ADMIN_ATTENDANCE_UPDATE:
            return { ...state, attendanceUpdateLoading: true };
        case ADMIN_ATTENDANCE_UPDATE_SUCCESS:
            return { ...state, attendanceUpdateLoading: false, ...MODAL_INITIAL_STATE };
        case ADMIN_ATTENDANCE_UPDATE_FAILED:
            return { ...state, attendanceUpdateLoading: false };
        case ADMIN_TASK_STATUS_UPDATED:
            return { ...state };
        case FETCH_ATTENDANCE_INFO:
            return { ...state, fetchAttendanceInfoLoading: true };
        case FETCH_ATTENDANCE_INFO_SUCCESS:
            return { ...state, attendanceReason: action.payload, fetchAttendanceInfoLoading: false };
        case FETCH_ATTENDANCE_INFO_FAILED:
            return { ...state, fetchAttendanceInfoLoading: false };
        case ENABLE_SAVE_BUTTON:
            return { ...state, ...BUTTON_ENABLE_STATE };
        case ADMIN_ATTENDANCE_MODAL_CLOSED:
            return { ...state, ...MODAL_INITIAL_STATE };
        default:
            return state;
    }
};

