import React, { useMemo, memo, useCallback, useState, useEffect } from "react"
import { View, Text, StyleSheet, Image, FlatList } from "react-native"
import { scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import { PupopLeft } from "../../components/PupopLeft"
import { TouchableHighlight } from "react-native-gesture-handler"
function Home({ navigation }) {
    //下拉刷新flag
    const [refreshing, setRefreshing] = useState(false)
    //下拉刷新事件
    const _onRefresh = useCallback(() => {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 1000)
    }, [refreshing])
    //上拉加载更多事件
    const _scrollEnd = useCallback(() => {
        console.log("loadmore")
    }, [])
    //跳转品论
    const _toComment = useCallback((id) => {
        navigation.navigate("comment", { id })
    }, [])
    return (
        <View style={style.container}>
            <View style={style.headerWrap}>
                <Text style={style.headerTitle}>首页</Text>
            </View>
            <FlatList
                style={style.flatList}
                onEndReached={_scrollEnd}
                onEndReachedThreshold={0.1}
                refreshing={refreshing}
                onRefresh={_onRefresh}
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                renderItem={({ item, index }) => <RecommandProductItem  toComment={_toComment} index={index} key={index}></RecommandProductItem>}
            />
        </View>
    )
}
//推荐Item
const RecommandProductItem = memo((props) => {
    const { index, toComment } = props
    //推荐头部组件
    const RecommandHeader = memo((props) => {
        const [menuSelect, setMenuSelect] = useState(false)
        const showPopup = useCallback(() => {
            setMenuSelect(true)
        }, [menuSelect])
        const hidePopup = useCallback(() => {
            setMenuSelect(false)
        }, [])
        return (
            <View style={style.recommonHeaderWrap}>
                <Image source={require("../../assets/imgs/avatar.jpeg")} style={style.avatar}></Image>
                <View style={style.nickerWrap}>
                    <Text style={style.nick}>小可爱</Text>
                    <Text style={style.time}>17分钟前</Text>
                </View>
                {menuSelect ?<PupopLeft hidePopup={hidePopup}>
                    <View style={style.optionItem}>
                        <Image style={style.saveIcon} source={require("../../assets/imgs/save.png")}></Image>
                        <Text style={style.save}>收藏</Text>
                    </View>
                    <View style={style.optionItem}>
                        <Image style={style.reportIcon} source={require("../../assets/imgs/report.png")}></Image>
                        <Text style={style.report}>举报</Text>
                    </View>
                </PupopLeft> 
                : null}
                <TouchableHighlight underlayColor="#fff" onPress={showPopup}>
                    <Image style={style.more} source={require("../../assets/imgs/more.png")}></Image>
                </TouchableHighlight>
            </View>
        )
    })
    //推荐图片组件
    const ImgList = memo((props) => {
        const { imgList } = props
        const _list = () => {
            switch (imgList.length) {
                case 1:
                    return (<View style={style.picWrap}>
                        <Image style={style.pic1} source={require("../../assets/imgs/pic1.jpg")}></Image>
                    </View>)
                case 2:
                    return (<View style={style.picWrap}>
                        {imgList.map((item, index) => <Image key={index} style={[style.pic2, index == 0 ? style.mr10 : {}]} source={require("../../assets/imgs/pic1.jpg")}></Image>)}
                    </View>)
                case 3:
                    return (<View style={style.picWrap}>
                        <Image style={style.pic3_1} source={require("../../assets/imgs/pic3.jpg")}></Image>
                        <View style={style.rightWrap}>
                            <Image style={[style.pic3_2, style.mb10]} source={require("../../assets/imgs/pic2.jpg")}></Image>
                            <Image style={style.pic3_2} source={require("../../assets/imgs/pic1.jpg")}></Image>
                        </View>
                    </View>)
                default:
                    return null
            }
        }
        return _list()
    })
    return (
        <TouchableHighlight activeOpacity={1} underlayColor="#fff" onPress={() => { }}>
            <View>
                <RecommandHeader></RecommandHeader>
                <Text style={style.comment}>已入手一双,钱包已掏空</Text>
                <ImgList imgList={index % 3 == 1 ? [1] : index % 3 == 2 ? [1, 2] : [1, 2, 3]}></ImgList>
                <View style={style.recommandBottomWrap}>
                    <View style={style.bottomOptionItem}>
                        <Image style={style.loveIcon} source={require("../../assets/imgs/love.png")}></Image>
                        <Text style={style.loveCount}>1245</Text>
                    </View>
                    <View style={style.bottomOptionItem}>
                        <Image style={style.commentIcon} source={require("../../assets/imgs/comment.png")}></Image>
                        <Text style={style.commentCount}>7245</Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    )
})

