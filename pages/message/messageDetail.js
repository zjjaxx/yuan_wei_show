import React, { useCallback, useState, useRef, memo, useEffect, useReducer } from "react"
import { View, Text, StyleSheet, SafeAreaView, Button, Image, TouchableOpacity, PermissionsAndroid, Dimensions, TouchableHighlight } from "react-native"
import Header from "../../components/Header"
import FastImage from 'react-native-fast-image'
import { ChatScreen } from 'react-native-easy-chat-ui'
import { AudioRecorder, AudioUtils } from 'react-native-audio'
import RNFS from 'react-native-fs'
import Sound from 'react-native-sound'
import { scaleSize, scaleHeight, setSpText2 } from "../../utils/ScreenUtil"
import { connect } from "react-redux"
import chatBg from '../../assets/imgs/pic1.jpg'
import { send, parseReceiveMessage } from "../../utils/toBuffer"
import { createId } from "../../utils/common"
import {
  RECEIVE_ERROR,
  RECEIVE_MAIN,
  RECEIVE_CHAT_RESULT,
  RECEIVE_CHAT_MSG,
  RECEIVE,
  SEND,
  RECEIVE_SYSTEM_MSG
} from "../../utils/config.js"

const { width, height } = Dimensions.get('window')

function MessageDetail({ navigation, webSocket, route, userInfo }) {
  const [productInfo, setProductInfo] = useState({})
  const reducers = (messageList, action) => {
    const { type, payload } = action
    //发送消息
    if (type == SEND) {
      return [payload, ...messageList]
    }
    //接收消息
    else if (type == RECEIVE) {
      switch (payload.y) {
        //初始化
        case RECEIVE_MAIN:
          let d = JSON.parse(payload.d)
          setProductInfo(d.goods)
          return d.msg
        //接收发送消息反馈
        case RECEIVE_CHAT_RESULT:
          let msg = JSON.parse(payload.d)
          return messageList.map(item => {
            if (item.id == msg.msgId) {
              return { ...item, sendStatus: msg.sendStatus }
            }
            else {
              return item
            }
          })
        //接收消息添加到消息列表
        case RECEIVE_CHAT_MSG:
        //接收系统消息
        case RECEIVE_SYSTEM_MSG:
          let _msg = JSON.parse(payload.d)
          let chatTicket = _msg.msg.chatTicket
          //根据chatTicket 来判断是否是这个人发送给你的消息
          if (chatTicket == route.params.chatTicket) {
            let _d = JSON.stringify({
              sellId: route.params.sellId,
              chatTicket: route.params.chatTicket,
              goodsId: route.params.goodsId,
              toUid: route.params.toUid
            })
            let readParams = { y: 'read', d: _d }
            send(readParams, webSocket)
            return [_msg.msg, ...messageList]
          }
          else {
            return messageList
          }
        //接收消息 error
        case RECEIVE_ERROR:
        default:
          return messageList
      }
    }
  }
  const userProfile = {
    id: userInfo.userId + "",
    avatar: userInfo.user_headimg,
    nickName: userInfo.nick_name
  }
  //聊天句柄
  const chatRef = useRef()
  //发语音计时器
  const timer = useRef()
  //聊天数据
  const [messageList, dispatch] = useReducer(reducers, [])
  //聊天数据
  const [messages, setMessages] = useState([
    {
      id: `1`,//message id
      type: 'text',//about message type: 'text', 'image', 'voice', 'video', 'location', 'share', 'videoCall', 'voiceCall', 'redEnvelope', 'file', 'system'
      content: 'hello world',
      targetId: '10086',//The id of the person who sent the message
      chatInfo: {//The profile of the person you're chatting with
        avatar: require('../../assets/imgs/avatar.jpeg'),
        id: '12345678',
        nickName: 'Test'
      },
      renderTime: true,//Whether to render time above message
      sendStatus: -1,//发送方状态0 ---> sending, 1 ---> sendSuccess, -1 ---> You are deleted or on the blacklist, -2 ---> error
      time: '1542006036549'
    },
    {
      id: `2`,
      type: 'text',
      content: 'hi/{se}',
      targetId: '12345678',
      chatInfo: {
        avatar: require('../../assets/imgs/avatar.jpeg'),
        id: '12345678',
        nickName: 'Test'
      },
      renderTime: true,
      sendStatus: 0,
      time: '1542106036549'
    },
    {
      id: `3`,
      type: 'image',
      content: {
        uri: 'https://upload-images.jianshu.io/upload_images/11942126-044bd33212dcbfb8.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/300/h/240',
        width: 100,
        height: 80,
      },
      targetId: '12345678',
      chatInfo: {
        avatar: require('../../assets/imgs/avatar.jpeg'),
        id: '12345678',
        nickName: 'Test'
      },
      renderTime: false,
      sendStatus: 0,
      time: '1542106037000'
    },
    {
      id: `4`,
      type: 'text',
      content: '你好/{weixiao}',
      targetId: '88886666',
      chatInfo: {
        avatar: require('../../assets/imgs/avatar.jpeg'),
        id: '12345678'
      },
      renderTime: true,
      sendStatus: 0,
      time: '1542177036549'
    },
    {
      id: `5`,
      type: 'voice',
      content: {
        uri: 'http://m10.music.126.net/20190810141311/78bf2f6e1080052bc0259afa91cf030d/ymusic/d60e/d53a/a031/1578f4093912b3c1f41a0bfd6c10115d.mp3',
        length: 10
      },
      targetId: '12345678',
      chatInfo: {
        avatar: require('../../assets/imgs/avatar.jpeg'),
        id: '12345678',
        nickName: 'Test'
      },
      renderTime: true,
      sendStatus: 1,
      time: '1542260667161'
    },
    {
      id: `6`,
      type: 'voice',
      content: {
        uri: 'http://m10.music.126.net/20190810141311/78bf2f6e1080052bc0259afa91cf030d/ymusic/d60e/d53a/a031/1578f4093912b3c1f41a0bfd6c10115d.mp3',
        length: 30
      },
      targetId: '88886666',
      chatInfo: {
        avatar: require('../../assets/imgs/avatar.jpeg'),
        id: '12345678'
      },
      renderTime: true,
      sendStatus: 0,
      time: '1542264667161'
    },
  ])
  //声音
  const sound = useRef()
  //当前激活语音ID
  const activeVoiceId = useRef(-1)
  //聊天背景
  //Whether to get a recording handle
  const [voiceHandle, setVoiceHandle] = useState(true)
  //Playing voice or not
  const [voicePlaying, setVoicePlaying] = useState(false)
  //Loading voice or not
  const [voiceLoading, setVoiceLoading] = useState(false)
  //音量Volume (0~10)
  const [voiceVolume, setVoiceVolume] = useState(0)
  //audio length
  const [currentTime, setCurrentTime] = useState(0)
  const [hasPermission, setHasPermission] = useState(false)
  //未知
  const [recording, setRecording] = useState(false)
  const [paused, setPaused] = useState(false)
  const [stoppedRecording, setStoppedRecording] = useState(false)
  const [finished, setFinished] = useState(false)
  const [volume, setVolume] = useState(0)
  //File path to store voice
  const [audioPath, setAudioPath] = useState("")
  //	Custom panel source
  const [panelSource, setPanelSource] = useState([{
    icon: <FastImage source={require('../../assets/imgs/camera.png')} style={style.menuIcon} />,
    title: '照片',
  }, {
    icon: <FastImage source={require('../../assets/imgs/camera.png')} style={style.menuIcon} />,
    title: '拍照'
  }])
  //发送消息事件
  const sendMessage = useCallback((type, content, isInverted) => {
    let msgId = `${createId()}`
    let params = {
      y: 'chat', d: JSON.stringify({
        sellId: route.params.sellId,
        chatTicket: route.params.chatTicket,
        toUid: route.params.toUid,
        goodsId: route.params.goodsId,
        msgType: type,
        data: content,
        msgId
      })
    }
    send(params, webSocket)
    dispatch({
      type: SEND, payload: {
        id: msgId,
        type,
        content,
        chatInfo: {
          avatar: require('../../assets/imgs/avatar.jpeg'),
          id: '12345678'
        },
        targetId: userInfo.userId + "",
        renderTime: false,
        sendStatus: 0,
      }
    })
  }, [webSocket])
  //Callback when check permission on android
  const _requestAndroidPermission = useCallback(async () => {
    try {
      const rationale = {
        title: '麦克风权限',
        message: '需要权限录制语音.',
        buttonPositive: '确定',
      }
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED)
    } catch (e) {
      console.log(e)
    }
  }, [])
  //返回事件
  const leftEvent = useCallback(() => {
    navigation.goBack()
  }, [])
  //选取相册
  const PanelMenuEvent = useCallback((index) => {

  }, [])
  //渲染底部菜单栏
  const renderPanelRow = (data, index) =>
    (<TouchableOpacity
      key={index}
      style={{
        width: (width - 30) / 4,
        height: (width - 30) / 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
      }}
      activeOpacity={0.7}
      onPress={() => PanelMenuEvent(index)}
    >
      <View style={style.menuItemWrap}>
        {data.icon}
      </View>
      <Text style={style.menuTitle}>{data.title}</Text>
    </TouchableOpacity>)
  //点击播放语音
  const onPress = useCallback((type, index, content) => {
    if (type === 'voice') {
      if (voicePlaying) {
        if (index === activeVoiceId.current) {
          stopSound()
        } else {
          stopSound(true)
          playSound(content, index)
        }
      } else {
        if (index !== activeVoiceId) {
          stopSound(true)
        }
        playSound(content, index)
      }
    }
  }, [voicePlaying])
  //停止播放语音
  const stopSound = useCallback((remove = false) => {
    sound.current && sound.current.stop()
    setVoicePlaying(false)
    if (remove) {
      sound.current = null
    }
  }, [])
  //播放语音
  const playSound = useCallback((url, index) => {
    activeVoiceId.current = index
    if (sound.current === null) {
      setVoiceLoading(true)
      sound.current = new Sound(url, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          setVoiceLoading(false)
          sound.current = null
          return;
        }
        setVoiceLoading(false)
        setVoicePlaying(true)
        sound.current.play((success) => {
          if (success) {
            setVoicePlaying(false)
            console.log('successfully finished playing');
          } else {
            setVoicePlaying(false)
            console.log('playback failed due to audio decoding errors');
          }
        });
      });
    } else {
      setVoicePlaying(true)
      sound.current.play((success) => {
        if (success) {
          setVoicePlaying(false)
          console.log('successfully finished playing');
        } else {
          setVoicePlaying(false)
          console.log('playback failed due to audio decoding errors');
        }
      });
    }
  }, [])
  //Callback when get handle or not
  const _setVoiceHandel = useCallback((status) => {
    setVoiceHandle(status)
  }, [])
  const changeHeaderLeft = useCallback(() => {
    console.log("trigger changeHeaderLeft")
  }, [])
  //	Callback when recording
  const audioProgress = useCallback(() => {
    AudioRecorder.onProgress = (data) => {
      if (data.currentTime === 0) {
        setCurrentTime(Math.floor(currentTime + 0.25))
      } else {
        setCurrentTime(Math.floor(data.currentTime))
      }
      _setVoiceHandel(false)
      setVolume(Math.floor(data.currentMetering))
      random()
    }
  }, [currentTime])
  //Callback when finish record
  const audioFinish = useCallback(() => {
    AudioRecorder.onFinished = (data) => _finishRecording(data.status === 'OK', data.audioFileURL)
  }, [])
  const _finishRecording = useCallback((didSucceed, filePath) => {
    console.log(filePath)
    setFinished(didSucceed)
  }, [])
  const checkDir = useCallback(async () => {
    if (!await RNFS.exists(`${AudioUtils.DocumentDirectoryPath}/voice/`)) {
      RNFS.mkdir(`${AudioUtils.DocumentDirectoryPath}/voice/`)
    }
  }, [])
  //	Callback when init file path
  const initPath = useCallback(async () => {
    await checkDir()
    const nowPath = `${AudioUtils.DocumentDirectoryPath}/voice/voice${Date.now()}.aac`
    setCurrentTime(0)
    setAudioPath(nowPath)
    prepareRecordingPath(nowPath)
  }, [])
  //Callback when start record
  const _record = useCallback(async () => {
    try {
      await AudioRecorder.startRecording()
    } catch (error) {
      console.log(error)
    }
  }, [])
  //Callback when stop record
  const _stop = useCallback(async () => {
    try {
      await AudioRecorder.stopRecording()
      console.log("_stop")
      timer.current && clearInterval(timer.current)
      if (Platform.OS === 'android') {
        _finishRecording(true)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])
  //Callback when pause record
  const _pause = useCallback(async () => {
    try {
      await AudioRecorder.pauseRecording() // Android 由于API问题无法使用此方法
    } catch (e) {
      console.log(e)
    }
  }, [])
  //Callback when resume record
  const _resume = useCallback(async () => {
    try {
      await AudioRecorder.resumeRecording() // Android 由于API问题无法使用此方法
    } catch (e) {
      console.log(e)
    }
  }, [])

  const prepareRecordingPath = useCallback((audioPath) => {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'High',
      AudioEncoding: 'aac',
      OutputFormat: 'aac_adts',
      AudioEncodingBitRate: 32000,
      MeteringEnabled: true,
    })
  }, [])
  const random = useCallback(() => {
    if (timer.current) return
    console.log('start')
    timer.current = setInterval(() => {
      const num = Math.floor(Math.random() * 10)
      setVoiceVolume(num)
    }, 500)
  }, [])
  //立即购买
  const orderConfirm = useCallback(() => {
    navigation.navigate("order", { goods_id: route.params.goodsId })
  }, [route.params?.goodsId])
  //接收消息
  const receiveMessage = useCallback(e => {
    let parseResult = parseReceiveMessage(e)
    console.log("parseResult", parseResult)
    dispatch({ type: RECEIVE, payload: parseResult })
  }, []) 
  //获取聊天记录
  useEffect(() => {
    if (route.params?.sellId && route.params?.chatTicket && route.params?.toUid && route.params?.goodsId&&webSocket) {
      webSocket.addEventListener("message", receiveMessage)
      let d = JSON.stringify({
        sellId: route.params.sellId,
        chatTicket: route.params.chatTicket,
        goodsId: route.params.goodsId,
        toUid: route.params.toUid
      })
      let params = { y: 'main', d }
      send(params, webSocket)
      let readParams = { y: 'read', d }
      send(readParams, webSocket)
    }
    return () => {
      webSocket.removeEventListener("message", receiveMessage)
    }
  }, [route.params?.sellId, route.params?.chatTicket, route.params?.toUid, route.params?.goodsId, webSocket])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={style.container}>
        <Header title="小可爱" leftEvent={leftEvent}>
        </Header>
        <ProductInfo productInfoData={productInfo} orderConfirm={orderConfirm}></ProductInfo>
        <ChatScreen
          chatWindowStyle={{ paddingTop: scaleHeight(55) }}
          ref={(e) => chatRef.current = e}
          CustomImageComponent={FastImage}
          messageList={messageList}
          userProfile={userProfile}
          panelSource={panelSource}
          renderPanelRow={renderPanelRow}
          inverted={true}
          chatBackgroundImage={chatBg}
          sendMessage={sendMessage}
          androidHeaderHeight={80}
          onMessagePress={onPress}
          changeHeaderLeft={changeHeaderLeft}
          audioPath={audioPath}
          audioHasPermission={hasPermission}
          checkPermission={AudioRecorder.requestAuthorization}
          requestAndroidPermission={_requestAndroidPermission}
          audioOnProgress={audioProgress}
          audioOnFinish={audioFinish}
          audioInitPath={initPath}
          audioRecord={_record}
          audioStopRecord={_stop}
          audioPauseRecord={_pause}
          audioResumeRecord={_resume}
          audioCurrentTime={currentTime}
          audioHandle={voiceHandle}
          setAudioHandle={_setVoiceHandel}
          voiceLoading={voiceLoading}
          voicePlaying={voicePlaying}
          voiceVolume={voiceVolume}
          renderSystemMessage={(data) => <SystemMessage orderConfirm={orderConfirm} systemItemData={data}></SystemMessage>}
        />
      </View>
    </SafeAreaView>

  )
}
const SystemMessage = memo((props) => {
  const { systemItemData: { message: { content } }, orderConfirm } = props
  const { msg,status } = JSON.parse(content)
  const systemMessageEvent = useCallback(() => {
    if(status==1||status==3){
       orderConfirm()
    }
  }, [])
  return (
    <TouchableOpacity activeOpacity={1}  onPress={systemMessageEvent}>
      <View style={style.systemItemDataWrap}>
        <Text style={style.systemItemTitle}>{msg.c}</Text>
        <Text style={style.systemItemDisc}>{msg.d}</Text>
      </View>
    </TouchableOpacity>
  )
})
const ProductInfo = memo((props) => {
  const { orderConfirm, productInfoData } = props
  return (
    <View style={style.productInfoWrap}>
      <Image style={style.productImg} source={{ uri: productInfoData.image }}></Image>
      <View style={style.productInfo}>
        <Text style={style.price}>￥{productInfoData.price}</Text>
        <Text style={style.deliveryFee}>{parseFloat(productInfoData.postage) === 0 ? '包邮' : `含运费${productInfoData.postage}元`}</Text>
        <Text style={style.tip}>交易前聊一聊</Text>
      </View>
      <TouchableHighlight underlayColor="#fff" onPress={orderConfirm}>
        <View style={style.buyWrap}>
          <Text style={style.buy}>立即购买</Text>
        </View>
      </TouchableHighlight>
    </View>
  )
})
const style = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1
  },
  menuIcon: {
    width: scaleSize(20),
    height: scaleSize(20)
  },
  menuItemWrap: {
    backgroundColor: '#fff',
    borderRadius: scaleSize(8),
    padding: scaleSize(15),
    borderColor: '#ccc',
    borderWidth: scaleSize(0.5)
  },
  menuTitle: {
    color: '#7a7a7a',
    marginTop: scaleHeight(10)
  },
  productInfoWrap: {
    position: "absolute",
    top: scaleHeight(45),
    left: 0,
    paddingVertical: scaleHeight(5),
    paddingHorizontal: scaleSize(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 100,
    backgroundColor: "#fff"
  },
  productImg: {
    marginRight: scaleSize(10),
    width: scaleSize(50),
    height: scaleSize(50),
    borderRadius: scaleSize(4)
  },
  productInfo: {
    flex: 1
  },
  price: {
    fontSize: setSpText2(14),
    fontWeight: "500"
  },
  deliveryFee: {
    marginTop: scaleHeight(2),
    fontSize: setSpText2(12),
    color: "#999"
  },
  tip: {
    marginTop: scaleHeight(2),
    fontSize: setSpText2(12),
    color: "#999"
  },
  buyWrap: {
    alignSelf: "flex-end",
    width: scaleSize(80),
    height: scaleHeight(25),
    borderRadius: scaleSize(4),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fca413"
  },
  buy: {
    fontSize: setSpText2(14),
    color: "#fff",
  },
  systemItemDataWrap: {
    backgroundColor: "#fff",
    marginHorizontal: "auto",
    alignSelf: "center",
    width: scaleSize(300),
    paddingVertical: scaleHeight(10),
    paddingHorizontal: scaleSize(20),
    borderRadius: scaleSize(10)
  },
  systemItemTitle: {
    fontSize: setSpText2(16),
    fontWeight: "500"
  },
  systemItemDisc: {
    fontSize: setSpText2(12),
    color: "#999",
    lineHeight: setSpText2(18),
    marginTop: scaleHeight(2)
  },
})
export default connect(state => state, dispatch => ({ dispatch }))(MessageDetail)