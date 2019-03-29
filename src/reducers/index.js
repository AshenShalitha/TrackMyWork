import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import TasksReducer from './TasksReducer';
import AttendanceReducer from './AttendanceReducer';
import HeaderReducer from './HeaderReducer';
import MyProfileReducer from './MyProfileReducer';
import DashBoardReducer from './DashboardReducer';

export default combineReducers({
    auth: AuthReducer,
    tasks: TasksReducer,
    attendance: AttendanceReducer,
    header: HeaderReducer,
    myProfile: MyProfileReducer,
    dashboard: DashBoardReducer
}); 