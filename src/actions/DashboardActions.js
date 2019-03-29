import { Alert } from 'react-native';
import moment from 'moment';
import {
    GET_ALL_USERS,
    TASKS,
    ATTENDANCE,
    INCOMPLETED_TASKS,
    ADMIN_PUT_ATTENDANCE,
    COMPLETE_INCOMPLETE_TASK_ADMIN,
    GET_ATTENDANCE_INFO
} from '../api/API';
import {
    FETCH_ALL_USERS,
    FETCH_ALL_TASKS,
    FETCH_ALL_USERS_SUCCESS,
    FETCH_ALL_TASKS_SUCCESS,
    FETCH_ALL_USERS_FAILED,
    FETCH_ALL_TASKS_FAILED,
    DELETE_CARD,
    DELETE_CARD_SUCCESS,
    DELETE_CARD_FAILED,
    ADD_TASK,
    ADD_TASK_SUCCESS,
    ADD_TASK_FAILED,
    EDIT_TASK,
    EDIT_TASK_FAILED,
    EDIT_TASK_SUCCESS,
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
    USER_TASK_SEARCH_FIELD_CHANGED,
    SET_USER_TASK_ARRAYHOLDER,
    ATTENDANCE_SEARCH_FIELD_CHANGED,
    SET_ATTENDANCE_ARRAYHOLDER,
    FETCH_ATTENDANCE_INFO,
    FETCH_ATTENDANCE_INFO_SUCCESS,
    FETCH_ATTENDANCE_INFO_FAILED,
    ENABLE_SAVE_BUTTON,
    ADMIN_ATTENDANCE_MODAL_CLOSED,
    ON_ADD_TASK_MODAL_OPENED,
    ON_EDIT_TASK_MODAL_OPENED,
    ENABLE_TASK_BUTTON,
    ADMIN_TASK_MODAL_CLOSED
} from './types';

import {
    refreshInCompletedLists,
    refreshAttendanceList
} from '../actions';


export const taskIdChanged = (text) => {
    return {
        type: TASK_ID_CHANGED,
        payload: text
    };
};

export const onAddTaskModalOpened = () => {
    return {
        type: ON_ADD_TASK_MODAL_OPENED
    };
};

export const onEditTaskModalOpened = () => {
    return {
        type: ON_EDIT_TASK_MODAL_OPENED
    };
};

export const enableTaskButton = () => {
    return {
        type: ENABLE_TASK_BUTTON
    };
};

export const onAdminTaskModalClosed = () => {
    return {
        type: ADMIN_TASK_MODAL_CLOSED
    };
};

//not used
export const fetchAllUsers = (token) => {
    return (dispatch) => {
        dispatch({ type: FETCH_ALL_USERS });
        fetch(GET_ALL_USERS, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then((resJson) => {
                        dispatch({ type: FETCH_ALL_USERS_SUCCESS, payload: resJson });
                    });
            } else {
                dispatch({ type: FETCH_ALL_USERS_FAILED });
            }
        }).catch((err) => {
            dispatch({ type: FETCH_ALL_USERS_FAILED });
        });
    };
};

//not used
export const fetchAllTasks = (token) => {
    return (dispatch) => {
        dispatch({ type: FETCH_ALL_TASKS });
        fetch(INCOMPLETED_TASKS, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then((resJson) => {
                        dispatch({ type: FETCH_ALL_TASKS_SUCCESS, payload: resJson });
                    });
            } else {
                dispatch({ type: FETCH_ALL_TASKS_FAILED });
            }
        }).catch((err) => {
            dispatch({ type: FETCH_ALL_TASKS_FAILED });
        });
    };
};


