import React, { useRef } from "react"
import { View, Text, StyleSheet, Dimensions, Image, Animated } from "react-native"
import { WaterfallList } from "react-native-largelist-v3";
import { RefreshHeader } from "react-native-spring-scrollview/RefreshHeader";


class MyHeader extends RefreshHeader {
    //RefreshHeader自带有两个Props, 和一个状态status，在子类里面可以直接使用

    // this.props.maxHeight,类型是number， 表示刷新组件的高度
    // this.props.offset，类型是Animated.Value 表示当前LargeList的contentOffset.y（原生动画值）
    // this.state.status，类型是HeaderStatus: 表示当前刷新组件正处在的状态
    static height = 200
    // {transform:[{scaleX:this.props.offset/100},{scaleY:this.props.offset/100}]}
    render() {
        let progress = this.props.offset.interpolate({
            inputRange: [0, 200],
            outputRange: [0, 1]
        });

        return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Animated.Image
                source={require("../../assets/imgs/avatar.jpeg")}
                style={{
                    height: 100,
                    width: 100,
                    transform: [
                        { rotate: "180deg" },
                        { scaleX: progress },
                        { scaleY: progress },
                    ]
                }} />
        </View>
    }
}

const cookData = require("./data.json").data.list;
function Test() {
    const listRef = useRef()
    const screenWidth = Dimensions.get("window").width;
    var data = [...cookData, ...cookData, ...cookData, ...cookData, ...cookData]
    const _renderItem = item => {
        return <View style={{ borderWidth: 1, borderBottomColor: '#333', flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>test</Text></View>
    };
    return (
        <WaterfallList
            ref={listRef}
            data={data}
            heightForItem={() => 50}
            numColumns={1}
            // preferColumnWidth={150}
            renderItem={_renderItem}
            refreshHeader={MyHeader}
            onRefresh={() => {
                console.log("trigger")
                setTimeout(() => {
                    listRef.current.endRefresh();
                }, 2000);
            }}
        />
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    section: {
        flex: 1,
        backgroundColor: "gray",
        justifyContent: "center",
        alignItems: "center"
    },
    row: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    line: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 1,
        backgroundColor: "#EEE"
    }
});
export default Test