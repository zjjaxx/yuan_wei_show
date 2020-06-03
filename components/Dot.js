import React from "react"
import {View,Text,StyleSheet} from "react-native"
import {scaleHeight,scaleSize,setSpText2} from "../utils/ScreenUtil"

function Dot(props){
    const {dot}=props
    return (
        <View style={style.dotWrap}>
            <Text style={style.dot}>{dot}</Text>
        </View>
    )
}
const style=StyleSheet.create({
    dotWrap:{
        position:"absolute",
        top:-scaleSize(5),
        right:-scaleSize(5),
        paddingVertical:scaleHeight(1),
        paddingHorizontal:scaleSize(5),
        backgroundColor:"#f2140c",
        borderRadius:scaleSize(10)
    },
    dot:{
        color:"#fff",
        fontSize:setSpText2(10)
    }
})
export default Dot