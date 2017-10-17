/**
 * Created by suxindao on 2017/9/19 .
 */

import React, {Component} from 'react';
import {Text, View, Image, Dimensions, ActivityIndicator} from 'react-native'
import Swiper from 'react-native-swiper'

import {httpIP} from '../../helpers/Upload'

export default class PhotoSwiper extends Component {
    constructor(props) {
        super(props)
        this.renderSlide = this.renderSlide.bind(this)
    }

    componentWillMount() {

    }

    componentDidUpdate() {

    }

    renderSlide() {
        const {photo_data} = this.props
        if (Array.isArray(photo_data) && photo_data.length > 0) {
            return photo_data.map((item, index) => {
                    return (
                        <View style={styles.slide} key={index}>
                            <Image
                                style={styles.pic}
                                source={{uri: httpIP.substring(0, httpIP.length - 1) + item.file_path}}
                            />
                        </View>
                    )
                }
            )
        } else {
            return null
        }
    }

    render() {
        const {index = 0} = this.props
        return (
            <Swiper style={styles.wrapper}
                    showsButtons={false}
                    dotColor={'#666'} activeDotColor={'#FFF'}
                    index={index} loop={false}
                    loadMinimal={true} loadMinimalSize={2}
                    loadMinimalLoader={<ActivityIndicator size={"large"} color={"#FFF"}/>}
            >
                {this.renderSlide()}
            </Swiper>
        )
    }
}

let styles = {
    wrapper: {
        backgroundColor: '#000'
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    pic: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
}
