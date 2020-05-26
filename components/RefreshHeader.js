import React from "react"
import {View,Animated} from "react-native"
import { RefreshHeader } from "react-native-spring-scrollview/RefreshHeader";
import {scaleHeight,scaleSize} from "../utils/ScreenUtil"
class ZRefreshHeader extends RefreshHeader {
    //RefreshHeader自带有两个Props, 和一个状态status，在子类里面可以直接使用

    // this.props.maxHeight,类型是number， 表示刷新组件的高度
    // this.props.offset，类型是Animated.Value 表示当前LargeList的contentOffset.y（原生动画值）
    // this.state.status，类型是HeaderStatus: 表示当前刷新组件正处在的状态
    static height = scaleHeight(100)
    // {transform:[{scaleX:this.props.offset/100},{scaleY:this.props.offset/100}]}
    render() {
        let progress = this.props.offset.interpolate({
            inputRange: [0, scaleHeight(100)],
            outputRange: [0, 1]
        });
        return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Animated.Image
                source={require("../assets/imgs/avatar.jpeg")}
                style={{
                    height: scaleSize(50),
                    width: scaleSize(50),
                    borderRadius:scaleSize(25),
                    transform: [
                        { rotate: "180deg" },
                        { scaleX: progress },
                        { scaleY: progress },
                    ]
                }} />
        </View>
    }
}
export default ZRefreshHeader