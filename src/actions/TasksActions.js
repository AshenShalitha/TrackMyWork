import { Alert } from 'react-native';
import {
    GET_MY_INCOMPLETED_TASKS,
    GET_PROJECTS,
    GET_MY_COMPLETED_TASKS,
    COMPLETE_INCOMPLETE_TASK,
    ADD_TASK
} from '../api/API';
import {
    DUE_DATE_CHANGED,
    FETCH_PROJECTS,
    FETCH_PROJECTS_SUCCESS,
    MODAL_VISIBLE,
    PROJECT_PICKED,
    TASK_NAME_CHANGED,
    FETCH_INCOMPLETED_TASKS,
    FETCH_TASKS_SUCCESS,
    TASK_TYPE_SELECTED,
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
    ADD_PROJECT_SUCCESS,
    ADD_PROJECT_FAILED,
    SEARCH_FIELD_CHANGED,
    SET_ARRAYHOLDER,
    CHECK_IF_BUTTON_IS_VISIBLE
} from './types';

import {
    refreshAllTasks
} from '../actions';

export const onModalClosed = () => {
    return {
        type: MODAL_VISIBLE
    };
};

export const onProjectsModalClosed = () => {
    return {
        type: CHECK_IF_BUTTON_IS_VISIBLE,
        payload: false
    };
};

export const taskNameChanged = (text) => {
    return {
        type: TASK_NAME_CHANGED,
        payload: text
    };
};

export const projectPick = (text) => {
    return {
        type: PROJECT_PICKED,
        payload: text
    };
};

export const dueDateChanged = (text) => {
    return {
        type: DUE_DATE_CHANGED,
        payload: text
    };
};

export const selectTaskType = (text) => {
    return {
        type: TASK_TYPE_SELECTED,
        payload: text
    };
};

export const fetchInCompletedTasks = (token) => {
    return (dispatch) => {
        dispatch({ type: FETCH_INCOMPLETED_TASKS });
        fetch(GET_MY_INCOMPLETED_TASKS, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then((resJson) => {
                        dispatch({ type: FETCH_TASKS_SUCCESS, payload: resJson });
                        const ongoing = resJson.filter((value) => { return value.remain_days >= 0; });
                        dispatch({ type: FETCH_ONGOING_TASKS_SUCCESS, payload: ongoing });
                        const overdue = resJson.filter((value) => { return value.remain_days < 0; });
                        dispatch({ type: FETCH_OVERDUE_TASKS_SUCCESSFUL, payload: overdue });
                    })
                    .catch(() => { });
            }
        });
    };
};

export const fetchCompletedTasks = (token) => {
    return (dispatch) => {
        dispatch({ type: FETCH_COMPLETED_TASKS });
        fetch(GET_MY_COMPLETED_TASKS, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then((resJson) => {
                        dispatch({ type: FETCH_COMPLETED_TASKS_SUCCESSFUL, payload: resJson });
                    })
                    .catch((err) => { });
            }
        });
    };
};

