import React, { useCallback, useState } from "react"
import { View, Image, StyleSheet, ScrollView, TouchableHighlight } from "react-native"
import { setSpText2, scaleSize, scaleHeight } from "../utils/ScreenUtil"
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-spinkit';
import RNFS from 'react-native-fs';
import { connect } from "react-redux"
import {imgUpload} from "../store/action"

function ImageUpload(props) {
    const [tack,setTack]=useState()
    const [isLoading, setIsloading] = useState(false)
    const { imageCount = 20, imageList = [], setImageList,dispatch,userInfo } = props
    //选择图片
    const selectImg = useCallback(() => {
        setIsloading(true)
        ImagePicker.openPicker({
            multiple: true
        }).then(images => {
            console.log("images", images,"userInfo",userInfo)
            let tack=userInfo.userId+new Date().getTime()
            setTack(tack)
            images.map(item => {
                let file = { uri: item.path, type: "multipart/form-data", name:item.mime };
                dispatch(imgUpload({file,tack}))
                RNFS.readFile(item.path, 'base64')
                    .then((content) => {
                        console.log("trigger",content)
                        setImageList(imageList=>[...imageList,{ uri: "data:image/png;base64,"+content}]);
                    })
                    .catch((err) => {
                        console.log("图片读取失败")
                    });
            })
        })
            .catch(res => {
                console.log("fail", res)
            })
            .finally(res => {
                setIsloading(false)
            });
    },[])
    //删除图片
    const removeImg = useCallback((index) => {
        setImageList(imageList.filter((item, _index) => index != _index))
    }, [imageList])
    return (
        <>
            <ScrollView horizontal style={style.imageUploadWrap} showsHorizontalScrollIndicator={false}>
                {imageList.map((item, index) => <View style={style.imgWrap} key={index} >
                    <TouchableHighlight style={style.remove} underlayColor="#fff" onPress={() => removeImg(index)}>
                        <Image style={style.removeIcon} source={require("../assets/imgs/remove.png")}></Image>
                    </TouchableHighlight>
                    <Image source={item} style={style.img}></Image>
                </View>)}
                {imageList.length >= imageCount ?
                    null
                    :
                    <TouchableHighlight underlayColor="#fff" onPress={selectImg}>
                        <View style={style.uploadWrap}>
                            <Image style={style.add} source={require("../assets/imgs/camera.png")}>
                            </Image>
                        </View>
                    </TouchableHighlight>}
            </ScrollView>
            <Spinner style={style.spinner} isVisible={isLoading} size={100} type={"FadingCircleAlt"} color={"#fca413"} />
        </>
    )
}
export default  connect(state => state, dispatch => ({ dispatch }))(ImageUpload)
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
    uploadWrap: {
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