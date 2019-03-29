import {
    ATTENDANCE_CATEGORY_PICKED,
    ATTENDANCE_MESSAGE_CHANGED,
    ATTENDANCE_MARKING,
    ATTENDANCE_MARKED_SUCCESSFULLY,
    UPDATE_ATTENDANCE,
    UPDATE_ATTENDANCE_SUCCESSFUL,
    ATTENDANCE_IS_MARKED,
    ATTENDANCE_IS_NOT_MARKED,
    FETCH_ATTENDANCE,
    FETCH_ATTENDANCE_SUCCESSFUL,
    FETCH_MY_TODAY_ATTENDANCE,
    FETCH_MY_TODAY_ATTENDANCE_SUCCESS,
    FETCH_MY_TODAY_ATTENDANCE_FAILED,
} from './types';
import {
    MARK_ATTENDANCE,
    PUT_ATTENDANCE,
    GET_ATTENDANCE,
    GET_MY_ATTENDANCE
} from '../api/API';

import {
    refreshAttendanceSummary
} from './DashboardActions';

//attendance picker listner
export const pickAttendanceCategory = (text) => {
    return {
        type: ATTENDANCE_CATEGORY_PICKED,
        payload: text
    };
};

//attendance messege input listner
export const attendanceMessegeChanged = (text) => {
    return {
        type: ATTENDANCE_MESSAGE_CHANGED,
        payload: text
    };
};

//mark today attendance
export const markAttendance = (token, user_id, status, reason, date, currentYear, currentMonth) => {
    return (dispatch) => {
        dispatch({ type: ATTENDANCE_MARKING });
        fetch(MARK_ATTENDANCE, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status,
                user_id,
                reason
            }),
        }).then((response) => {
            if (response.ok) {
                dispatch({ type: ATTENDANCE_MARKED_SUCCESSFULLY });
                refreshAttendanceSummary(token, currentYear, currentMonth, dispatch);
            } else {
                updateAttendance(token, user_id, status, reason, date, dispatch, currentYear, currentMonth);
            }
        }).then(() => {
            refreshAttendanceList(token, dispatch, currentYear, currentMonth);
        }).catch(() => {

        });
    };
};

//update today attendance
const updateAttendance = (token, userId, status, reason, date, dispatch, currentYear, currentMonth) => {
    dispatch({ type: UPDATE_ATTENDANCE });
    fetch(`${PUT_ATTENDANCE}${userId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status,
            reason
        }),
    }).then((response) => {
        if (response.ok) {
            dispatch({ type: UPDATE_ATTENDANCE_SUCCESSFUL });
            refreshAttendanceList(token, dispatch, currentYear, currentMonth);
            refreshAttendanceSummary(token, currentYear, currentMonth, dispatch);
        }
    }).catch(() => { });
};

//get user's today attendance to check status
export const fetchTodayAttendance = (date, token) => {
    let isStatusSet;
    let status;
    return (dispatch) => {
        dispatch({ type: FETCH_MY_TODAY_ATTENDANCE });
        fetch(`${GET_MY_ATTENDANCE}${date}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then((resJson) => {
                        if (resJson.length === 0) {
                            isStatusSet = false;
                            status = 'not_informed';
                        } else {
                            isStatusSet = true;
                            status = resJson[0].status;
                        }
                        dispatch({ type: FETCH_MY_TODAY_ATTENDANCE_SUCCESS, payload: resJson });
                        checkAttendanceIsMarked(isStatusSet, status, dispatch);
                    });
            } else {
                return response.json()
                    .then((resJson) => {
                        dispatch({ type: FETCH_MY_TODAY_ATTENDANCE_FAILED, payload: resJson });
                    });
            }
        }).catch((err) => {
            dispatch({ type: FETCH_MY_TODAY_ATTENDANCE_FAILED, payload: err });
        });
    };
};

// check if today attendance is marked or not
const checkAttendanceIsMarked = (isStatusSet, status, dispatch) => {
    if (isStatusSet) {
        dispatch({ type: ATTENDANCE_IS_MARKED, payload: status });
    } else {
        dispatch({ type: ATTENDANCE_IS_NOT_MARKED });
    }
};

//get attendance summary of all users for the month
export const getAttendanceList = (token, year, month) => {
    return (dispatch) => {
        dispatch({ type: FETCH_ATTENDANCE });
        fetch(`${GET_ATTENDANCE}${year}/${month}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                return response.json()
                    .then((resJson) => {
                        dispatch({ type: FETCH_ATTENDANCE_SUCCESSFUL, payload: resJson });
                    });
            } else {

            }
        }).catch(() => {

        });
    };
};

//refresh attendance summary of all users for the month
export const refreshAttendanceList = (token, dispatch, year, month) => {
    dispatch({ type: FETCH_ATTENDANCE });
    fetch(`${GET_ATTENDANCE}${year}/${month}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.ok) {
            return response.json()
                .then((resJson) => {
                    dispatch({ type: FETCH_ATTENDANCE_SUCCESSFUL, payload: resJson });
                });
        } else {

        }
    }).catch(() => {

    });
};

