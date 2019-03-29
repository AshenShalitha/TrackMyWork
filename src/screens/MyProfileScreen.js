import React, { Component } from 'react';
import {
    ScrollView,
    Image,
    View,
    Text,
    Dimensions,
    AsyncStorage,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SkypeIndicator } from 'react-native-indicators';

import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { OfflineNotice } from '../components/OfflineNotice';
import { colors } from '../config/styles';
import {
    nameChanged,
    contactNoChanged,
    oldPasswordChanged,
    newPasswordChanged,
    confirmChanged,
    changePassword,
    activatePaswordChangeButton,
    deactivatePaswordChangeButton,
    updateMyProfile,
    profilePictureChanged
} from '../actions';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const options = {
    title: 'Select Avatar',
    quality: 0.3

};
let fileName;
let fileType;
let uri;

class MyProfileScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            avatarSource: null,
        };
    }

    onNameChanged(text) {
        this.props.nameChanged(text);
    }

    onContactNoChanged(text) {
        this.props.contactNoChanged(text);
    }

    onOldPasswordChanged(text) {
        this.props.oldPasswordChanged(text);
        if (this.validatePasswordFields(text, this.props.newPassword, this.props.confirm)) {
            this.props.activatePaswordChangeButton();
        } else {
            this.props.deactivatePaswordChangeButton();
        }
    }

    onConfirmChanged(text) {
        this.props.confirmChanged(text);
        if (this.validatePasswordFields(this.props.oldPassword, this.props.newPassword, text)) {
            this.props.activatePaswordChangeButton();
        } else {
            this.props.deactivatePaswordChangeButton();
        }
    }

    onNewPasswordChanged(text) {
        this.props.newPasswordChanged(text);
        if (this.validatePasswordFields(this.props.oldPassword, text, this.props.confirm)) {
            this.props.activatePaswordChangeButton();
        } else {
            this.props.deactivatePaswordChangeButton();
        }
    }

    onPasswordChangePressed() {
        AsyncStorage.getItem('token')
            .then((token) => {
                this.props.changePassword(token, this.props.user.email, this.props.oldPassword, this.props.newPassword);
            });
    }

    setAvatar() {
        if (this.state.avatarSource !== null) {
            return this.state.avatarSource;
        } else {
            return { uri: this.props.user.profile_pic }
        }
    }

    pickImage() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log(response)
            if (!response.didCancel) {
                fileName = response.fileName;
                fileType = response.type;
                uri = response.uri;
            }
            if (response.didCancel) {

            } else if (response.error) {

            } else {
                this.props.profilePictureChanged();
                const source = { uri: response.uri };
                this.setState({
                    avatarSource: source,
                });
            }
        });
    }

    saveUserDetails() {
        if (this.state.avatarSource !== null) {
            AsyncStorage.getItem('token').then((token) => {
                this.props.updateMyProfile(token, fileName, fileType, uri, this.props.name, this.props.contactNo);
            });
        } else {
            AsyncStorage.getItem('token').then((token) => {
                this.props.updateMyProfile(token, null, null, null, this.props.name, this.props.contactNo);
            });
        }
    }

    validatePasswordFields(oldpw, newpw, confirm) {
        if (oldpw === '' || newpw === '' || confirm === '') {
            return false;
        } else if (newpw !== confirm) {
            return false;
        }
        return true;
    }

    renderChangePasswordButton() {
        if (this.props.changePasswordLoading) {
            return <SkypeIndicator color={colors.buttonRed} size={EStyleSheet.value('40rem')} />;
        } else {
            return (
                <Button
                    onPress={this.onPasswordChangePressed.bind(this)}
                    disabled={this.props.pwChangeBtnIsDisabled}
                    color={this.props.pwChangeBtnColor}
                    textColor={this.props.pwChangeButtonTextColor}
                >
                    Change
                </Button>
            );
        }
    }

    renderSaveChangesButton() {
        if (this.props.saveDetailsLoading) {
            return <SkypeIndicator color={colors.buttonRed} size={EStyleSheet.value('40rem')} />;
        } else {
            return (
                <Button
                    disabled={this.props.saveBtnIsDisabled}
                    color={this.props.saveBtnColor}
                    textColor={this.props.saveBtnTextColor}
                    onPress={this.saveUserDetails.bind(this)}
                >
                    Save Changes
                </Button>
            );
        }
    }

    render() {
        return (
            <ScrollView style={[styles.mainContainer]}>
                <OfflineNotice />
                <View style={{ flex: 1, paddingHorizontal: EStyleSheet.value('10rem') }}>
                    {/*Profile Picture Card */}
                    <Card style={[styles.cardStyle, { marginTop: EStyleSheet.value('16rem'), marginBottom: EStyleSheet.value('8rem') }]}>
                        <View style={{ alignItems: 'center', paddingTop: EStyleSheet.value('8rem') }}>
                            <Image
                                style={styles.imageStyle}
                                source={this.setAvatar()}
                            />
                            <TouchableOpacity
                                onPress={this.pickImage.bind(this)}
                                style={{
                                    position: 'relative',
                                    left: EStyleSheet.value('70rem'),
                                    top: -EStyleSheet.value('50rem'),
                                    zIndex: 1,
                                    backgroundColor: '#eee',
                                    width: EStyleSheet.value('46rem'),
                                    height: EStyleSheet.value('46rem'),
                                    borderRadius: EStyleSheet.value('23rem'),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 2,
                                    borderColor: colors.textWhite
                                }}
                            >
                                <FontAwesomeIcon
                                    name='camera'
                                    size={EStyleSheet.value('16rem')}
                                    color={colors.textBlack}
                                    style={{ elevation: 2 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingBottom: EStyleSheet.value('10rem'), paddingHorizontal: EStyleSheet.value('30rem') }}>
                            <View style={{ flex: 1 }}>
                                <Input
                                    label='Name'
                                    onChangeText={this.onNameChanged.bind(this)}
                                    value={this.props.name}
                                />
                            </View>
                            <View style={{ flex: 1, marginTop: EStyleSheet.value('20rem') }}>
                                <Input
                                    label='Contact No'
                                    onChangeText={this.onContactNoChanged.bind(this)}
                                    value={this.props.contactNo}
                                    keyboardType='numeric'
                                />
                            </View>
                            <View style={{ flex: 1, marginTop: EStyleSheet.value('20rem') }}>
                                {this.renderSaveChangesButton()}
                            </View>
                        </View>
                    </Card>
                    <Card style={[styles.cardStyle, { marginBottom: EStyleSheet.value('16rem'), marginTop: EStyleSheet.value('8rem') }]}>
                        <Text style={styles.headingStyle}>Change Password</Text>
                        <View>
                            <View style={styles.bodySectionContainer}>
                                <Input
                                    label='Old Password'
                                    onChangeText={this.onOldPasswordChanged.bind(this)}
                                    value={this.props.oldPassword}
                                    secureTextEntry
                                />
                            </View>
                            <View style={styles.bodySectionContainer}>
                                <Input
                                    label='New Password'
                                    onChangeText={this.onNewPasswordChanged.bind(this)}
                                    value={this.props.newPassword}
                                    secureTextEntry
                                />
                            </View>
                            <View style={styles.bodySectionContainer}>
                                <Input
                                    label='Confirm'
                                    onChangeText={this.onConfirmChanged.bind(this)}
                                    value={this.props.confirm}
                                    secureTextEntry
                                />
                            </View>
                            <View style={styles.bodySectionContainer}>
                                {this.renderChangePasswordButton()}
                            </View>
                        </View>
                    </Card>
                </View>
            </ScrollView >
        );
    }
}

