import React, { Component } from 'react';
import { View, Image, Dimensions, AsyncStorage, TouchableWithoutFeedback } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const deviceWidth = Dimensions.get('window').width;
const width = (deviceWidth * 0.4);

class HeaderLeft extends Component {
    render() {
        return (
            <TouchableWithoutFeedback onPress={onPress.bind(this)}>
                <View style={styles.mainContainerStyle}>
                    <Image
                        style={styles.imageStyle}
                        source={require('../../images/tmwLogoImg.png')}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const onPress = () => {
    AsyncStorage.getItem('refreshToken').then((refreshToken) => {
        console.log(refreshToken);
    });
}

const styles = EStyleSheet.create({
    mainContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: '0rem',
        paddingHorizontal: '5rem'
    },
    imageStyle: {
        justifyContent: 'center',
        width,
        height: '30rem'
    }

});

export { HeaderLeft };
