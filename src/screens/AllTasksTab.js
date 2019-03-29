import React, { Component } from 'react';
import {
    View,
    Dimensions,
    AsyncStorage,
    FlatList,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SkypeIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';
import UserTaskRow from '../components/UserTaskRow/UserTaskRow';
import { colors } from '../config/styles';
import {
    fetchAllUsers,
    fetchAllTasks,
    generateUserTaskArray,
    filterUserTaskArray
} from '../actions';

const entireScreenWidth = Dimensions.get('window').width;
const entireScreenHeight = Dimensions.get('window').height;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

class AllTasksTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: ''
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('token').then((token) => {
            this.props.generateUserTaskArray(token);
        });
    }

    filterUserTaskArray = text => {
        this.props.filterUserTaskArray(text, this.props.userTaskArrayHolder);
        this.setState({
            userName: text
        });
    };

    renderItems(userTask) {
        return <UserTaskRow item={userTask.item} />;
    }

    renderContent() {
        const { usersLoading, allTasksLoading } = this.props;
        const itemArray = this.props.userTaskArray;
        if (usersLoading || allTasksLoading) {
            return <SkypeIndicator color={colors.headerBlue} size={EStyleSheet.value('40rem')} />;
        } else {
            return (
                <View style={styles.mainContainer}>
                    <View>
                        <SearchBar
                            placeholder="Search by name..."
                            lightTheme
                            round
                            onChangeText={text => this.filterUserTaskArray(text)}
                            autoCorrect={false}
                        />
                    </View>
                    <FlatList
                        data={itemArray}
                        renderItem={this.renderItems}
                        keyExtractor={item => item.userId.toString()}
                        initialNumToRender={5}
                        removeClippedSubviews
                        windowSize={11}
                    />
                </View>
            );
        }
    }

    render() {
        return (
            this.renderContent()
        );
    }
}

const styles = EStyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingHorizontal: '10rem',
        backgroundColor: colors.backgroundColor,
    },
    userContainer: {
        width: entireScreenWidth * 0.6,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'red',
        padding: '5rem'
    },
    avatarContainer: {
        flex: 2,
        justifyContent: 'center'
    },
    textContainer: {
        flex: 3,
        paddingHorizontal: '5rem',
        justifyContent: 'center'
    },
    buttonContainer: {
        flex: 1,
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
        fontSize: '12rem'
    },
    textRole: {
        fontSize: '10rem'
    }
});


const mapStateToProps = state => {
    return {
        usersLoading: state.dashboard.usersLoading,
        allUsers: state.dashboard.allUsers,
        allTasksLoading: state.dashboard.allTasksLoading,
        allTasks: state.dashboard.allTasks,
        userTaskArray: state.dashboard.userTaskArray,
        userTaskArrayHolder: state.dashboard.userTaskArrayHolder,
    };
};

export default connect(mapStateToProps, {
    fetchAllUsers,
    fetchAllTasks,
    generateUserTaskArray,
    filterUserTaskArray
})(AllTasksTab);
