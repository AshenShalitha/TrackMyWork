import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    AsyncStorage,
    Alert,
    TouchableOpacity
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SkypeIndicator } from 'react-native-indicators';
import Modal from 'react-native-modal';

import { Card } from '../components/Card';
import { CardSection } from '../components/CardSection/CardSection';
import { colors } from '../config/styles';
import { strings } from '../config/strings';
import { Button } from '../components/Button';
import { OfflineNotice } from '../components/OfflineNotice';

import {
    pickAttendanceCategory,
    attendanceMessegeChanged,
    markAttendance,
    checkAttendanceIsMarked,
    getAttendanceList,
    fetchTodayAttendance
} from '../actions';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

class AttendanceScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment().format('YYYY-MM-DD'),
            isMonthChanged: false,
            changedDate: '',
            isAttendanceModalVisible: false
        };
    }
    componentWillMount() {
        //check if attendance is marked or not
        AsyncStorage.getItem('token').then((token) => {
            const today = moment().format('YYYY-MM-DD');
            this.props.fetchTodayAttendance(today, token);
        });

        //get attendance list
        AsyncStorage.getItem('token').then((token) => {
            const currentYear = moment().format('YYYY');
            const currentMonth = moment().format('MM');
            this.props.getAttendanceList(token, currentYear, currentMonth);
        });
    }

    onAttendanceMessageChanged(text) {
        this.props.attendanceMessegeChanged(text);
    }

    onAttendanceSet() {
        const currentYear = moment().format('YYYY');
        const currentMonth = moment().format('MM');
        if (this.props.attendanceCategory === 'default' || '') {
            Alert.alert(
                'Error',
                'Please select an attendance category!',
                [
                    { text: 'Ok' },
                ],
            );
        } else {
            const keys = ['token', 'userId'];
            AsyncStorage.multiGet(keys).then((result) => {
                const token = result[0][1];
                const userId = result[1][1];
                const status = this.props.attendanceCategory;
                const message = this.props.attendanceMessage;
                const date = moment().format('MMMM Do YYYY');
                this.props.markAttendance(token, userId, status, message, date, currentYear, currentMonth);
            });
        }
    }

    //on month changed in the calander
    onMonthChanged(date) {
        const changedDate = moment(date.dateString).startOf('month').format('YYYY-MM-DD');
        this.setState({
            changedDate,
            isMonthChanged: true,
            date: date.dateString
        });
        AsyncStorage.getItem('token').then((token) => {
            this.props.getAttendanceList(token, date.year, date.month);
        });
    }

    //decide if date is needs to be selected or not
    setCalenderDateSelected(status) {
        switch (status) {
            case 'not_informed':
                return true;
            case 'absent':
                return true;
            case 'work_from_home':
                return true;
            default:
                return false;
        }
    }

    //set date colors of the calander
    setCalanderColor(status) {
        switch (status) {
            case 'not_informed':
                return colors.black;
            case 'absent':
                return colors.buttonRed;
            case 'work_from_home':
                return colors.blue;
            default:
                return colors.black;
        }
    }

    //mapping attendance data to calender dates
    populateCalander() {
        const attendanceData = {};
        const attendanceList = this.props.attendanceList;
        const today = moment();
        let startOfTheMonth;
        if (this.state.isMonthChanged) {
            const momentDate = moment(this.state.changedDate);
            startOfTheMonth = momentDate;
        } else {
            startOfTheMonth = moment().startOf('month');
        }
        const numberOfDaysInMonth = moment(startOfTheMonth).daysInMonth();
        if (attendanceList.length === 0) {
            for (let i = 0; i < numberOfDaysInMonth; i++) {
                const date = startOfTheMonth.format('YYYY-MM-DD');
                attendanceData[date] = {
                    selected: this.setCalenderDateSelected('not_informed'),
                    selectedColor: this.setCalanderColor('not_informed')
                };
                startOfTheMonth.add(1, 'd').format('YYYY-MM-DD');
            }
        } else {
            for (let j = 0; j < numberOfDaysInMonth; j++) {
                const date = startOfTheMonth.format('YYYY-MM-DD');
                for (let i = 0; i < attendanceList.length; i++) {
                    if (date === attendanceList[i].date) {
                        attendanceData[attendanceList[i].date] = {
                            selected: this.setCalenderDateSelected(attendanceList[i].status),
                            selectedColor: this.setCalanderColor(attendanceList[i].status)
                        };
                        break;
                    } else if (moment(today).isBefore(date)) {
                        attendanceData[date] = {
                            selected: this.setCalenderDateSelected(''),
                        };
                    } else {
                        attendanceData[date] = {
                            selected: this.setCalenderDateSelected('not_informed'),
                            selectedColor: this.setCalanderColor('not_informed')
                        };
                    }
                }
                startOfTheMonth.add(1, 'd').format('YYYY-MM-DD');
            }
        }
        return attendanceData;
    }

    //render attendance set
    renderButton() {
        if (this.props.loading) {
            return <SkypeIndicator color={colors.buttonRed} size={EStyleSheet.value('40rem')} />;
        } else {
            return (
                <Button
                    onPress={this.onAttendanceSet.bind(this)}
                    disabled={this.props.buttonDisabled}
                    color={this.props.buttonColor}
                    textColor={this.props.buttonTextColor}
                >
                    {this.props.buttonText}
                </Button>
            );
        }
    }

    setAttendanceCategoryOnButton() {
        if (this.props.attendanceCategory === 'default') {
            return 'Select an Attendance Category';
        } else {
            switch (this.props.attendanceCategory) {
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
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    backgroundColor: '#CED0CE',
                }}
            />
        );
    };

    renderAttendanceCategory(item) {
        return (
            <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                    this.setState({ isAttendanceModalVisible: false });
                    this.props.pickAttendanceCategory(item.item.key);
                }}
            >
                <Text style={styles.itemText}>{item.item.value}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const offset = (Platform.OS === 'android') ? -500 : 0;
        const data = [
            {
                key: 'absent',
                value: 'Absent'
            },
            {
                key: 'present',
                value: 'Present'
            },
            {
                key: 'work_from_home',
                value: 'Work From Home'
            }];
        return (
            <ScrollView style={{ flex: 1 }}>
                <OfflineNotice />
                <View style={styles.mainContainer}>
                    {/* attendance card */}
                    <Card style={[styles.cardStyle, { marginTop: EStyleSheet.value('20rem') }]}>
                        <View style={styles.textContainer}>
                            <Text style={styles.textTopic}>{strings.attendanceTopic}</Text>
                            <Text style={styles.subText}>{strings.attendanceSubTopic}</Text>
                        </View>
                        <CardSection style={{ flex: 1, flexDirection: 'row', padding: EStyleSheet.value('0rem') }}>
                            <View style={{ flex: 1, borderRightColor: colors.textAsh, borderRightWidth: EStyleSheet.value('1rem'), padding: EStyleSheet.value('15rem') }}>
                                <IonIcon
                                    name='md-bulb'
                                    size={EStyleSheet.value('16rem')}
                                    style={{ alignSelf: 'center' }}
                                />
                            </View>
                            <View style={{ flex: 3, alignItems: 'center', padding: EStyleSheet.value('15rem') }}>
                                <Text>Today I'm</Text>
                            </View>
                            <View style={{ flex: 1 }} />
                        </CardSection>

                        {/* attendanceSelectButton */}
                        <CardSection style={[{ flex: 1, marginTop: EStyleSheet.value('15rem'), padding: EStyleSheet.value('0rem') }]}>
                            <TouchableOpacity
                                style={styles.attendanceCategoryBtn}
                                onPress={() => this.setState({ isAttendanceModalVisible: true })}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.attendanceCategoryText}>{this.setAttendanceCategoryOnButton()}</Text>
                                <FontAwesomeIcon
                                    name='chevron-down'
                                    size={EStyleSheet.value('14rem')}
                                    color={colors.headerBlue}
                                    style={[{ right: EStyleSheet.value('18rem'), top: EStyleSheet.value('18rem'), position: 'absolute' }]}
                                />
                            </TouchableOpacity>
                        </CardSection>

                        {/* attedance Category Modal */}
                        <Modal
                            isVisible={this.state.isAttendanceModalVisible}
                            backdropColor='black'
                            useNativeDriver
                            onBackdropPress={() => this.setState({ isAttendanceModalVisible: false })}
                            onBackButtonPress={() => this.setState({ isAttendanceModalVisible: false })}
                        >
                            <View style={styles.modal}>
                                <FlatList
                                    data={data}
                                    renderItem={this.renderAttendanceCategory.bind(this)}
                                    keyExtractor={(item) => item.key}
                                    refreshing
                                    style={{ marginVertical: 5, flex: 1, backgroundColor: colors.backgroundLight }}
                                    ItemSeparatorComponent={this.renderSeparator}
                                />
                            </View>
                        </Modal>

                        {/* attendance set button */}
                        <View style={{ marginTop: EStyleSheet.value('15rem') }}>
                            {this.renderButton()}
                        </View>
                    </Card>

                    {/* message box card */}
                    <Card style={styles.cardStyle}>
                        <View style={styles.textContainer}>
                            <Text style={styles.textTopic}>{strings.attendanceMessageTopic}</Text>
                            <Text style={styles.subText}>{strings.attendanceMessageSubTopic}</Text>
                        </View>
                        <View style={styles.textInputContainer} keyboardVerticalOffset={offset}>
                            <FontAwesomeIcon
                                name="pencil"
                                size={EStyleSheet.value('17rem')} color={colors.textAsh}
                                style={{ marginTop: EStyleSheet.value('12rem') }}
                            />
                            <KeyboardAvoidingView enabled keyboardVerticalOffset={offset}>
                                <TextInput
                                    placeholder="Type here"
                                    style={styles.textInputStyle}
                                    multiline
                                    onChangeText={this.onAttendanceMessageChanged.bind(this)}
                                    value={this.props.attendanceMessage}
                                />
                            </KeyboardAvoidingView>
                        </View>
                    </Card>

                    {/* calender card */}
                    <Card style={[styles.calenderContainer]}>
                        <Calendar
                            style={styles.calendar}
                            current={this.state.date}
                            theme={{
                                selectedDayTextColor: colors.textWhite,
                                todayTextColor: colors.darkBlue,
                                dayTextColor: colors.darkBlue,
                                textDisabledColor: colors.darkAsh,
                            }}
                            markedDates={this.populateCalander()}
                            onMonthChange={(d) => { this.onMonthChanged(d); }}
                        />
                    </Card>
                </View>
            </ScrollView>
        );
    }
}

