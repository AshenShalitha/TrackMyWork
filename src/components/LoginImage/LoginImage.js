import React, { Component } from 'react';
import { View, Image, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import logoImg from '../../images/logoImg.png';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

class LoginImage extends Component {

    render() {
        return (
            <View style={styles.containerStyle}>
                <Image source={logoImg} style={styles.image} />
            </View>
        );
    }
}

const styles = EStyleSheet.create({
    container: {
        flex: 3,
        alignSelf: 'stretch'
    },
    image: {
        width: '80rem',
        height: '80rem'
    },
});

export { LoginImage };