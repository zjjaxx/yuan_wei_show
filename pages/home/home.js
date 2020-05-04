import React, { useMemo, memo, useCallback, useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, Image, FlatList, SafeAreaView, TouchableHighlight } from "react-native"
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"
import { Popover } from '@ui-kitten/components';
import toDate from "../../utils/toDate"

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
    //跳转产品详情页
    const _toProductDetail = useCallback((id) => {
        navigation.navigate("productDetail", { id })
    }, [])
    //跳转发布页
    const _toPublish = useCallback(() => {
        navigation.navigate("publish")
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <View style={style.headerWrap}>
                    <Text style={style.headerTitle}>首页</Text>
                    <TouchableHighlight underlayColor="#fff" onPress={_toPublish}>
                        <Image style={style.camera} source={require("../../assets/imgs/camera.png")}></Image>
                    </TouchableHighlight>
                </View>
                <FlatList
                    style={style.flatList}
                    onEndReached={_scrollEnd}
                    onEndReachedThreshold={0.1}
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                    data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    renderItem={({ item, index }) => <RecommandProductItem toProductDetail={_toProductDetail} index={index} key={index}></RecommandProductItem>}
                />
            </View>
        </SafeAreaView>
    )
}
//推荐Item
const RecommandProductItem = memo((props) => {
    const { index, toProductDetail } = props
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
                    <Text numberOfLines={1} ellipsizeMode="tail" style={style.nick}>小可爱</Text>
                    <Text style={style.time}>{toDate("2020-05-02 15:20:45")}</Text>
                </View>
                <Popover
                    placement="left"
                    visible={menuSelect}
                    anchor={() => <TouchableHighlight underlayColor="#fff" onPress={showPopup}>
                        <Image style={style.more} source={require("../../assets/imgs/more.png")}></Image>
                    </TouchableHighlight>}
                    onBackdropPress={() => hidePopup(false)}>
                    <View style={style.pupopWrap}>
                        <TouchableHighlight activeOpacity={1} underlayColor="rgba(0,0,0,0.7)" onPress={() => { console.log("press item") }}>
                            <View style={style.optionItem}>
                                <Image style={style.saveIcon} source={require("../../assets/imgs/save.png")}></Image>
                                <Text style={style.save}>收藏</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight activeOpacity={1} underlayColor="rgba(0,0,0,0.7)" onPress={() => { console.log("press item") }}>
                            <View style={style.optionItem}>
                                <Image style={style.reportIcon} source={require("../../assets/imgs/report.png")}></Image>
                                <Text style={style.report}>举报</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </Popover>
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
        <View>
            <RecommandHeader></RecommandHeader>
            <Text style={style.comment}>已入手一双,钱包已掏空</Text>
            <TouchableHighlight underlayColor="#fff" onPress={toProductDetail}>
                <ImgList imgList={index % 3 == 1 ? [1] : index % 3 == 2 ? [1, 2] : [1, 2, 3]}></ImgList>
            </TouchableHighlight>
            <View style={style.recommandBottomWrap}>
                <TouchableHighlight underlayColor="#fff" onPress={() => { }}>
                    <View style={style.bottomOptionItem}>
                        <Image style={style.loveIcon} source={require("../../assets/imgs/love.png")}></Image>
                        <Text style={style.loveCount}>1245</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#fff" onPress={toProductDetail}>
                    <View style={style.bottomOptionItem}>
                        <Image style={style.commentIcon} source={require("../../assets/imgs/comment.png")}></Image>
                        <Text style={style.commentCount}>7245</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </View>
    )
})

const style = StyleSheet.create({
    container: {
        position: "relative",
        flex: 1,
        backgroundColor: "#fff",
    },
    headerWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: scaleHeight(50),
        paddingHorizontal: scaleSize(15)
    },
    headerTitle: {
        fontSize: setSpText2(16),
        lineHeight: setSpText2(50),
        fontWeight: "500"
    },
    camera: {
        width: scaleSize(20),
        height: scaleSize(20)
    },
    flatList: {
        flex: 1,
        paddingHorizontal: scaleSize(15)
    },
    listHeader: {
        height: scaleHeight(40),
        alignItems: "center",
        justifyContent: "center"
    },
    listHeaderImage: {
        height: scaleHeight(40),
        width: scaleSize(40),
        borderRadius: scaleSize(20)
    },
    recommonHeaderWrap: {
        height: scaleHeight(80),
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
        flex: 1,
        marginRight: scaleSize(20)
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
        height: scaleHeight(25)
    },
    comment: {
        fontSize: setSpText2(14),
        lineHeight: setSpText2(18)
    },
    picWrap: {
        marginTop: scaleSize(8),
        flexDirection: "row"
    },
    pic1: {
        height: scaleHeight(180),
        width: "100%",
        borderRadius: scaleSize(15)
    },
    pic2: {
        flex: 1,
        height: scaleHeight(180),
        borderRadius: scaleSize(15)
    },
    mr10: {
        marginRight: scaleSize(10)
    },
    pic3_1: {
        marginRight: scaleSize(10),
        flex: 2,
        height: scaleHeight(180),
        borderRadius: scaleSize(15)
    },
    rightWrap: {
        flex: 1,
        height: scaleHeight(180),
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
        height: scaleHeight(20),
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
    pupopWrap: {
        marginRight: scaleSize(5),
        flexDirection: "row",
        width: scaleSize(150),
        height: scaleHeight(30),
        backgroundColor: "rgba(0,0,0,0.7)",
        borderRadius: scaleSize(4)
    },
    optionItem: {
        height: "100%",
        flexDirection: "row",
        width: scaleSize(75),
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