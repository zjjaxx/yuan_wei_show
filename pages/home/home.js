import React, { useMemo, memo, useCallback, useState, useEffect, useRef, useReducer } from "react"
import { View, Text, StyleSheet, Image, FlatList, SafeAreaView, TouchableHighlight, Alert, TouchableOpacity } from "react-native"
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"
import { WaterfallList } from "react-native-largelist-v3";
import RefreshHeader from "../../components/RefreshHeader"
import { ChineseWithLastDateFooter } from "react-native-spring-scrollview/Customize";
import { Popover } from '@ui-kitten/components';
import toDate from "../../utils/toDate"
import FastImage from 'react-native-fast-image'
import JPush from 'jpush-react-native';
import { connect } from "react-redux"
import { send, parseReceiveMessage } from "../../utils/toBuffer"
//热更新
import { APP_KEY_CONFIG, CLEAR, ADD_LIST, RECEIVE, RECEIVE_ERROR, RECEIVE_UPDATE_HOME_COMMENT_ADD, RECEIVE_UPDATE_HOME_THUMB_ADD } from "../../utils/config"
import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
} from 'react-native-update';
const { appKey } = APP_KEY_CONFIG[Platform.OS];
import { home } from "../../api/api"
import { usePage } from "../../customUse/usePage.js"

