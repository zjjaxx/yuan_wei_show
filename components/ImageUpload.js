import React, { useCallback, useState } from "react"
import { View, Image, StyleSheet, ScrollView, TouchableHighlight, Platform, Text, Alert } from "react-native"
import { setSpText2, scaleSize, scaleHeight } from "../utils/ScreenUtil"
import SyanImagePicker from 'react-native-syan-image-picker';
import Spinner from 'react-native-spinkit';
import { connect } from "react-redux"
import axios from "axios"
import { baseURL } from "../utils/config"
function ImageUpload(props) {
    const [isLoading, setIsloading] = useState(false)
    const { imageCount = 20, imageList = [], setImageList, userInfo, token } = props
    //选择图片
    const selectImg = useCallback(() => {
        // promise-then
        SyanImagePicker.asyncShowImagePicker({ imageCount: 20 })
            .then(photos => {
                let _images = photos.map((item, index) => {
                    console.log("item", item)
                    let file = { uri: Platform.OS === "ios" ? "file:///" + item.uri : item.path, type: "multipart/form-data", name: "image.png" };

                    imgUpload({ file }, imageList.length + index)
                    return { status: "loading", message: "上传中" }
                })
                setImageList(imageList => [...imageList, ..._images])
                // 选择成功
            })
            .catch(err => {
                // 取消选择，err.message为"取消"
            })

        // ImagePicker.openPicker({
        //     multiple: true
        // }).then(images => {
        //     let _images = images.map((item, index) => {
        //         console.log("item",item)
        //         let file = { uri: Platform.OS === "ios" ? "file:///" + item.path : item.path, type: "multipart/form-data", name: item.filename||"image" };

        //         imgUpload({ file }, imageList.length + index)
        //         return { status: "loading", message: "上传中" }
        //     })
        //     setImageList(imageList => [...imageList, ..._images])
        // })
        //     .catch(res => {
        //     })
        //     .finally(res => {
        //     });
    }, [imageList])
    const imgUpload = useCallback((imgData, index) => {
        let formData = new FormData();
        formData.append("img", imgData.file);
        axios.post(baseURL + "/api/v1/image/upload", formData, {
            headers: {
                authorization: "bearer " + token,
                'Content-Type': 'multipart/form-data'
            }
        }).then(({ data: { result } }) => {
            setImageList(imageList => imageList.map((item, _index) => {
                if (_index == index) {
                    return {
                        uri: result.uri,
                        status: "complate",
                        message: ""
                    }
                }
                else {
                    return item
                }
            }))
        })
            .catch(res => {
                setImageList(imageList => imageList.map((item, _index) => {
                    if (_index == index) {
                        return {
                            status: "error", message: "上传失败"
                        }
                    }
                    else {
                        return item
                    }
                }))
            });
    }, [])
    //删除图片
    const removeImg = useCallback((index) => {
        if (imageList[index].status == "loading") {
            Alert.alert(
                '提示',
                "图片上传中...",
                [
                    { text: 'OK', onPress: () => { } },
                ],

            )
            return
        }
        setImageList(imageList.filter((item, _index) => index != _index))
    }, [imageList])
    return (
        <>
            <ScrollView horizontal style={style.imageUploadWrap} showsHorizontalScrollIndicator={false}>
                {imageList.length >= imageCount ?
                    null
                    :
                    <TouchableHighlight underlayColor="#fff" onPress={selectImg}>
                        <View style={style.uploadWrap}>
                            <Image style={style.add} source={require("../assets/imgs/camera.png")}>
                            </Image>
                        </View>
                    </TouchableHighlight>}
                {imageList.map((item, index) => <View style={style.imgWrap} key={index} >
                    <TouchableHighlight style={style.remove} underlayColor="#fff" onPress={() => removeImg(index)}>
                        <Image style={style.removeIcon} source={require("../assets/imgs/remove.png")}></Image>
                    </TouchableHighlight>
                    {
                        item.status == "loading" ?
                            <View style={style.statusWrap}><Text style={style.statusText}>加载中</Text></View>
                            : item.status == "error" ?
                                <View style={style.statusWrap}>
                                    <Image style={style.errorIcon} source={require("../assets/imgs/error-white.png")}></Image>
                                    <Text style={style.statusText}>加载失败</Text>
                                </View>
                                : <Image source={{ uri: item.uri }} style={style.img}></Image>
                    }
                </View>)}
            </ScrollView>
            <Spinner style={style.spinner} isVisible={isLoading} size={100} type={"FadingCircleAlt"} color={"#fca413"} />
        </>
    )
}
export default connect(state => state, dispatch => ({ dispatch }))(ImageUpload)
const style = StyleSheet.create({
    imageUploadWrap: {
        height: scaleSize(100),
    },
    img: {
        borderRadius: scaleSize(5),
        height: scaleSize(90),
        width: scaleSize(90),
    },
    imgWrap: {
        marginTop: scaleHeight(10),
        marginRight: scaleSize(20),
        position: "relative",
        overflow: "visible"
    },
    remove: {
        backgroundColor: "#fff",
        borderRadius: scaleSize(10),
        position: "absolute",
        right: -scaleSize(10),
        top: -scaleSize(10),
        width: scaleSize(20),
        height: scaleSize(20),
        zIndex: 1000
    },
    removeIcon: {
        height: "100%",
        width: "100%"
    },
    statusWrap: {
        borderRadius: scaleSize(5),
        height: scaleSize(90),
        width: scaleSize(90),
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center"
    },
    errorIcon: {
        marginBottom: scaleHeight(10),
        width: scaleSize(25),
        height: scaleSize(25)
    },
    statusText: {
        fontSize: setSpText2(12),
        color: "#fff"
    },
    uploadWrap: {
        marginRight: scaleSize(20),
        marginTop: scaleHeight(10),
        borderRadius: scaleSize(5),
        height: scaleSize(90),
        width: scaleSize(90),
        backgroundColor: "#eee",
        alignItems: "center",
        justifyContent: "center"
    },
    spinner: {
        left: "50%",
        transform: [{ translateX: -50 }]
    },
    add: {
        width: scaleSize(25),
        height: scaleSize(25)
    }
})