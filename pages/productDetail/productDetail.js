import React, { useCallback, useState, memo } from "react"
import { Text, View, StyleSheet, Image, ScrollView, TouchableHighlight, SafeAreaView, TextInput, KeyboardAvoidingView, Modal,Alert } from "react-native"
import Header from "../../components/Header"
import CameraRoll from "@react-native-community/cameraroll";
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"
import Carousel from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../../swiperLib/SliderEntry.style';
import LoadMore from "../../components/LoadMore"
import ImageViewer from 'react-native-image-zoom-viewer'
const mockData = [0, 1, 2]
function ProductDetail({ navigation }) {
    //是否预览
    const [imgPreviewFlag, setImgPreviewFlag] = useState(false)
    //产品图片
    const [imgList, setImgList] = useState([
        {
            url: "https://cdn.weile999.com/upload/common/1587452044.jpg",
            props: {
                // Or you can set source directory.
                source: require('../../assets/imgs/avatar.jpeg')
            }
        },
        {
            url: "https://cdn.weile999.com/upload/common/1588835954.png",
            props: {
                // Or you can set source directory.
                source: require('../../assets/imgs/avatar.jpeg')
            }
        },
    ])
    //是否收藏
    const [isSave, setSave] = useState(false)
    //是否显示留言框
    const [isShowLeaveMessage, setIsShowLeaveMessage] = useState(false)
    //返回事件
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    //收藏事件
    const toggleSave = useCallback(() => {
        setSave(!isSave)
    }, [isSave])
    //留言事件
    const leaveMessage = useCallback(() => {
        setIsShowLeaveMessage(true)
    }, [])
    //点击购买事件
    const payConfirm = useCallback(() => {
        navigation.navigate("messageDetail")
    }, [])
    //保存图片到本地
    const _onSaveToCamera = useCallback((url) => {
        console.log("url", url)
        CameraRoll.saveToCameraRoll(url).then(path => {
            console.log("path", path)
        })
    }, [imgList])
    //查看更多
    const checkMore=useCallback(()=>{
        Alert.alert(
            '提示',
            "需开通vip才能查看更多",
            [
                { text: 'OK', onPress: () => {} },
                { text: 'Cancel', onPress: () => {} },
            ],

        )
    },[])
    const toInfo=useCallback(()=>{
        navigation.navigate("info")
    },[])
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
                    {/* <Swiper></Swiper> */}
                    <TouchableHighlight underlayColor="#fff" onPress={toInfo}>
                        <UserInfo></UserInfo>
                    </TouchableHighlight>
                    <Text style={style.productName}>AIR JODOY DANCE</Text>
                    <Text style={style.price}>￥ 278.00</Text>
                    {/* <Text style={style.discTitle}>介绍</Text> */}
                    <Text style={style.productDisc}>SALEWA(沙乐华)1935年起源于德国 ，是欧洲著名的e68a84e8a2ad7a6431333433626539户外运动品牌。SA意为Saddler(制造马鞍的)、LE意为Leather(皮革)、WA意为Wares(制品)。SALEWA滑雪板及滑雪杆也在市场上取得成功，逐渐成为公司最主要的收入来源。适合各个年龄段的人群。</Text>
                    <View style={style.imgList}>
                        {[1, 2, 3].map((item, index) => {
                            if (index == 2) {
                                return <LoadMore key={index}>
                                    <TouchableHighlight underlayColor="#fff" onPress={() => setImgPreviewFlag(true)}>
                                        <Image resizeMode="stretch" style={[style.detailImg, { marginBottom: 0 }]} source={require("../../assets/imgs/avatar.jpeg")}></Image>
                                    </TouchableHighlight>
                                </LoadMore>
                            }
                            else {
                                return <TouchableHighlight key={index} underlayColor="#fff" onPress={() => setImgPreviewFlag(true)}>
                                    <Image resizeMode="stretch" style={style.detailImg} source={require("../../assets/imgs/avatar.jpeg")}></Image>
                                </TouchableHighlight>
                            }
                        })}
                    </View>
                    <Modal visible={imgPreviewFlag} transparent={true}>
                        <ImageViewer onSave={_onSaveToCamera} menus={({ cancel, saveToLocal }) => <CustomMenus cancel={cancel} saveToLocal={saveToLocal}></CustomMenus>} onClick={() => setImgPreviewFlag(false)} imageUrls={imgList} />
                    </Modal>
                    <TouchableHighlight underlayColor="#fca413" onPress={checkMore} style={style.checkMoreWrap}>
                        <Text style={style.checkMore}>查看更多</Text>
                    </TouchableHighlight>
                    <LeaveMessageList leaveMessageList={[[2, 4, 3], [3, 45, 5]]}></LeaveMessageList>
                </ScrollView>
                <BottomBar
                    isSave={isSave}
                    isShowLeaveMessage={isShowLeaveMessage}
                    setIsShowLeaveMessage={setIsShowLeaveMessage}
                    toggleSave={toggleSave}
                    leaveMessage={leaveMessage}
                    payConfirm={payConfirm}>
                </BottomBar>
            </View>
        </SafeAreaView>
    )
}
const UserInfo = memo((props) => {
    return (
        <View style={style.userWrap}>
            <Image style={style.userAvatar} source={require("../../assets/imgs/avatar.jpeg")}></Image>
            <View style={style.userMsg}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={style.userName}>小可爱</Text>
                <Text style={style.time}>连续3天来过</Text>
            </View>
        </View>
    )
})
//底部栏
const BottomBar = React.memo(function (props) {
    const { isSave, isShowLeaveMessage, toggleSave, setIsShowLeaveMessage, leaveMessage, payConfirm } = props
    //留言输入框
    const [leaveInputValue, setLeaveInputValue] = useState("")
    //留言框change事件
    const leaveInputValueChange = useCallback((value) => {
        setLeaveInputValue(value)
    }, [])
    //留言框失去焦点事件
    const leaveInputOnBlur = useCallback(() => {
        setIsShowLeaveMessage(false)
    }, [])
    return (
        <>
            {isShowLeaveMessage ? <KeyboardAvoidingView keyboardVerticalOffset={scaleHeight(32)} behavior={Platform.OS == "android" ? '' : 'position'} enabled contentContainerStyle={{ backgroundColor: "#fff" }}>
                <View style={style.leaveInputWrap}>
                    <Image style={style.avatar} source={require("../../assets/imgs/avatar.jpeg")}></Image>
                    <TextInput
                        style={style.leaveInput}
                        returnKeyType="send"
                        returnKeyLabel="发送"
                        placeholderTextColor="#999"
                        placeholder="看对眼就留言，问问更多细节~"
                        onChangeText={leaveInputValueChange}
                        onBlur={leaveInputOnBlur}
                        value={leaveInputValue}
                    ></TextInput>
                </View>
            </KeyboardAvoidingView> : <View style={style.buttomWrap}>
                    <TouchableHighlight underlayColor="#fff" onPress={toggleSave}>
                        <View style={style.saveWrap}>
                            <Image style={style.saveIcon} source={isSave ? require("../../assets/imgs/saved.png") : require("../../assets/imgs/unsave.png")}></Image>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#fff" onPress={leaveMessage}>
                        <View style={style.leaveMessageWrap}>
                            <Text style={style.leaveMessage}>留言</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#fff" onPress={payConfirm}>
                        <View style={style.payWrap}>
                            <Text style={style.pay}>我想要</Text>
                        </View>
                    </TouchableHighlight>
                </View>}
        </>
    )
})
//全部留言
const LeaveMessageList = React.memo(function (props) {
    const { leaveMessageList } = props
    const LeaveMessageItem = memo((props) => {
        const Item = memo((props) => {
            const { type } = props
            return (<View style={style.leaveMessageItemWrap}>
                <View style={style.leaveMessageHeadWrap}>
                    <Image style={style.leaveItemAvatar} source={require("../../assets/imgs/avatar.jpeg")}></Image>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[style.name, type == 1 ? { marginRight: "auto" } : {}]}>花花有期~纷纷尽我if</Text>
                    {type == 2 ? <View style={style.sellerWrap}><Text style={style.seller}>主人</Text></View> : null}
                    <Image source={require("../../assets/imgs/thumbs-up.png")} style={style.thumbIcon}></Image>
                </View>
                {type == 2 ? <Text style={style.replay}>回复@花花有期~纷纷尽我if:在的</Text> : <Text style={style.leaveMessageContent}>东西还在吗？</Text>}
                <Text style={style.messageTime}>22天前</Text>
            </View>)
        })
        return (
            <>
                <Item type={1}></Item>
                <View style={style.replayWrap}>
                    <Item type={2}></Item>
                </View>
            </>
        )
    })
    return (
        <>
            <View style={style.leaveTitleWrap}>
                <Text style={style.leaveTitle}>全部留言 · 18</Text>
            </View>
            <View style={style.leaveMessageListWrap}>
                {leaveMessageList.map((item, index) => <LeaveMessageItem key={index}></LeaveMessageItem>)}
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
        width: scaleSize(100),
        height: scaleHeight(30),
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
        height: scaleSize(350),
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
    price: {
        marginLeft: scaleSize(20),
        marginTop: scaleSize(10),
        fontWeight: "500",
        fontSize: setSpText2(16),
        color: "#fca413"
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
        paddingHorizontal: scaleSize(20),
        height: scaleHeight(50),
        alignItems: "center",
        width: "100%"
    },
    saveWrap: {
        width: scaleSize(70),
        height: scaleHeight(40),
        backgroundColor: "#f6f6f6",
        borderRadius: scaleSize(5),
        justifyContent: "center",
        alignItems: "center"
    },
    leaveMessageWrap: {
        marginRight: scaleSize(20),
        marginLeft: scaleSize(10),
        width: scaleSize(70),
        height: scaleHeight(40),
        backgroundColor: "#f6f6f6",
        borderRadius: scaleSize(5),
        justifyContent: "center",
        alignItems: "center"
    },
    leaveMessage: {
        fontSize: setSpText2(16)
    },
    payWrap: {
        width: scaleSize(140),
        height: scaleHeight(40),
        backgroundColor: "#fca413",
        borderRadius: scaleSize(5),
        justifyContent: "center",
        alignItems: "center"
    },
    pay: {
        fontSize: setSpText2(16),
        color: "#fff"
    },
    saveIcon: {
        height: scaleSize(20),
        width: scaleSize(20)
    },
    leaveInputWrap: {
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
        paddingVertical: scaleHeight(10),
        flex: 1,
        paddingHorizontal: scaleSize(10),
        backgroundColor: "#eee",
        fontSize: setSpText2(14),
        borderRadius: scaleSize(4)
    },
    leaveTitleWrap: {
        marginTop: scaleHeight(10),
        paddingLeft: scaleSize(20),
        height: scaleHeight(40),
        justifyContent: "center"
    },
    leaveTitle: {
        fontSize: setSpText2(16),
    },
    leaveMessageListWrap: {
        marginTop: scaleHeight(10),
        paddingHorizontal: scaleSize(20)
    },
    leaveMessageItemWrap: {
        marginBottom: scaleHeight(20)
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
        marginTop: scaleHeight(10),
        paddingLeft: scaleSize(40),
        fontSize: setSpText2(14)
    },
    replayWrap: {
        paddingLeft: scaleSize(40)
    },
    replay: {
        marginTop: scaleHeight(10),
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
export default ProductDetail
