import React, { useCallback } from "react"
import { View, Button, StyleSheet, Image } from "react-native"
import { connect } from "react-redux"
import { Formik } from 'formik';
import { login } from "../../store/action"
import { scaleSize, setSpText2 } from "../../utils/ScreenUtil"
//阴影
import { BoxShadow } from 'react-native-shadow'
function Login({ dispatch }) {
    const setLogin = useCallback(() => {
        dispatch(login("token" + Math.random()))
    }, [dispatch])
    return (
        <View style={style.container}>
            <BoxShadow setting={shadowOpt}>
                <Image resizeMode="stretch" style={style.logo} source={require("../../assets/imgs/yuanwei.png")}></Image>
            </BoxShadow>
        </View>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    logo: {
        width: scaleSize(80),
        height: scaleSize(100),
        borderRadius: scaleSize(15)
    }
})
const shadowOpt = {
    width: scaleSize(80),
    height: scaleSize(100),
    color: "#A2A2A2",
    border: scaleSize(3),
    radius: scaleSize(8),
    opacity: 0.19,
    x: scaleSize(3),
    y: scaleSize(3),
    style: {
        marginTop: scaleSize(100),
        marginLeft: scaleSize(50),
    }
}
export default connect(state => state, dispatch => ({ dispatch }))(Login)