export const generateUserTaskArray = (token) => {
    return (dispatch) => {
        dispatch({ type: FETCH_ALL_USERS });
        fetch(GET_ALL_USERS, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then((users) => {
                        dispatch({ type: FETCH_ALL_USERS_SUCCESS, payload: users });
                        dispatch({ type: FETCH_ALL_TASKS });
                        fetch(INCOMPLETED_TASKS, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }).then((res) => {
                            if (res.ok) {
                                return res.json()
                                    .then((tasks) => {
                                        dispatch({ type: FETCH_ALL_TASKS_SUCCESS, payload: tasks });
                                        setUserTaskArray(users, tasks, dispatch);
                                    });
                            } else {
                                dispatch({ type: FETCH_ALL_TASKS_FAILED });
                            }
                        }).catch((er) => {
                            dispatch({ type: FETCH_ALL_TASKS_FAILED });
                        });
                    });
            } else {
                dispatch({ type: FETCH_ALL_USERS_FAILED });
            }
        }).catch((err) => {
            dispatch({ type: FETCH_ALL_USERS_FAILED });
        });
    };
}

const setUserTaskArray = (users, tasks, dispatch) => {
    const userTaskArr = [];
    let taskArr = [];
    for (let i = 0; i < users.length; i++) {
        const userTaskObj = {};
        userTaskObj.userId = users[i].user_id;
        userTaskObj.name = users[i].name;
        userTaskObj.position = users[i].position;
        userTaskObj.profilePic = users[i].profile_pic;
        taskArr = [];
        for (let j = 0; j < tasks.length; j++) {
            if (users[i].user_id === tasks[j].user_id) {
                taskArr.push(tasks[j]);
            }
        }
        userTaskObj.tasks = taskArr;
        userTaskArr.push(userTaskObj);
    }
    dispatch({ type: USER_TASK_ARRAY_SET, payload: userTaskArr });
    dispatch({ type: SET_USER_TASK_ARRAYHOLDER, payload: userTaskArr });
};

export const filterUserTaskArray = (text, arrayHolder) => {
    const newData = arrayHolder.filter(item => {
        const itemData = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
    });
    return (dispatch) => {
        dispatch({ type: USER_TASK_SEARCH_FIELD_CHANGED, payload: newData });
    };
};

export const deleteTaskCard = (token, taskId) => {
    return (dispatch) => {
        dispatch({ type: DELETE_CARD });
        fetch(`${TASKS}${taskId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                dispatch({ type: DELETE_CARD_SUCCESS });
                Alert.alert(
                    'Alert',
                    'Card deleted successfully!',
                    [
                        {
                            text: 'Ok',
                            onPress: () => {
                                refreshAllTasks(token, dispatch);
                                refreshInCompletedLists(token, dispatch);
                            }
                        },
                    ],
                );
            } else {
                dispatch({ type: DELETE_CARD_FAILED });
                Alert.alert(
                    'Error',
                    'Something went wrong!',
                    [
                        { text: 'Ok' },
                    ],
                );
            }
        }).catch((err) => {
            dispatch({ type: DELETE_CARD_FAILED });
            Alert.alert(
                'Error',
                'Something went wrong!',
                [
                    { text: 'Ok' },
                ],
            );
        });
    };
};

export const addTask = (token, taskName, deadline, userId, projectName) => {
    return (dispatch) => {
        dispatch({ type: ADD_TASK });
        fetch(TASKS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                task_name: taskName,
                deadline,
                user_id: userId,
                project_name: projectName
            })
        }).then((response) => {
            if (response.ok) {
                dispatch({ type: ADD_TASK_SUCCESS });
                Alert.alert(
                    'Alert',
                    'Card added successfully!',
                    [
                        {
                            text: 'Ok',
                            onPress: () => {
                                refreshAllTasks(token, dispatch);
                                refreshInCompletedLists(token, dispatch);
                                onAdminTaskModalClosed();
                            }
                        },
                    ],
                );
            } else {
                dispatch({ type: ADD_TASK_FAILED });
                Alert.alert(
                    'Alert',
                    'Something went wrong!',
                    [
                        {
                            text: 'Ok',
                            onPress: () => {
                                refreshAllTasks(token, dispatch);
                            }
                        },
                    ],
                );
            }
        }).catch((err) => {
            dispatch({ type: ADD_TASK_FAILED });
            Alert.alert(
                'Alert',
                'Something went wrong!',
                [
                    {
                        text: 'Ok',
                        onPress: () => {
                            refreshAllTasks(token, dispatch);
                        }
                    },
                ],
            );
        })
    };
};

export const editTask = (token, taskName, dueDate, taskId) => {
    return (dispatch) => {
        dispatch({ type: EDIT_TASK });
        fetch(`${TASKS}${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                task_name: taskName,
                deadline: dueDate,
                completed: false
            })
        }).then((response) => {
            if (response.ok) {
                dispatch({ type: EDIT_TASK_SUCCESS });
                Alert.alert(
                    'Alert',
                    'Card updated successfully!',
                    [
                        {
                            text: 'Ok',
                            onPress: () => {
                                refreshAllTasks(token, dispatch);
                                refreshInCompletedLists(token, dispatch);
                                onAdminTaskModalClosed();
                            }
                        },
                    ],
                );
            } else {
                dispatch({ type: EDIT_TASK_FAILED });
                Alert.alert(
                    'Alert',
                    'Something went wrong!',
                    [
                        {
                            text: 'Ok',
                        },
                    ],
                );
            }
        }).catch((err) => {
            dispatch({ type: EDIT_TASK_FAILED });
            Alert.alert(
                'Alert',
                'Something went wrong!',
                [
                    {
                        text: 'Ok',
                    },
                ],
            );
        })
    };
};

