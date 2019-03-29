import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import { HeaderLeft } from '../components/header';
import HeaderRight from '../components/header/HeaderRight';
import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from '../screens/MainTabNavigator';
import NonAdminTabNavigator from '../screens/NonAdminTabNavigator';
import SplashScreen from '../screens/SplashScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import { colors } from '../config/styles';

export const TopLevelNavigator = createStackNavigator(
    {
        SplashScreen: {
            screen: SplashScreen,
            headerMode: 'none',
            header: null,
            navigationOptions: {
                header: null
            }
        },
        LoginScreen: {
            screen: LoginScreen,
            headerMode: 'none',
            header: null,
            navigationOptions: {
                header: null
            }
        },
        MainTabNavigator: {
            screen: MainTabNavigator,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: colors.headerBlue,
                },
                headerRight: (<HeaderRight />),
                headerLeft: (<HeaderLeft />)
            }
        },
        NonAdminTabNavigator: {
            screen: NonAdminTabNavigator,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: colors.headerBlue,
                },
                headerRight: (<HeaderRight />),
                headerLeft: (<HeaderLeft />)
            }
        },
        MyProfileScreen: {
            screen: MyProfileScreen,
            navigationOptions: {
                title: 'My Profile',
                headerTintColor: colors.textWhite,
                headerTitleStyle: {
                    alignSelf: 'center',
                    color: colors.textWhite,
                    flex: 1,
                    textAlign: 'center'
                },
                headerStyle: {
                    backgroundColor: colors.headerBlue,
                },
                headerRight: (<View />)
            }
        }

    },
    {
        initialRouterName: 'MainTabNavigator',
    }
);

