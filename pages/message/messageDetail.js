import React, { useCallback, useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, } from "react-native"
import Header from "../../components/Header"
import { GiftedChat } from 'react-native-gifted-chat'
function MessageDetail({ navigation }) {
    const [messages, setMessages] = useState([{
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
        },
    },])
    const onSend = useCallback((_messages = []) => {
        console.log("send")
        setMessages([ ..._messages,...messages])
    }, [messages])
    //返回事件
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <Header title="小可爱" leftEvent={leftEvent}>
                </Header>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />
            </View>
        </SafeAreaView>

    )
}
const style = StyleSheet.create({
    container: {
        flex: 1
    }
})
export default MessageDetail