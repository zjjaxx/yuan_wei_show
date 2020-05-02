import React, { useCallback } from "react"
import {Text,View,StyleSheet,Image} from "react-native"
import Header from "../../components/Header"
import { scaleSize } from "../../utils/ScreenUtil"

function ProductDetail({navigation}){

    //返回事件
    const leftEvent=useCallback(()=>{
        navigation.goBack()
    },[])
    return (
        <View style={style.container}>
            <Header title="产品详情" leftEvent={leftEvent} right={<Image style={style.share} source={require("../../assets/imgs/share.png")}></Image>}>
            </Header>
        </View>
    )
}
const style=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff"
    },
    share:{
        height:scaleSize(20),
        width:scaleSize(20)
    }
})
export default ProductDetail