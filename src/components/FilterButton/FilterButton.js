import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../config/styles';
import { Card } from '../Card';

const FilterButton = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Card style={styles.filterButton}>
                <FontAwesomeIcon
                    name='filter'
                    size={EStyleSheet.value('25rem')}
                    color={colors.textGray}
                    style={[{ alignItems: 'flex-start', position: 'relative', }]}
                />
                <Text style={styles.textStyle}>Filter by position</Text>
            </Card>
        </TouchableOpacity>
    );
};

const styles = EStyleSheet.create({
    filterButton: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: '16rem',
    },
    textStyle: {
        color: colors.textGray,
        marginLeft: '15rem',
        alignSelf: 'center'
    },
});

export { FilterButton };
