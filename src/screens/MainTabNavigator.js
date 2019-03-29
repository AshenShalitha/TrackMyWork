import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';

import TasksScreen from './TasksScreen';
import AttendanceScreen from './AttendanceScreen';
import DashboardNavigator from './DashboardNavigator';
import { colors } from '../config/styles';

export default createMaterialTopTabNavigator(
    {
        Dashboard: { screen: DashboardNavigator },
        Tasks: { screen: TasksScreen },
        Attendance: { screen: AttendanceScreen }
    },
    {
        tabBarOptions: {
            indicatorStyle: {
                backgroundColor: colors.indicatoeRed,
                height: 5
            },
            style: {
                backgroundColor: colors.textWhite
            },
            labelStyle: {
                color: colors.textGray
            },
            upperCaseLabel: false
        },
        initialRouteName: 'Tasks',
        lazy: false
    }
);
