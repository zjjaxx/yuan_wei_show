import React, { useState, useCallback } from "react"
import { View, Text, SafeAreaView, StyleSheet, ScrollView,TextInput } from "react-native"
import Header from "../../components/Header"
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"

function Publish({navigation}) {
    //宝贝描述
    const [publishValue, setPublishValue] = useState("")
    //宝贝描述change事件
    const _setPublishValue = useCallback((value) => {
        setPublishValue(value)
    }, [])
    //返回事件
    const _goBack=useCallback(()=>{
        navigation.goBack()
    },[])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <Header
                    leftEvent={_goBack}
                    wrapStyle={style.header}
                    title="发布"
                    right={<View style={style.publishBtn}><Text style={style.publish}>发布</Text></View>}
                    left={<Text style={style.cancelPublish}>取消</Text>}
                ></Header>
                <ScrollView style={style.scrollWrap}>
                    <TextInput
                        placeholder="请输入宝贝详情 ~ ~ ~ "
                        style={style.textArea}
                        onChangeText={_setPublishValue}
                        value={publishValue}
                        multiline
                        numberOfLines={5}
                        maxLength={250}
                    />
                </ScrollView>

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
        fontSize:setSpText2(16),
        lineHeight:scaleHeight(24),
        height: scaleHeight(150)
    }
})

export default Publish