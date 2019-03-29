import React, { Component } from 'react';
import {
    Dimensions,
    Text,
    TouchableOpacity,
    LayoutAnimation,
    NativeModules
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../config/styles';
import { Card } from '../Card';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class AddTaskButton extends Component {

    componentDidUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    render() {
        const { onPress } = this.props;
        return (
            <TouchableOpacity onPress={onPress}>
                <Card style={[styles.addButtonCardStyle, { justifyContent: 'flex-start', flexDirection: 'row' }]}>
                    <IonIcon
                        name='md-add-circle-outline'
                        size={EStyleSheet.value('25rem')}
                        color={colors.blue}
                        style={[{ alignItems: 'flex-start', position: 'relative', }]}
                    />
                    <Text style={styles.textStyle}>Add new task card</Text>
                </Card>
            </TouchableOpacity>
        );
    }
}

const styles = EStyleSheet.create({
    addButtonCardStyle: {
        marginHorizontal: '10rem',
        marginTop: '16rem',
        padding: '10rem'
    },
    textStyle: {
        color: colors.textGray,
        marginLeft: '15rem',
        alignSelf: 'center'
    }
});

export { AddTaskButton };
