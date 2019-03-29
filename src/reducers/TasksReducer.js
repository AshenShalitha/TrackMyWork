import moment from 'moment';
import {
    MODAL_VISIBLE,
    DUE_DATE_CHANGED,
    TASK_NAME_CHANGED,
    FETCH_PROJECTS,
    FETCH_PROJECTS_SUCCESS,
    PROJECT_PICKED,
    TASK_TYPE_SELECTED,
    FETCH_INCOMPLETED_TASKS,
    FETCH_TASKS_SUCCESS,
    FETCH_COMPLETED_TASKS,
    FETCH_ONGOING_TASKS_SUCCESS,
    FETCH_OVERDUE_TASKS_SUCCESSFUL,
    FETCH_COMPLETED_TASKS_SUCCESSFUL,
    TASK_STATUS_UPDATED,
    REFRESH_COMPLETED_TASKS,
    REFRESH_ONGOING_TASKS,
    REFRESH_OVERDUE_TASKS,
    ADD_TASK_CARD,
    ADD_TASK_CARD_SUCCESSFULL,
    ADD_TASK_CARD_FAILED,
    ENABLE_BUTTON,
    ADD_PROJECT,
    ADD_PROJECT_SUCCESS,
    ADD_PROJECT_FAILED,
    SEARCH_FIELD_CHANGED,
    SET_ARRAYHOLDER,
    CHECK_IF_BUTTON_IS_VISIBLE,
} from '../actions/types';
import { colors } from '../config/styles';

const INITIAL_STATE = {
    taskName: '',
    projects: [],
    addTaskLoading: false,
    project: '',
    dueDate: moment().format('YYYY-MM-DD'),
    tasksLoading: false,
    taskType: 'ongoing',
    taskList: [],
    complete: false,
    task: '',
    err: '',
    addCardBtnColor: colors.headerBlue,
    addCardBtnTextColor: colors.textAsh,
    buttonDisabled: true,
    projectListLoading: false,
    arrayholder: [],
    btnVisible: false
};

const MODAL_INITIAL_STATE = {
    taskName: '',
    projects: [],
    project: '',
    dueDate: moment().format('YYYY-MM-DD'),
    addCardBtnColor: colors.headerBlue,
    addCardBtnTextColor: colors.textAsh,
    buttonDisabled: true,
    addTaskLoading: false,
};

const BUTTON_ENABLE_STATE = {
    addCardBtnColor: colors.buttonRed,
    addCardBtnTextColor: colors.textWhite,
    buttonDisabled: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MODAL_VISIBLE:
            return { ...state, ...MODAL_INITIAL_STATE };
        case TASK_NAME_CHANGED:
            return { ...state, taskName: action.payload };
        case FETCH_PROJECTS:
            return { ...state, projectListLoading: true };
        case FETCH_PROJECTS_SUCCESS:
            return { ...state, projects: action.payload, projectListLoading: false };
        case PROJECT_PICKED:
            return { ...state, project: action.payload };
        case DUE_DATE_CHANGED:
            return { ...state, dueDate: action.payload };
        case ENABLE_BUTTON:
            return { ...state, ...BUTTON_ENABLE_STATE };
        case ADD_TASK_CARD:
            return { ...state, addTaskLoading: true };
        case ADD_TASK_CARD_SUCCESSFULL:
            return { ...state, addTaskLoading: false, task: action.payload, ...MODAL_INITIAL_STATE };
        case ADD_TASK_CARD_FAILED:
            return { ...state, addTaskLoading: false, err: action.payload };
        case SEARCH_FIELD_CHANGED:
            return { ...state, projects: action.payload };
        case ADD_PROJECT:
            return { ...state, projectListLoading: true };
        case ADD_PROJECT_SUCCESS:
            return { ...state, resp: action.payload, projectListLoading: false };
        case SET_ARRAYHOLDER:
            return { ...state, arrayholder: action.payload };
        case ADD_PROJECT_FAILED:
            return { ...state, resp: action.payload, projectListLoading: false };
        case CHECK_IF_BUTTON_IS_VISIBLE:
            return { ...state, btnVisible: action.payload };
        case TASK_TYPE_SELECTED:
            return { ...state, taskType: action.payload };
        case FETCH_INCOMPLETED_TASKS:
            return { ...state, tasksLoading: true };
        case FETCH_COMPLETED_TASKS:
            return { ...state, tasksLoading: true };
        case FETCH_TASKS_SUCCESS:
            return { ...state, tasksList: action.payload, tasksLoading: false };
        case FETCH_ONGOING_TASKS_SUCCESS:
            return { ...state, ongoingTasks: action.payload, tasksLoading: false };
        case FETCH_OVERDUE_TASKS_SUCCESSFUL:
            return { ...state, overdueTasks: action.payload, tasksLoading: false };
        case FETCH_COMPLETED_TASKS_SUCCESSFUL:
            return { ...state, completedTasks: action.payload, tasksLoading: false };
        case TASK_STATUS_UPDATED:
            return { ...state, complete: action.payload, tasksLoading: true };
        case REFRESH_COMPLETED_TASKS:
            return { ...state, completedTasks: action.payload, tasksLoading: false };
        case REFRESH_ONGOING_TASKS:
            return { ...state, ongoingTasks: action.payload, tasksLoading: false };
        case REFRESH_OVERDUE_TASKS:
            return { ...state, overdueTasks: action.payload, tasksLoading: false };
        default:
            return state;
    }
}
