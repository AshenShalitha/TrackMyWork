import React, { Component } from 'react';
import {
    View,
    Dimensions,
    TouchableOpacity,
    Text
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import IonIcons from 'react-native-vector-icons/Ionicons';

import { colors } from '../../config/styles';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

class YearMonthCounter extends Component {

    render() {
        const { value, onUpPressed, onDownPressed } = this.props;

        return (
            <View style={styles.mainContainer}>
                <View style={styles.leftContainer}>
                    <Text style={styles.text}>{value}</Text>
                </View>
                <View style={styles.rightContainer}>
                    <TouchableOpacity onPress={onUpPressed}>
                        <View style={styles.buttonContainer}>
                            <IonIcons
                                name='ios-arrow-up'
                                size={EStyleSheet.value('16rem')}
                                color={colors.darkAsh}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDownPressed}>
                        <View style={styles.buttonContainer}>
                            <IonIcons
                                name='ios-arrow-down'
                                size={EStyleSheet.value('16rem')}
                                color={colors.darkAsh}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = EStyleSheet.create({
    mainContainer: {
        height: '40rem',
        width: '120rem',
        flexDirection: 'row',
        elevation: 2,
        backgroundColor: colors.textWhite,
    },
    leftContainer: {
        width: '80rem',
        height: '40rem',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: '1rem',
        borderColor: colors.textAsh
    },
    rightContainer: {
        width: '40rem',
        height: '40rem',
    },
    buttonContainer: {
        height: '20rem',
        width: '40rem',
        alignItems: 'center'
    },
    text: {
        fontSize: '16rem',
        color: colors.darkAsh
    }
});

export { YearMonthCounter };