const styles = EStyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    cardStyle: {
        alignSelf: 'stretch',
    },
    imageStyle: {
        borderWidth: '1rem',
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: '200rem',
        height: '200rem',
        backgroundColor: '#fff',
        borderRadius: '100rem',
        marginRight: '8rem',
        marginLeft: '20rem',
        zIndex: 1,
    },
    headingStyle: {
        textAlign: 'center',
        fontSize: '25rem',
        color: colors.black,
        fontWeight: 'bold',
        paddingVertical: '10rem'
    },
    bodySectionContainer: {
        paddingVertical: '10rem',
        paddingHorizontal: '30rem'
    }
});

const mapStateToProps = state => {
    return {
        user: state.header.userDetails,
        name: state.myProfile.name,
        contactNo: state.myProfile.contactNo,
        oldPassword: state.myProfile.oldPassword,
        newPassword: state.myProfile.newPassword,
        confirm: state.myProfile.confirm,
        pwChangeBtnIsDisabled: state.myProfile.pwChangeBtnIsDisabled,
        pwChangeBtnColor: state.myProfile.pwChangeBtnColor,
        pwChangeButtonTextColor: state.myProfile.pwChangeButtonTextColor,
        changePasswordLoading: state.myProfile.changePasswordLoading,
        saveDetailsLoading: state.myProfile.saveDetailsLoading,
        saveBtnIsDisabled: state.myProfile.saveBtnIsDisabled,
        saveBtnColor: state.myProfile.saveBtnColor,
        saveBtnTextColor: state.myProfile.saveBtnTextColor
    };
};

export default connect(mapStateToProps, {
    nameChanged,
    contactNoChanged,
    oldPasswordChanged,
    newPasswordChanged,
    confirmChanged,
    changePassword,
    activatePaswordChangeButton,
    deactivatePaswordChangeButton,
    updateMyProfile,
    profilePictureChanged
})(MyProfileScreen);
