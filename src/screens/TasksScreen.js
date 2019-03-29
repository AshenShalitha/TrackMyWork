import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    AsyncStorage,
    FlatList,
    Dimensions,
    Alert
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { List, ListItem, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SkypeIndicator } from 'react-native-indicators';
import Modal from 'react-native-modal';

import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Date } from '../components/Date';
import { TaskCard } from '../components/TaskCard';
import { OfflineNotice } from '../components/OfflineNotice';
import { colors } from '../config/styles';
import {
    onModalClosed,
    taskNameChanged,
    fetchProjects,
    dueDateChanged,
    projectPick,
    selectTaskType,
    fetchInCompletedTasks,
    fetchCompletedTasks,
    completeIncompleteTask,
    addTaskCard,
    enableButton,
    addProject,
    searchFilterAction,
    onProjectsModalClosed,
    getUserDetails
} from '../actions';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const deviceHeight = Dimensions.get('window').height;
const modalHeight = deviceHeight - EStyleSheet.value('200rem');

class TasksScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            selectProjectVisible: false,
            projectName: '',
            buttonPrefix: 'Add Project ',
            isTaskTypePickerVisible: false,
        };
    }

    componentDidMount() {
        const keys = ['token', 'userId'];
        AsyncStorage.multiGet(keys).then((result) => {
            const token = result[0][1];
            const userId = result[1][1];
            this.props.fetchInCompletedTasks(token);
            this.props.getUserDetails(token, userId);
        });
    }

    onModalClosed() {
        this.props.onModalClosed();
    }

    onTaskNameChanged(text) {
        this.props.taskNameChanged(text);
        if (this.props.project !== '') {
            this.props.enableButton();
        }
    }

    onSelectProjectPressed() {
        console.log()
        this.setState({ selectProjectVisible: true });
        AsyncStorage.getItem('token').then((token) => {
            this.props.fetchProjects(token);
        });
    }

    onProjectPicked(text) {
        this.props.projectPick(text);
        this.setState({ selectProjectVisible: false });
        if (this.props.taskName !== '') {
            this.props.enableButton();
        }
    }

    onDueDateChanged(date) {
        this.props.dueDateChanged(date);
    }

    onAddCardPressed() {
        const { taskName, project, dueDate } = this.props;
        if (taskName === '' || project === '') {
            Alert.alert(
                'Error',
                'Please fill all the fields!',
                [
                    { text: 'Ok' },
                ],
            );
        } else {
            AsyncStorage.getItem('token').then((token) => {
                this.props.addTaskCard(token, taskName, project, dueDate);
            });
        }
    }

    onTaskTypeSelected(text) {
        this.props.selectTaskType(text);
        if (text === 'completed') {
            AsyncStorage.getItem('token').then((token) => {
                this.props.fetchCompletedTasks(token);
            });
        } else {
            AsyncStorage.getItem('token').then((token) => {
                this.props.fetchInCompletedTasks(token);
            });
        }
    }

    //set add new task modal visibility
    setModalVisible(visible) {
        if (!visible) {
            this.onModalClosed();
        }
        this.setState({ modalVisible: visible });
    }

    //separate tasks according to type
    generateTasksLists() {
        switch (this.props.selectedTaskType) {
            case 'ongoing':
                return this.props.ongoingTaskList;
            case 'overdue':
                return this.props.overdueTaskList;
            case 'completed':
                return this.props.completedTaskList;
            default:
                return null;
        }
    }

    //set task state
    completeIncompleteTask(value, taskId) {
        AsyncStorage.getItem('token').then((token) => {
            this.props.completeIncompleteTask(token, value, taskId, this.props.selectedTaskType);
        });
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    backgroundColor: '#CED0CE',
                }}
            />
        );
    };

    searchFilterFunction = text => {
        this.props.searchFilterAction(text, this.props.arrayholder);
        this.setState({
            projectName: text
        });
    };

    renderHeader = () => {
        return (
            <View>
                <SearchBar
                    placeholder="Type Here..."
                    lightTheme
                    round
                    onChangeText={text => this.searchFilterFunction(text)}
                    autoCorrect={false}
                />
            </View>
        );
    };

    renderAddTaskButton() {
        if (this.props.addTaskLoading) {
            return <SkypeIndicator color={colors.headerBlue} size={EStyleSheet.value('40rem')} />;
        } else {
            return (
                <Button
                    onPress={this.onAddCardPressed.bind(this)}
                    color={this.props.addCardBtnColor}
                    textColor={this.props.addCardBtnTextColor}
                    disabled={this.props.buttonDisabled}
                >
                    Add Card
                </Button>
            );
        }
    }

    addProject() {
        Alert.alert(
            'Confirm',
            'Add this project?',
            [
                { text: 'Cancel' },
                {
                    text: 'Ok',
                    onPress: () => {
                        if (this.state.projectName === '') {
                            Alert.alert(
                                'Error',
                                'Project name cannot be empty!',
                                [
                                    { text: 'Ok' },
                                ],
                            );
                        } else {
                            AsyncStorage.getItem('token').then((token) => {
                                this.props.addProject(token, this.state.projectName);
                                this.setState({
                                    projectName: '',
                                    btnVisible: false
                                });
                            });
                        }
                    }
                }
            ],
        );
    }

    //render loader and task lists
    renderList() {
        if (this.props.tasksLoading) {
            return <SkypeIndicator color={colors.headerBlue} size={EStyleSheet.value('40rem')} />;
        } else {
            return (
                <FlatList
                    data={this.generateTasksLists()}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(task) => task.task_id.toString()}
                    refreshing
                    style={{ marginTop: 5, flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            );
        }
    }

    //render card item
    renderItem(task) {
        let cardColor;
        let daysLeft;
        let completed = false;
        //selecting card color and bottom icon
        switch (this.props.selectedTaskType) {
            case 'completed':
                cardColor = colors.green;
                completed = true;
                break;
            case 'ongoing':
                cardColor = colors.blue;
                break;
            case 'overdue':
                cardColor = colors.buttonRed;
                break;
            default:
                cardColor = colors.blue;
        }

        //formatting days left
        if (this.props.selectedTaskType === 'completed') {
            daysLeft = 'Task Completed';
        } else {
            if (task.item.remain_days === 0) {
                daysLeft = ' Today';
            } else if (task.item.remain_days === 1) {
                daysLeft = ' Tomorrow';
            } else if (task.item.remain_days === -1) {
                daysLeft = ' Yesterday';
            } else if (task.item.remain_days < -1) {
                daysLeft = Math.abs(task.item.remain_days) + ' Days Delayed';
            } else if (task.item.remain_days > 1) {
                daysLeft = task.item.remain_days + ' Days Left';
            }
        }
        return (
            <TaskCard
                id={task.item.task_id}
                message={task.item.task_name}
                project={task.item.project_name}
                daysLeft={daysLeft}
                date={task.item.deadline}
                color={cardColor}
                completed={completed}
                switchValue={task.item.completed}
                switchOnToggle={(value) => { this.completeIncompleteTask(value, task.item.task_id); }}
            />
        );
    }

    renderProjectList() {
        if (this.props.projectListLoading) {
            return <SkypeIndicator color={colors.headerBlue} size={EStyleSheet.value('40rem')} />;
        } else {
            return (
                <List containerStyle={{ flex: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginTop: 0 }}>
                    <FlatList
                        data={this.props.projects}
                        renderItem={({ item }) => (
                            <ListItem
                                title={item}
                                containerStyle={{ borderBottomWidth: 0 }}
                                onPress={() => this.onProjectPicked(item)}
                            />
                        )}
                        keyExtractor={item => item}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={this.renderHeader}
                    />
                </List>
            );
        }
    }

    onTaskTypeChanged(value) {
        let taskType;
        switch (value) {
            case 'On Going Tasks':
                taskType = 'ongoing';
                break;
            case 'Overdue Tasks':
                taskType = 'overdue';
                break;
            case 'Completed Tasks':
                taskType = 'completed';
                break;
            default:
                taskType = 'ongoing';
        }

        this.onTaskTypeSelected(taskType);
        this.setState({ modalVisible: false });
    }

    renderTaskType(item) {
        return (
            <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                    this.setState({ isTaskTypePickerVisible: false })
                    this.onTaskTypeSelected(item.item.key);
                }}
            >
                <Text style={styles.itemText}>{item.item.value}</Text>
            </TouchableOpacity>
        )
    }

    setSelectedItemName(key) {
        switch (key) {
            case 'ongoing':
                return 'Ongoing Tasks';
            case 'overdue':
                return 'Overdue Tasks';
            case 'completed':
                return 'Completed Tasks';
            default:
                return 'Ongoing Tasks';
        }
    }

    render() {
        const data = [
            {
                key: 'ongoing',
                value: 'Ongoing Tasks',
            },
            {
                key: 'overdue',
                value: 'Overdue Tasks'
            },
            {
                key: 'completed',
                value: 'Completed Tasks'
            }];

        return (
            //main container
            <View style={styles.container}>
                <OfflineNotice />
                {/* task type select button */}
                <TouchableOpacity
                    style={styles.buttonDark}
                    onPress={() => this.setState({ isTaskTypePickerVisible: true })}
                    activeOpacity={0.7}
                >
                    <Text style={styles.whiteText}>{this.setSelectedItemName(this.props.selectedTaskType)}</Text>
                    <FontAwesomeIcon
                        name='chevron-down'
                        size={EStyleSheet.value('14rem')}
                        color='white'
                        style={[{ right: EStyleSheet.value('18rem'), top: EStyleSheet.value('18rem'), position: 'absolute' }]}
                    />
                </TouchableOpacity>
                {/* task type modal */}
                <Modal
                    isVisible={this.state.isTaskTypePickerVisible}
                    backdropColor='black'
                    useNativeDriver
                    onBackdropPress={() => this.setState({ isTaskTypePickerVisible: false })}
                    onBackButtonPress={() => this.setState({ isTaskTypePickerVisible: false })}
                >
                    <View style={styles.modal}>
                        <FlatList
                            data={data}
                            renderItem={this.renderTaskType.bind(this)}
                            keyExtractor={(item) => item.key}
                            refreshing
                            style={{ marginVertical: 5, flex: 1, backgroundColor: colors.backgroundLight }}
                            ItemSeparatorComponent={this.renderSeparator}
                        />
                    </View>
                </Modal>

                {/* add new task card button */}
                <TouchableOpacity onPress={() => { this.setModalVisible(!this.state.modalVisible); }}>
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

                {this.renderList()}

                {/* add new task modal */}
                <Modal
                    isVisible={this.state.modalVisible}
                    backdropColor='black'
                    avoidKeyboard
                    useNativeDriver
                    animationInTiming={250}
                    animationOutTiming={250}
                    deviceHeight={deviceHeight}
                    deviceWidth={entireScreenWidth}
                    onBackdropPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                        this.setState({ selectProjectVisible: false, projectName: '' });
                        this.props.onProjectsModalClosed();
                    }}
                    onBackButtonPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                        this.setState({ selectProjectVisible: false, projectName: '' });
                        this.props.onProjectsModalClosed();
                    }}
                >
                    {this.state.selectProjectVisible ?
                        // selectProject modal
                        <TouchableOpacity
                            activeOpacity={1}
                            onPressOut={() => {
                                this.setState({ selectProjectVisible: false, projectName: '' });
                                this.props.onProjectsModalClosed();
                            }}
                            style={{ flex: 1, alignSelf: 'stretch' }}
                        >
                            <View style={[styles.modalStyle, { height: modalHeight }]}>
                                {/* header */}
                                <View style={styles.projectModalHeader}>
                                    <View style={{ alignItems: 'flex-start', flex: 5, justifyContent: 'center' }}>
                                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.addProject.bind(this)}>
                                            <IonIcon
                                                name='md-add-circle-outline'
                                                size={22}
                                                color={colors.blue}
                                                style={[{ alignItems: 'flex-start', position: 'relative', }]}
                                            />
                                            <Text style={{ color: colors.textWhite, marginLeft: 6 }}>{`${this.state.buttonPrefix}${this.state.projectName}`}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ alignItems: 'flex-end', flex: 1, justifyContent: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ selectProjectVisible: false, projectName: '' });
                                                this.props.onProjectsModalClosed();
                                            }}
                                        >
                                            <IonIcon
                                                name='md-close-circle'
                                                size={EStyleSheet.value('22rem')}
                                                color={colors.textWhite}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {/* body */}
                                <View style={[{ flex: 18 }, styles.modalBottamStyle]}>
                                    {this.renderProjectList()}
                                </View>
                            </View>
                        </TouchableOpacity>
                        :
                        // add task modal
                        <TouchableOpacity
                            activeOpacity={1}
                            onPressOut={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}
                            style={{ flex: 1, alignSelf: 'stretch' }}
                        >
                            <TouchableWithoutFeedback>
                                {/* modal header */}
                                <View style={[styles.modalStyle, { height: modalHeight }]}>
                                    <View style={styles.modalHeaderStyle}>
                                        <View style={styles.modalHeaderTopStyle}>
                                            <TouchableOpacity onPress={() => { this.setModalVisible(!this.state.modalVisible); }}>
                                                <IonIcon
                                                    name='md-close-circle'
                                                    size={EStyleSheet.value('20rem')}
                                                    color={colors.textWhite}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.modalHeaderBottomStyle}>
                                            <Text style={styles.modalHeaderTextStyle}>TASK CARD ADD</Text>
                                        </View>
                                    </View>
                                    {/* modal body */}
                                    <View style={styles.modalBodyStyle}>
                                        {/* task name input */}
                                        <View style={styles.modalBodySection} >
                                            <Input
                                                label="Task Name"
                                                placeholder="Add Task Name here"
                                                onChangeText={this.onTaskNameChanged.bind(this)}
                                                value={this.props.taskName}
                                            />
                                        </View >
                                        {/* project list picker */}
                                        <View style={[styles.modalBodySection, { justifyContent: 'flex-start' }]}>
                                            <Text style={styles.labelStyle}>Project Name</Text>
                                                <TouchableOpacity style={styles.pickerLight} onPress={this.onSelectProjectPressed.bind(this)}>
                                                    <TextInput
                                                        style={styles.placeholderTextStyle}
                                                        placeholder='Select Project'
                                                        placeholderTextColor={colors.textGray}
                                                        editable={false}
                                                    >
                                                        {this.props.project}
                                                    </TextInput>
                                                </TouchableOpacity>
                                        </View>
                                        {/* date picker */}
                                        <View style={[styles.modalBodySection]}>
                                            <Date
                                                label='Due date'
                                                date={this.props.dueDate}
                                                onDateChange={this.onDueDateChanged.bind(this)}
                                            />
                                        </View>
                                        <View style={[styles.modalBodySection, styles.modalBottamStyle]}>
                                            {this.renderAddTaskButton()}
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>
                    }

                </Modal>

                {/* project list modal */}
                {/* <Modal
                    isVisible={this.state.selectProjectVisible}
                    backdropColor='black'
                    useNativeDriver
                    animationInTiming={250}
                    animationOutTiming={250}
                    avoidKeyboard
                    deviceWidth={entireScreenWidth}
                    deviceHeight={deviceHeight}
                    onBackdropPress={() => {
                        this.setState({ selectProjectVisible: false, projectName: '' });
                        this.props.onProjectsModalClosed();
                    }}
                    onBackButtonPress={() => {
                        this.setState({ selectProjectVisible: false, projectName: '' });
                        this.props.onProjectsModalClosed();
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPressOut={() => {
                            this.setState({ selectProjectVisible: false, projectName: '' });
                            this.props.onProjectsModalClosed();
                        }}
                        style={{ flex: 1, alignSelf: 'stretch' }}
                    >
                        
                        <View style={[styles.modalStyle, { height: modalHeight }]}>
                           
                            <View style={styles.projectModalHeader}>
                                <View style={{ alignItems: 'flex-start', flex: 5, justifyContent: 'center' }}>
                                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.addProject.bind(this)}>
                                        <IonIcon
                                            name='md-add-circle-outline'
                                            size={22}
                                            color={colors.blue}
                                            style={[{ alignItems: 'flex-start', position: 'relative', }]}
                                        />
                                        <Text style={{ color: colors.textWhite, marginLeft: 6 }}>{`${this.state.buttonPrefix}${this.state.projectName}`}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ alignItems: 'flex-end', flex: 1, justifyContent: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ selectProjectVisible: false, projectName: '' });
                                            this.props.onProjectsModalClosed();
                                        }}
                                    >
                                        <IonIcon
                                            name='md-close-circle'
                                            size={EStyleSheet.value('22rem')}
                                            color={colors.textWhite}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            <View style={[{ flex: 18 }, styles.modalBottamStyle]}>
                                {this.renderProjectList()}
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal> */}
            </View >

        );
    }
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
    },
    buttonDark: {
        marginTop: '16rem',
        marginHorizontal: '10rem',
        backgroundColor: colors.headerBlue,
        borderRadius: '5rem',
        paddingVertical: '14rem',
        paddingHorizontal: '10rem'
    },
    pickerLight: {
        backgroundColor: colors.background,
        borderRadius: '3rem',
        height: '40rem',
        position: 'relative',
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: '3rem',
        elevation: 1,
        justifyContent: 'center'
    },
    addButtonCardStyle: {
        marginHorizontal: '10rem',
        marginTop: '16rem',
        padding: '10rem'
    },
    textStyle: {
        color: colors.textGray,
        marginLeft: '15rem',
        alignSelf: 'center'
    },
    whiteText: {
        color: colors.textWhite,
        fontSize: '16rem',
    },
    modalStyle: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        paddingHorizontal: '30rem',
        borderRadius: '10rem',
        marginTop: '70rem',
    },
    modalHeaderStyle: {
        flex: 1,
        backgroundColor: colors.headerBlue,
        borderTopRightRadius: '8rem',
        borderTopLeftRadius: '8rem'
    },
    modalBodyStyle: {
        flex: 4,
        paddingVertical: '20rem',
        paddingHorizontal: '20rem',
        backgroundColor: colors.textWhite,
        borderBottomRightRadius: '10rem',
        borderBottomLeftRadius: '10rem',
        justifyContent: 'center'
    },
    modalHeaderTopStyle: {
        flex: 1.5,
        alignItems: 'flex-end',
        paddingRight: '6rem',
        paddingTop: '2rem',
        backgroundColor: colors.headerBlue,
        borderTopRightRadius: '8rem',
        borderTopLeftRadius: '8rem'
    },
    modalHeaderBottomStyle: {
        flex: 3,
        alignItems: 'center',
        backgroundColor: colors.headerBlue,
    },
    modalHeaderTextStyle: {
        color: colors.textWhite,
        fontWeight: 'bold',
        fontSize: '18rem'
    },
    modalBodySection: {
        flex: 1,
        justifyContent: 'center',
        marginTop: '5rem'
    },
    labelStyle: {
        fontSize: '10rem',
        paddingBottom: '8rem',
        color: colors.textBlack
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    modalSearchbarContainer: {
        flex: 1,
    },
    modalListContainer: {
        flex: 4,
    },
    placeholderTextStyle: {
        paddingLeft: '5rem',
        fontSize: '14rem',
        color: colors.textGray
    },
    modalBottamStyle: {
        borderBottomRightRadius: '10rem',
        borderBottomLeftRadius: '10rem',
        backgroundColor: colors.textWhite
    },
    projectModalHeader: {
        backgroundColor: colors.headerBlue,
        flex: 1,
        borderTopLeftRadius: '10rem',
        borderTopRightRadius: '10rem',
        alignItems: 'center',
        flexDirection: 'row',
        padding: '5rem'
    },
    modal: {
        height: '162rem',
        width: entireScreenWidth * 0.6,
        // marginTop: entireScreenHeight * 0.2,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: '5rem',
        backgroundColor: colors.background,
        paddingHorizontal: '5rem'
    },
    listItem: {
        alignSelf: 'stretch',
        marginHorizontal: '25rem',
        height: '50rem',
        justifyContent: 'center',
    },
    itemText: {
        fontSize: '18rem',
        paddingVertical: '15rem',
        color: colors.textBlack,
        textAlign: 'center'
    }
});

