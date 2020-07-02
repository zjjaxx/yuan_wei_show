
import React, { useRef, useCallback } from 'react';
import {  StyleSheet, Text, TouchableOpacity, View,SafeAreaView } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Header from "../../components/Header.js"
import {scaleHeight,scaleSize,setSpText2} from "../../utils/ScreenUtil"
function ScanView({navigation}) {
    const cameraRef = useRef()
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    const takePicture =useCallback(async ()=>{
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true };
            const data = await camera.current.takePictureAsync(options);
            console.log(data.uri);
        }
    },[])  
    return (
        <SafeAreaView style={styles.container}>
            <Header title="扫一扫" leftEvent={leftEvent}></Header>
            <RNCamera
                ref={cameraRef}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                androidRecordAudioPermissionOptions={{
                    title: 'Permission to use audio recording',
                    message: 'We need your permission to use your audio',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                onGoogleVisionBarcodesDetected={({ barcodes }) => {
                    console.log(barcodes);
                }}
            />
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={takePicture} style={styles.capture}>
                    <Text style={{ fontSize: setSpText2(14) }}> 扫一扫 </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:"#fff"
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fca413',
        borderRadius: scaleSize(5),
        paddingVertical: scaleHeight(10),
        paddingHorizontal: scaleSize(20),
        alignSelf: 'center',
        marginVertical:scaleHeight(10)
    },
});
export default ScanView