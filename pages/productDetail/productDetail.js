import React, { useCallback, useState, memo, useEffect, useMemo } from "react"
import { Text, View, StyleSheet, Image, ScrollView, TouchableHighlight, SafeAreaView, TextInput, KeyboardAvoidingView, Modal, Alert } from "react-native"
import Header from "../../components/Header"
import CameraRoll from "@react-native-community/cameraroll";
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"
import Carousel from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../../swiperLib/SliderEntry.style';
import LoadMore from "../../components/LoadMore"
import ImageViewer from 'react-native-image-zoom-viewer'
import { productDetail, comment,like} from "../../api/api"
import FastImage from 'react-native-fast-image'
import { connect } from "react-redux"
import toDate from "../../utils/toDate"

function ProductDetail({ navigation, route, userInfo }) {
    const [productDetailData, setProductDetailData] = useState({})
    //是否预览
    const [imgPreviewFlag, setImgPreviewFlag] = useState(false)
    //产品图片
    const productImg = useMemo(() => {
        return productDetailData.images ? productDetailData.images.map(item => ({ url: item.att_dir })) : []
    }, [productDetailData.images])
    //是否显示留言框
    const [isShowLeaveMessage, setIsShowLeaveMessage] = useState(false)
    //回复人信息
    const [replayInfo, setReplayInfo] = useState({})
    //是否收藏
    const [isSave, setSave] = useState(false)
    //是否点赞
    const [isThumb, setIsThumb] = useState(false)

    //返回事件
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    //收藏事件
    const toggleSave = useCallback(() => {
        setSave(isSave => !isSave)
    }, [isSave])
    //点赞
    const toggleLove = useCallback(() => {
        let flag=isThumb?0:1
        like({goods_id:route.params?.goods_id,flag}).then(res=>{
            setIsThumb(isThumb => !isThumb)
        })
    }, [route.params?.goods_id,isThumb])
    //发送留言
    const sendComment = useCallback(({ nativeEvent: { text, eventCount, target } }) => {
        let comment_id = replayInfo.id ? replayInfo.id : ""
        comment({ goods_id: route.params?.goods_id, comment_id, content: text })
            .then(({ data: { result } }) => {
                Alert.alert(
                    '提示',
                    result,
                    [
                        {
                            text: 'OK', onPress: () => {
                                _api(route.params.goods_id)
                            }
                        },
                    ],

                )
            })
    }, [route.params?.goods_id, replayInfo])
    //点击购买事件
    const payConfirm = useCallback(() => {
        navigation.navigate("messageDetail",{
            sellId:productDetailData.user.uid,
            goods_id:route.params.goods_id,
            chatTicket:productDetailData.chatTicket
        })
    }, [productDetailData])
    //保存图片到本地
    const _onSaveToCamera = useCallback((url) => {
        CameraRoll.saveToCameraRoll(url).then(path => {
            Alert.alert(
                '提示',
                "保存成功!",
                [
                    { text: 'OK', onPress: () => { } },
                ],

            )
        })
    }, [])
    //查看更多
    const checkMore = useCallback(() => {
        Alert.alert(
            '提示',
            "需开通vip才能查看更多",
            [
                { text: 'OK', onPress: () => { } },
                { text: 'Cancel', onPress: () => { } },
            ],

        )
    }, [])
    const toInfo = useCallback(() => {
    }, [])
    const _api = useCallback((goods_id) => {
        productDetail({ goods_id }).then(({ data: { result } }) => {
            setProductDetailData(result)
            setIsThumb(result.isLike)
        })
    }, [])
    //产品详情数据
    useEffect(() => {
        if (route.params?.goods_id) {
            _api(route.params.goods_id)
        }
    }, [route.params?.goods_id])
    const CustomMenus = memo((props) => {
        const { saveToLocal, cancel } = props
        return <View style={style.customMenus}>
            <TouchableHighlight style={[style.menuItem, style.bottomLine]} underlayColor="#fff" onPress={saveToLocal}>
                <Text style={style.menuText}>保存相册</Text>
            </TouchableHighlight>
            <TouchableHighlight style={style.menuItem} underlayColor="#fff" onPress={cancel}>
                <Text style={style.menuText}>取消</Text>
            </TouchableHighlight>
        </View>
    })
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <Header title="产品详情" leftEvent={leftEvent} right={<Image style={style.share} source={require("../../assets/imgs/share.png")}></Image>}>
                </Header>
                <ScrollView style={style.scrollView}>
                    <TouchableHighlight underlayColor="#fff" onPress={toInfo}>
                        <UserInfo productDetailData={productDetailData}></UserInfo>
                    </TouchableHighlight>
                    <Text style={style.productDisc}>{productDetailData.store_info}</Text>
                    <View style={style.priceWrap}>
                        <Text style={style.price}>￥ {productDetailData.price}</Text>
                        <Text style={style.deliveryFee}>包邮</Text>
                    </View>
                    <View style={style.imgList}>
                        {productDetailData.images && productDetailData.images.map((item, index) => {
                            if (index == productDetailData.images.length - 1) {
                                return <LoadMore key={index}>
                                    <TouchableHighlight underlayColor="#fff" onPress={() => setImgPreviewFlag(true)}>
                                        <FastImage style={[style.detailImg, { marginBottom: 0 }]} source={{ uri: item.att_dir }}></FastImage>
                                    </TouchableHighlight>
                                </LoadMore>
                            }
                            else {
                                return <TouchableHighlight key={index} underlayColor="#fff" onPress={() => setImgPreviewFlag(true)}>
                                    <FastImage style={style.detailImg} source={{ uri: item.att_dir }}></FastImage>
                                </TouchableHighlight>
                            }
                        })}
                    </View>
                    <Modal visible={imgPreviewFlag} transparent={true}>
                        <ImageViewer
                            onSave={_onSaveToCamera}
                            menus={({ cancel, saveToLocal }) => <CustomMenus cancel={cancel} saveToLocal={saveToLocal}></CustomMenus>}
                            onClick={() => setImgPreviewFlag(false)}
                            imageUrls={productImg}
                        />
                    </Modal>
                    <TouchableHighlight underlayColor="#fca413" onPress={checkMore} style={style.checkMoreWrap}>
                        <Text style={style.checkMore}>查看更多</Text>
                    </TouchableHighlight>
                    <LeaveMessageList setReplayInfo={setReplayInfo} productDetailData={productDetailData} setIsShowLeaveMessage={setIsShowLeaveMessage}></LeaveMessageList>
                </ScrollView>
                <BottomBar
                    replayInfo={replayInfo}
                    setReplayInfo={setReplayInfo}
                    isShowLeaveMessage={isShowLeaveMessage}
                    setIsShowLeaveMessage={setIsShowLeaveMessage}
                    sendComment={sendComment}
                    toggleLove={toggleLove}
                    isThumb={isThumb}
                    isSave={isSave}
                    toggleSave={toggleSave}
                    payConfirm={payConfirm}
                >
                </BottomBar>
            </View>
        </SafeAreaView>
    )
}
const UserInfo = memo((props) => {
    const { productDetailData } = props
    return (
        <View style={style.userWrap}>
            <FastImage style={style.userAvatar} source={{ uri: productDetailData.user && productDetailData.user.avatar }}></FastImage>
            <View style={style.userMsg}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={style.userName}>{productDetailData.user && productDetailData.user.nickname}</Text>
                <Text style={style.time}>连续3天来过</Text>
            </View>
        </View>
    )
})
//底部栏
const BottomBar = React.memo(function (props) {
    const {
        setReplayInfo,//设置回复人信息
        replayInfo,//回复人信息
        isShowLeaveMessage,//是否显示留言输入框
        setIsShowLeaveMessage,//设置是否显示留言输入框
        isSave,//是否收藏
        isThumb,//是否点赞
        toggleLove, //toggle 点赞
        toggleSave,//toggle 收藏
        payConfirm, //想要
        sendComment, //发送留言
    } = props

    //留言框失去焦点事件
    const leaveInputOnBlur = useCallback(() => {
        setIsShowLeaveMessage(false)
        setReplayInfo({})
    }, [])
    const relayPlaceHolder = replayInfo.nickname ? "回复@" + replayInfo.nickname + ":" : "看对眼就留言，问问更多细节~"
    return (
        <>
            {isShowLeaveMessage ? <KeyboardAvoidingView keyboardVerticalOffset={scaleHeight(32)} behavior={Platform.OS == "android" ? '' : 'position'} enabled contentContainerStyle={{ backgroundColor: "#fff" }}>
                <View style={style.leaveInputWrap}>
                    <Image style={style.avatar} source={require("../../assets/imgs/avatar.jpeg")}></Image>
                    <TextInput
                        autoFocus={true}
                        style={style.leaveInput}
                        returnKeyType="send"
                        returnKeyLabel="发送"
                        placeholderTextColor="#999"
                        placeholder={relayPlaceHolder}
                        onBlur={leaveInputOnBlur}
                        onSubmitEditing={sendComment}
                    ></TextInput>
                </View>
            </KeyboardAvoidingView> : <View style={style.buttomWrap}>
                    <TouchableHighlight style={{ flex: 2 }} underlayColor="#fff" onPress={toggleSave}>
                        <View style={style.saveWrap}>
                            <Image style={style.menuIcon} source={isSave ? require("../../assets/imgs/saved.png") : require("../../assets/imgs/unsave.png")}></Image>
                            <Text style={style.bottomMenuText}>收藏</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={{ flex: 2 }} underlayColor="#fff" onPress={() => setIsShowLeaveMessage(true)}>
                        <View style={style.leaveMessageWrap}>
                            <Image style={style.menuIcon} source={require("../../assets/imgs/message.png")}></Image>
                            <Text style={style.bottomMenuText}>留言</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={{ flex: 2 }} underlayColor="#fff" onPress={toggleLove}>
                        <View style={style.thumbWrap}>
                            <Image style={style.menuIcon} source={isThumb ? require("../../assets/imgs/loved.png") : require("../../assets/imgs/unlove.png")}></Image>
                            <Text style={style.bottomMenuText}>点赞</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={style.payWrap} underlayColor="#fca413" onPress={payConfirm}>
                        <Text style={style.pay}>我想要</Text>
                    </TouchableHighlight>
                </View>}
        </>
    )
})
//全部留言
const LeaveMessageList = React.memo(function (props) {
    const { productDetailData, setIsShowLeaveMessage, setReplayInfo } = props
    let { comments = [], comments_count = 0 } = productDetailData
    const LeaveMessageItem = memo((props) => {
        const { itemData, setIsShowLeaveMessage } = props
        const Item = memo((props) => {
            const { type, itemData, setIsShowLeaveMessage, setReplayInfo } = props
            const replay = useCallback(itemData => {
                setReplayInfo(itemData)
                setIsShowLeaveMessage(true)
            }, [])
            return (<View style={style.leaveMessageItemWrap}>
                <View style={style.leaveMessageHeadWrap}>
                    <Image style={style.leaveItemAvatar} source={{ uri: itemData.avatar }}></Image>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[style.name, itemData.is_master == 0 ? { marginRight: "auto" } : {}]}>{itemData.nickname}</Text>
                    {itemData.is_master == 1 ? <View style={style.sellerWrap}><Text style={style.seller}>主人</Text></View> : null}
                    <Image source={require("../../assets/imgs/thumbs-up.png")} style={style.thumbIcon}></Image>
                </View>
                <TouchableHighlight underlayColor="#fff" onPress={() => replay(itemData)}>
                    {type == 2 ? <Text style={style.replay}>回复@{itemData.p_nickname}:{itemData.content}</Text> : <Text style={style.leaveMessageContent}>{itemData.content}</Text>}
                </TouchableHighlight>
                <Text style={style.messageTime}>{toDate(itemData.add_time)}</Text>
            </View>)
        })
        return (
            <>
                <Item itemData={itemData} setIsShowLeaveMessage={setIsShowLeaveMessage} setReplayInfo={setReplayInfo} type={1}></Item>
                {itemData.child && itemData.child.map((item,index) =>
                    <View style={style.replayWrap} key={index}>
                        <Item itemData={item} setIsShowLeaveMessage={setIsShowLeaveMessage} setReplayInfo={setReplayInfo} type={2}></Item>
                    </View>
                )}
            </>
        )
    })
    return (
        <>
            <View style={style.leaveTitleWrap}>
                <Text style={style.leaveTitle}>全部留言 · {comments_count}</Text>
            </View>
            <View style={style.leaveMessageListWrap}>
                {comments.map((item, index) => <LeaveMessageItem setReplayInfo={setReplayInfo} setIsShowLeaveMessage={setIsShowLeaveMessage} itemData={item} key={index}></LeaveMessageItem>)}
            </View>
        </>
    )
})
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    userWrap: {
        flexDirection: "row",
        paddingHorizontal: scaleSize(10),
        paddingVertical: scaleHeight(4)
    },
    userAvatar: {
        marginRight: scaleSize(10),
        height: scaleSize(40),
        width: scaleSize(40),
        borderRadius: scaleSize(4)
    },
    userMsg: {
        flex: 1
    },
    userName: {
        fontSize: setSpText2(14),
        fontWeight: "500"
    },
    time: {
        marginTop: scaleHeight(4),
        fontSize: setSpText2(12),
        color: "#999"
    },
    imgList: {
        marginTop: scaleHeight(20),
        paddingHorizontal: scaleSize(15)
    },
    checkMoreWrap: {
        marginVertical: scaleHeight(10),
        alignSelf: "center",
        borderRadius: scaleSize(15),
        width: scaleSize(80),
        height: scaleHeight(25),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fca413"
    },
    checkMore: {
        color: "#fff",
        fontSize: setSpText2(14)
    },
    detailImg: {
        width: "100%",
        height: scaleSize(280),
        borderRadius: scaleSize(5),
        marginBottom: scaleHeight(20)
    },
    scrollView: {
        flex: 1
    },
    share: {
        height: scaleHeight(20),
        width: scaleSize(20)
    },

    productName: {
        marginHorizontal: scaleSize(20),
        marginTop: scaleSize(10),
        fontSize: setSpText2(16),
        fontWeight: "500"
    },
    priceWrap: {
        marginTop: scaleSize(10),
        flexDirection: "row",
        alignItems: "center"
    },
    price: {
        marginLeft: scaleSize(20),
        fontWeight: "500",
        fontSize: setSpText2(16),
        color: "#f40"
    },
    deliveryFee: {
        marginLeft: scaleSize(10),
        backgroundColor: "#fca413",
        paddingVertical: scaleHeight(2),
        paddingHorizontal: scaleSize(5),
        color: "#000",
        fontSize: setSpText2(10),
    },
    discTitle: {
        marginTop: scaleHeight(20),
        fontSize: setSpText2(16),
        fontWeight: "500",
        paddingHorizontal: scaleSize(20)
    },
    productDisc: {
        marginTop: scaleHeight(10),
        fontSize: setSpText2(14),
        lineHeight: setSpText2(24),
        paddingHorizontal: scaleSize(20)
    },
    buttomWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: scaleSize(15),
        height: scaleHeight(40),
        alignItems: "center",
        width: "100%"
    },
    saveWrap: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    leaveMessageWrap: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    thumbWrap: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    leaveMessage: {
        fontSize: setSpText2(16)
    },
    payWrap: {
        marginLeft: scaleSize(40),
        flex: 3,
        height: scaleHeight(30),
        backgroundColor: "#fca413",
        borderRadius: scaleSize(5),
        justifyContent: "center",
        alignItems: "center"
    },
    pay: {
        fontSize: setSpText2(14),
        color: "#fff"
    },
    menuIcon: {
        marginRight: scaleSize(5),
        height: scaleSize(20),
        width: scaleSize(20)
    },
    bottomMenuText: {
        fontSize: setSpText2(12),
        color: "#333"
    },
    leaveInputWrap: {
        paddingVertical: scaleHeight(5),
        paddingHorizontal: scaleSize(10),
        flexDirection: "row",
        alignItems: "center"
    },
    avatar: {
        marginRight: scaleSize(10),
        borderRadius: scaleSize(4),
        height: scaleSize(30),
        width: scaleSize(30)
    },
    leaveInput: {
        paddingVertical: scaleHeight(8),
        flex: 1,
        paddingHorizontal: scaleSize(10),
        backgroundColor: "#eee",
        fontSize: setSpText2(14),
        color: "#333",
        borderRadius: scaleSize(4)
    },
    leaveTitleWrap: {
        marginTop: scaleHeight(10),
        paddingLeft: scaleSize(20),
        height: scaleHeight(30),
        justifyContent: "center"
    },
    leaveTitle: {
        fontSize: setSpText2(16),
    },
    leaveMessageListWrap: {
        marginTop: scaleHeight(5),
        paddingHorizontal: scaleSize(20)
    },
    leaveMessageItemWrap: {
        marginBottom: scaleHeight(10)
    },
    leaveMessageHeadWrap: {
        flexDirection: "row",
        alignItems: "center",
        height: scaleHeight(30),
        justifyContent: "space-between"
    },
    leaveItemAvatar: {
        marginRight: scaleSize(10),
        height: scaleSize(30),
        width: scaleSize(30),
        borderRadius: scaleSize(4),
    },
    name: {
        maxWidth: scaleSize(200),
        fontSize: setSpText2(14),
        fontWeight: "500"
    },
    thumbIcon: {
        width: scaleSize(15),
        height: scaleSize(15)
    },
    sellerWrap: {
        marginLeft: scaleSize(5),
        marginRight: "auto",
        borderWidth: scaleSize(0.5),
        height: scaleHeight(20),
        width: scaleSize(30),
        borderRadius: scaleSize(2),
        borderColor: "#fca413",
        alignItems: "center",
        justifyContent: "center"
    },
    seller: {
        fontSize: setSpText2(12),
        color: "#fca413"
    },
    leaveMessageContent: {
        marginTop: scaleHeight(5),
        paddingLeft: scaleSize(40),
        fontSize: setSpText2(14)
    },
    replayWrap: {
        paddingLeft: scaleSize(40)
    },
    replay: {
        marginTop: scaleHeight(5),
        paddingLeft: scaleSize(40),
        fontSize: setSpText2(14)
    },
    messageTime: {
        marginTop: scaleHeight(10),
        paddingLeft: scaleSize(40),
        fontSize: setSpText2(12),
        color: "#999"
    },
    customMenus: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: scaleHeight(100),
        backgroundColor: "#fff",
        borderTopLeftRadius: scaleSize(15),
        borderTopRightRadius: scaleSize(15)
    },
    menuItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    menuText: {
        fontSize: setSpText2(14),
    },
    bottomLine: {
        borderBottomWidth: scaleSize(0.5),
        borderBottomColor: "#999"
    }

})
export default connect(state => state, dispatch => ({ dispatch }))(ProductDetail) 
