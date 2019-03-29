import React, { Component } from 'react';
import {
    View,
    Dimensions,
    FlatList,
    AsyncStorage,
    Alert,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    TextInput
} from 'react-native';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { List, ListItem, SearchBar } from 'react-native-elements';
import { SkypeIndicator } from 'react-native-indicators';

import { UserCollapsable } from '../UserCollapsable';
import { TaskCardMini } from '../TaskCardMini';
import { Button } from '../Button';
import { Input } from '../Input';
import { Date } from '../Date';
import { colors } from '../../config/styles';
import {
    deleteTaskCard,
    taskNameChanged,
    onProjectsModalClosed,
    fetchProjects,
    enableTaskButton,
    addProject,
    searchFilterAction,
    projectPick,
    onModalClosed,
    dueDateChanged,
    addTaskCard,
    addTask,
    editTask,
    taskIdChanged,
    adminCompleteIncompleteTask,
    onAddTaskModalOpened,
    onEditTaskModalOpened,
    onAdminTaskModalClosed
} from '../../actions';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });
const deviceHeight = Dimensions.get('window').height;
const modalHeight = deviceHeight - 140;

class UserTaskRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            userId: '',
            selectProjectVisible: false,
            isEditClicked: false,
            name: '',
            projectName: '',
            taskName: '',
            dueDate: '',
            buttonPrefix: 'Add Project ',
        }
    }

    deleteCard(taskId) {
        Alert.alert(
            'Delete Task Card',
            'Are you sure you want to delete this task?',
            [
                { text: 'Decline' },
                {
                    text: 'Accept',
                    onPress: () => {
                        AsyncStorage.getItem('token').then((token) => {
                            this.props.deleteTaskCard(token, taskId);
                        });
                    }
                }
            ]
        );
    }

    editCard(task, name) {
        this.setState({
            isModalVisible: true,
            isEditClicked: true,
            name
        });
        this.props.taskNameChanged(task.task_name);
        this.props.projectPick(task.project_name);
        this.props.taskIdChanged(task.task_id);
        this.props.dueDateChanged(task.deadline);
        this.props.onEditTaskModalOpened();
    }

    addTaskCard(userId, name) {
        this.setState({
            isModalVisible: true,
            isEditClicked: false,
            name,
            userId
        });
        this.props.onAddTaskModalOpened();
    }

    setModalVisible(visible) {
        if (!visible) {
            this.props.onModalClosed();
        }
        this.setState({ isModalVisible: visible });
    }

    onTaskNameChanged(text) {
        this.props.taskNameChanged(text);
        if (this.props.project !== '') {
            this.props.enableTaskButton();
        }
    }

    onDueDateChanged(date) {
        this.props.dueDateChanged(date);
        if (this.state.isEditClicked) {
            this.props.enableTaskButton();
        }
    }

    onSelectProjectPressed() {
        this.setState({ selectProjectVisible: true });
        AsyncStorage.getItem('token').then((token) => {
            this.props.fetchProjects(token);
        });
    }

    onProjectPicked(text) {
        this.props.projectPick(text);
        this.setState({ selectProjectVisible: false });
        if (this.props.taskName !== '') {
            this.props.enableTaskButton();
        }
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
        if (this.props.adminAddTaskLoading || this.props.adminEditTaskLoading) {
            return <SkypeIndicator color={colors.buttonRed} size={EStyleSheet.value('40rem')} />;
        } else if (this.state.isEditClicked) {
            return (
                <Button
                    onPress={this.onEditCardPressed.bind(this)}
                    color={this.props.addCardBtnColor}
                    textColor={this.props.addCardBtnTextColor}
                    disabled={this.props.taskButtonDisabled}
                >
                    Edit Card
                </Button>
            );
        } else {
            return (
                <Button
                    onPress={this.onAddCardPressed.bind(this)}
                    color={this.props.addCardBtnColor}
                    textColor={this.props.addCardBtnTextColor}
                    disabled={this.props.taskButtonDisabled}
                >
                    Add Card
                </Button>
            );
        }
    }

    onAddCardPressed() {
        const { taskName, dueDate, project } = this.props;
        const userId = this.state.userId;
        AsyncStorage.getItem('token').then((token) => {
            this.props.addTask(token, taskName, dueDate, userId, project);
        });
        // this.setState({ isModalVisible: false });
        // this.props.onAdminTaskModalClosed();
    }

    onEditCardPressed() {
        const { taskName, dueDate, taskId } = this.props;
        AsyncStorage.getItem('token').then((token) => {
            this.props.editTask(token, taskName, dueDate, taskId);
        });
        // this.setState({ isModalVisible: false });
        // this.props.onAdminTaskModalClosed();
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

    renderItem(task) {
        let cardColor;
        let daysLeft;
        let completed = false;
        //selecting card color and bottom icon
        if (task.item.completed) {
            cardColor = colors.green;
            completed = true;
        } else {
            if (task.item.remain_days >= 0) {
                cardColor = colors.blue;
            } else {
                cardColor = colors.buttonRed;
            }
        }

        //formatting days left
        if (task.item.completed) {
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
            <TaskCardMini
                id={task.item.task_id}
                message={task.item.task_name}
                project={task.item.project_name}
                daysLeft={daysLeft}
                date={task.item.deadline}
                color={cardColor}
                completed={completed}
                switchValue={task.item.completed}
                onDelete={this.deleteCard.bind(this, task.item.task_id)}
                onEdit={this.editCard.bind(this, task.item, this.props.item.name)}
                switchOnToggle={(value) => { this.completeIncompleteTask(value, task.item.task_id); }}
            />
        );
    }

    completeIncompleteTask(value, taskId) {
        AsyncStorage.getItem('token').then((token) => {
            this.props.adminCompleteIncompleteTask(token, value, taskId);
        });
    }

    render() {
        const { userId, name, position, profilePic, tasks } = this.props.item;
        return (
            <View style={styles.mainContainer}>
                <UserCollapsable
                    name={name}
                    position={position}
                    profilePic={profilePic}
                    onAddCard={this.addTaskCard.bind(this, userId, name)}
                />
                <FlatList
                    data={tasks}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(task) => task.task_id.toString()}
                    refreshing
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.taskListStyle}
                    style={{ alignSelf: 'center' }}
                />

                {/* add task modal */}
                <Modal
                    animationType="slide"
                    transparent
                    visible={this.state.isModalVisible}
                    onRequestClose={() => {
                        this.setState({ isModalVisible: false, });
                        this.props.projectPick('');
                        this.props.onAdminTaskModalClosed();
                    }}
                >

                    {this.state.selectProjectVisible ?

                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                this.setState({ selectProjectVisible: false, });
                                this.props.onProjectsModalClosed();
                                this.props.onAdminTaskModalClosed();
                            }}
                            style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'rgba(1, 1, 1, 0.7)' }}
                        >
                            <TouchableWithoutFeedback>
                                {/* project select modal */}
                                <View style={[styles.modalStyle, { height: modalHeight }]}>
                                    {/* header */}
                                    <View style={styles.projectModalHeader}>
                                        <View style={{ alignItems: 'flex-start', flex: 5, justifyContent: 'center', backgroundColor: colors.headerBlue }}>
                                            <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.addProject.bind(this)}>
                                                <IonIcon
                                                    name='md-add-circle-outline'
                                                    size={EStyleSheet.value('20rem')}
                                                    color={colors.blue}
                                                    style={[{ alignItems: 'flex-start', position: 'relative', }]}
                                                />
                                                <Text style={{ color: colors.textWhite, marginLeft: 6 }}>{`${this.state.buttonPrefix}${this.state.projectName}`}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', flex: 1, justifyContent: 'center', backgroundColor: colors.headerBlue }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({ selectProjectVisible: false });
                                                    this.props.onAdminTaskModalClosed();
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
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>
                        :
                        // addtask modal
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                this.setState({ isModalVisible: false, });
                                this.props.projectPick('');
                            }}
                            style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'rgba(1, 1, 1, 0.7)' }}
                        >
                            <TouchableWithoutFeedback>
                                {/* modal header */}
                                <View style={[styles.modalStyle, { height: modalHeight }]}>
                                    <View style={styles.modalHeaderStyle}>
                                        <View style={styles.modalHeaderTopStyle}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setModalVisible(!this.state.isModalVisible);
                                                    this.props.projectPick('');
                                                }}
                                            >
                                                <IonIcon
                                                    name='md-close-circle'
                                                    size={EStyleSheet.value('22rem')}
                                                    color={colors.textWhite}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.modalHeaderBottomStyle}>
                                            {
                                                this.state.isEditClicked ?
                                                    <Text style={styles.modalHeaderTextStyle}>EDIT TASK CARD</Text>
                                                    :
                                                    <Text style={styles.modalHeaderTextStyle}>ADD TASK CARD</Text>
                                            }

                                        </View>
                                    </View>
                                    {/* modal body */}
                                    <View style={styles.modalBodyStyle}>
                                        {/* username */}
                                        <View style={[styles.modalBodySection, { justifyContent: 'flex-start' }]}>
                                            <Text style={styles.labelStyle}>User name</Text>
                                            <View style={styles.pickerLight}>
                                                <TextInput
                                                    style={styles.placeholderTextStyle}
                                                    placeholder='User name'
                                                    placeholderTextColor={colors.textGray}
                                                    editable={false}
                                                >
                                                    {this.state.name}
                                                </TextInput>
                                            </View>
                                        </View>
                                        {/* task name input */}
                                        <View style={styles.modalBodySection} >
                                            <Input
                                                label="Task Name"
                                                placeholder="Add Task Name here"
                                                value={this.props.taskName}
                                                onChangeText={this.onTaskNameChanged.bind(this)}
                                            />
                                        </View >
                                        {/* project list picker */}
                                        <View style={[styles.modalBodySection, { justifyContent: 'flex-start' }]}>
                                            <Text style={styles.labelStyle}>Project Name</Text>
                                                <TouchableOpacity style={styles.pickerLight} onPress={this.onSelectProjectPressed.bind(this)} disabled={this.state.isEditClicked}>
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
                    animationType="slide"
                    transparent={false}
                    visible={this.state.selectProjectVisible}
                    onRequestClose={() => {
                        this.setState({ selectProjectVisible: false, });
                        this.props.onProjectsModalClosed();
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            this.setState({ selectProjectVisible: false, });
                            this.props.onProjectsModalClosed();
                        }}
                        style={{ flex: 1, alignSelf: 'stretch' }}
                    >
                        <TouchableWithoutFeedback>
                            
                            <View style={[styles.modalStyle, { height: modalHeight }]}>
                                
                                <View style={styles.projectModalHeader}>
                                    <View style={{ alignItems: 'flex-start', flex: 5, justifyContent: 'center' }}>
                                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.addProject.bind(this)}>
                                            <IonIcon
                                                name='md-add-circle-outline'
                                                size={EStyleSheet.value('22rem')}
                                                color={colors.blue}
                                                style={[{ alignItems: 'flex-start', position: 'relative', }]}
                                            />
                                            <Text style={{ color: colors.textWhite, marginLeft: 6 }}>{`${this.state.buttonPrefix}${this.state.projectName}`}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ alignItems: 'flex-end', flex: 1, justifyContent: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ selectProjectVisible: false });
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
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal> */}
            </View >
        );
    }
}

