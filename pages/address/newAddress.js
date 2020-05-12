import React, { useCallback } from "react"
import { View, Text, SafeAreaView, Image, StyleSheet, ScrollView, Switch } from "react-native"
import Header from "../../components/Header"
import { TextInput } from "react-native-gesture-handler"
import { Formik } from 'formik';
import * as yup from "yup"
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"
const phoneRegExp = /^1[3456789]\d{9}$/

function NewAddress({ navigation }) {
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    //提交
    const _handleSubmit = useCallback((values, errors, handleSubmit) => {
        if (!(values.phone && values.name && values.addressDetail)) {
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
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header leftEvent={leftEvent} title="新建收货地址"></Header>
                <Formik
                    initialValues={{ phone: '', name: "", addressDetail: "", isDefault: false }}
                    onSubmit={values => setLogin(values)}
                    validationSchema={
                        yup.object().shape({
                            phone: yup
                                .string()
                                .matches(phoneRegExp, '手机格式有误')
                                .required(),
                            name: yup
                                .string()
                                .required(),
                            addressDetail: yup
                                .string()
                                .required()
                        })}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <ScrollView style={style.scrollView}>
                            <View style={style.formItemWrap}>
                                <Text style={style.label}>收货人</Text>
                                <TextInput value={values.name} placeholder="请填写收货人姓名" onChangeText={handleChange('name')} style={style.nameInput}></TextInput>
                            </View>
                            <View style={style.formItemWrap}>
                                <Text style={style.label}>手机号码</Text>
                                <TextInput value={values.phone} placeholder="请填写收货人手机号" onChangeText={handleChange('phone')} style={style.phoneInput}></TextInput>
                            </View>
                            <View style={style.formItemWrap}>
                                <Text style={style.label}>所在地区</Text>
                                <Text style={style.areTitle}>省市区县、乡镇等</Text>
                                <Image style={style.locationIcon} source={require("../../assets/imgs/location.png")}></Image>
                                <Text style={style.locationTitle}>定位</Text>
                            </View>
                            <View style={style.formItemWrap}>
                                <Text style={style.label}>详细地址</Text>
                                <TextInput value={values.addressDetail} placeholder="街道、楼牌号等" onChangeText={handleChange('addressDetail')} style={style.addressDetailInput}></TextInput>
                            </View>
                            <View style={style.formItemWrap}>
                                <View style={style.defaultLabelWrap}>
                                    <Text style={style.defaultLabel}>设置默认地址</Text>
                                    <Text style={style.tip}>提醒：每次下单会默认推荐使用该地址</Text>
                                </View>
                                <Switch value={values.isDefault} ios_backgroundColor="#eee" onValueChange={handleChange("isDefault")} trackColor="#f2140c"></Switch>
                            </View>
                        </ScrollView>
                    )}
                </Formik>
            </View>
        </SafeAreaView>
    )
}
export default NewAddress
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        flex: 1
    },
    scrollView: {
        flex: 1
    },
    formItemWrap:{
        paddingHorizontal:scaleSize(10),
        paddingVertical:scaleHeight(10),
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        borderBottomColor:"#eee",
        borderBottomWidth:scaleSize(0.5)
    },
    label:{
        width:scaleSize(80),
        fontSize:setSpText2(14)
    },
    nameInput:{
        marginRight:scaleSize(20),
        paddingVertical:0,
        flex:1
    },
    phoneInput:{
        marginRight:scaleSize(20),
        paddingVertical:0,
        flex:1
    },
    areTitle:{
        fontSize:setSpText2(14),
        color:"#999"
    },
    locationIcon:{
        width:scaleSize(15),
        height:scaleSize(15)
    },
    locationTitle:{
        fontSize:setSpText2(14)
    },
    addressDetailInput:{
        marginRight:scaleSize(20),
        paddingVertical:0,
        flex:1
    },
    defaultLabelWrap:{
        marginRight:scaleSize(30),
        flex:1
    },
    defaultLabel:{
        fontSize:scaleSize(14)
    },
    tip:{
        marginTop:scaleHeight(4),
        fontSize:scaleSize(12)
    }
})