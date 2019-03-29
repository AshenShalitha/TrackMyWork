import React, { Component } from 'react';
import {
    View,
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Picker,
    TextInput,
    Keyboard,
    AsyncStorage,
    Modal
} from 'react-native';
import { connect } from 'react-redux';
import Grid from 'react-native-grid-component';
import EStyleSheet from 'react-native-extended-stylesheet';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { SkypeIndicator } from 'react-native-indicators';
import { Dropdown } from 'react-native-material-dropdown';
// import Modal from 'react-native-modal'; 
import moment from 'moment';

import { Input } from '../Input';
import { Button } from '../Button';
import { UserCollapsable } from '../UserCollapsable';
import { colors } from '../../config/styles';
import {
    attendanceCategorySelected,
    attendanceReasonChanged,
    attendanceDateSet,
    getAttendanceInfo,
    enableSaveButton,
    adminAttendanceModalClosed,
    adminAttendanceUpdate
} from '../../actions';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const deviceHeight = Dimensions.get('window').height;
const modalHeight = deviceHeight - 100;

class UserAttendanceRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            attendanceModalVisible: false,
            keyboardVisible: false,
            attendanceCategory: '',
        };
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({
            keyboardVisible: true
        });
    }

    _keyboardDidHide = () => {
        this.setState({
            keyboardVisible: false
        });
    }

    onItemPressed(key, data, isTop) {
        this.setState({ attendanceModalVisible: !this.state.attendanceModalVisible });
        console.log(this.state.attendanceModalVisible);
        const { year, date } = this.props;
        const month = moment(date).format('MM');
        switch (data) {
            case colors.green:
                this.props.attendanceCategorySelected('present');
                break;
            case colors.blue:
                this.props.attendanceCategorySelected('work_from_home');
                break;
            case colors.buttonRed:
                this.props.attendanceCategorySelected('absent');
                break;
            case colors.headerBlue:
                this.props.attendanceCategorySelected('default');
                break;
            default:
                this.props.attendanceCategorySelected('default');
        }
        if (isTop) {
            this.props.attendanceDateSet(`${year}-${month}-${key + 1}`);
        } else {
            this.props.attendanceDateSet(`${year}-${month}-${key + 17}`);
        }
        AsyncStorage.getItem('token').then((token) => {
            this.props.getAttendanceInfo(token, this.props.attendanceDate, this.props.item.user_id);
        });
    }

    setColor(type) {
        switch (type) {
            case 'not_informed':
                return colors.headerBlue;
            case 'present':
                return colors.green;
            case 'absent':
                return colors.buttonRed;
            case 'work_from_home':
                return colors.blue;
            default:
                return colors.headerBlue;
        }
    }

    generateAttendanceArray(isTopRow) {
        const obj = this.props.item;
        const attendanceArr = [];
        for (var key in obj) {
            if (key.startsWith('day')) {
                const number = key.replace('day', '');
                attendanceArr.splice(number - 1, 0, this.setColor(obj[key]));
            }
        }
        if (isTopRow) {
            return attendanceArr.splice(0, 16);
        } else {
            return attendanceArr.splice(16);
        }
    }

    renderTopItem = (data, i) => (
        <TouchableOpacity key={i} onPress={this.onItemPressed.bind(this, i, data, true)}>
            <View style={[{ backgroundColor: data }, styles.item]} >
                <Text style={styles.text}>{i + 1}</Text>
            </View>
        </TouchableOpacity>
    );

    renderBottomItem = (data, i) => (
        <TouchableOpacity key={i} onPress={this.onItemPressed.bind(this, i, data, false)}>
            <View style={[{ backgroundColor: data }, styles.item]} >
                <Text style={styles.text}>{i + 17}</Text>
            </View>
        </TouchableOpacity>
    );

    onAttendanceSetPressed() {
        const { attendanceDate, attendanceCategory, attendanceReason } = this.props;
        const { user_id: userId } = this.props.item;
        AsyncStorage.getItem('token').then((token) => {
            this.props.adminAttendanceUpdate(token, userId, attendanceDate, attendanceCategory, attendanceReason);
        });
    }

    setDropDownValue(language) {
        switch (language) {
            case 'default':
                return 'Not Informed';
            case 'absent':
                return 'Absent';
            case 'present':
                return 'Present';
            case 'work_from_home':
                return 'Work From Home';
            default:
                return null;
        }
    }

    onAttendanceCategoryPicked = (category) => {
        let itemValue;
        switch (category) {
            case 'Not Informed':
                itemValue = 'default';
                break;
            case 'Absent':
                itemValue = 'absent';
                break;
            case 'Present':
                itemValue = 'present';
                break;
            case 'Work From Home':
                itemValue = 'work_from_home';
                break;
            default:
                return null;
        }

        this.props.attendanceCategorySelected(itemValue);
        this.props.enableSaveButton();
    }

    render() {
        const { name, profile_pic: profilePic, position } = this.props.item;

        let data = [
            {
                value: 'Not Informed'
            },
            {
                value: 'Absent'
            },
            {
                value: 'Present'
            },
            {
                value: 'Work From Home'
            }];

        return (
            <View style={styles.mainContainer}>
                <UserCollapsable
                    name={name}
                    profilePic={profilePic}
                    position={position}
                    buttonInvisible
                />
                <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 10 }}>
                    <View>
                        <Grid
                            style={styles.list}
                            renderItem={this.renderTopItem}
                            data={this.generateAttendanceArray(true)}
                            itemsPerRow={16}
                        />
                        <Grid
                            style={styles.list}
                            renderItem={this.renderBottomItem}
                            data={this.generateAttendanceArray(false)}
                            itemsPerRow={16}
                        />
                    </View>
                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent
                    visible={this.state.attendanceModalVisible}
                    onBackdropPress={() => {
                        this.setState({ attendanceModalVisible: false, });
                        this.props.adminAttendanceModalClosed();
                    }}
                    onRequestClose={() => {
                        this.setState({ attendanceModalVisible: false, });
                        this.props.attendanceReasonChanged('');
                        this.props.adminAttendanceModalClosed();
                    }}
                // isVisible={this.state.attendanceModalVisible}
                // backdropColor='black'
                // useNativeDriver
                // animationInTiming={300}
                // animationOutTiming={200}
                // deviceHeight={deviceHeight}
                // deviceWidth={entireScreenWidth}
                // onBackdropPress={() => {
                //     this.setState({ attendanceModalVisible: false, });
                //     this.props.attendanceReasonChanged('');
                //     this.props.adminAttendanceModalClosed();
                // }}
                // onBackButtonPress={() => {
                //     this.setState({ attendanceModalVisible: false, });
                //     this.props.attendanceReasonChanged('');
                //     this.props.adminAttendanceModalClosed();
                // }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPressOut={() => {
                            this.setState({
                                attendanceModalVisible: false
                            });
                            this.props.attendanceReasonChanged('');
                            this.props.adminAttendanceModalClosed();
                        }}
                        style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'rgba(1, 1, 1, 0.7)' }}
                    >
                        <TouchableWithoutFeedback>
                            {/* modal header */}
                            <View style={[styles.modalStyle, { height: modalHeight }]}>
                                <View style={styles.modalHeaderStyle}>
                                    <View style={styles.modalHeaderTopStyle}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ attendanceModalVisible: false, });
                                                this.props.attendanceReasonChanged('');
                                                this.props.adminAttendanceModalClosed();
                                            }}
                                        >
                                            <IonIcon
                                                name='md-close-circle'
                                                size={EStyleSheet.value('22rem')}
                                                color={colors.textWhite}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.modalHeaderBottomStyle}>
                                        <Text style={styles.modalHeaderTextStyle}>ATTENDANCE INFO</Text>
                                    </View>
                                </View>
                                {/* modal body */}
                                <View style={styles.modalBodyStyle}>
                                    {/* task user name */}
                                    {
                                        !this.state.keyboardVisible ?
                                            <View style={styles.modalBodySection} >
                                                <Input
                                                    label="User Name"
                                                    editable={false}
                                                    value={name}
                                                />
                                            </View >
                                            :
                                            null
                                    }
                                    {/* date */}
                                    {
                                        !this.state.keyboardVisible ?
                                            <View style={[styles.modalBodySection, { justifyContent: 'flex-start' }]}>
                                                <Input
                                                    label="Date"
                                                    editable={false}
                                                    value={this.props.attendanceDate}
                                                />
                                            </View>
                                            :
                                            null
                                    }
                                    {/* attendance */}
                                    {
                                        !this.state.keyboardVisible ?
                                            <View style={[styles.modalBodySection, { justifyContent: 'flex-start' }]}>
                                                <Text style={styles.labelStyle}>Attendance</Text>
                                                <View style={styles.pickerLight}>
                                                    <Dropdown
                                                        value={this.setDropDownValue(this.props.attendanceCategory)}
                                                        data={data}
                                                        onChangeText={(value) => {
                                                            this.onAttendanceCategoryPicked(value);
                                                        }}
                                                        containerStyle={{
                                                            paddingLeft: EStyleSheet.value('10rem'),
                                                            borderBottomColor: 'white',
                                                            position: 'absolute',
                                                            bottom: 22,
                                                            left: 0,
                                                            width: EStyleSheet.value('240rem'),
                                                            height: EStyleSheet.value('40rem'),
                                                        }}
                                                        rippleOpacity={0.2}
                                                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                                        dropdownPosition={0}
                                                    />
                                                    {/* <Picker
                                                        mode="dropdown"
                                                        style={{ color: colors.textGray }}
                                                        selectedValue={this.props.attendanceCategory}
                                                        onValueChange={(value) => {
                                                            this.props.attendanceCategorySelected(value);
                                                            this.props.enableSaveButton();
                                                        }}
                                                    >
                                                        <Picker.Item label="Not Informed" value="default" color={colors.headerBlue} />
                                                        <Picker.Item label="Absent" value="absent" color={colors.headerBlue} />
                                                        <Picker.Item label="Present" value="present" color={colors.headerBlue} />
                                                        <Picker.Item label="Work From Home" value="work_from_home" color={colors.headerBlue} />
                                                    </Picker> */}
                                                </View>
                                            </View>
                                            :
                                            null
                                    }
                                    {/* reason */}
                                    <View style={[styles.modalBodySection, { justifyContent: 'flex-start', flex: 2 }]}>
                                        <Text style={styles.labelStyle}>Reason</Text>
                                        <View style={styles.textInputContainer}>
                                            <TextInput
                                                placeholder="Type here                                "
                                                style={styles.textInputStyle}
                                                multiline
                                                value={this.props.attendanceReason}
                                                onChangeText={(text) => {
                                                    this.props.attendanceReasonChanged(text);
                                                    this.props.enableSaveButton();
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={[styles.modalBodySection, styles.modalBottamStyle]}>
                                        {
                                            this.props.attendanceUpdateLoading ?
                                                <SkypeIndicator color={colors.buttonRed} size={EStyleSheet.value('40rem')} />
                                                :
                                                <Button
                                                    color={this.props.saveBtnColor}
                                                    textColor={this.props.saveBtnTextColor}
                                                    disabled={this.props.buttonDisabled}
                                                    onPress={this.onAttendanceSetPressed.bind(this)}
                                                >
                                                    Save
                                            </Button>
                                        }
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    }
}

