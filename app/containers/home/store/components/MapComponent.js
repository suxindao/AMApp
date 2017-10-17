/**
 * create at 04/21/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, InteractionManager} from 'react-native'
import {MapView, MapTypes, Geolocation} from 'react-native-baidu-map'
import {Actions} from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

/**
 * params
 *  lng, lat, 提供的经度和维度
 *  width number, height number 组件宽、高
 *  mapPress , 组件是否可以点击进入大地图
 */
export default class MapComponent extends Component {
    constructor(props) {
        super(props)
    }

	render(){
		let {width = distances.deviceWidth, height = 100, lng, lat, mapPress, showMap = true} = this.props
		return (
			<View style={{backgroundColor: '#fff', width: width, height: height}}>
				{showMap ? <MapView 
          trafficEnabled={false}
          baiduHeatMapEnabled={false}
          mapType={MapTypes.NORMAL}
          zoom={15}
          center={{longitude: lng, latitude: lat}}
          style={{width: width, height: height, backgroundColor: '#fff'}}
        /> : null}
				<Image style={{position: 'absolute', left: (width-37.0/2)/2, top: (height)/2-28}} 
					source={require('../../../../sources/images/home/location_orange.png')}
        />
				<TouchableHighlight underlayColor='rgba(255, 255, 255, 0)' onPress={mapPress} style={{
					position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0)'
				}}>
					<View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0)' }}/>
				</TouchableHighlight>
			</View>
		)
	}
}