function Home({ navigation, webSocket }) {
    const listRef = useRef()
    const reducers = (homeDataList, action) => {
        const { type, payload } = action
        //接收消息
        if (type == RECEIVE) {
            switch (payload.y) {
                //更新首页数据 评论+1
                case RECEIVE_UPDATE_HOME_COMMENT_ADD:
                    const updateData = JSON.parse(payload.d)
                    return homeDataList.map(item => {
                        if (item.id == updateData.goods_id) {
                            return { ...item, common_num: item.common_num + 1 }
                        }
                        else {
                            return item
                        }
                    })
                //更新首页数据 点赞+1
                case RECEIVE_UPDATE_HOME_THUMB_ADD:
                    const updateThumbData = JSON.parse(payload.d)
                    return homeDataList.map(item => {
                        if (item.id == updateThumbData.goods_id) {
                            return { ...item, star_num: item.star_num + 1 }
                        }
                        else {
                            return item
                        }
                    })
                //接收消息 error
                case RECEIVE_ERROR:
                default:
                    return homeDataList
            }
        }
        else if (type == ADD_LIST) {
            return [...homeDataList, ...payload]
        }
        else if (type == CLEAR) {
            return []
        }
    }
    const [homeDataList, dispatch] = useReducer(reducers, [])

    const calcItemHeight = useCallback((item, index) => {
        let height1 = scaleHeight(50) + setSpText2(36) + scaleHeight(140) + scaleHeight(8) + scaleHeight(30)
        let height2 = scaleHeight(50) + setSpText2(36) + scaleHeight(180) + scaleHeight(8) + scaleHeight(30)
        return item.images_info.images_total == 2 ? height1 : height2
    }, [])

    //跳转产品详情页
    const _toProductDetail = useCallback((goods_id) => {
        navigation.navigate("productDetail", { goods_id })
    }, [])
    //跳转发布页
    const _toPublish = useCallback(() => {
        navigation.navigate("publish")
    }, [])
    //热更新
    const doUpdate = async (info) => {
        try {
            const hash = await downloadUpdate(info);
            Alert.alert('提示', '下载完毕,是否重启应用?', [
                { text: '是', onPress: () => { switchVersion(hash); } },
                { text: '否', },
                { text: '下次启动时', onPress: () => { switchVersionLater(hash); } },
            ]);
        } catch (err) {
            Alert.alert('提示', '更新失败.');
        }
    };
    const doCheckUpdate = async () => {
        if (__DEV__ || Platform.OS == "ios") {
            // 开发模式不支持热更新，跳过检查
            return;
        }
        let info;
        try {
            info = await checkUpdate(appKey);
        } catch (err) {
            console.warn(err);
            return;
        }
        if (info.expired) {
            Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
                { text: '确定', onPress: () => { info.downloadUrl && Linking.openURL(info.downloadUrl) } },
            ]);
        } else if (info.upToDate) {
            // Alert.alert('提示', '您的应用版本已是最新.');
        } else {
            Alert.alert('提示', '检查到新的版本' + info.name + ',是否下载?\n' + info.description, [
                { text: '是', onPress: () => { doUpdate(info) } },
                { text: '否', },
            ]);
        }
    };
    //接收消息推送
    const receiveMessage = useCallback((e) => {
        let parseResult = parseReceiveMessage(e)
        console.log("parseResult", parseResult)
        dispatch({ type: RECEIVE, payload: parseResult })
    }, [])
    const _api = useCallback((_page) => {
        home({ page: _page + 1 }).then(({ data: { result } }) => {
            if (result.length) {
                dispatch({ type: ADD_LIST, payload: result })
                setCurrentPage(page => page + 1)
            }
            else {
                setIsFinish(true)
            }
        })
            .finally(res => {
                setIsLoading(false)
            })
    }, [])
    //跳转个人中心
    const toInfo = useCallback((item) => {
        navigation.navigate("info", { uid: item.uid })
    }, [])
    const { setIsLoading,setIsFinish, refresh, loadMore,setCurrentPage } = usePage(_api, () => {
        dispatch({ type: CLEAR })
    })
    useEffect(() => {
        //极光推送
        JPush.init();
        doCheckUpdate()
    }, [])
    //首页数据请求
    useEffect(() => {
        _api(0)
    }, [])
    //接收消息推送
    useEffect(() => {
        if (webSocket) {
            webSocket.addEventListener("message", receiveMessage)
            return () => {
                webSocket.removeEventListener("message", receiveMessage)
            }
        }
    }, [webSocket])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <View style={style.headerWrap}>
                    <Text style={style.headerTitle}>首页</Text>
                    <TouchableHighlight underlayColor="#fff" onPress={_toPublish}>
                        <Image style={style.camera} source={require("../../assets/imgs/camera.png")}></Image>
                    </TouchableHighlight>
                </View>
                <WaterfallList
                    style={{ flex: 1 }}
                    ref={listRef}
                    data={homeDataList}
                    heightForItem={(item, index) => calcItemHeight(item, index)}
                    numColumns={1}
                    loadingFooter={ChineseWithLastDateFooter}
                    renderItem={(item, index) => <RecommandProductItem toInfo={toInfo} productItemData={item} toProductDetail={_toProductDetail} index={index} key={index}></RecommandProductItem>}
                    refreshHeader={RefreshHeader}
                    onRefresh={() =>
                        setTimeout(() => {
                            listRef.current.endRefresh();
                            refresh()
                        }, 1000)
                    }
                    onLoading={() => {
                        setTimeout(() => {
                            listRef.current.endLoading();
                            loadMore()
                        }, 1000)
                    }}
                />
            </View>
        </SafeAreaView>
    )
}
//推荐Item
const RecommandProductItem = memo((props) => {
    const { index, toInfo, toProductDetail, productItemData } = props
    //推荐头部组件
    const RecommandHeader = memo((props) => {
        const { productItemData, toInfo } = props
        const [menuSelect, setMenuSelect,] = useState(false)
        const showPopup = useCallback(() => {
            setMenuSelect(true)
        }, [menuSelect])
        const hidePopup = useCallback(() => {
            setMenuSelect(false)
        }, [])

        return (
            <View style={style.recommonHeaderWrap}>
                <TouchableOpacity activeOpacity={1} onPress={() => toInfo(productItemData.user)}>
                    <FastImage source={{ uri: productItemData.user.avatar }} style={style.avatar}></FastImage>
                </TouchableOpacity>
                <TouchableOpacity style={style.nickerWrap} activeOpacity={1} onPress={toInfo}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={style.nick}>{productItemData.user.nickname}</Text>
                        <Text style={style.time}>{toDate(productItemData.add_time)}</Text>
                    </View>
                </TouchableOpacity>
                <Popover
                    placement="left"
                    visible={menuSelect}
                    anchor={() => <TouchableHighlight underlayColor="#fff" onPress={showPopup}>
                        <Image style={style.more} source={require("../../assets/imgs/more.png")}></Image>
                    </TouchableHighlight>}
                    onBackdropPress={() => hidePopup(false)}>
                    <View style={style.pupopWrap}>
                        <TouchableHighlight activeOpacity={1} underlayColor="rgba(0,0,0,0.7)" onPress={() => { }}>
                            <View style={style.optionItem}>
                                <Image style={style.saveIcon} source={require("../../assets/imgs/save.png")}></Image>
                                <Text style={style.save}>收藏</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight activeOpacity={1} underlayColor="rgba(0,0,0,0.7)" onPress={() => { }}>
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
        const { imgList, images_total } = props
        const _list = () => {
            switch (imgList.length) {
                case 1:
                    return (<View style={style.picWrap}>
                        <FastImage style={style.pic1} source={{ uri: imgList[0] }}></FastImage>
                    </View>)
                case 2:
                    return (<View style={style.picWrap}>
                        {imgList.map((item, index) => <Image key={index} style={[style.pic2, index == 0 ? style.mr10 : {}]} source={{ uri: item }}></Image>)}
                    </View>)
                case 3:
                    if (images_total <= 3) {
                        return (<View style={style.picWrap}>
                            <FastImage style={style.pic3_1} source={{ uri: imgList[0] }}></FastImage>
                            <View style={style.rightWrap}>
                                <FastImage style={[style.pic3_2, style.mb10]} source={{ uri: imgList[1] }}></FastImage>
                                <FastImage style={style.pic3_2} source={{ uri: imgList[2] }}></FastImage>
                            </View>
                        </View>)
                    }
                    else {
                        return (<View style={style.picWrap}>
                            <FastImage style={style.pic3_1} source={{ uri: imgList[0] }}></FastImage>
                            <View style={style.rightWrap}>
                                <FastImage style={[style.pic3_2, style.mb10]} source={{ uri: imgList[1] }}></FastImage>
                                <View style={style.imgWrap}>
                                    <FastImage style={style.pic3_2} source={{ uri: imgList[2] }}></FastImage>
                                    <View style={style.imgMask}>
                                        <Text style={style.imgMore}>+ {images_total}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>)
                    }
                default:
                    return (<View style={style.picWrap}>
                        <FastImage style={style.pic3_1} source={{ uri: imgList[0] }}></FastImage>
                        <View style={style.rightWrap}>
                            <FastImage style={[style.pic3_2, style.mb10]} source={{ uri: imgList[1] }}></FastImage>
                            <View style={style.imgWrap}>
                                <FastImage style={style.pic3_2} source={{ uri: imgList[2] }}></FastImage>
                                <View style={style.imgMask}>
                                    <Text style={style.imgMore}>+{images_total}</Text>
                                </View>
                            </View>
                        </View>
                    </View>)
            }
        }
        return _list()
    })
    return (
        <View style={{ flex: 1, paddingHorizontal: scaleSize(15) }}>
            <RecommandHeader toInfo={toInfo} productItemData={productItemData}></RecommandHeader>
            <Text numberOfLines={2} ellipsizeMode="tail" style={style.comment}>{productItemData.store_info}</Text>
            <TouchableHighlight underlayColor="#fff" onPress={() => toProductDetail(productItemData.id)}>
                <ImgList images_total={productItemData.images_info.images_total} imgList={productItemData.images_info.images}></ImgList>
            </TouchableHighlight>
            <View style={style.recommandBottomWrap}>
                <TouchableHighlight underlayColor="#fff" onPress={() => { }}>
                    <View style={style.bottomOptionItem}>
                        <Image style={style.loveIcon} source={require("../../assets/imgs/love.png")}></Image>
                        <Text style={style.loveCount}>{productItemData.star_num}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="#fff" onPress={() => { }}>
                    <View style={style.bottomOptionItem}>
                        <Image style={style.commentIcon} source={require("../../assets/imgs/comment.png")}></Image>
                        <Text style={style.commentCount}>{productItemData.common_num}</Text>
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
        height: scaleHeight(50),
        flexDirection: "row",
        alignItems: "center",
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
        marginTop: scaleHeight(8),
        flexDirection: "row"
    },
    pic1: {
        height: scaleHeight(180),
        width: "100%",
        borderRadius: scaleSize(15)
    },
    pic2: {
        flex: 1,
        height: scaleHeight(120),
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
    imgWrap: {
        position: "relative",
        flex: 1,
        width: "100%",
    },
    imgMask: {
        borderRadius: scaleSize(15),
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
    },
    imgMore: {
        fontSize: setSpText2(18),
        color: "#fff"
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
        marginTop: scaleHeight(10),
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
export default connect(state => state, dispatch => ({ dispatch }))(Home)