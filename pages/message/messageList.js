import React, { useCallback, useState, useReducer, useMemo, useEffect } from "react"
import { View, Text, ScrollView, FlatList, SafeAreaView, StyleSheet, Image, TouchableHighlight } from "react-native"
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import toDate from "../../utils/toDate"
import { SwipeListView } from 'react-native-swipe-list-view';
import { connect } from "react-redux"
import { send, parseReceiveMessage } from "../../utils/toBuffer"
import { useFocusEffect } from '@react-navigation/native';
const RECEIVE_ERROR = "1001"
const RECEIVE_MAIN = "2000"
const RECEIVE_CHAT_RESULT = "2001"
const RECEIVE_CHAT_LIST = "2003"
const RECEIVE = "RECEIVE"
const SEND = "SEND"
const CLEAR="CLEAR"
const reducers = (messageList, action) => {
    const { type, payload } = action
    //发送消息
    if (type == SEND) {
    }
    //接收消息
    else if (type == RECEIVE) {
        switch (payload.y) {
            //初始化
            case RECEIVE_MAIN:
                let d = JSON.parse(payload.d)
                return d.msg
            case RECEIVE_CHAT_LIST:
                let chatList = JSON.parse(payload.d)
                return [...messageList, ...chatList.msg]
            //接收消息 error
            case RECEIVE_ERROR:
            default:
                return messageList
        }
    }
    else if(type==CLEAR){
        return []
    }
}
function MessageList({ navigation, webSocket }) {
    const [messageList, dispatch] = useReducer(reducers, [])
    const [page, setPage] = useState(0)
    const [lastPage, setLastPage] = useState(1)
    //下拉刷新flag
    const [refreshing, setRefreshing] = useState(false)
    const c_messageList = useCallback(() => {
        return messageList.map((item, index) => ({ key: index + "", ...item }))
    }, [messageList])
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
    const toMessageDetail = useCallback((messageDataItem) => {
        navigation.navigate("messageDetail", {
            sellId: messageDataItem.m_uid,
            toUid: messageDataItem.c_uid,
            chatTicket: messageDataItem.chat_ticket,
            goodsId: messageDataItem.product_id
        })
    }, [])
    //删除地址
    const delAddress = useCallback((rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }, [])
    //接收消息
    const receiveMessage = useCallback(e => {
        let parseResult = parseReceiveMessage(e)
        console.log("parseResult", parseResult)
        dispatch({ type: RECEIVE, payload: parseResult })
    }, [])
    //获取聊天记录
    useFocusEffect(
        React.useCallback(() => {
            webSocket.onmessage = receiveMessage
            let params = { y: 'index', d: JSON.stringify({ page: page + 1 }) }
            send(params, webSocket)
            return ()=>{
                dispatch({type:CLEAR})
            }
        }, [page])
    )
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <View style={style.headerWrap}>
                    <Text style={style.headerTitle}>消息</Text>
                </View>
                <SwipeListView
                    style={style.scrollView}
                    rightOpenValue={-scaleSize(70)}
                    data={c_messageList()}
                    renderItem={(data, rowMap) => (
                        <MessageItem messageDataItem={data.item} toMessageDetail={toMessageDetail}></MessageItem>
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        <View style={style.addressOptionMenu}>
                            <TouchableHighlight style={style.delOption} underlayColor="#fff" onPress={() => delAddress(rowMap, data.item.key, data.item)}>
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
    const { toMessageDetail, messageDataItem = {} } = props
    console.log("messageDataItem", messageDataItem)
    return (
        <TouchableHighlight underlayColor="#fff" onPress={() => toMessageDetail(messageDataItem)}>
            <View style={style.messageItem}>
                <Image style={style.avatar} source={{ uri: messageDataItem._nickname }}></Image>
                <View style={style.messageInfo}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={style.name}>{messageDataItem._nickname}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={style.message}>{messageDataItem.last_content}</Text>
                    <Text style={style.time}>{toDate(messageDataItem.last_time)}</Text>
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
        marginLeft: scaleSize(15),
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
        marginRight: scaleSize(15),
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
export default connect(state => state, dispatch => ({ dispatch }))(MessageList)