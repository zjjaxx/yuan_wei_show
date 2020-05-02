import React, { useMemo, useState, useEffect } from "react"
import { View, StyleSheet, Animated,Text ,Dimensions} from "react-native"
import { scaleSize } from "../utils/ScreenUtil"

export function PupopLeft(props) {
    const { children } = props
    //pupop 动画
    const [widthAnimate] = useState(new Animated.Value(0))
    //popup 动画执行
    useEffect(() => {
        Animated.spring(                  // 随时间变化而执行动画
            widthAnimate,                       // 动画中的变量值
            {
                toValue: scaleSize(150),                   // 透明度最终变为1，即完全不透明
                duration: 400,              // 让动画持续一段时间
            }
        ).start();                        // 开始执行动画
    }, [])
    return (
        <Animated.View style={[style.pupopWrap, { width: widthAnimate }]}>
            {children}
        </Animated.View>

    )
}
const style = StyleSheet.create({
    pupopWrap: {
        marginRight:scaleSize(5),
        flexDirection: "row",
        width: 0,
        height: scaleSize(30),
        backgroundColor: "rgba(0,0,0,0.7)",
        borderRadius: scaleSize(4)
    }
})