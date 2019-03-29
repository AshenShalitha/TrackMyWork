import React, { Component } from 'react';
import { View, Image, StyleSheet, AsyncStorage, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { colors } from '../config/styles';
import logoImg from '../images/logoImg.png';

import { OfflineNotice } from '../components/OfflineNotice';
import {
    fetchAccessToken,
    fetchAllTasks,
    fetchAllUsers
} from '../actions';
import {
    GET_MY_ATTENDANCE
} from '../api/API';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const imageHeight = deviceHeight * 0.35;
const imageWidth = deviceWidth * 0.6;


class SplashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = { hasToken: false };
    }

    componentDidMount() {
        setTimeout(() => {
            AsyncStorage.getItem('token').then((token) => {
                this.setState({ hasToken: token !== null });
            }).then(() => {
                AsyncStorage.getItem('refreshToken').then((refreshToken) => {
                    console.log(this.state.hasToken);
                    if (this.state.hasToken) {
                        console.log('has token, getting new one')
                        this.getNewAccessToken(refreshToken);
                    } else {
                        console.log('no token, redirect to login')
                        this.props.navigation.replace('LoginScreen');
                    }
                });
            });
        }, 2000);
    }

    // componentDidUpdate() {
    //     if (this.props.allowedAccess) {
    //         this.props.navigation.replace('MainTabNavigator');
    //     }
    // }

    getNewAccessToken(refreshToken) {
        this.props.fetchAccessToken(refreshToken);
    }

    // checkIfTokenIsValid(token) {
    //     const date = moment().format('YYYY-MM-DD');
    //     fetch(`${GET_MY_ATTENDANCE}${date}`, {
    //         method: 'GET',
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     }).then((response) => {
    //         if (response.ok) {
    //             this.props.navigation.replace('MainTabNavigator');
    //         } else {
    //             this.props.navigation.replace('LoginScreen');
    //         }
    //     }).catch(() => {
    //         this.props.navigation.replace('LoginScreen');
    //     });
    // }

    // fetchData(token) {
    //     this.props.fetchAllUsers(token);
    //     this.props.fetchAllTasks(token);
    // }

    render() {
        return (
            <View style={styles.mainContainer}>
                <OfflineNotice />
                <Image style={[{ height: imageHeight, width: imageWidth }]} source={logoImg} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: colors.background
    }
});

const mapStateToProps = state => {
    return {
        allowedAccess: state.auth.allowedAccess
    };
};

export default connect(mapStateToProps, {
    fetchAccessToken,
    fetchAllUsers,
    fetchAllTasks
})(SplashScreen);