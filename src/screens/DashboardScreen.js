import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import DashboardNavigator from './DashboardNavigator';
import { colors } from '../config/styles';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });


class DashboardScreen extends Component {
    render() {
        return (
            <View style={styles.mainContainer}>
                <DashboardNavigator />
            </View>
        );
    }
}

const styles = EStyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: colors.backgroundColor
    }
});

export default DashboardScreen;
