import React, { Component } from 'react';
import {
    View,
    Dimensions,
    AsyncStorage,
    FlatList,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SkypeIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';
import moment from 'moment';

import { YearMonthCounter } from '../components/YearMonthCounter';
import UserAttendanceRow from '../components/UserAttendanceRow/UserAttendanceRaw';
import { colors } from '../config/styles';
import {
    yearChanged,
    monthChanged,
    fetchAttendanceSummary,
    filterAttendance,
} from '../actions';

const entireScreenWidth = Dimensions.get('window').width;
const entireScreenHeight = Dimensions.get('window').height;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

class AttendanceTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: ''
        };
    }

    componentDidMount() {
        const { year, date } = this.props;
        const month = moment(date).format('MM')
        AsyncStorage.getItem('token').then((token) => {
            this.props.fetchAttendanceSummary(token, year, month);
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.year !== prevProps.year || this.props.date !== prevProps.date) {
            const { year, date } = this.props;
            const month = moment(date).format('MM')
            AsyncStorage.getItem('token').then((token) => {
                this.props.fetchAttendanceSummary(token, year, month);
            });
        }
    }

    incrementYear() {
        this.props.yearChanged(++this.props.year);
    }

    decrementYear() {
        this.props.yearChanged(--this.props.year);
    }

    incrementMonth() {
        this.props.monthChanged(moment(this.props.date).add(1, 'M').format('YYYY-MM-DD'));
    }

    decrementMonth() {
        this.props.monthChanged(moment(this.props.date).subtract(1, 'M').format('YYYY-MM-DD'));
    }

    filterAttendance = text => {
        this.props.filterAttendance(text, this.props.attendanceArrayHolder);
        this.setState({
            userName: text
        });
    };

    renderItems(attendanceItem) {
        return <UserAttendanceRow item={attendanceItem.item} />;
    }

    renderContent() {
        const { allAttendanceLoading, attendance } = this.props;

        if (allAttendanceLoading) {
            return <SkypeIndicator color={colors.headerBlue} size={EStyleSheet.value('40rem')} />;
        } else {
            return (
                <View style={styles.mainContainer}>
                    <View>
                        <SearchBar
                            placeholder="Search by name..."
                            lightTheme
                            round
                            onChangeText={text => this.filterAttendance(text)}
                            autoCorrect={false}
                        />
                    </View>
                    <View style={styles.counterContainer}>
                        <YearMonthCounter
                            value={this.props.year}
                            onUpPressed={this.incrementYear.bind(this)}
                            onDownPressed={this.decrementYear.bind(this)}
                        />
                        <YearMonthCounter
                            value={moment(this.props.date).format('MMM')}
                            onUpPressed={this.incrementMonth.bind(this)}
                            onDownPressed={this.decrementMonth.bind(this)}
                        />
                    </View>
                    <FlatList
                        data={attendance}
                        renderItem={this.renderItems}
                        keyExtractor={item => item.user_id.toString()}
                        initialNumToRender={5}
                        removeClippedSubviews
                        windowSize={11}
                    />
                </View>
            );
        }
    }

    render() {
        return (
            this.renderContent()
        );
    }
}

const styles = EStyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingHorizontal: '10rem',
        backgroundColor: colors.backgroundColor
    },
    counterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: '10rem'
    }
});

const mapStateToProps = state => {
    return {
        year: state.dashboard.year,
        date: state.dashboard.date,
        attendance: state.dashboard.attendance,
        attendanceArrayHolder: state.dashboard.attendanceArrayHolder,
        allAttendanceLoading: state.dashboard.allAttendanceLoading,
    };
};

export default connect(mapStateToProps, {
    yearChanged,
    monthChanged,
    fetchAttendanceSummary,
    filterAttendance,
})(AttendanceTab);
