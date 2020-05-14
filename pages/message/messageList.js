import React, { useCallback, useState } from "react"
import { View, Text, ScrollView, FlatList, SafeAreaView, StyleSheet, Image, TouchableHighlight } from "react-native"
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import toDate from "../../utils/toDate"
import { SwipeListView } from 'react-native-swipe-list-view';

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
    //删除地址
    const delAddress = useCallback((rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <View style={style.headerWrap}>
                    <Text style={style.headerTitle}>消息</Text>
                </View>
                    <SwipeListView
                        style={style.scrollView}
                        rightOpenValue={-scaleSize(70)}
                        data={[{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }]}
                        renderItem={(data, rowMap) => (
                            <MessageItem toMessageDetail={toMessageDetail}></MessageItem>
                        )}
                        renderHiddenItem={(data, rowMap) => (
                            <View style={style.addressOptionMenu}>
                                <TouchableHighlight style={style.delOption} underlayColor="#fff" onPress={() => delAddress(rowMap, data.item.key)}>
                                    <Text style={style.delTitle}>删除</Text>
                                </TouchableHighlight>
                            </View>
                        )}>
                    </SwipeListView>
            </View>
        </SafeAreaView>
    )
}
//消息item
const MessageItem = function (props) {
    const { toMessageDetail } = props
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
    scrollView: {
        flex: 1,
    },
    messageItem: {
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: scaleHeight(5),
        justifyContent: "space-between",
        borderBottomColor: "#eee",
        borderBottomWidth: scaleSize(0.5),
    },
    avatar: {
        marginLeft:scaleSize(15),
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
        marginRight:scaleSize(15),
        height: scaleSize(50),
        width: scaleSize(50),
        borderRadius: scaleSize(4)
    },
    addressOptionMenu: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row"
    },
    defaultOption: {
        height: "100%",
        width: scaleSize(70),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#eee",
    },
    defaultTitle: {
        color: "#333",
        fontSize: setSpText2(12),
    },
    delOption: {
        height: "100%",
        width: scaleSize(70),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2140c",
    },
    delTitle: {
        color: "#fff",
        fontSize: setSpText2(12)
    }
})
export default MessageList