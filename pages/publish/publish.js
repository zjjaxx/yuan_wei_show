import React, { useState, useCallback } from "react"
import { View, Text, SafeAreaView, Alert, StyleSheet, ScrollView, TextInput, Button, Image, TouchableHighlight,KeyboardAvoidingView } from "react-native"
import Header from "../../components/Header"
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"
import ImageUpload from "../../components/ImageUpload"
import { Formik } from 'formik';
import * as yup from "yup"

function Publish({ navigation, route }) {
    //图片数组
    const [imageList, setImageList] = useState([])
    //返回事件
    const _goBack = useCallback(() => {
        navigation.goBack()
    }, [])
    //跳转分类事件
    const toCategories = useCallback(() => {
        navigation.navigate("categories")
    }, [])
    //重置分类
    const resetCategories = useCallback(() => {
        navigation.setParams({ categories: "" })
    }, [])
    //发布事件
    const _handleSubmit = useCallback((values, errors, handleSubmit) => {
        if (!(route.params && route.params.categories)) {
            Alert.alert(
                '提示',
                "请选择分类~",
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],

            )
            return
        }
        if (!imageList.length) {
            Alert.alert(
                '提示',
                "请上传图片~",
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
    }, [route.params, imageList])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <Formik
                    initialValues={{ publishValue: '', price: "", deliverFee: "包邮" }}
                    onSubmit={() => { }}
                    validationSchema={
                        yup.object().shape({
                            publishValue: yup
                                .string()
                                .required("请填写产品描述~"),
                            price: yup
                                .string()
                                .required("请填写价格~"),
                            deliverFee: yup
                                .string()
                                .required("请输入运费~"),
                        })}
                >
                    {({ handleChange, handleSubmit, values, errors }) =>
                        (<>
                            <Header
                                leftEvent={_goBack}
                                wrapStyle={style.header}
                                title="发布"
                                right={<TouchableHighlight style={style.publishBtn} underlayColor="#fca413" onPress={() => _handleSubmit(values, errors, handleSubmit)}>
                                    <Text style={style.publish}>发布</Text>
                                </TouchableHighlight>}
                                left={<Text style={style.cancelPublish}>取消</Text>}
                            ></Header>
                            <ScrollView style={style.scrollWrap}>
                                <TextInput
                                    placeholder="请输入宝贝详情 ~ ~ ~ "
                                    style={style.textArea}
                                    onChangeText={handleChange('publishValue')}
                                    value={values.publishValue}
                                    multiline
                                    numberOfLines={5}
                                    maxLength={250}
                                />
                                <ImageUpload imageList={imageList} setImageList={setImageList}></ImageUpload>
                                <Text style={style.categoriesTitle}>分类</Text>
                                {route.params && route.params.categories ? <View style={{ flexDirection: "row" }}>
                                    <View style={style.selectCategoriesWrap}>
                                        <Text style={style.categories}>{route.params.categories}</Text>
                                        <TouchableHighlight style={style.remove} underlayColor="#fca413" onPress={resetCategories}>
                                            <Image style={style.removeIcon} source={require("../../assets/imgs/removeCategories.png")}></Image>
                                        </TouchableHighlight>
                                    </View>
                                </View> : <TouchableHighlight underlayColor="#fff" onPress={toCategories}>
                                        <View style={style.categoriesWrap}>
                                            <Text style={style.all}>全部  > </Text>
                                        </View>
                                    </TouchableHighlight>}
                                <KeyboardAvoidingView behavior="padding" enabled >
                                    <View style={style.priceWrap}>
                                        <Image style={style.priceIcon} source={require("../../assets/imgs/price.png")}></Image>
                                        <Text style={style.price}>价格</Text>
                                        <TextInput keyboardType="numeric" placeholder="请输入价格" style={style.priceValue} onChangeText={handleChange("price")} value={values.price}></TextInput>
                                    </View>
                                </KeyboardAvoidingView>
                                <KeyboardAvoidingView behavior="padding" enabled >
                                    <View style={style.deliverWrap}>
                                        <Image style={style.deliveryIcon} source={require("../../assets/imgs/delivery.png")}></Image>
                                        <Text style={style.price}>运费</Text>
                                        <TextInput keyboardType="numeric" placeholder="请输入价格" style={style.deliverFeeValue} onChangeText={handleChange("deliverFee")} value={values.deliverFee}></TextInput>
                                    </View>
                                </KeyboardAvoidingView>
                            </ScrollView>
                        </>
                        )}
                </Formik>
            </View>
        </SafeAreaView>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1
    },
    publishBtn: {
        width: scaleSize(45),
        height: scaleHeight(30),
        backgroundColor: "#fca413",
        borderRadius: scaleSize(4),
        alignItems: "center",
        justifyContent: "center"
    },
    publish: {
        fontSize: setSpText2(14)
    },
    header: {
        marginHorizontal: scaleSize(10)
    },
    cancelPublish: {
        fontSize: setSpText2(14)
    },
    scrollWrap: {
        flex: 1,
        paddingHorizontal: scaleSize(20)
    },
    textArea: {
        marginBottom: scaleSize(20),
        borderBottomColor: "#eee",
        borderBottomWidth: scaleSize(0.5),
        fontSize: setSpText2(14),
        height: scaleHeight(150)
    },
    categoriesTitle: {
        marginTop: scaleHeight(20),
        fontSize: scaleSize(16)
    },
    categoriesWrap: {
        marginTop: scaleHeight(20),
        height: scaleHeight(25),
        width: scaleSize(70),
        backgroundColor: "#eee",
        borderRadius: scaleSize(15),
        alignItems: "center",
        justifyContent: "center"
    },
    all: {
        fontSize: setSpText2(12)
    },
    selectCategoriesWrap: {
        marginTop: scaleHeight(10),
        borderRadius: scaleSize(15),
        paddingHorizontal: scaleSize(20),
        paddingVertical: scaleHeight(5),
        backgroundColor: "#fca413",
        flexDirection: "row",
        alignItems: "center"
    },
    categories: {
        fontSize: setSpText2(14)
    },
    remove: {
        marginLeft: scaleSize(10),
        width: scaleSize(15),
        height: scaleSize(15)
    },
    removeIcon: {
        height: "100%",
        width: "100%"
    },
    priceWrap: {
        marginTop: scaleHeight(10),
        borderBottomColor: "#eee",
        borderBottomWidth: scaleSize(0.5),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: scaleHeight(40)
    },
    priceIcon: {
        marginRight: scaleSize(10),
        height: scaleSize(20),
        width: scaleSize(20)
    },
    price: {
        marginRight: "auto",
        fontSize: setSpText2(14)
    },
    priceValue: {
        textAlign: "right"
    },
    deliverWrap: {
        marginTop: scaleHeight(10),
        borderBottomColor: "#eee",
        borderBottomWidth: scaleSize(0.5),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: scaleHeight(40)
    },
    deliveryIcon: {
        marginRight: scaleSize(10),
        height: scaleSize(20),
        width: scaleSize(20)
    },
    deliverFeeValue: {
        textAlign: "right"
    }
})

export default Publish