import React, { Component } from 'react';
import {
    View,
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    LayoutAnimation,
    NativeModules
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EStyleSheet from 'react-native-extended-stylesheet';
import { colors } from '../../config/styles';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
let componentWidth = EStyleSheet.value('85rem');

class UserCollapsable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDetailsVisible: false
        };
    }

    componentDidUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    onAddCardPressed() {
        this.props.onAddCard();
        this.setState({
            isDetailsVisible: false
        });
        componentWidth = EStyleSheet.value('85rem');
    }

    toggleState() {
        if (!this.state.isDetailsVisible) {
            this.setState({
                isDetailsVisible: true
            });
            componentWidth = EStyleSheet.value('235rem');
        } else {
            this.setState({
                isDetailsVisible: false
            });
            componentWidth = EStyleSheet.value('85rem');
        }
    }

    render() {
        const { name, position, profilePic, buttonInvisible } = this.props;
        return (
            <View style={[styles.userContainer, { width: componentWidth }]}>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={this.toggleState.bind(this)} style={{ padding: 5 }}>
                        {
                            profilePic === '' ?
                                <Image
                                    style={styles.imageStyle}
                                    source={require('../../images/defaultUserImg.jpg')}
                                />
                                :
                                <Image
                                    style={styles.imageStyle}
                                    source={{ uri: profilePic }}
                                />
                        }
                        {
                            !this.state.isDetailsVisible ?
                                <Text style={styles.shortName}>{name.replace(/ .*/, '')}</Text>
                                :
                                null
                        }
                    </TouchableOpacity>
                </View>
                {
                    this.state.isDetailsVisible ?
                        <View style={styles.textContainer}>
                            <Text style={styles.textName}>{name}</Text>
                            <Text style={styles.textRole}>{position}</Text>
                        </View>
                        :
                        null
                }
                {
                    this.state.isDetailsVisible && !buttonInvisible ?
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={this.onAddCardPressed.bind(this)}>
                                <FontAwesomeIcon
                                    name='plus-circle'
                                    size={EStyleSheet.value('25rem')}
                                    color={colors.textGray}
                                    style={[{ alignItems: 'flex-end', position: 'relative', }]}
                                />
                            </TouchableOpacity>
                        </View>
                        :
                        null
                }
            </View>
        );
    }
}

const styles = EStyleSheet.create({
    userContainer: {
        height: '100rem',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.textWhite,
        padding: '5rem',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        borderRadius: '2rem',
        marginBottom: '1rem'
    },
    avatarContainer: {
        width: '75rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        width: '125rem',
        flexWrap: 'wrap',
        paddingHorizontal: '5rem',
        justifyContent: 'center'
    },
    buttonContainer: {
        width: '30rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    imageStyle: {
        borderWidth: '1rem',
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60rem',
        height: '60rem',
        backgroundColor: '#fff',
        borderRadius: '30rem',
    },
    textName: {
        fontSize: '12rem',
        color: colors.textGray,
        fontWeight: 'bold'
    },
    textRole: {
        fontSize: '10rem',
        color: colors.textGray,
    },
    shortName: {
        fontSize: '10rem',
        color: colors.textGray,
        padding: '3rem',
        alignSelf: 'center'
    }
});

export { UserCollapsable };