// const refreshAllTasks = (token, dispatch) => {
//     dispatch({ type: FETCH_ALL_TASKS });
//     fetch(INCOMPLETED_TASKS, {
//         method: 'GET',
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     }).then((response) => {
//         if (response.ok) {
//             return response.json()
//                 .then((resJson) => {
//                     dispatch({ type: FETCH_ALL_TASKS_SUCCESS, payload: resJson });
//                 });
//         } else {
//             dispatch({ type: FETCH_ALL_TASKS_FAILED });
//         }
//     }).catch((err) => {
//         dispatch({ type: FETCH_ALL_TASKS_FAILED });
//     });
// };

export const refreshAllTasks = (token, dispatch) => {
    dispatch({ type: FETCH_ALL_USERS });
    fetch(GET_ALL_USERS, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.ok) {
            return response.json()
                .then((users) => {
                    dispatch({ type: FETCH_ALL_USERS_SUCCESS, payload: users });
                    dispatch({ type: FETCH_ALL_TASKS });
                    fetch(INCOMPLETED_TASKS, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then((res) => {
                        if (res.ok) {
                            return res.json()
                                .then((tasks) => {
                                    dispatch({ type: FETCH_ALL_TASKS_SUCCESS, payload: tasks });
                                    setUserTaskArray(users, tasks, dispatch);
                                });
                        } else {
                            dispatch({ type: FETCH_ALL_TASKS_FAILED });
                        }
                    }).catch((er) => {
                        dispatch({ type: FETCH_ALL_TASKS_FAILED });
                    });
                });
        } else {
            dispatch({ type: FETCH_ALL_USERS_FAILED });
        }
    }).catch((err) => {
        dispatch({ type: FETCH_ALL_USERS_FAILED });
    });
};

export const adminCompleteIncompleteTask = (token, complete, taskId) => {
    return (dispatch) => {
        fetch(`${COMPLETE_INCOMPLETE_TASK_ADMIN}${complete}/${taskId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                dispatch({ type: ADMIN_TASK_STATUS_UPDATED, payload: complete });
                refreshAllTasks(token, dispatch);
                refreshInCompletedLists(token, dispatch);
            }
        }).catch((err) => { });
    };
};
//-------------------------------------------------------------------------------------------------
//Attendance actions
//-------------------------------------------------------------------------------------------------

export const yearChanged = year => {
    return {
        type: YEAR_CHANGED,
        payload: year
    };
};

export const monthChanged = date => {
    return {
        type: MONTH_CHANGED,
        payload: date
    };
};

export const fetchAttendanceSummary = (token, year, month) => {
    return (dispatch) => {
        dispatch({ type: FETCH_ATTENDANCE_SUMMARY });
        fetch(`${ATTENDANCE}${year}/${month}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then((resJson) => {
                        dispatch({ type: FETCH_ATTENDANCE_SUMMARY_SUCCESS, payload: resJson });
                        dispatch({ type: SET_ATTENDANCE_ARRAYHOLDER, payload: resJson });
                    })
            } else {
                dispatch({ type: FETCH_ATTENDANCE_SUMMARY_FAILED });
            }
        }).catch((err) => {
            dispatch({ type: FETCH_ATTENDANCE_SUMMARY_FAILED });

        });
    };
};

