import React,{ useState, useCallback } from "react"
import {ScrollView,RefreshControl} from "react-native"
export function RefreshScrollView(props) {
    const {scrollEnd,onRefresh,refreshing,isSticky=false,stickyIndex=-1}=props
    const _onRefresh = () => {
        onRefresh()
    }
    //这里不能使用useCallback，因为依赖这个函数的函数的上下文中有需要动态改变的值
    const _scrollEnd=(e)=>{
        var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
        if (offsetY + oriageScrollHeight >= 0.9*contentSizeHeight){
           scrollEnd()
        }
    }
    return (<ScrollView
        onMomentumScrollEnd={_scrollEnd}
        stickyHeaderIndices={isSticky?[stickyIndex]:[]}
        refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={_onRefresh}
            />
        }

    >{props.children}</ScrollView>)
}