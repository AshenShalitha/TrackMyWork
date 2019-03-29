import React from 'react';
import { View, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const Card = (props) => {
    return (
        <View style={[styles.containerStyle, props.style]}>
            {props.children}
        </View>
    );
};

const styles = EStyleSheet.create({
    containerStyle: {
        borderBottomWidth: '1rem',
        padding: '5rem',
        backgroundColor: '#fff',
        borderRadius: '5rem',
        borderColor: '#ddd',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: '5rem',
        elevation: 1,
    }
});

export { Card };

