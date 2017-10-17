/**
 * Created by Joe on 2017/8/2.
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, InteractionManager, TouchableOpacity} from 'react-native'
import {MapView, MapTypes} from 'react-native-baidu-map'
import {Actions} from 'react-native-router-flux'
import {toastShort} from './../../../../constants/toast'

// components
import EnhancedBackAndroid from '../../../../modules/enhanced/back.android'
// Util
import {getLocation} from '../../../../modules/location/'

// style
import {colors, distances, fontScale, globleStyles} from '../../../../constants/style'

const Height = distances.deviceHeight - (distances.navHeight + distances.statusBarHeight)

class ShowMap extends Component {
    constructor(props) {
        super(props)
        // data
        this.state = {
            longitude: 0.0,
            latitude: 0.0,
            store_longitude: 0.0,
            store_latitude: 0.0,
        }
        this._loadData = this._loadData.bind(this)
        this.handleHardwareBackPress = this.handleHardwareBackPress.bind(this)
    }

    componentWillMount() {
        // 取当前位置
        InteractionManager.runAfterInteractions(() => {
            this._loadData()
        })
    }

    /**
     * 获取地理位置
     * @returns {function(*, *=)}
     * @private
     */
    async _loadData() {
        let {routerData} = this.props
        this.setState({
            latitude: routerData.data.location_lat,
            longitude: routerData.data.location_lon,
            store_longitude: routerData.data.store_location_lon,
            store_latitude: routerData.data.store_location_lat,
        })
    }

    handleHardwareBackPress() {
        return false
    }

    render() {
        let {latitude, longitude, store_longitude, store_latitude} = this.state
        if (!Boolean(latitude) || !Boolean(longitude)) {
            return null
        }
        return (
            <View style={{flex: 1}}>
                <MapView
                    trafficEnabled={false}
                    baiduHeatMapEnabled={false}
                    mapType={MapTypes.NORMAL}
                    zoom={15}
                    center={{latitude: latitude, longitude: longitude}}
                    markers={
                        [
                            {latitude: latitude, longitude: longitude, title: '定位'},
                            {latitude: store_latitude, longitude: store_longitude, title: '门店'},
                        ]
                    }
                    style={{width: distances.deviceWidth, height: Height}}
                />
            </View>
        )
    }
}

export default (EnhancedBackAndroid()(ShowMap))