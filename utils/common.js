
import { findNodeHandle, UIManager } from "react-native"
import AsyncStorage  from "@react-native-community/async-storage"
import CryptoJS from "crypto-js";
import Toast from 'react-native-root-toast';
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



export function showToast(message){
    Toast.show(message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        onShow: () => {
            // calls on toast\`s appear animation start
        },
        onShown: () => {
            // calls on toast\`s appear animation end.
        },
        onHide: () => {
            // calls on toast\`s hide animation start.
        },
        onHidden: () => {
            // calls on toast\`s hide animation end.
        }
    });
}
export function MD5(password) {
    return CryptoJS.MD5(password).toString()
}
//加密aes
export function encrypt(data, _key, _iv) {
    // let text = JSON.stringify(data);
    let text = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(data)
    ).toString();
    let key = CryptoJS.enc.Utf8.parse(_key); //为了避免补位，直接用16位的秘钥
    let iv = CryptoJS.enc.Utf8.parse(_iv); //16位初始向量
    let encrypted = CryptoJS.AES.encrypt(text, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    }).toString();
    return CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(encrypted)
    ).toString();
}