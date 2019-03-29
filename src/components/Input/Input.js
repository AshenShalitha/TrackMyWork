import React from 'react';
import { TextInput, View, Text, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { colors } from '../../config/styles';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, editable }) => {
    const { inputStyle, labelStyle, containerStyle } = styles;

    const offset = (Platform.OS === 'android') ? -300 : 0;
    return (
        <View style={containerStyle} behavior="padding" keyboardVerticalOffset={offset}>
            <View style={styles.labelContainer}>
                <Text style={labelStyle}>{label}</Text>
            </View>
            <View style={styles.inputContainer}>
                <KeyboardAvoidingView enabled={true} keyboardVerticalOffset={offset}>
                    <TextInput
                        secureTextEntry={secureTextEntry}
                        placeholder={placeholder}
                        autoCorrect={false}
                        style={inputStyle}
                        value={value}
                        onChangeText={onChangeText}
                        placeholderTextColor={colors.textGray}
                        keykeyboardType={keyboardType}
                        editable={editable}
                    />
                </KeyboardAvoidingView>
            </View>
        </View>
    );
};

const styles = EStyleSheet.create({
    inputStyle: {
        color: colors.textGray,
        paddingRight: '5rem',
        paddingLeft: '5rem',
        fontSize: '14rem',
        lineHeight: '22rem',
    },
    labelStyle: {
        fontSize: '10rem',
        paddingBottom: '8rem',
        color: colors.textBlack
    },
    containerStyle: {
        flex: 1,
    },
    labelContainer: {

    },
    inputContainer: {
        justifyContent: 'center',
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
    }
});

export { Input };
