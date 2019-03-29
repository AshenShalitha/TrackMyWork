import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableNativeFeedback,
    TouchableOpacity,
    Alert,
    Dimensions,
    LayoutAnimation,
    NativeModules
} from 'react-native';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { colors } from '../../config/styles';
import { removeData } from '../../config/session';
import NavigationService from '../../services/NavigationService';
import {
    getUserDetails,
    myProfileClicked
} from '../../actions';


const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class HeaderRight extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogoutBtnVisible: false
        };
    }

    componentWillUpdate() {
        LayoutAnimation.spring();
    }

    onMenuPress() {
        this.setState.isLogoutBtnVisible = this.setState({
            isLogoutBtnVisible: !this.state.isLogoutBtnVisible
        });
    }

    onMyProfilePress() {
        this.props.myProfileClicked(this.props.user);
        NavigationService.navigate('MyProfileScreen');
    }

    renderLogoutBtn() {
        if (this.state.isLogoutBtnVisible) {
            return (
                <TouchableNativeFeedback style={styles.logoutBtn} onPress={HeaderRight.showLogoutAlert.bind(this)}>
                    <Text style={{ color: colors.textWhite, fontSize: EStyleSheet.value('12rem') }}>Logout</Text>
                </TouchableNativeFeedback>
            );
        }
    }

    static showLogoutAlert() {
        this.setState({ isLogoutBtnVisible: false });
        Alert.alert(
            'Logout',
            'Are you sure?',
            [
                { text: 'Cancel' },
                {
                    text: 'OK',
                    onPress: () => {
                        removeData('refreshToken');
                        removeData('userId');
                        removeData('token').then(() => NavigationService.replace('LoginScreen'));
                    }
                },
            ],
        );
    }

    render() {
        return (
            <View style={styles.rowContainerStyle}>
                <TouchableOpacity onPress={this.onMyProfilePress.bind(this)}>
                    <Image
                        style={styles.imageStyle}
                        source={!this.props.avatarLoading
                            ?
                            { uri: this.props.user.profile_pic }
                            :
                            require('../../images/defaultUserImg.jpg')}
                    />
                </TouchableOpacity>
                <View style={styles.textContainerStyle}>
                    <Text style={{ color: '#ffffff', fontSize: EStyleSheet.value('12rem'), fontWeight: 'bold' }}>{this.props.user.name}</Text>
                    <Text style={{ color: '#777777', fontSize: EStyleSheet.value('10rem') }}>{this.props.user.position}</Text>
                </View>
                <TouchableOpacity onPress={this.onMenuPress.bind(this)}>
                    <FeatherIcons
                        style={{ marginLeft: EStyleSheet.value('14rem'), color: '#aaaaaa' }}
                        name={'more-vertical'}
                        size={EStyleSheet.value('20rem')}
                    />
                </TouchableOpacity>
                {this.renderLogoutBtn()}
            </View>

        );
    }
}

const styles = EStyleSheet.create({
    mainContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    rowContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        padding: '10rem',
        justifyContent: 'center',
        alignItems: 'center'

    },
    textContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    imageStyle: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30rem',
        height: '30rem',
        backgroundColor: '#fff',
        borderRadius: '15rem',
        marginRight: '8rem',
        marginLeft: '20rem'
    },
    logoutBtn: {
        width: '45rem',
        height: '35rem',
        alignItems: 'center',
        justifyContent: 'center',
    }

});

const mapStateToProps = state => {
    return {
        user: state.header.userDetails,
        avatarLoading: state.header.avatarLoading
    };
};

export default connect(mapStateToProps, {
    getUserDetails,
    myProfileClicked
})(HeaderRight);
