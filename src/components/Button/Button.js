import React from 'react';
import { Text, TouchableOpacity, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });


const Button = ({ onPress, children, color, disabled, textColor }) => {
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.buttonStyle, { backgroundColor: color }]}>
            <Text style={[styles.textStyle, { color: textColor }]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};

const styles = EStyleSheet.create({
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '3rem',
        height: '50rem',
    },
    textStyle: {
        fontSize: '16rem',
        fontWeight: '600',

    }
});

export { Button };
