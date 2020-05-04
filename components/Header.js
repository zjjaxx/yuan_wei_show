import React, { useCallback } from "react"
import { View, Text, StyleSheet, Image, TouchableHighlight } from "react-native"
import { scaleSize, setSpText2 ,scaleHeight} from "../utils/ScreenUtil"

function Header(props) {
    const {wrapStyle={}, left = "", right = "", center = "", title = "HHH", leftEvent = () => { }, rightEvent = () => { console.log("enter right") } } = props
    return (
        <View style={[style.headerWrap,wrapStyle]}>
            {/* view元素一定要放在前面，不然TouchableHighlight如果是absolute定位的话，点击事件会无效 */}
            <View style={style.headerCenter}>
                {center ? center : <View style={style.centerWrap}>
                    <Text style={style.headerTitle}>{title}</Text>
                </View>}
            </View>
            <TouchableHighlight style={style.headerLeftWrap} underlayColor="#fff" onPress={leftEvent}>
                {left ? left : <Image style={style.backIcon} source={require("../assets/imgs/arrow-left.png")}></Image>}
            </TouchableHighlight>
            <TouchableHighlight style={style.headerRightWrap} underlayColor="#fff" onPress={rightEvent}>
                {right ? right : null}
            </TouchableHighlight>
        </View>
    )
}
export default Header
const style = StyleSheet.create({
    headerWrap: {
        height: scaleHeight(45),
    },
    headerLeftWrap: {
        position: "absolute",
        left: 0,
        top: 0,
        height: scaleHeight(45),
        minWidth: scaleSize(45),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    headerRightWrap: {
        position: "absolute",
        right: 0,
        top: 0,
        height: scaleHeight(45),
        minWidth: scaleSize(45),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    backIcon: {
        height: scaleSize(20),
        width: scaleSize(20)
    },
    headerCenter: {
        height: scaleHeight(45),
    },
    headerTitle: {
        fontSize: setSpText2(16),
        fontWeight: "500",
        lineHeight: scaleHeight(45),
        textAlign: "center",
    }
})