const style = StyleSheet.create({
    container: {
        position:"relative",
        flex: 1,
        backgroundColor: "#fff",
    },
    headerWrap: {
        height: scaleSize(50),
        paddingHorizontal: scaleSize(15)
    },
    headerTitle: {
        fontSize: setSpText2(16),
        lineHeight: scaleSize(50),
        fontWeight: "500"
    },
    flatList: {
        flex: 1,
        paddingHorizontal: scaleSize(15)
    },
    listHeader: {
        height: scaleSize(40),
        alignItems: "center",
        justifyContent: "center"
    },
    listHeaderImage: {
        height: scaleSize(40),
        width: scaleSize(40),
        borderRadius: scaleSize(20)
    },
    recommonHeaderWrap: {
        height: scaleSize(80),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    avatar: {
        marginRight: scaleSize(8),
        height: scaleSize(40),
        width: scaleSize(40),
        borderRadius: scaleSize(20)
    },
    nickerWrap: {
        marginRight: "auto"
    },
    nick: {
        fontSize: setSpText2(14),
        fontWeight: "500"
    },
    time: {
        fontSize: setSpText2(12),
        color: "#999",
        marginTop: scaleSize(4)
    },
    more: {
        width: scaleSize(25),
        height: scaleSize(25)
    },
    comment: {
        fontSize: setSpText2(14),
        lineHeight: scaleSize(18)
    },
    picWrap: {
        marginTop: scaleSize(8),
        flexDirection: "row"
    },
    pic1: {
        height: scaleSize(200),
        width: "100%",
        borderRadius: scaleSize(15)
    },
    pic2: {
        flex: 1,
        height: scaleSize(200),
        borderRadius: scaleSize(15)
    },
    mr10: {
        marginRight: scaleSize(10)
    },
    pic3_1: {
        marginRight: scaleSize(10),
        flex: 2,
        height: scaleSize(200),
        borderRadius: scaleSize(15)
    },
    rightWrap: {
        flex: 1,
        height: scaleSize(200),
    },
    pic3_2: {
        flex: 1,
        width: "100%",
        borderRadius: scaleSize(15)
    },
    mb10: {
        marginBottom: scaleSize(10)
    },
    recommandBottomWrap: {
        marginTop: scaleSize(10),
        flexDirection: "row",
        alignItems: "center",
    },
    bottomOptionItem: {
        width: scaleSize(70),
        height: "100%",
        flexDirection: "row",
        alignItems: "center"
    },
    loveIcon: {
        marginRight: scaleSize(4),
        width: scaleSize(20),
        height: scaleSize(20)
    },
    commentIcon: {
        marginRight: scaleSize(4),
        width: scaleSize(20),
        height: scaleSize(20)
    },
    loveCount: {
        color: "#999",
        fontSize: setSpText2(10)
    },
    commentCount: {
        color: "#999",
        fontSize: setSpText2(10)
    },
    optionItem: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    reportIcon: {
        marginRight: scaleSize(4),
        width: scaleSize(20),
        height: scaleSize(20)
    },
    report: {
        color: "#fff",
        fontSize: setSpText2(12)
    },
    save: {
        color: "#fff",
        fontSize: setSpText2(12)
    },
    saveIcon: {
        marginRight: scaleSize(4),
        width: scaleSize(20),
        height: scaleSize(20)
    }
})
export default Home