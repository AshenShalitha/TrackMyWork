import React, { Component } from 'react';
import { KeyboardAvoidingView, Dimensions, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';
import { colors } from '../../config/styles';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

class LoginForm extends Component {
    render() {
        const offset = (Platform.OS === 'android') ? -300 : 0;
        return (
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={offset}>
                <Sae
                    style={styles.saeInputStyle}
                    label={'Email'}
                    onChangeText={this.props.onEmailChange}
                    value={this.props.valueEmail}
                    labelStyle={styles.labelTextStyle}
                    inputStyle={styles.inputTextStyle}
                    keyboardType="email-address"
                    iconClass={FontAwesomeIcon}
                    iconName={'pencil'}
                    iconColor={'white'}
                    returnKeyType={'next'}
                    onSubmitEditing={() => { this.Password.focus(); }}
                    blurOnSubmit={false}
                />
                <Sae
                    style={styles.saeInputStyle}
                    labelStyle={styles.labelTextStyle}
                    inputStyle={styles.inputTextStyle}
                    label={'Password'}
                    onChangeText={this.props.onPasswordChange}
                    value={this.props.valuePassword}
                    secureTextEntry
                    iconClass={FontAwesomeIcon}
                    iconName={'pencil'}
                    iconColor={'white'}
                    ref={(input) => { this.Password = input; }}
                />
            </KeyboardAvoidingView>
        );
    }
}

const styles = EStyleSheet.create({
    saeInputStyle: {
        backgroundColor: colors.textWhite,
        marginTop: '20rem',
        maxHeight: '55rem',
        borderRadius: '2rem',
    },
    labelTextStyle: {
        marginHorizontal: '10rem',
        color: colors.textAsh,
        maxHeight: '25rem',
        fontWeight: '200',
    },
    inputTextStyle: {
        marginHorizontal: '20rem',
        color: colors.textBlack,
        fontSize: '15rem',
        fontWeight: '200'
    }
});

export { LoginForm };
