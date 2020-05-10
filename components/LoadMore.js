import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, Image, Animated } from "react-native"
import { scaleHeight, scaleSize } from "../utils/ScreenUtil"
//渐变
import LinearGradient from 'react-native-linear-gradient';
function LoadMore(props) {
    const { children } = props
    //pupop 动画
    const [translateYAnimate] = useState(new Animated.Value(0))
    //popup 动画执行
    useEffect(() => {
        let sequence = Animated.sequence([
            Animated.timing(                  // 随时间变化而执行动画
                translateYAnimate,                       // 动画中的变量值
                {
                    toValue: scaleSize(10),                   // 透明度最终变为1，即完全不透明
                    duration: 1000          // 让动画持续一段时间
                }
            ),
            Animated.timing(                  // 随时间变化而执行动画
                translateYAnimate,                       // 动画中的变量值
                {
                    toValue: scaleSize(0),                   // 透明度最终变为1，即完全不透明
                    duration: 1000          // 让动画持续一段时间
                }
            )
        ])
        Animated.loop(sequence).start(); // start the sequence group         // 开始执行动画
    }, [])
    return (
        <View style={style.imgWrap}>
            {children}
            <LinearGradient colors={["rgba(255,255,255,0)", "#fff"]} style={style.loadMore}>
                <Animated.View style={{ transform: [{ translateY: translateYAnimate }] }}>
                    <Image style={style.loadIcon} source={require("../assets/imgs/down-arrow.png")}></Image>
                    <Image style={style.loadIcon} source={require("../assets/imgs/down-arrow.png")}></Image>
                </Animated.View>
            </LinearGradient>
        </View>
    )
}
const style = StyleSheet.create({
    imgWrap: {
        position: "relative",
        width: "100%",
        height: scaleSize(350),
        borderRadius: scaleSize(5),
    },
    loadMore: {
        height: scaleHeight(40),
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    loadIcon: {
        width: scaleSize(20),
        height: scaleHeight(10)
    }
})
export default LoadMore