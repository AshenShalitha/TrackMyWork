import React, { Component } from 'react';
import { View, Text, Image, Dimensions, Alert } from 'react-native';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SkypeIndicator } from 'react-native-indicators';

import { LoginForm } from '../components/LoginForm';
import { Button } from '../components/Button';
import { OfflineNotice } from '../components/OfflineNotice';
import { colors } from '../config/styles';
import { strings } from '../config/strings';
import logoImg from '../images/logoImg.png';
import {
    emailChanged,
    passwordChanged,
    loginUser
} from '../actions';


const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

class LoginScreen extends Component {

    onEmailChange(text) {
        this.props.emailChanged(text);
    }

    onPasswordChange(text) {
        this.props.passwordChanged(text);
    }

    onButtonPress() {
        const { email, password } = this.props;
        this.validate(email, password);
    }

    validate(email, password) {
        if (email === '' || password === '') {
            Alert.alert(
                'Login Failed',
                'Please fill all the fields!',
                [
                    { text: 'Ok' },
                ],
            );
        }
        else if (!LoginScreen.validateEmail(email)) {
            Alert.alert(
                'Login Failed',
                'Invalid email!',
                [
                    { text: 'Ok' },
                ],
            );
        }
        else {
            this.props.loginUser({ email, password });
        }
    }

    static validateEmail(email) {
        let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(email);
    }

    renderButton() {
        if (this.props.loading) {
            return <SkypeIndicator color={colors.buttonRed} size={EStyleSheet.value('40rem')} />;
        }
        else {
            return (
                <Button onPress={this.onButtonPress.bind(this)} color={colors.buttonRed} textColor={colors.textWhite}>
                    Login
                </Button>
            );
        }
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <OfflineNotice />
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={logoImg} />
                </View>
                <View style={styles.formContainer}>
                    <LoginForm
                        onEmailChange={this.onEmailChange.bind(this)}
                        valueEmail={this.props.email}
                        onPasswordChange={this.onPasswordChange.bind(this)}
                        valuePassword={this.props.password}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    {this.renderButton()}
                </View>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>{strings.loginFooter}</Text>
                </View>
            </View>
        );
    }
}

const styles = EStyleSheet.create({
    containerStyle: {
        flex: 1,
        paddingHorizontal: '30rem',
        backgroundColor: colors.background
    },
    imageContainer: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        flex: 2,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    footerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerText: {
        fontSize: '10rem',
        color: colors.textGray
    },
    image: {
        height: '250rem',
        width: '250rem'
    }
});

const mapStateToProps = state => {
    return {
        email: state.auth.email,
        password: state.auth.password,
        loading: state.auth.loading
    };
};

export default connect(mapStateToProps, {
    emailChanged,
    passwordChanged,
    loginUser
})(LoginScreen);