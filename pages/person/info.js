import React, { memo, useState, useCallback, useRef, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, FlatList } from "react-native"
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import Header from "../../components/Header"
import ProductItemLarge from "../../components/ProductItemLarge"
import CustomTab from "../../components/CustomTabBar"
import { getNodeInfo } from "../../utils/common"
import {profile} from "../../api/api"

function Info({ navigation,route }) {
    //个人信息
    const [personInfo,setPersonInfo]=useState({})
    const refs = new Array(2).fill(null).map(item => useRef())
    const [listHeight, setListHeight] = useState(0)
    //发布产品数据列表
    const [publishListData, setPublishListData] = useState([])
    //品论数据列表
    const [commentListData, setCommentListData] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    //tab句柄
    const customTabRef = useRef()
    // scroll tab 句柄
    const scrollTabRef = useRef()
    // tablist 数据
    const [tabList, setTabList] = useState([{cate_name:"发布"}, {cate_name:"留言"}])
    // tabindex 索引
    const [tabIndex, setTabIndex] = useState(0)
    const toProductDetail = useCallback((item) => {
        navigation.navigate("productDetail",{goods_id:item.id})
    }, [])
    useEffect(()=>{
        if(route.params?.uid){
            profile({uid:route.params?.uid}).then(({data:{result}})=>{
                setPersonInfo(result)
                setPublishListData(result.goods)
            })
        }
    },[route.params?.uid])
    //tab切换
    const tabChange = useCallback(({ i, from }) => {
        if (i != from) {
            if (refs[i].current) {
                setTimeout(() => {
                    getNodeInfo(refs[i].current).then(({ height }) => {
                        setListHeight(height)
                    })
                    setTabIndex(i)
                }, 0)
            }
        }
    }, [refs])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header leftEvent={() => { navigation.goBack() }}></Header>
                <ScrollView style={style.scrollView} stickyHeaderIndices={[3]}>
                    <View style={style.infoWrap}>
                        <Image source={{uri:personInfo.avatar}} style={style.avatar}></Image>
                        <View style={style.infoContentWrap}>
                            <View style={style.infoContent}>
                                <View style={style.thumbUpWrap}>
                                    <Text style={style.count}>{personInfo.like}</Text>
                                    <Text style={style.label}>超赞</Text>
                                </View>
                                <View style={style.careWrap}>
                                    <Text style={style.count}>{personInfo.attention}</Text>
                                    <Text style={style.label}>关注</Text>
                                </View>
                                <View style={style.fansWrap}>
                                    <Text style={style.count}>{personInfo.fans}</Text>
                                    <Text style={style.label}>粉丝</Text>
                                </View>
                            </View>
                            <View style={style.careBtn}>
                                <Text style={style.careText}>+ 关注</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={style.name}>
                        {personInfo.nickname}
                    </Text>
                    <Text style={style.disc}>
                        喜欢的话就来关注我吧
                    </Text>
                    <CustomTab ref={customTabRef} tabIndex={tabIndex} scrollTabRef={scrollTabRef} tabList={tabList} tabChange={tabChange}></CustomTab>
                    <ScrollableTabView onChangeTab={tabChange} style={[listHeight ? { height: listHeight } : {}]} ref={scrollTabRef} renderTabBar={() => <View></View>}>
                        <PublishList refs={refs} setListHeight={setListHeight} tabIndex={tabIndex} publishListData={publishListData} toProductDetail={toProductDetail}></PublishList>
                        <CommentList refs={refs} setListHeight={setListHeight} tabIndex={tabIndex} commentListData={commentListData}></CommentList>
                    </ScrollableTabView>
                </ScrollView>
            </View>

        </SafeAreaView>
    )
}
const PublishList = memo((props) => {
    const { publishListData, toProductDetail, refs } = props
    return (
        <View ref={refs[0]} style={style.publishListWrapperStyle}>
            {publishListData.map(item => <ProductItemLarge key={item.id} productData={item} toProductDetail={toProductDetail} item={item}></ProductItemLarge>)}
        </View>
    )
})
const CommentList = memo((props) => {
    const { commentListData, refs } = props
    return (
        <View ref={refs[1]} style={style.flatList}>
            {commentListData.map(item => <CommentListItem item={item}></CommentListItem>)}
        </View>
    )
})
const CommentListItem = memo((props) => {
    const { item } = props
    return (
        <View style={style.commentItemWrap}>
            <View style={style.headerWrap}>
                <Image source={require("../../assets/imgs/pic2.jpg")} style={style.commentAvatar}></Image>
                <Text style={style.nickname}>nickname</Text>
                <Image source={require("../../assets/imgs/goodProduct.png")} style={style.goodProductIcon}></Image>
            </View>
            <View style={style.commentContentWrap}>
                <Text style={style.commentText}>良心！！！</Text>
                <View style={style.imgList}>
                    {
                        [1, 2, 3].map(item => {
                            return (
                                <Image style={style.img} source={require("../../assets/imgs/pic2.jpg")}></Image>
                            )
                        })
                    }
                </View>
                <Text style={style.time}>2019-11-12 22:29:16</Text>
            </View>
        </View>
    )
})
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        flex: 1
    },
    scrollView: {
        flex: 1
    },
    infoWrap: {
        paddingHorizontal: scaleSize(15),
        flexDirection: "row"
    },
    avatar: {
        marginRight: scaleSize(15),
        height: scaleSize(80),
        width: scaleSize(80)
    },
    infoContentWrap: {
        flex: 1,
    },
    infoContent: {
        flex: 1,
        paddingRight: scaleSize(20),
        flexDirection: "row",
        justifyContent: "space-between",
    },
    count: {
        fontSize: setSpText2(16),
        fontWeight: "500"
    },
    label: {
        marginTop: scaleHeight(5),
        fontSize: setSpText2(12),
        color: "#999",
    },
    careBtn: {
        flex: 1,
        paddingRight: scaleSize(20),
        borderRadius: scaleSize(15),
        height: scaleHeight(15),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fca413"
    },
    careText: {
        fontSize: setSpText2(14),
        fontWeight: "500",
        color:"#fff"
    },
    name: {
        marginTop: scaleHeight(10),
        marginLeft: scaleSize(15),
        fontSize: setSpText2(16),
        fontWeight: "500"
    },
    disc: {
        marginTop: scaleHeight(5),
        marginLeft: scaleSize(15),
        fontSize: setSpText2(14),
        lineHeight: setSpText2(18)
    },
    flatList: {
        flex: 1
    },
    publishListWrapperStyle: {
        paddingHorizontal: scaleSize(10),
        justifyContent: "space-between",
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor:"#f6f6f6"
    },
    // commentListWrapperStyle:{
    //     paddingHorizontal: scaleSize(10),
    //     paddingVertical:scaleHeight(10)
    // },
    commentItemWrap: {
        paddingHorizontal: scaleSize(10),
        paddingVertical: scaleHeight(5)
    },
    headerWrap: {
        flexDirection: "row",
        alignItems: "center"
    },
    commentAvatar: {
        marginRight: scaleSize(5),
        height: scaleSize(40),
        width: scaleSize(40),
        borderRadius: scaleSize(5)
    },
    nickname: {
        marginRight: scaleSize(10),
        flex: 1,
        color: "#999",
        fontSize: setSpText2(16)
    },
    goodProductIcon: {
        height: scaleSize(30),
        width: scaleSize(30)
    },
    commentContentWrap: {
        paddingVertical: scaleHeight(5),
        marginLeft: scaleSize(45),
        borderBottomColor: "#eee",
        borderBottomWidth: scaleSize(0.5)
    },
    commentText: {
        fontSize: setSpText2(16),
        lineHeight: setSpText2(20)
    },
    imgList: {
        flexDirection: "row"
    },
    img: {
        marginRight: scaleSize(20),
        width: scaleSize(80),
        height: scaleSize(80),
        borderRadius: scaleSize(5)
    },
    time: {
        marginTop: scaleHeight(10),
        fontSize: setSpText2(14),
        color: "#999"
    }
})

export default Info