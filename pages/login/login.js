import React, { useCallback } from "react"
import { View, Button, StyleSheet, Image, TextInput, Text, Alert, TouchableHighlight, SafeAreaView } from "react-native"
import { connect } from "react-redux"
import { Formik } from 'formik';
import * as yup from "yup"
import { login } from "../../store/action"
import { login as loginApi } from "../../api/api"
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"
import { MD5 } from "../../utils/common"
//阴影
import { BoxShadow } from 'react-native-shadow'
const phoneRegExp = /^1[3456789]\d{9}$/
const passwordRegExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
function Login({ dispatch, navigation, device_code }) {
    //登入
    const setLogin = useCallback((values) => {
        let password = MD5(MD5(values.password))
        loginApi({ mobile: values.mobile, password, device_code: device_code }).then(({ data: { result } }) => {
            dispatch(login(result.token))
        })
    }, [dispatch])
    const _handleSubmit = useCallback((values, errors, handleSubmit) => {
        if (!(values.mobile && values.password)) {
            return
        }
        for (let [key, value] of Object.entries(errors)) {
            if (value) {
                Alert.alert(
                    '提示',
                    value,
                    [
                        { text: 'OK', onPress: () => { } },
                    ],

                )
                return
            }
        }
        handleSubmit()
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <Image resizeMode="stretch" style={style.logo} source={require("../../assets/imgs/yuanwei.png")}></Image>
                <Formik
                    initialValues={{ mobile: '', password: "" }}
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
                                .required()
                        })}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <View style={style.formWrap}>
                            <Text style={style.inputTitle}>请输入你的手机号</Text>
                            <View style={style.inputWrap}>
                                <TextInput style={style.input}
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
                                    style={style.input}
                                    returnKeyType="done"
                                    returnKeyLabel="完成"
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={true}
                                />
                                {values.password ? <Image style={style.tipIcon} source={errors.password ? require("../../assets/imgs/error.png") : require("../../assets/imgs/ok.png")}></Image> : null}
                            </View>
                            <TouchableHighlight underlayColor="#fff" onPress={() => navigation.navigate("forgetPassword")}>
                                <Text style={style.forget}>忘记密码?</Text>
                            </TouchableHighlight>
                            <View style={style.submitWrap}>
                                <Text style={style.loginTitle}>登录</Text>
                                <TouchableHighlight underlayColor="#fff" onPress={() => _handleSubmit(values, errors, handleSubmit)}>
                                    <View style={[style.enabledBtn, values.password && values.mobile && style.activeBtn]}>
                                        <Image style={style.arrowRight} source={require("../../assets/imgs/arrow_right.png")}></Image>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    )}
                </Formik>
                <TouchableHighlight underlayColor="#fff" onPress={() => navigation.navigate("register")}>
                    <View style={style.registerWrap} >
                        <Text style={style.noAccount}>暂无账号?</Text>
                        <Text style={style.register}>注册</Text>
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
        marginTop: scaleSize(60),
        width: scaleSize(80),
        height: scaleSize(80),
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
        borderBottomColor: "#e6e6e6",
    },
    inputTitle: {
        fontSize: setSpText2(14),
        color: "#999",
    },
    input: {
        flex: 1,
        color: "#333",
        paddingVertical: scaleHeight(10),
        fontSize: setSpText2(14)
    },
    mt10: {
        marginTop: scaleSize(30)
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
        marginTop: scaleSize(60),
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
    }
})
const shadowOpt = {
    width: scaleSize(80),
    height: scaleSize(80),
    color: "#fca413",
    border: scaleSize(1),
    radius: scaleSize(8),
    opacity: 0.19,
    x: scaleSize(1),
    y: scaleSize(1),
    style: {
        marginTop: scaleSize(60)
    }
}

export default connect(state => state, dispatch => ({ dispatch }))(Login)
