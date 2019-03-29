import { AsyncStorage } from "react-native";

export const setData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error('AsyncStorage error: ' + error.message);
    }
};

export const getData = async (key) => {
    let value = '';
    try {
        value = await AsyncStorage.getItem(key) || 'none';
    } catch (error) {
    }
    return value;
};

export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch (exception) {
        return false;
    }
};