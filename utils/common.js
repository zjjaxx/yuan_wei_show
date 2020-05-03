
import { findNodeHandle, UIManager } from "react-native"
import AsyncStorage  from "@react-native-community/async-storage"
export function getNodeInfo(ref) {
    return new Promise((resolve, reject) => {
        UIManager.measure(findNodeHandle(ref), (x, y, width, height, pageX, pageY) => {
            resolve({
                x, y, width, height, pageX, pageY
            })
        })
    })
}

export const setLocalStorage = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        // Error saving data
    }
}
export const getLocalStorage = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value
        }
    } catch (error) {
    }
}

export const TOKEN_KEY="TOKEN"