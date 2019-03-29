import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated, Dimensions, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Switch from 'react-native-switch-pro';
import EStyleSheet from 'react-native-extended-stylesheet';
import { colors } from '../../config/styles';
import { strings } from '../../config/strings';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });
const deviceWidth = Dimensions.get('window').width;

class TaskCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardFlipped: true
        };
    }

    componentWillMount() {
        this.animatedValue = new Animated.Value(0.01);
        this.value = 0.01;
        this.animatedValue.addListener(({ value }) => {
            this.value = value;
        });
        this.frontInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
        });
        this.backInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg']
        });
        this.frontOpacity = this.animatedValue.interpolate({
            inputRange: [89, 90],
            outputRange: [1, 0],
        });
        this.backOpacity = this.animatedValue.interpolate({
            inputRange: [89, 90],
            outputRange: [0, 1]
        });
        this.frontElevation = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [5, 0]
        });
        this.backElevation = this.animatedValue.interpolate({
            inputRange: [179, 180],
            outputRange: [0, 5]
        });
    }

    flipCard() {
        if (this.value >= 90) {
            this.setState({ cardFlipped: true });
            Animated.spring(this.animatedValue, {
                toValue: 0.01,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start();
        } else {
            this.setState({ cardFlipped: false });
            Animated.spring(this.animatedValue, {
                toValue: 180,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start();
        }
    }

    static deleteCard() {
        Alert.alert('Delete feature is disabled!');
    }
    static editCard() {
        Alert.alert('Edit feature is disabled!');
    }

    renderBottomIcon() {
        if (this.props.completed) {
            return (
                <FontAwesomeIcon
                    name='check-square'
                    size={18}
                    color={colors.textWhite}
                />
            );
        } else {
            return (
                <Octicons
                    name='alert'
                    size={18}
                    color={colors.textWhite}
                />
            );
        }
    }

    render() {
        const frontAnimatedStyle = {
            transform: [
                { rotateY: this.frontInterpolate }
            ]
        };
        const backAnimatedStyle = {
            transform: [
                { rotateY: this.backInterpolate }
            ]
        };

        return (
            <TouchableWithoutFeedback onPress={this.flipCard.bind(this)}>
                <View style={{ flex: 1, alignItems: 'center' }} >
                    {/* front card */}
                    <Animated.View style={[styles.cardStyle, frontAnimatedStyle, { opacity: this.frontOpacity, }, { perspective: 1000 }]}>
                        <View style={{ flex: 1 }} >
                            <View style={styles.topContainer}>
                                <View style={styles.commentAlertContainer}>
                                    <MaterialCommunityIcons
                                        name="comment-alert"
                                        size={30}
                                        color={this.props.color}
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.textDescription}>{this.props.message}</Text>
                                    <Text style={styles.textProject}>{this.props.project}</Text>
                                </View>
                            </View>
                            <View style={[styles.bottomContainer, { backgroundColor: this.props.color }]}>
                                <View style={styles.bottomLeftContainer}>
                                    {this.renderBottomIcon()}
                                    <Text style={styles.textDays}>{this.props.daysLeft}</Text>
                                </View>
                                <View style={styles.bottomRightContainer}>
                                    <Text style={styles.textDate}>{this.props.date}</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* back card */}
                    <Animated.View onPress={this.flipCard.bind(this)} style={[styles.cardStyle, styles.backCardStyle, backAnimatedStyle, { opacity: this.backOpacity }, { backgroundColor: this.props.color }, { perspective: 1000 },]}>
                        <View style={{ flex: 1 }}>
                            {!this.state.cardFlipped ?
                                <View style={styles.backTopContainer}>
                                    {/* <FontAwesomeIcon
                                    name="pencil"
                                    size={20}
                                    color={colors.textWhite}
                                    style={{ marginRight: 20 }}
                                    onPress={TaskCard.editCard.bind(this)}
                                />
                                <FontAwesomeIcon
                                    name="trash-o"
                                    size={20}
                                    color={colors.textWhite}
                                    onPress={TaskCard.deleteCard.bind(this)}
                                /> */}
                                </View> :
                                <View style={styles.backTopContainer} />
                            }
                            <View style={styles.backBottomContainer}>
                                <View style={styles.backTextContainer}>
                                    <Text style={styles.backDescriptionText}>{strings.cardComplete}</Text>
                                    <Text style={styles.backProjectText}>{this.props.project}</Text>
                                </View>
                                {!this.state.cardFlipped ?
                                    <View style={[styles.backSwitchContainer]}>
                                        <Switch
                                            width={120}
                                            height={30}
                                            circleStyle={{ width: 65, height: 27 }}
                                            circleColorActive={this.props.color}
                                            circleColorInactive={this.props.color}
                                            backgroundActive={colors.textWhite}
                                            backgroundInactive={colors.textWhite}
                                            value={this.props.switchValue}
                                            onSyncPress={this.props.switchOnToggle}
                                        />
                                    </View> :
                                    null
                                }
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}


const styles = EStyleSheet.create({
    //front card styles
    cardStyle: {
        backgroundColor: colors.textWhite,
        borderBottomWidth: '0rem',
        borderRadius: '5rem',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: '5rem',
        height: '140rem',
        width: deviceWidth - EStyleSheet.value('20rem'),
        padding: '0rem',
        marginTop: '20rem',
        backfaceVisibility: 'hidden',
    },
    topContainer: {
        flex: 2,
        flexDirection: 'row',
        borderTopLeftRadius: '5rem',
        borderTopRightRadius: '5rem',
    },
    bottomContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: '5rem',
        borderBottomRightRadius: '5rem',
        paddingHorizontal: '25rem'
    },
    commentAlertContainer: {
        flex: 1,
        borderTopLeftRadius: '5rem',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        flex: 4,
        borderTopRightRadius: '5rem',
        justifyContent: 'center',
    },
    bottomLeftContainer: {
        flex: 1,
        borderBottomLeftRadius: '5rem',
        flexDirection: 'row'
    },
    bottomRightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        borderBottomRightRadius: '5rem',
    },
    textDescription: {
        color: colors.textGray,
        fontWeight: '500',
    },
    textProject: {
        color: colors.textAsh,
        fontSize: '14rem'
    },
    textDays: {
        color: colors.textWhite,
        fontWeight: '500',
        marginLeft: '10rem'
    },
    textDate: {
        color: colors.textWhite,
        fontSize: '10rem',
        fontWeight: '400'
    },

    //back card styles
    backCardStyle: {
        position: 'absolute'
    },
    backTopContainer: {
        flex: 1,
        borderTopLeftRadius: '5rem',
        borderTopRightRadius: '5rem',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: '10rem',
        paddingRight: '10rem'
    },
    backBottomContainer: {
        flex: 3,
        flexDirection: 'row',
        borderBottomLeftRadius: '5rem',
        borderBottomRightRadius: '5rem'
    },
    backTextContainer: {
        flex: 1,
        borderBottomLeftRadius: '5rem',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: '10rem'
    },
    backDescriptionText: {
        fontSize: '20rem',
        fontWeight: 'bold',
        color: colors.textWhite
    },
    backProjectText: {
        fontSize: '15rem',
        fontWeight: '400',
        color: colors.textWhite
    },
    backSwitchContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: '10rem',
        alignItems: 'center',
        borderBottomRightRadius: '5rem'
    }
});
export { TaskCard };
