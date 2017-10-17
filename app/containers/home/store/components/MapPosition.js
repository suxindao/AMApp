/**
 * Created by Joe on 2017/6/5.
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, InteractionManager, TouchableOpacity} from 'react-native'
import {MapView, MapTypes, Geolocation} from 'react-native-baidu-map'
import { Actions } from 'react-native-router-flux'
import {toastShort} from './../../../../constants/toast'

// components
import EnhancedBackAndroid from '../../../../modules/enhanced/back.android'
// Util
import {getLocation} from '../../../../modules/location/'

// style
import {colors, distances, fontScale, globleStyles} from '../../../../constants/style'
const Height = distances.deviceHeight-(distances.navHeight+distances.statusBarHeight)

class MapPosition extends Component{
  constructor(props){
    super(props)
    // data
    this.state = {
      longitude: 0.0,
      latitude: 0.0,
    }
    this._loadData = this._loadData.bind(this)
    this.subInfo = this.subInfo.bind(this)
  }

  componentWillMount(){
    // 取当前位置
    InteractionManager.runAfterInteractions(() => {
      this._loadData()
    })
  }

  componentDidMount(){
    Actions.refresh({
      renderRightButton: ()=> (
        <TouchableOpacity
          onPress={this.subInfo}
          style={{
            width:40,
            height:32,
            justifyContent:'flex-start',
            alignItems:'center',
          }}
        >
          <Text style={{fontSize:16*fontScale, color:'#fff'}}>确定</Text>
        </TouchableOpacity>
      )
    })
  }

  /**
   * 获取地理位置
   * @returns {function(*, *=)}
   * @private
   */
  async _loadData() {
      return await getLocation().then(location=>{
        this.setState({
          longitude: location.lng,
          latitude: location.lat
        })
        return location;
      });
  }

  subInfo(){
    this.props.routerData.callback(
      {
        location_lon:this.state.longitude,
        location_lat:this.state.latitude,
      }
    )
    Actions.pop();
  }

  render(){
    let {latitude, longitude} = this.state
    if(!Boolean(latitude) || !Boolean(longitude)){
      return null
    }
    return (
      <View style={{flex: 1}}>
        <MapView
          trafficEnabled={false}
          baiduHeatMapEnabled={false}
          mapType={MapTypes.NORMAL}
          zoom={15}
          center={{longitude: longitude, latitude: latitude}}
          style={{width: distances.deviceWidth, height: Height}}
        />
        <Image
          style={{
            position: 'absolute',
            left: (distances.deviceWidth-37.0/2)/2,
            top: (Height)/2-28
          }}
          source={require('../../../../sources/images/home/location_orange.png')}
        />
        <View
          style={{
            width:distances.deviceWidth,
            height:distances.deviceHeight,
            position: 'absolute',
            left: 0,
            bottom: 0,
            backgroundColor:'rgba(0,0,0,0)',
            zIndex:2,
          }}
        >
        </View>
        <TouchableHighlight
          onPress={this._loadData}
          underlayColor='rgba(0,0,0,0.0)'
          style={{position: 'absolute', left: 20, bottom: 30,zIndex:3,}}
        >
          <Image source={require('../../../../sources/images/home/new_location.png')}/>
        </TouchableHighlight>
      </View>
    )
  }
}

export default (EnhancedBackAndroid()(MapPosition))