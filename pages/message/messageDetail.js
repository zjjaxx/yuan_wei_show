import React, { useCallback, useState, useRef } from "react"
import { View, Text, StyleSheet, SafeAreaView, Button, TouchableOpacity, PermissionsAndroid,Dimensions } from "react-native"
import Header from "../../components/Header"
import FastImage from 'react-native-fast-image'
import { ChatScreen } from 'react-native-easy-chat-ui'
import { AudioRecorder, AudioUtils } from 'react-native-audio'
import RNFS from 'react-native-fs'
import Sound from 'react-native-sound'
const { width, height } = Dimensions.get('window')
function MessageDetail({ navigation }) {
  const chatRef = useRef()
  const timer = useRef()
  const [messages, setMessages] = useState([
    {
      id: `1`,
      type: 'text',
      content: 'hello world',
      targetId: '12345678',
      chatInfo: {
        avatar: require('../../assets/imgs/avatar.jpeg'),
        id: '12345678',
        nickName: 'Test'
      },
      renderTime: true,
      sendStatus: 0,
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
      sendStatus: -2,
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
  const sound = useRef()
  const activeVoiceId = useRef(-1)

  const [info, setInfo] = useState({
    chatBg: require('../../assets/imgs/pic1.jpg'),
    inverted: false,
    voiceHandle: true,
    voicePlaying: false,
    voiceLoading: false,
    voiceVolume: 0,
    currentTime: 0,
    recording: false,
    paused: false,
    stoppedRecording: false,
    finished: false,
    audioPath: '',
    panelSource: [
      {
        icon: <FastImage source={require('../../assets/imgs/avatar.jpeg')} style={{ width: 30, height: 30 }} />,
        title: '照片',
      }, {
        icon: <FastImage source={require('../../assets/imgs/avatar.jpeg')} style={{ width: 30, height: 30 }} />,
        title: '拍照'
      }
    ]
  })
  const sendMessage = useCallback((type, content, isInverted) => {
    console.log(type, content, isInverted, 'msg')
    setMessages([...messages, {
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
  }, [messages])
  const _requestAndroidPermission = useCallback(async () => {
    try {
      const rationale = {
        title: '麦克风权限',
        message: '需要权限录制语音.',
        buttonPositive: '确定',
      }
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      setInfo({ ...info, hasPermission: granted === PermissionsAndroid.RESULTS.GRANTED })
    } catch (e) {
      console.log(e)
    }
  }, [info])
  //返回事件
  const leftEvent = useCallback(() => {
    navigation.goBack()
  }, [])
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
      onPress={() => console.log('press')}
    >
      <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 15, borderColor: '#ccc', borderWidth:80 }}>
        {data.icon}
      </View>
      <Text style={{ color: '#7a7a7a', marginTop: 10 }}>{data.title}</Text>
    </TouchableOpacity>)
  const stopSound = useCallback((remove = false) => {
    sound.current && sound.current.stop()
    setInfo({ ...info, voicePlaying: false })
    if (remove) {
      sound.current = null
    }
  }, [info])
  const playSound = useCallback((url, index) => {
    activeVoiceId.current = index
    if (sound.current === null) {
      setInfo({ ...info, voiceLoading: true })
      sound.current = new Sound(url, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          setInfo({ ...info, voiceLoading: false })
          sound.current = null
          return;
        }
        setInfo({ ...info, voiceLoading: false })
        setInfo({ ...info, voicePlaying: true })

        sound.current.play((success) => {
          if (success) {
            setInfo({ ...info, voicePlaying: false })
            console.log('successfully finished playing');
          } else {
            setInfo({ ...info, voicePlaying: false })
            console.log('playback failed due to audio decoding errors');
          }
        });
      });
    } else {
      setInfo({ ...info, voicePlaying: true })
      sound.current.play((success) => {
        if (success) {
          setInfo({ ...info, voicePlaying: false })
          console.log('successfully finished playing');
        } else {
          setInfo({ ...info, voicePlaying: false })
          console.log('playback failed due to audio decoding errors');
        }
      });
    }
  }, [info])
  const _setVoiceHandel = useCallback((status) => {
    setInfo({ ...info, voiceHandle: status })
  }, [info])
  const changeHeaderLeft = useCallback(() => {
    console.log("trigger changeHeaderLeft")
  }, [])
  const onPress = useCallback((type, index, content) => {
    if (type === 'voice') {
      const { voicePlaying } = info
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
  }, [info])
  const audioProgress = useCallback(() => {
    AudioRecorder.onProgress = (data) => {
      if (data.currentTime === 0) {
        setInfo({ ...info, currentTime: Math.floor(info.currentTime + 0.25) })
      } else {
        setInfo({ ...info, currentTime: Math.floor(data.currentTime) })
      }
      _setVoiceHandel(false)
      setInfo({ ...info, volume: Math.floor(data.currentMetering) })
      random()
    }
  }, [info])
  const audioFinish = useCallback(() => {
    AudioRecorder.onFinished = (data) => _finishRecording(data.status === 'OK', data.audioFileURL)
  }, [])
  const _finishRecording = useCallback((didSucceed, filePath) => {
    console.log(filePath)
    setInfo({ ...info, finished: didSucceed })
  }, [info])
  const checkDir = useCallback(async () => {
    if (!await RNFS.exists(`${AudioUtils.DocumentDirectoryPath}/voice/`)) {
      RNFS.mkdir(`${AudioUtils.DocumentDirectoryPath}/voice/`)
    }
  }, [])
  const initPath = useCallback(async () => {
    await checkDir()
    const nowPath = `${AudioUtils.DocumentDirectoryPath}/voice/voice${Date.now()}.aac`
    setInfo({ ...info, audioPath: nowPath, currentTime: 0 })
    prepareRecordingPath(nowPath)
  }, [info])
  const _record = useCallback(async () => {
    try {
      await AudioRecorder.startRecording()
    } catch (error) {
      console.log(error)
    }
  }, [])

  const _stop = useCallback(async () => {
    try {
      await AudioRecorder.stopRecording()
      timer.current && clearInterval(timer.current)
      if (Platform.OS === 'android') {
        _finishRecording(true)
      }
    } catch (error) {
      console.log(error)
    }
  }, [])
  const _pause = useCallback(async () => {
    try {
      await AudioRecorder.pauseRecording() // Android 由于API问题无法使用此方法
    } catch (e) {
      console.log(e)
    }
  }, [])

  const _resume = useCallback(async () => {
    try {
      await AudioRecorder.resumeRecording() // Android 由于API问题无法使用此方法
    } catch (e) {
      console.log(e)
    }
  }, [])
  const receive = useCallback(() => {
    const newMsg = [...info.messages]
    newMsg.push(
      {
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
      })
    setInfo({ ...info, messages: newMsg })
  }, [info])

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
      setInfo({
        ...info,
        voiceVolume: num
      })
    }, 500)
  }, [info])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={style.container}>
        <Header title="小可爱" leftEvent={leftEvent}>
        </Header>
        <ChatScreen
          ref={(e) => chatRef.current = e}
          CustomImageComponent={FastImage}
          messageList={messages}
          panelSource={info.panelSource}
          renderPanelRow={renderPanelRow}
          inverted={info.inverted}
          chatBackgroundImage={info.chatBg}
          sendMessage={sendMessage}
          androidHeaderHeight={80}
          onMessagePress={onPress}
          changeHeaderLeft={changeHeaderLeft}
          audioPath={info.audioPath}
          audioHasPermission={info.hasPermission}
          checkPermission={AudioRecorder.requestAuthorization}
          requestAndroidPermission={_requestAndroidPermission}
          audioOnProgress={audioProgress}
          audioOnFinish={audioFinish}
          audioInitPath={initPath}
          audioRecord={_record}
          audioStopRecord={_stop}
          audioPauseRecord={_pause}
          audioResumeRecord={_resume}
          audioCurrentTime={info.currentTime}
          audioHandle={info.voiceHandle}
          setAudioHandle={_setVoiceHandel}
          voiceLoading={info.voiceLoading}
          voicePlaying={info.voicePlaying}
          voiceVolume={info.voiceVolume}
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
const style = StyleSheet.create({
  container: {
    flex: 1
  }
})
export default MessageDetail