import React, { useCallback, useState } from "react"
import { View, Text, ScrollView, FlatList, SafeAreaView, StyleSheet, Image, TouchableHighlight } from "react-native"
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import toDate from "../../utils/toDate"

function MessageList({ navigation }) {
    //下拉刷新flag
    const [refreshing, setRefreshing] = useState(false)
    //下拉刷新事件
    const _onRefresh = useCallback(() => {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 1000)
    }, [refreshing])
    //上拉加载更多事件
    const _scrollEnd = useCallback(() => {
    }, [])
    //跳转聊天页面
    const toMessageDetail = useCallback(() => {
        navigation.navigate("messageDetail")
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <View style={style.headerWrap}>
                    <Text style={style.headerTitle}>消息</Text>
                </View>
                <FlatList
                    style={style.flatList}
                    onEndReached={_scrollEnd}
                    onEndReachedThreshold={0.1}
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                    data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    renderItem={({ item, index }) => <MessageItem toMessageDetail={toMessageDetail} index={index} key={index}></MessageItem>}
                />
            </View>
        </SafeAreaView>
    )
}
//消息item
const MessageItem = function (props) {
    const { toMessageDetail, index } = props
    return (
        <TouchableHighlight underlayColor="#fff" onPress={toMessageDetail}>
            <View style={style.messageItem}>
                <Image style={style.avatar} source={require("../../assets/imgs/avatar.jpeg")}></Image>
                <View style={style.messageInfo}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={style.name}>鱼塘群聊</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={style.message}>你有一条新消息</Text>
                    <Text style={style.time}>{toDate("2020-05-02 15:20:45")}</Text>
                </View>
                <Image style={style.pic} source={require("../../assets/imgs/pic1.jpg")}></Image>
            </View>
        </TouchableHighlight>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerWrap: {
        flexDirection: "row",
        alignItems: "center",
        height: scaleHeight(50),
        paddingHorizontal: scaleSize(15)
    },
    headerTitle: {
        fontSize: setSpText2(16),
        lineHeight: setSpText2(50),
        fontWeight: "500"
    },
    flatList: {
        flex: 1,
        paddingHorizontal: scaleSize(15)
    },
    messageItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: scaleHeight(5),
        justifyContent: "space-between",
        borderBottomColor: "#eee",
        borderBottomWidth: scaleSize(0.5),
    },
    avatar: {
        marginRight: scaleSize(10),
        height: scaleSize(30),
        width: scaleSize(30),
        borderRadius: scaleSize(4),
    },
    messageInfo: {
        flex: 1,
        marginRight: scaleSize(20)
    },
    name: {
        fontSize: setSpText2(14),
        fontWeight: "500"
    },
    message: {
        marginTop: scaleSize(5),
        fontSize: setSpText2(12),
        color: "#999"
    },
    time: {
        marginTop: scaleHeight(10),
        fontSize: setSpText2(12),
        color: "#999"
    },
    pic: {
        height: scaleSize(50),
        width: scaleSize(50),
        borderRadius: scaleSize(4)
    }
})
export default MessageList