import React, { useEffect } from "react"
import {View,Text,Image,StyleSheet,StatusBar} from "react-native"
import {connect} from "react-redux"

function Flash(props){
    return (
        <View style={style.container}>
           <Image style={style.flashImg} source={require("../../assets/imgs/flash.jpg")}></Image>
        </View>
    )
}
const style=StyleSheet.create({
    container:{
        flex:1
    },
    flashImg:{
        flex:1
    }
})
export default connect(state=>state,dispatch=>({dispatch}))(Flash)