export const refreshAttendanceSummary = (token, year, month, dispatch) => {
    dispatch({ type: FETCH_ATTENDANCE_SUMMARY });
    fetch(`${ATTENDANCE}${year}/${month}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.ok) {
            return response.json()
                .then((resJson) => {
                    dispatch({ type: FETCH_ATTENDANCE_SUMMARY_SUCCESS, payload: resJson });
                    dispatch({ type: SET_ATTENDANCE_ARRAYHOLDER, payload: resJson });
                })
        } else {
            dispatch({ type: FETCH_ATTENDANCE_SUMMARY_FAILED });
        }
    }).catch((err) => {
        dispatch({ type: FETCH_ATTENDANCE_SUMMARY_FAILED });
    });
};

export const attendanceCategorySelected = (text) => {
    return {
        type: ADMIN_ATTENDANCE_TYPE_CHANGED,
        payload: text
    };
};

export const attendanceReasonChanged = text => {
    return {
        type: ADMIN_ATTENDANCE_REASON_CHANGED,
        payload: text
    };
};

export const attendanceDateSet = text => {
    return {
        type: ADMIN_ATTENDANCE_DATE_SET,
        payload: text
    };
};

export const adminAttendanceUpdate = (token, userId, date, status, reason) => {
    return (dispatch) => {
        console.log(`${ADMIN_PUT_ATTENDANCE}${userId}`);
        dispatch({ type: ADMIN_ATTENDANCE_UPDATE });
        fetch(`${ADMIN_PUT_ATTENDANCE}${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                date,
                status,
                reason
            })
        }).then((response) => {
            if (response.ok) {
                dispatch({ type: ADMIN_ATTENDANCE_UPDATE_SUCCESS });
                console.log(date);
                refreshAttendanceSummary(token, moment(date).format('YYYY'), moment(date).format('M'), dispatch);
            } else {
                dispatch({ type: ADMIN_ATTENDANCE_UPDATE_FAILED });
            }
        }).catch((err) => {
            dispatch({ type: ADMIN_ATTENDANCE_UPDATE_FAILED });
        });
    };
};

export const filterAttendance = (text, arrayHolder) => {
    const newData = arrayHolder.filter(item => {
        const itemData = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
    });
    return (dispatch) => {
        dispatch({ type: ATTENDANCE_SEARCH_FIELD_CHANGED, payload: newData });
    };
};

export const getAttendanceInfo = (token, date, userId) => {
    return (dispatch) => {
        dispatch({ type: FETCH_ATTENDANCE_INFO });
        fetch(`${GET_ATTENDANCE_INFO}${userId}/${date}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then((resJson) => {
                        dispatch({ type: FETCH_ATTENDANCE_INFO_SUCCESS, payload: resJson[0].reason });
                    });
            } else {
                dispatch({ type: FETCH_ATTENDANCE_INFO_FAILED });
            }
        }).catch(() => {
            dispatch({ type: FETCH_ATTENDANCE_INFO_FAILED });
        });
    };
};

export const enableSaveButton = () => {
    return {
        type: ENABLE_SAVE_BUTTON
    };
};

export const adminAttendanceModalClosed = () => {
    return {
        type: ADMIN_ATTENDANCE_MODAL_CLOSED
    };
};