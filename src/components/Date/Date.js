import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import DatePicker from 'react-native-datepicker';
import EStyleSheet from 'react-native-extended-stylesheet';
import { colors } from '../../config/styles';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });


const Date = ({ label, date, onDateChange }) => {
    return (
        <View style={styles.containerStyle}>
            <View style={styles.labelContainer}>
                <Text style={styles.labelStyle}>{label}</Text>
            </View>
            <View style={styles.inputContainer}>
                <DatePicker
                    date={date}
                    mode="date"
                    format="YYYY-MM-DD"
                    minDate="2018-1-1"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onDateChange={onDateChange}
                    showIcon={false}
                />
            </View>
        </View>
    );
};

export { Date };

const styles = EStyleSheet.create({
    labelStyle: {
        fontSize: '10rem',
        paddingBottom: '8rem',
        color: colors.textBlack
    },
    containerStyle: {
        flex: 1,
    },
    labelContainer: {

    },
    inputContainer: {
        justifyContent: 'center',
        backgroundColor: colors.background,
        borderRadius: '3rem',
        height: '40rem',
        position: 'relative',
        borderColor: '#ddd',
        borderBottomWidth: '0rem',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: '3rem',
        elevation: 1,
    }
});
