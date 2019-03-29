import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated, Dimensions, TouchableOpacity } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Switch from 'react-native-switch-pro';
import EStyleSheet from 'react-native-extended-stylesheet';
import { colors } from '../../config/styles';
import { strings } from '../../config/strings';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

class TaskCardMini extends Component {
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

    renderBottomIcon() {
        if (this.props.completed) {
            return (
                <FontAwesomeIcon
                    name='check-square'
                    size={EStyleSheet.value('15rem')}
                    color={colors.textWhite}
                />
            );
        } else {
            return (
                <Octicons
                    name='alert'
                    size={EStyleSheet.value('15rem')}
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

        const { message, project, daysLeft, date, switchValue, switchOnToggle, color, onDelete, onEdit } = this.props;

        return (
            <TouchableWithoutFeedback onPress={this.flipCard.bind(this)}>
                <View style={{ flex: 1, alignItems: 'center' }} >
                    {/* front card */}
                    <Animated.View style={[styles.cardStyle, frontAnimatedStyle, { opacity: this.frontOpacity, }, { perspective: 1000 }]}>
                        <View style={{ flex: 1 }} >
                            <View style={styles.topContainer}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.textDescription}>{message}</Text>
                                    <Text style={styles.textProject}>{project}</Text>
                                </View>
                            </View>
                            <View style={[styles.bottomContainer, { backgroundColor: color }]}>
                                <View style={styles.bottomLeftContainer}>
                                    {this.renderBottomIcon()}
                                    <Text style={styles.textDays}>{daysLeft}</Text>
                                </View>
                                <View style={styles.bottomRightContainer}>
                                    <Text style={styles.textDate}>{date}</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* back card */}
                    <Animated.View
                        onPress={this.flipCard.bind(this)}
                        style={[styles.cardStyle, styles.backCardStyle, backAnimatedStyle, { opacity: this.backOpacity }, { backgroundColor: color }, { perspective: 1000 },]}
                    >
                        <View style={{ flex: 1 }}>
                            {!this.state.cardFlipped ?
                                <View style={styles.backTopContainer}>
                                    <TouchableOpacity onPress={onEdit}>
                                        <FontAwesomeIcon
                                            name="pencil"
                                            size={EStyleSheet.value('15rem')}
                                            color={colors.textWhite}
                                            style={{ marginRight: EStyleSheet.value('20rem') }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={onDelete}>
                                        <FontAwesomeIcon
                                            name="trash-o"
                                            size={EStyleSheet.value('15rem')}
                                            color={colors.textWhite}
                                        />
                                    </TouchableOpacity>
                                </View> :
                                <View style={styles.backTopContainer} />
                            }
                            <View style={styles.backBottomContainer}>
                                <View style={styles.backTextContainer}>
                                    <Text style={styles.backDescriptionText}>{strings.cardComplete}</Text>
                                    <Text style={styles.backProjectText}>{project}</Text>
                                </View>
                                {!this.state.cardFlipped ?
                                    <View style={[styles.backSwitchContainer]}>
                                        <Switch
                                            width={60}
                                            height={20}
                                            circleStyle={{ width: 35, height: 17 }}
                                            circleColorActive={color}
                                            circleColorInactive={color}
                                            backgroundActive={colors.textWhite}
                                            backgroundInactive={colors.textWhite}
                                            value={switchValue}
                                            onSyncPress={switchOnToggle}
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
        borderRadius: '3rem',
        position: 'relative',
        shadowRadius: '5rem',
        height: '90rem',
        width: '200rem',
        padding: '0rem',
        backfaceVisibility: 'hidden',
        marginRight: '10rem'
    },
    topContainer: {
        flex: 2,
        flexDirection: 'row',
        borderTopLeftRadius: '3rem',
        borderTopRightRadius: '3rem',
        paddingHorizontal: '6rem'
    },
    bottomContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: '3rem',
        borderBottomRightRadius: '3rem',
        paddingHorizontal: '6rem'
    },
    textContainer: {
        flex: 4,
        borderTopRightRadius: '5rem',
        justifyContent: 'center',
    },
    bottomLeftContainer: {
        flex: 1,
        borderBottomLeftRadius: '3rem',
        flexDirection: 'row',
        alignItems: 'center'
    },
    bottomRightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        borderBottomRightRadius: '3rem',
    },
    textDescription: {
        color: colors.textGray,
        fontWeight: '400',
        fontSize: '11rem'
    },
    textProject: {
        color: colors.textAsh,
        fontSize: '9rem'
    },
    textDays: {
        color: colors.textWhite,
        fontWeight: '400',
        marginLeft: '10rem',
        fontSize: '10rem'
    },
    textDate: {
        color: colors.textWhite,
        fontSize: '10rem',
        fontWeight: '400',
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
        borderBottomLeftRadius: '3rem',
        borderBottomRightRadius: '3rem'
    },
    backTextContainer: {
        flex: 1,
        borderBottomLeftRadius: '3rem',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: '6rem'
    },
    backDescriptionText: {
        fontSize: '14rem',
        fontWeight: 'bold',
        color: colors.textWhite
    },
    backProjectText: {
        fontSize: '10rem',
        fontWeight: '400',
        color: colors.textWhite
    },
    backSwitchContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: '10rem',
        alignItems: 'center',
        borderBottomRightRadius: '3rem'
    }
});
export { TaskCardMini };
