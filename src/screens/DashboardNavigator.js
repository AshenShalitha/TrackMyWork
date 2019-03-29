import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';

import AllTasksTab from './AllTasksTab';
import AttendanceTab from './AttendanceTab';
import { colors } from '../config/styles';

export default createMaterialTopTabNavigator(
    {
        AllTsks: {
            screen: AllTasksTab,
            navigationOptions: {
                tabBarLabel: 'All Tasks'
            },
        },
        Attendance: { screen: AttendanceTab }
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
            upperCaseLabel: false,
        },
        lazy: false
    }
);