const mapStateToProps = state => {
    return {
        taskName: state.tasks.taskName,
        dueDate: state.tasks.dueDate,
        projects: state.tasks.projects,
        project: state.tasks.project,
        selectedTaskType: state.tasks.taskType,
        tasksList: state.tasks.tasksList,
        ongoingTaskList: state.tasks.ongoingTasks,
        overdueTaskList: state.tasks.overdueTasks,
        completedTaskList: state.tasks.completedTasks,
        complete: state.tasks.complete,
        tasksLoading: state.tasks.tasksLoading,
        addCardBtnColor: state.tasks.addCardBtnColor,
        addCardBtnTextColor: state.tasks.addCardBtnTextColor,
        buttonDisabled: state.tasks.buttonDisabled,
        addTaskLoading: state.tasks.addTaskLoading,
        projectListLoading: state.tasks.projectListLoading,
        arrayholder: state.tasks.arrayholder,
        btnVisible: state.tasks.btnVisible
    };
};

export default connect(mapStateToProps, {
    onModalClosed,
    taskNameChanged,
    fetchProjects,
    dueDateChanged,
    projectPick,
    fetchCompletedTasks,
    fetchInCompletedTasks,
    selectTaskType,
    completeIncompleteTask,
    addTaskCard,
    enableButton,
    addProject,
    searchFilterAction,
    onProjectsModalClosed,
    getUserDetails
})(TasksScreen);