export const completeIncompleteTask = (token, complete, taskId, taskType) => {
    return (dispatch) => {
        fetch(`${COMPLETE_INCOMPLETE_TASK}${complete}/${taskId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                dispatch({ type: TASK_STATUS_UPDATED, payload: complete });
                refreshAllTasks(token, dispatch);
            }
        }).then(() => {
            if (taskType === 'completed') {
                refreshCompletedList(token, dispatch);
            } else {
                refreshInCompletedLists(token, dispatch);
            }
        }).catch((err) => {
        });
    };
};

const refreshCompletedList = (token, dispatch) => {
    fetch(GET_MY_COMPLETED_TASKS, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.ok) {
            return response.json()
                .then((resJson) => {
                    dispatch({ type: REFRESH_COMPLETED_TASKS, payload: resJson });
                })
                .catch((err) => { });
        }
    });
};

export const refreshInCompletedLists = (token, dispatch) => {
    fetch(GET_MY_INCOMPLETED_TASKS, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.ok) {
            return response.json()
                .then((resJson) => {
                    const ongoing = resJson.filter((value) => { return value.remain_days >= 0; });
                    dispatch({ type: REFRESH_ONGOING_TASKS, payload: ongoing });
                    const overdue = resJson.filter((value) => { return value.remain_days < 0; });
                    dispatch({ type: REFRESH_OVERDUE_TASKS, payload: overdue });
                })
                .catch((err) => { });
        }
    });
};

export const addTaskCard = (token, taskName, projectName, dueDate) => {
    return (dispatch) => {
        dispatch({ type: ADD_TASK_CARD })
        fetch(ADD_TASK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                task_name: taskName,
                deadline: dueDate,
                project_name: projectName
            })
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then((resJson) => {
                        dispatch({ type: ADD_TASK_CARD_SUCCESSFULL, payload: resJson });
                        refreshAllTasks(token, dispatch);
                        Alert.alert(
                            'Alert',
                            'Task card added!',
                            [
                                { text: 'Ok' },
                            ],
                        );
                    }).then(() => {
                        refreshInCompletedLists(token, dispatch);
                    });
            } else {
                return response.json()
                    .then((resJson) => {
                        dispatch({ type: ADD_TASK_CARD_FAILED, payload: resJson });
                        Alert.alert(
                            'Alert',
                            'Something went wrong!',
                            [
                                { text: 'Ok' },
                            ],
                        );
                    });
            }
        }).catch((err) => {
            dispatch({ type: ADD_TASK_CARD_FAILED, payload: err });
            Alert.alert(
                'Alert',
                'Something went wrong!',
                [
                    { text: 'Ok' },
                ],
            );
        });
    };
};

export const enableButton = () => {
    return {
        type: ENABLE_BUTTON
    };
};

export const fetchProjects = (token) => {
    return (dispatch) => {
        dispatch({ type: FETCH_PROJECTS });
        fetch(GET_PROJECTS, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
            }
        }).then((resJson) => {
            const names = resJson.map((obj) => {
                return obj.name;
            });
            dispatch({ type: FETCH_PROJECTS_SUCCESS, payload: names });
            dispatch({ type: SET_ARRAYHOLDER, payload: names });
        }).catch((err) => { });
    };
};

export const addProject = (token, projectName) => {
    return (dispatch) => {
        dispatch({ type: CHECK_IF_BUTTON_IS_VISIBLE, payload: false });
        fetch(GET_PROJECTS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: projectName
            })
        }).then((response) => {
            if (response.ok) {
                dispatch({ type: ADD_PROJECT_SUCCESS, payload: response });
                refreshProjects(token, dispatch);
            } else {
                dispatch({ type: ADD_PROJECT_FAILED, payload: response });
                Alert.alert(
                    'Alert',
                    'Project is already exist in the list!',
                    [
                        { text: 'Ok' },
                    ],
                );
            }
        }).catch((err) => {
            dispatch({ type: ADD_PROJECT_FAILED, payload: err });
            Alert.alert(
                'Alert',
                'Something went wrong!',
                [
                    { text: 'Ok' },
                ],
            );
        });
    };
};

const refreshProjects = (token, dispatch) => {
    dispatch({ type: FETCH_PROJECTS });
    fetch(GET_PROJECTS, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
        }
    }).then((resJson) => {
        const names = resJson.map((obj) => {
            return obj.name;
        });
        dispatch({ type: FETCH_PROJECTS_SUCCESS, payload: names });
        dispatch({ type: SET_ARRAYHOLDER, payload: names });
    }).catch((err) => { });
};

export const searchFilterAction = (text, arrayHolder) => {
    const newData = arrayHolder.filter(item => {
        const itemData = item.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
    });
    // let btnVisible = false;
    // if (newData.length === 0) {
    //     btnVisible = true;
    // } else {
    //     btnVisible = false;
    // }

    return (dispatch) => {
        dispatch({ type: SEARCH_FIELD_CHANGED, payload: newData });
        // dispatch({ type: CHECK_IF_BUTTON_IS_VISIBLE, payload: btnVisible });
    }
};
