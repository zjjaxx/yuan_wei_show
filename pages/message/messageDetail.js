import React, {useCallback } from "react"
import { View, Text, StyleSheet, SafeAreaView, } from "react-native"
import Header from "../../components/Header"
function MessageDetail({navigation}) {
     //返回事件
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <Header title="小可爱" leftEvent={leftEvent}>
                </Header>
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