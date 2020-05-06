import React, { useCallback, useState } from "react"
import { View, Text, StyleSheet, SafeAreaView,Button } from "react-native"
import Header from "../../components/Header"
// import { GiftedChat } from 'react-native-gifted-chat'
function MessageDetail({ navigation }) {
    const [messages, setMessages] = useState([{
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1703743334,411607732&fm=26&gp=0.jpg',
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
    //接收消息receiveMessage
    const receiveMessage=useCallback(()=>{
        setMessages([  {
            _id: messages.length+1,
            text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
            createdAt: new Date(),
            quickReplies: {
              type: 'radio', // or 'checkbox',
              keepIt: true,
              values: [
                {
                  title: '😋 Yes',
                  value: 'yes',
                },
                {
                  title: '📷 Yes, let me show you with a picture!',
                  value: 'yes_picture',
                },
                {
                  title: '😞 Nope. What?',
                  value: 'no',
                },
              ],
            },
            user: {
              _id: 2,
              name: 'React Native',
              avatar: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1703743334,411607732&fm=26&gp=0.jpg',
            },
          },...messages])
    },[messages])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <Header title="小可爱" leftEvent={leftEvent}>
                </Header>
                <Button onPress={receiveMessage} title="receive"></Button>
                {/* <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                /> */}
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