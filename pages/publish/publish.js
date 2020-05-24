import React, { useState, useCallback, useEffect } from "react"
import { View, Text, SafeAreaView, Alert, StyleSheet, ScrollView, TextInput, Button, Image, TouchableHighlight, KeyboardAvoidingView, Switch } from "react-native"
import Header from "../../components/Header"
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"
import ImageUpload from "../../components/ImageUpload"
import { Formik } from 'formik';
import * as yup from "yup"
import { CheckBox } from '@ui-kitten/components';
import { publish } from "../../api/api"

function Publish({ navigation, route }) {
    //图片数组
    const [imageList, setImageList] = useState([])
    //标签数组
    const [labelList, setLabelList] = useState([])
    //是否包邮
    const [isFreeDelivery, setIsFreeDelivery] = useState(true)
    //toggle checkbox
    const toggleLabelChecked = useCallback((checked, index) => {
        setLabelList(labelList => labelList.map((item, _index) => {
            if (index == _index) {
                return { ...item, checked }
            }
            else {
                return item
            }
        }))
    }, [labelList])
    //返回事件
    const _goBack = useCallback(() => {
        navigation.goBack()
    }, [])
    //重置分类
    const resetCategories = useCallback(() => {
        navigation.setParams({ categories: "", tags: "", customTags:""})
        setLabelList([])
    }, [])
    //发布事件校验
    const _handleSubmit = useCallback((values, errors, handleSubmit) => {
        if (!(route.params && route.params.categories)) {
            Alert.alert(
                '提示',
                "请选择分类~",
                [
                    { text: 'OK', onPress: () => { } },
                ],

            )
            return
        }
        if (!imageList.length) {
            Alert.alert(
                '提示',
                "请上传图片~",
                [
                    { text: 'OK', onPress: () => { } },
                ],

            )
            return
        }
        if (!isFreeDelivery && !values.deliverFee) {
            Alert.alert(
                '提示',
                "请输入运费~",
                [
                    { text: 'OK', onPress: () => { } },
                ],

            )
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
    }, [route.params, imageList, isFreeDelivery])
    //发布事件
    const publishEvent = useCallback((values) => {
        let _labelList =labelList.filter(item => item.checked)
        let platform=_labelList.filter(item=>item.id)||[]
        let customTags=_labelList.filter(item=>!item.id)||[]
        let tagList=JSON.stringify({
            platform,
            customTags
        })
        let images = JSON.stringify(imageList.map(item => item.uri))
        let shipping_fee = isFreeDelivery ? 0 : values.deliverFee
        publish({
            type: 1,
            content: values.publishValue,
            cat_id: route.params.categories.id,
            images,
            shipping_fee,
            price: values.price,
            tags: tagList
        }).then(({data:{result}}) => {
            Alert.alert(
                '提示',
                result,
                [
                    { text: 'OK', onPress: () => { navigation.goBack()} },
                ],

            )

        })
    }, [labelList, imageList, isFreeDelivery])
    //标签数组 
    useEffect(() => {
        if (route.params?.tags) {
            setLabelList(route.params.tags.map(item => ({ ...item, checked: false })))
        }
        if(route.params?.customTags){
            let _labelList=route.params.customTags.map(item=>({customTag:item,name:item, checked: true}))
            setLabelList(labelList=>[...labelList,..._labelList])
        }
    }, [route.params?.tags,route.params?.customTags])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "android" ? "" : "padding"} enabled >
                <View style={style.container}>
                    <Formik
                        initialValues={{ publishValue: '', price: "", deliverFee: "" }}
                        onSubmit={(values) => publishEvent(values)}
                        validationSchema={
                            yup.object().shape({
                                publishValue: yup
                                    .string()
                                    .required("请填写产品描述~"),
                                price: yup
                                    .string()
                                    .required("请填写价格~")
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
                                        textAlignVertical='top'
                                        maxLength={250}
                                    />
                                    <ImageUpload imageList={imageList} setImageList={setImageList}></ImageUpload>
                                    <Text style={style.categoriesTitle}>分类</Text>
                                    {route.params && route.params.categories ? <View style={{ flexDirection: "row" }}>
                                        <View style={style.selectCategoriesWrap}>
                                            <Text style={style.categories}>{route.params.categories.cate_name}</Text>
                                            <TouchableHighlight style={style.remove} underlayColor="#fca413" onPress={resetCategories}>
                                                <Image style={style.removeIcon} source={require("../../assets/imgs/removeCategories.png")}></Image>
                                            </TouchableHighlight>
                                        </View>
                                    </View> : <TouchableHighlight underlayColor="#fff" onPress={()=>navigation.navigate("categories")}>
                                            <View style={style.categoriesWrap}>
                                                <Text style={style.all}>全部  > </Text>
                                            </View>
                                        </TouchableHighlight>}
                                    {route.params && route.params.tags ? (
                                        <>
                                            <Text style={style.categoriesTitle}>标签</Text>
                                            <View style={style.labelListWrap}>
                                                {labelList.map((item, index) => (
                                                    <CheckBox
                                                        key={index}
                                                        style={style.checkbox}
                                                        status="warning"
                                                        checked={item.checked}
                                                        onChange={nextChecked => toggleLabelChecked(nextChecked, index)}>
                                                        <Text style={style.labelText}>{item.name}</Text>
                                                    </CheckBox>
                                                ))}
                                                <TouchableHighlight style={style.customTagWrap} underlayColor="#fff" onPress={() => navigation.navigate("customTags")}>
                                                    <Text style={style.all}>添加标签 ></Text>
                                                </TouchableHighlight>
                                            </View>

                                        </>
                                    ) : null}
                                    <View style={style.priceWrap}>
                                        <Image style={style.priceIcon} source={require("../../assets/imgs/price.png")}></Image>
                                        <Text style={style.price}>价格</Text>
                                        <TextInput keyboardType="numeric" placeholder="请输入价格" style={style.priceValue} onChangeText={handleChange("price")} value={values.price}></TextInput>
                                    </View>
                                    <View style={style.isFreeDeliveryWrap}>
                                        <Text style={style.freedelivery}>包邮</Text>
                                        <Switch value={isFreeDelivery} ios_backgroundColor="#eee" onValueChange={() => setIsFreeDelivery(isFreeDelivery => !isFreeDelivery)} trackColor={{ false: '#eee', true: '#fca413' }}></Switch>
                                    </View>
                                    {isFreeDelivery ? null : <View style={style.deliverWrap}>
                                        <Image style={style.deliveryIcon} source={require("../../assets/imgs/delivery.png")}></Image>
                                        <Text style={style.price}>运费</Text>
                                        <TextInput keyboardType="numeric" placeholder="请输入运费" style={style.deliverFeeValue} onChangeText={handleChange("deliverFee")} value={values.deliverFee}></TextInput>
                                    </View>}
                                </ScrollView>
                            </>
                            )}
                    </Formik>
                </View>
            </KeyboardAvoidingView>
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
        height: scaleHeight(150),
        color: "#333"
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
    customTagWrap: {
        height: scaleHeight(25),
        width: scaleSize(100),
        backgroundColor: "#fca413",
        borderRadius: scaleSize(15),
        alignItems: "center",
        justifyContent: "center"
    },
    labelListWrap: {
        paddingVertical: scaleHeight(10),
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems:"center"
    },
    checkbox: {
        marginBottom: scaleHeight(10)
    },
    labelText: {
        fontSize: setSpText2(14)
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
        textAlign: "right",
        fontSize: setSpText2(14),
        fontWeight: "500",
        color: "#333"
    },
    isFreeDeliveryWrap: {
        marginTop: scaleHeight(10),
        borderBottomColor: "#eee",
        borderBottomWidth: scaleSize(0.5),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: scaleHeight(40)
    },
    freedelivery: {
        fontSize: setSpText2(14)
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
        textAlign: "right",
        fontSize: setSpText2(14),
        fontWeight: "500",
        color: "#333"
    }
})

export default Publish