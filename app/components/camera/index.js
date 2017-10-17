/**
 *  create by Qi at 16/09/09
 *  拍照组件，接收路由数据
 *  {fun, attach} fun拍照后调用的函数 fun(image, attach) image为拍照获取的base64字符串  attach为前一个页面需要返回的数据（原样返回）
 */
import React, {Component} from 'react';

import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';

import Camera from 'react-native-camera';
import {Actions} from 'react-native-router-flux'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    capture: {
        color: '#000',
    }
})

export default class CameraComponent extends Component {
    constructor(props) {
        super(props)

        this.preventRepeat = true

        this.state = {
            isAuth: false,
        }

        this.takePicture = this.takePicture.bind(this)
        this.back = this.back.bind(this)
        this.renderAuthSuccess = this.renderAuthSuccess.bind(this)
    }

    componentWillMount() {
        if (Platform.OS === 'ios') {
            Camera.checkVideoAuthorizationStatus().then(val => {
                if (Boolean(val)) {
                    this.setState({isAuth: true})
                }
            })
            Camera.checkDeviceAuthorizationStatus().then(val => {
                if (val) {
                    this.setState({isAuth: true})
                }
            })
        }
    }

    renderAuthSuccess() {
        return (
            <View style={styles.container}>
                <Camera
                    ref={(cam) => {
                        this.camera = cam
                    }}
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}
                    captureQuality={'high'}>
                    <TouchableOpacity onPress={this.takePicture}>
                        <View style={{
                            backgroundColor: 'white',
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            marginBottom: 50
                        }}/>
                    </TouchableOpacity>
                </Camera>
                <TouchableOpacity style={{position: 'absolute', top: 0, left: 0}} onPress={this.back}>
                    <View style={{padding: 17}}>
                        <Image style={{flex: 1}} source={require('../../sources/images/back_black.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * iOS 在react-native-camera 中willMount 中授权为异步操作没有成功
     */
    render() {
        if (Platform.OS === 'ios') {
            if (this.state.isAuth) {
                return this.renderAuthSuccess()
            }
            return (
                <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                    <Text>请在隐私里打开相机权限</Text>
                </View>
            )
        }
        return this.renderAuthSuccess()
    }

    back() {
        Actions.pop()
    }

    takePicture() {
        if (this.preventRepeat) {
            this.preventRepeat = false
            this.camera.capture().then((result) => {
                console.log('result===>', result)
                const {onCameraCallback} = this.props
                if (Boolean(onCameraCallback) && (typeof onCameraCallback === 'function'))
                    onCameraCallback(result)
                Actions.pop()
            }).catch(err => console.error(err))
        }
    }
}