const styles = EStyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    item: {
        width: '30rem',
        height: '30rem',
        margin: '2rem',
        borderRadius: '2rem',
        justifyContent: 'center',
        alignItems: 'center'
    },
    list: {
        flex: 1,
    },
    text: {
        fontSize: '14rem',
        color: colors.textWhite,
        fontWeight: '800'
    },
    modalStyle: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        paddingHorizontal: '40rem',
        borderRadius: '10rem',
        marginTop: '40rem'
    },
    modalHeaderStyle: {
        flex: 1,
        backgroundColor: colors.headerBlue,
        borderTopRightRadius: '8rem',
        borderTopLeftRadius: '8rem'
    },
    modalBodyStyle: {
        flex: 6,
        paddingVertical: '20rem',
        paddingHorizontal: '20rem',
        backgroundColor: colors.textWhite,
        borderBottomRightRadius: '10rem',
        borderBottomLeftRadius: '10rem',
        justifyContent: 'center'
    },
    modalHeaderTopStyle: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: '6rem',
        paddingTop: '4rem'
    },
    modalHeaderBottomStyle: {
        flex: 3,
        alignItems: 'center',
    },
    modalHeaderTextStyle: {
        color: colors.textWhite,
        fontWeight: 'bold',
        fontSize: '18rem'
    },
    modalBodySection: {
        flex: 1,
        justifyContent: 'center',
        marginTop: '5rem'
    },
    labelStyle: {
        fontSize: '10rem',
        paddingBottom: '8rem',
        color: colors.textBlack
    },
    placeholderTextStyle: {
        paddingLeft: '5rem',
        fontSize: '14rem',
        color: colors.textGray
    },
    modalBottamStyle: {
        borderBottomRightRadius: '10rem',
        borderBottomLeftRadius: '10rem',
        backgroundColor: colors.textWhite
    },
    pickerLight: {
        backgroundColor: colors.background,
        borderRadius: '3rem',
        height: '40rem',
        position: 'relative',
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: '3rem',
        elevation: 1,
        justifyContent: 'center'
    },
    textInputContainer: {
        backgroundColor: colors.backgroundLight,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: '5rem',
    },
    textInputStyle: {
        flexDirection: 'row',
        height: '80rem',
        textAlignVertical: 'top',
        marginHorizontal: '2rem',
    },
});

const mapStateToProps = state => {
    return {
        attendanceCategory: state.dashboard.attendanceCategory,
        attendanceReason: state.dashboard.attendanceReason,
        year: state.dashboard.year,
        date: state.dashboard.date,
        attendanceDate: state.dashboard.attendanceDate,
        saveBtnColor: state.dashboard.saveBtnColor,
        saveBtnTextColor: state.dashboard.saveBtnTextColor,
        buttonDisabled: state.dashboard.buttonDisabled,
        attendanceUpdateLoading: state.dashboard.attendanceUpdateLoading,
    };
};

export default connect(mapStateToProps, {
    attendanceCategorySelected,
    attendanceReasonChanged,
    attendanceDateSet,
    getAttendanceInfo,
    enableSaveButton,
    adminAttendanceModalClosed,
    adminAttendanceUpdate
})(UserAttendanceRow);