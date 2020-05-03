import React, { useCallback, useState, useRef, useEffect } from "react"
import { View, Button, StyleSheet, Image, TextInput, Text, Alert, TouchableOpacity, TouchableHighlight, SafeAreaView } from "react-native"
import { connect } from "react-redux"
import { Formik } from 'formik';
import { login } from "../../store/action"
import { scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import * as yup from "yup"
//阴影
import { BoxShadow } from 'react-native-shadow'

const phoneRegExp = /^1[3456789]\d{9}$/
const passwordRegExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
function Login({ dispatch, navigation }) {
    //短信验证码
    const [codeState, setCodeState] = useState("获取验证码")
    //倒计时ref
    const timerRef = useRef()
    //登入事件
    const setLogin = useCallback((values) => {
        dispatch(login("token" + Math.random()))
    }, [dispatch])
    //提交事件
    const _handleSubmit = useCallback((values, errors, handleSubmit) => {
        if (!(values.qcode && values.phone && values.password && values.confirmPassword)) {
            return
        }
        if (values.password != values.confirmPassword) {
            Alert.alert(
                '提示',
                "2次输入密码不一致",
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],

            )
            return
        }
        for (let [key, value] of Object.entries(errors)) {
            if (value) {
                console.log("value", value)
                Alert.alert(
                    '提示',
                    value,
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],

                )
                return
            }
        }
        handleSubmit()
    }, [])
    //获取短信验证码
    const getCode = useCallback(() => {
        if (codeState != "获取验证码") {
            return
        }
        let timeCount = 60
        timerRef.current = setInterval(() => {
            timeCount = timeCount - 1
            if (timeCount < 0) {
                clearInterval(timerRef.current)
                timerRef.current = null
                setCodeState("获取验证码")
                return
            }
            setCodeState(timeCount + "s")
        }, 1000)
    }, [codeState, timerRef])
    //取消倒计时
    useEffect(() => {
        return () => {
            timerRef.current && clearInterval(timerRef.current)
        }
    }, [timerRef])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <BoxShadow setting={shadowOpt}>
                    <Image resizeMode="stretch" style={style.logo} source={require("../../assets/imgs/yuanwei.png")}></Image>
                </BoxShadow>
                <Formik
                    initialValues={{ phone: '', password: "", confirmPassword: "", qcode: "" }}
                    onSubmit={values => setLogin(values)}
                    validationSchema={
                        yup.object().shape({
                            phone: yup
                                .string()
                                .matches(phoneRegExp, '手机格式有误')
                                .required(),
                            password: yup
                                .string()
                                .matches(passwordRegExp, "密码必须是6~16位数字和字母组合")
                                .required(),
                            confirmPassword: yup
                                .string()
                                .matches(passwordRegExp, "密码必须是6~16位数字和字母组合")
                                .required(),
                            qcode: yup
                                .string()
                                .required()
                        })}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <View style={style.formWrap}>
                            <Text style={style.inputTitle}>请输入你的手机号</Text>
                            <View style={style.inputWrap}>
                                <TextInput style={style.input}
                                    onChangeText={handleChange('phone')}
                                    onBlur={handleBlur('phone')}
                                    value={values.phone}
                                />
                                {values.phone ? <Image style={style.tipIcon} source={errors.phone ? require("../../assets/imgs/error.png") : require("../../assets/imgs/ok.png")}></Image> : null}
                            </View>
                            <Text style={[style.inputTitle, style.mt10]}>请输入密码</Text>
                            <View style={style.inputWrap}>
                                <TextInput
                                    style={style.input}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={true}
                                />
                                {values.password ? <Image style={style.tipIcon} source={errors.password ? require("../../assets/imgs/error.png") : require("../../assets/imgs/ok.png")}></Image> : null}
                            </View>
                            <Text style={[style.inputTitle, style.mt10]}>请再次输入密码</Text>
                            <View style={style.inputWrap}>
                                <TextInput
                                    style={style.input}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    value={values.confirmPassword}
                                    secureTextEntry={true}
                                />
                                {values.confirmPassword ? <Image style={style.tipIcon} source={errors.confirmPassword ? require("../../assets/imgs/error.png") : require("../../assets/imgs/ok.png")}></Image> : null}
                            </View>
                            <Text style={[style.inputTitle, style.mt10]}>短信验证码</Text>
                            <View style={style.inputWrap}>
                                <TextInput
                                    style={style.input}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={true}
                                />
                                <TouchableOpacity onPress={getCode}>
                                    <Text style={style.qcode}>{codeState}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={style.submitWrap}>
                                <Text style={style.loginTitle}>注册</Text>
                                <BoxShadow setting={shadowLogin}>
                                    <TouchableHighlight underlayColor="#fff" onPress={() => _handleSubmit(values, errors, handleSubmit)}>
                                        <View style={[style.enabledBtn, values.qcode && values.confirmPassword && values.password && values.phone && style.activeBtn]}>
                                            <Image style={style.arrowRight} source={require("../../assets/imgs/arrow_right.png")}></Image>
                                        </View>
                                    </TouchableHighlight>
                                </BoxShadow>
                            </View>
                        </View>
                    )}
                </Formik>
                <TouchableHighlight underlayColor="#fff" onPress={() => navigation.navigate("login")}>
                    <View style={style.registerWrap} >
                        <Text style={style.noAccount}>已有账号?</Text>
                        <Text style={style.register}>登录</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </SafeAreaView>

    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scaleSize(30),
        backgroundColor: "#fff",
    },
    logo: {
        width: scaleSize(90),
        height: scaleSize(100),
        borderRadius: scaleSize(15)
    },
    formWrap: {
        marginTop: scaleSize(50)
    },
    inputWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: scaleSize(0.5),
        borderBottomColor: "#f6f6f6",
    },
    inputTitle: {
        fontSize: setSpText2(14),
        color: "#999"
    },
    input: {
        flex: 1,
        height: scaleSize(40),
        width: "100%",
        fontSize: setSpText2(14)
    },
    mt10: {
        marginTop: scaleSize(10)
    },
    tipIcon: {
        width: scaleSize(15),
        height: scaleSize(15)
    },
    forget: {
        marginTop: scaleSize(12),
        color: "#999",
        alignSelf: "flex-end",
        fontSize: setSpText2(12)
    },
    submitWrap: {
        marginTop: scaleSize(100),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    loginTitle: {
        fontSize: setSpText2(22),
        fontWeight: "bold"
    },
    activeBtn: {
        width: scaleSize(50),
        height: scaleSize(50),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fca413",
        borderRadius: scaleSize(25)
    },
    enabledBtn: {
        width: scaleSize(50),
        height: scaleSize(50),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#999",
        borderRadius: scaleSize(25)
    },
    arrowRight: {
        width: scaleSize(20),
        height: scaleSize(10)
    },
    registerWrap: {
        marginTop: scaleSize(40),
        flexDirection: "row"
    },
    noAccount: {
        marginRight: scaleSize(4),
        color: "#999",
        fontSize: setSpText2(12)
    },
    register: {
        fontSize: setSpText2(12),
        color: "#fca413"
    },
    qcode: {
        color: "#fca413",
        fontSize: setSpText2(14)
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
        marginTop: scaleSize(60)
    }
}
const shadowLogin = {
    width: scaleSize(50),
    height: scaleSize(50),
    color: "#A2A2A2",
    border: scaleSize(3),
    radius: scaleSize(24),
    opacity: 0.19,
    x: scaleSize(1),
    y: scaleSize(1),
    style: {

    }
}
export default connect(state => state, dispatch => ({ dispatch }))(Login)
