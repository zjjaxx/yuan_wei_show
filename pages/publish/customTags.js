import React, { useState, useCallback, useRef } from "react"
import { View, Text, SafeAreaView, StyleSheet, TouchableHighlight, TextInput, Image } from "react-native"
import Header from "../../components/Header"
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
function CustomTags({ navigation }) {
    const inputRef = useRef()
    const [tagIndex, setTagIndex] = useState(-1)
    const [labelList, setLabelList] = useState([])
    const submit = useCallback(({ nativeEvent: { text, eventCount, target } }) => {
        if (!text) {
            return
        }
        setLabelList(labelList => [...labelList, text])
        inputRef.current.clear();
    }, [])
    const confirmTag = useCallback(() => {
        navigation.navigate("publish", { customTags: labelList })
    }, [labelList])
    const removeTags = useCallback((index) => {
        setLabelList(labelList => labelList.filter((item, _index) => index != _index))
    }, [])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header
                    leftEvent={() => navigation.goBack()}
                    wrapStyle={style.header}
                    title="标签"
                    right={<TouchableHighlight style={style.publishBtn} underlayColor="#fca413" onPress={() => confirmTag()}>
                        <Text style={style.publish}>确认</Text>
                    </TouchableHighlight>}
                    left={<Text style={style.cancelPublish}>取消</Text>}
                ></Header>
                <View style={style.tagsWrap}>
                    {
                        labelList.map((item, index) => <View key={index} style={style.tagItem}>
                            <Text style={style.tagItemText}>{item}</Text>
                            <TouchableHighlight style={style.remove} underlayColor="#fca413" onPress={() => removeTags(index)}>
                                <Image style={style.removeIcon} source={require("../../assets/imgs/removeCategories.png")}></Image>
                            </TouchableHighlight>
                        </View>)
                    }
                    <TextInput
                        ref={inputRef}
                        placeholder="请输入标签~ ~ ~ "
                        style={style.textArea}
                        onSubmitEditing={submit}
                        returnKeyType="done"
                        returnKeyLabel="完成"
                    />
                </View>

            </View>
        </SafeAreaView>
    )
}
export default CustomTags
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
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
    tagsWrap: {
        paddingHorizontal: scaleSize(10),
        paddingVertical: scaleHeight(10),
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center"
    },
    textArea: {
        fontSize: setSpText2(14)
    },
    tagItem: {
        marginRight: scaleSize(10),
        marginBottom: scaleHeight(10),
        paddingHorizontal: scaleSize(10),
        paddingVertical: scaleSize(10),
        borderRadius: scaleSize(15),
        backgroundColor: "#f6f6f6",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fca413",
        flexDirection:"row"
    },
    tagItemText: {
        fontSize: setSpText2(14),
        color: "#333"
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
})