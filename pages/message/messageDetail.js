import React, { useCallback, useState, useRef, memo } from "react"
import { View, Text, StyleSheet, SafeAreaView, Button, Image, TouchableOpacity, PermissionsAndroid, Dimensions, TouchableHighlight } from "react-native"
import Header from "../../components/Header"
import FastImage from 'react-native-fast-image'
import { ChatScreen } from 'react-native-easy-chat-ui'
import { AudioRecorder, AudioUtils } from 'react-native-audio'
import RNFS from 'react-native-fs'
import Sound from 'react-native-sound'
import ImagePicker from 'react-native-image-crop-picker';
import { scaleSize, scaleHeight, setSpText2 } from "../../utils/ScreenUtil"
import chatBg from '../../assets/imgs/pic1.jpg'
const { width, height } = Dimensions.get('window')
function MessageDetail({ navigation }) {
  //聊天句柄
  const chatRef = useRef()
  //发语音计时器
  const timer = useRef()
  //聊天数据
  const [messages, setMessages] = useState([
    {
      id: `1`,//message id
      type: 'text',//about message type: 'text', 'image', 'voice', 'video', 'location', 'share', 'videoCall', 'voiceCall', 'redEnvelope', 'file', 'system'
      content: 'hello world',
      targetId: '12345678',//The id of the person who sent the message
      chatInfo: {//The profile of the person you're chatting with
        avatar: require('../../assets/imgs/avatar.jpeg'),
        id: '12345678',
        nickName: 'Test'
      },
      renderTime: true,//Whether to render time above message
      sendStatus: 0,//发送方状态0 ---> sending, 1 ---> sendSuccess, -1 ---> You are deleted or on the blacklist, -2 ---> error
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
    setMessages(messages=>[...messages, {
      id: `${new Date().getTime()}`,
      type,
      content,
      targetId: '88886666',
      chatInfo: {
        avatar: require('../../assets/imgs/avatar.jpeg'),
        id: '12345678',
        nickName: 'Test'
      },
      renderTime: true,
      sendStatus: 1,
      time: `${new Date().getTime()}`
    }])
  }, [])
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
    switch (index) {
      case 0:
        ImagePicker.openPicker({}).then(image => {
          console.log(" openPicker image", image)
        })
        break
      case 1:
        ImagePicker.openCamera({}).then(image => {
          console.log(" openPicker image", image);
        });
      default:
        break
    }

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
  //消息接收事件
  const receive = useCallback(() => {
    setMessages(messages=>([...messages, {
      id: `${new Date().getTime()}`,
      type: 'text',
      content: '收到一条消息' + new Date().getTime(),
      targetId: '12345678',
      chatInfo: {
        avatar: require('../../assets/imgs/avatar.jpeg'),
        id: '88886666',
        nickName: 'Test'
      },
      renderTime: true,
      sendStatus: 1,
      time: `${new Date().getTime()}`
    }]))
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
    navigation.navigate("order")
  }, [])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={style.container}>
        <Header title="小可爱" leftEvent={leftEvent}>
        </Header>
        <ProductInfo orderConfirm={orderConfirm}></ProductInfo>
        <ChatScreen
          chatWindowStyle={{ paddingTop: scaleHeight(50) }}
          ref={(e) => chatRef.current = e}
          CustomImageComponent={FastImage}
          messageList={messages}
          panelSource={panelSource}
          renderPanelRow={renderPanelRow}
          inverted={false}
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
        />
        <TouchableOpacity
          onPress={() => receive()}
          style={{
            width: 60,
            height: 60, borderRadius: 30,
            position: 'absolute', top: 200, right: 0, backgroundColor: 'blue',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text style={{ color: '#fff' }}>
            模拟收消息
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>

  )
}
const ProductInfo = memo((props) => {
  const { orderConfirm } = props
  return (
    <View style={style.productInfoWrap}>
      <Image style={style.productImg} source={require("../../assets/imgs/pic1.jpg")}></Image>
      <View style={style.productInfo}>
        <Text style={style.price}>￥19.90</Text>
        <Text style={style.deliveryFee}>含运费0.00元</Text>
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
  }
})
export default MessageDetail