const styles = EStyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    taskListStyle: {
        paddingHorizontal: EStyleSheet.value('10rem'),
        paddingVertical: EStyleSheet.value('5rem'),
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
    modalStyle: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        paddingHorizontal: '30rem',
        borderRadius: '10rem',
        marginTop: '75rem'
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
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: '6rem',
        paddingTop: '4rem',
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
    placeholderTextStyle: {
        paddingLeft: '5rem',
        fontSize: '14rem',
        color: colors.textGray
    },
    modalSearchbarContainer: {
        flex: 1,
    },
    modalListContainer: {
        flex: 4,
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
    }
});

const mapStateToProps = state => {
    return {
        taskName: state.tasks.taskName,
        projects: state.tasks.projects,
        projectListLoading: state.tasks.projectListLoading,
        arrayholder: state.tasks.arrayholder,
        btnVisible: state.tasks.btnVisible,
        project: state.tasks.project,
        dueDate: state.tasks.dueDate,
        addCardBtnColor: state.dashboard.addCardBtnColor,
        addCardBtnTextColor: state.dashboard.addCardBtnTextColor,
        taskButtonDisabled: state.dashboard.taskButtonDisabled,
        adminAddTaskLoading: state.dashboard.adminAddTaskLoading,
        taskId: state.dashboard.taskId,
        year: state.dashboard.year,
        date: state.dashboard.date,
        adminEditTaskLoading: state.dashboard.adminEditTaskLoading,
    };
};

export default connect(mapStateToProps, {
    deleteTaskCard,
    taskNameChanged,
    onProjectsModalClosed,
    enableTaskButton,
    addProject,
    searchFilterAction,
    fetchProjects,
    projectPick,
    onModalClosed,
    dueDateChanged,
    addTaskCard,
    addTask,
    editTask,
    taskIdChanged,
    adminCompleteIncompleteTask,
    onAddTaskModalOpened,
    onEditTaskModalOpened,
    onAdminTaskModalClosed
})(UserTaskRow);

