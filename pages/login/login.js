import React, { useCallback } from "react"
import { View, Button, StyleSheet, Image, TextInput, Text } from "react-native"
import { connect } from "react-redux"
import { Formik } from 'formik';
import { login } from "../../store/action"
import { scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import * as yup from "yup"
//阴影
import { BoxShadow } from 'react-native-shadow'
import { TouchableHighlight } from "react-native-gesture-handler";
const phoneRegExp = /^1[3456789]\d{9}$/
function Login({ dispatch }) {
    const setLogin = useCallback(() => {
        dispatch(login("token" + Math.random()))
    }, [dispatch])
    return (
        <View style={style.container}>
            <BoxShadow setting={shadowOpt}>
                <Image resizeMode="stretch" style={style.logo} source={require("../../assets/imgs/yuanwei.png")}></Image>
            </BoxShadow>
            <Formik
                initialValues={{ phone: '', password: "" }}
                onSubmit={values => console.log(values)}
                validationSchema={
                    yup.object().shape({
                        phone: yup
                            .string()
                            .matches(phoneRegExp, 'Phone number is not valid')
                            .required(),
                        password: yup
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
                        <Text style={style.forget}>忘记密码?</Text>
                        <View style={style.submitWrap}>
                            <Text style={style.loginTitle}>登录</Text>
                            <BoxShadow setting={shadowLogin}>
                                <TouchableHighlight underlayColor="#fff" onPress={handleSubmit}>
                                    <View style={style.btn}>
                                        <Image style={style.arrowRight} source={require("../../assets/imgs/arrow_right.png")}></Image>
                                    </View>
                                </TouchableHighlight>
                            </BoxShadow>
                        </View>

                    </View>
                )}
            </Formik>
        </View>

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
    btn: {
        width: scaleSize(50),
        height: scaleSize(50),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fca413",
        borderRadius: scaleSize(25)
    },
    arrowRight: {
        width: scaleSize(20),
        height: scaleSize(10)
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
        marginTop: scaleSize(100)
    }
}
const shadowLogin = {
    width: scaleSize(50),
    height: scaleSize(50),
    color: "#A2A2A2",
    border: scaleSize(3),
    radius: scaleSize(20),
    opacity: 0.19,
    x: scaleSize(1),
    y: scaleSize(1),
    style: {

    }
}
export default connect(state => state, dispatch => ({ dispatch }))(Login)