const styles = EStyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'space-around',
        paddingHorizontal: '10rem'
    },
    cardStyle: {
        marginTop: '10rem',
        marginBottom: '10rem',
        flex: 1,
        borderRadius: '2rem',
        paddingHorizontal: '15rem',
        paddingBottom: '30rem',
        paddingTop: '20rem'
    },
    textContainer: {
        alignItems: 'flex-start',
        paddingBottom: '10rem'
    },
    textTopic: {
        fontSize: '16rem',
        color: colors.textBlack,
        fontWeight: 'bold'
    },
    subText: {
        fontSize: '14rem',
        color: colors.textGray
    },
    attendanceCategoryBtn: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: colors.whiteText,
        borderRadius: '3rem',
        height: '50rem',
        borderColor: '#ddd',
        alignItems: 'center',
        paddingHorizontal: '10rem'
    },
    attendanceCategoryText: {
        fontSize: '16rem',
        color: colors.textBlack
    },
    pickerLight: {
        backgroundColor: colors.background,
        borderRadius: '3rem',
        height: '45rem',
        borderColor: '#ddd',
        position: 'relative',
        borderBottomWidth: '0rem',
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
        borderColor: '#bbb',
        padding: '10rem',
    },
    textInputStyle: {
        flexDirection: 'row',
        height: '200rem',
        textAlignVertical: 'top',
        marginHorizontal: '5rem',
    },
    calenderContainer: {
        flex: 1,
        marginBottom: '20rem',
        marginTop: '10rem',
        borderRadius: '2rem'
    },
    calendar: {
        flex: 1,
    },
    modal: {
        height: '162rem',
        width: entireScreenWidth * 0.6,
        // marginTop: entireScreenHeight * 0.2,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: '5rem',
        backgroundColor: colors.background,
        paddingHorizontal: '5rem'
    },
    listItem: {
        alignSelf: 'stretch',
        marginHorizontal: '25rem',
        height: '50rem',
        justifyContent: 'center',
    },
    itemText: {
        fontSize: '18rem',
        paddingVertical: '15rem',
        color: colors.textBlack,
        textAlign: 'center'
    }
});

const mapStateToProps = state => {
    return {
        attendanceCategory: state.attendance.selectedCategory,
        attendanceMessage: state.attendance.message,
        loading: state.attendance.loading,
        buttonText: state.attendance.buttonText,
        buttonColor: state.attendance.buttonColor,
        buttonDisabled: state.attendance.disabled,
        buttonTextColor: state.attendance.buttonTextColor,
        attendanceList: state.attendance.attendanceList,
        myAttendanceList: state.attendance.myAttendanceList,
        attendanceListLoading: state.attendance.attendanceListLoading,
    };
};

export default connect(mapStateToProps, {
    pickAttendanceCategory,
    attendanceMessegeChanged,
    markAttendance,
    checkAttendanceIsMarked,
    getAttendanceList,
    fetchTodayAttendance
})(AttendanceScreen);

