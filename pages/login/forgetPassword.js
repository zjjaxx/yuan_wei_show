import React, { useCallback, useState, useRef, useEffect } from "react"
import { View, Button, StyleSheet, Image, TextInput, Text, Alert, ScrollView, TouchableOpacity, TouchableHighlight, SafeAreaView, KeyboardAvoidingView } from "react-native"
import { connect } from "react-redux"
import { Formik } from 'formik';
import { login } from "../../store/action"
import { register, msgCode } from "../../api/api"
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"
import * as yup from "yup"
import { showToast, encrypt } from "../../utils/common"

const phoneRegExp = /^1[3456789]\d{9}$/
const passwordRegExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
function ForgetPassword({ dispatch, navigation, device_code }) {
    //加密
    const [key, setKey] = useState("")
    const [iv, setIv] = useState("")
    //短信验证码
    const [codeState, setCodeState] = useState("获取验证码")
    //倒计时ref
    const timerRef = useRef()
    //重置密码事件
    const resetPassword = useCallback((values) => {
        let password = encrypt(values.password, key, iv)
        let confirm_password = encrypt(values.confirm_password, key, iv)
        // register({
        //     mobile: values.mobile,
        //     password,
        //     confirm_password,
        //     pid: values.pid,
        //     msgCode: values.msgCode,
        //     device_code
        // }).then(({ data: { result } }) => {
        //     dispatch(login(result.token))
        // })
    }, [dispatch, key, iv])
    //提交事件
    const _handleSubmit = useCallback((values, errors, handleSubmit) => {
        if (!(values.msgCode && values.mobile && values.password && values.confirm_password)) {
            return
        }
        if (values.password != values.confirm_password) {
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
    const getCode = useCallback((mobile) => {
        if (codeState != "获取验证码") {
            return
        }
        if (!phoneRegExp.test(mobile)) {
            showToast("手机格式有误")
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
        msgCode({ mobile }).then(({ data: { result } }) => {
            setKey(result.key)
            setIv(result.iv)
        })
    }, [codeState, timerRef])
    //取消倒计时
    useEffect(() => {
        return () => {
            timerRef.current && clearInterval(timerRef.current)
        }
    }, [timerRef])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ScrollView style={style.container}>
                    <Image resizeMode="stretch" style={style.logo} source={require("../../assets/imgs/yuanwei.png")}></Image>
                    <Formik
                        initialValues={{ mobile: '', password: "", confirm_password: "", msgCode: "" }}
                        onSubmit={values => setLogin(values)}
                        validationSchema={
                            yup.object().shape({
                                mobile: yup
                                    .string()
                                    .matches(phoneRegExp, '手机格式有误')
                                    .required(),
                                password: yup
                                    .string()
                                    .matches(passwordRegExp, "密码必须是6~16位数字和字母组合")
                                    .required(),
                                confirm_password: yup
                                    .string()
                                    .matches(passwordRegExp, "密码必须是6~16位数字和字母组合")
                                    .required(),
                                msgCode: yup
                                    .string()
                                    .required("请输入验证码")
                            })}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (

                            <View style={style.formWrap}>
                                <Text style={style.inputTitle}>请输入你的手机号</Text>
                                <View style={style.inputWrap}>
                                    <TextInput
                                        style={style.input}
                                        returnKeyType="done"
                                        returnKeyLabel="完成"
                                        keyboardType="numeric"
                                        onChangeText={handleChange('mobile')}
                                        value={values.mobile}
                                    />
                                    {values.mobile ? <Image style={style.tipIcon} source={errors.mobile ? require("../../assets/imgs/error.png") : require("../../assets/imgs/ok.png")}></Image> : null}
                                </View>
                                <Text style={[style.inputTitle, style.mt10]}>请输入密码</Text>
                                <View style={style.inputWrap}>
                                    <TextInput
                                        returnKeyType="done"
                                        returnKeyLabel="完成"
                                        style={style.input}
                                        onChangeText={handleChange('password')}
                                        value={values.password}
                                        secureTextEntry={true}
                                    />
                                    {values.password ? <Image style={style.tipIcon} source={errors.password ? require("../../assets/imgs/error.png") : require("../../assets/imgs/ok.png")}></Image> : null}
                                </View>
                                <Text style={[style.inputTitle, style.mt10]}>请再次输入密码</Text>
                                <View style={style.inputWrap}>
                                    <TextInput
                                        returnKeyType="done"
                                        returnKeyLabel="完成"
                                        style={style.input}
                                        onChangeText={handleChange('confirm_password')}
                                        value={values.confirm_password}
                                        secureTextEntry={true}
                                    />
                                    {values.confirm_password ? <Image style={style.tipIcon} source={errors.confirm_password ? require("../../assets/imgs/error.png") : require("../../assets/imgs/ok.png")}></Image> : null}
                                </View>
                                <Text style={[style.inputTitle, style.mt10]}>短信验证码</Text>
                                <View style={style.inputWrap}>
                                    <TextInput
                                        returnKeyType="done"
                                        returnKeyLabel="完成"
                                        style={style.input}
                                        onChangeText={handleChange('msgCode')}
                                        value={values.msgCode}
                                    />
                                    <TouchableOpacity onPress={() => getCode(values.mobile)}>
                                        <Text style={style.qcode}>{codeState}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={style.submitWrap}>
                                    <Text style={style.loginTitle}>重置密码</Text>
                                    <TouchableHighlight underlayColor="#fff" onPress={() => _handleSubmit(values, errors, handleSubmit)}>
                                        <View style={[style.enabledBtn, values.msgCode && values.confirm_password && values.password && values.mobile && style.activeBtn]}>
                                            <Image style={style.arrowRight} source={require("../../assets/imgs/arrow_right.png")}></Image>
                                        </View>
                                    </TouchableHighlight>
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
                </ScrollView>
            </KeyboardAvoidingView>
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
        marginTop: scaleSize(40),
        width: scaleSize(80),
        height: scaleSize(80),
        borderRadius: scaleSize(15),
        borderWidth: 0
    },
    formWrap: {
        marginTop: scaleSize(30)
    },
    inputWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: scaleSize(0.5),
        borderBottomColor: "#e6e6e6",
    },
    inputTitle: {
        fontSize: setSpText2(14),
        color: "#999"
    },
    input: {
        paddingVertical: scaleHeight(5),
        flex: 1,
        color: "#333",
        fontSize: setSpText2(14)
    },
    mt10: {
        marginTop: scaleHeight(25)
    },
    tipIcon: {
        width: scaleSize(15),
        height: scaleHeight(15)
    },
    forget: {
        marginTop: scaleSize(12),
        color: "#999",
        alignSelf: "flex-end",
        fontSize: setSpText2(12)
    },
    submitWrap: {
        marginTop: scaleSize(50),
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
        height: scaleHeight(10)
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
    height: scaleHeight(100),
    color: "#A2A2A2",
    border: scaleSize(3),
    radius: scaleSize(8),
    opacity: 0.19,
    x: scaleSize(3),
    y: scaleSize(3),
    style: {
        marginTop: scaleSize(20)
    }
}

export default connect(state => state, dispatch => ({ dispatch }))(ForgetPassword)
