/**
 * create at 04/21/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, InteractionManager, TouchableOpacity} from 'react-native'
import {MapView, MapTypes, Geolocation} from 'react-native-baidu-map'
import { Actions } from 'react-native-router-flux'

// components
import {SearchInputText} from '../../../../components/search/Search'
import EnhancedBackAndroid from '../../../../modules/enhanced/back.android'

// location
import {getLocation} from '../../../../modules/location'

// style
import {colors, distances, fontScale, globleStyles} from '../../../../constants/style'

// common
import {toastShort} from '../../../../constants/toast'

const Height = distances.deviceHeight-(distances.navHeight+distances.statusBarHeight)

class MapContainer extends Component{
	constructor(props){
		super(props)

    // data
    this.state = {
      showLng: 0.0,
      showLat: 0.0,
      searchContent: ''
    }

    this._getCurrentPosition = this._getCurrentPosition.bind(this)
    this._handleRightClick = this._handleRightClick.bind(this)
		this._onMapStatusChangeFinish = this._onMapStatusChangeFinish.bind(this)
    this._onMapStatusChange = this._onMapStatusChange.bind(this)
    this.searchInputContent = this.searchInputContent.bind(this)
    this.clickSearchBtn = this.clickSearchBtn.bind(this)
    this._backClick = this._backClick.bind(this)
	}

  componentWillMount(){
    if(Boolean(this.props.routerData) && this.props.routerData.location){
      // 提供的位置
      let {location} = this.props.routerData
      this.setState({
        showLng: Boolean(location.lng) ? location.lng : 0.0,
        showLat: Boolean(location.lat) ? location.lat : 0.0
      })
    } else {
      // 没有提供位置则取当前位置
      InteractionManager.runAfterInteractions(() => {
        this._getCurrentPosition()
      })
    }
  }

  componentDidMount(){
    // 开始时拿到当前城市
    InteractionManager.runAfterInteractions(() => {
      Geolocation.getCurrentPosition().then(data=>{
        // 获取城市
        this.city = Boolean(data.city) ? data.city : ''
      }).catch(e=>{
        console.log('getCurrentPosition e===>', e)
      })
    })
    //必须在此处bind上下文，否则在_handleRightClick调用的是global上下文
    Actions.refresh({
      renderBackButton: ()=> (
        <TouchableOpacity onPress={this._backClick} style={{paddingTop: 5, paddingBottom: 5, paddingRight: 30}}> 
          <Image style={{marginLeft: 5}} source={require('../../../../sources/images/back_white.png')}/>
        </TouchableOpacity>
      ),
      onRight: this._handleRightClick.bind(this)
    })
  }

  async _getCurrentPosition(){
    try{
      let ret = await Geolocation.getCurrentPosition()
      // console.log('getCurrentPosition data==>', ret)
      this.city = Boolean(ret.city) ? ret.city : ''
      this.setState({
        showLng: Boolean(ret.longitude) ? ret.longitude : 0.0,
        showLat: Boolean(ret.latitude) ? ret.latitude : 0.0
      })
      // console.log('state===>', this.state)
    }catch(e){
      console.log('getCurrentPosition e===>', e)
      toastShort('当前位置获取失败，请允许北斗获取您的位置信息。');
    }
  }

  _handleRightClick(){
    const {handlerPositionChange, backFunc} = this.props.routerData
    if(Boolean(this.lng) && Boolean(this.lat)){
      // 返回
      if(typeof handlerPositionChange === 'function')
        handlerPositionChange(this.lng, this.lat)
      if(typeof backFunc === 'function')
        backFunc()
      Actions.pop()
      return
    }
    toastShort('请移动地图选择新的坐标点')
  }
  _backClick(){
    let {backFunc} = this.props.routerData
    if(typeof backFunc === 'function'){
      backFunc()
    }
    Actions.pop()
  }

	_onMapStatusChange(mapStatus){
    if(!!mapStatus){
      const {longitude: lng, latitude: lat} = mapStatus.target
      this.lng = lng
      this.lat = lat
    }
  }

  _onMapStatusChangeFinish(mapStatus){
    if(!!mapStatus){
      const {longitude: lng, latitude: lat} = mapStatus.target
      this.lng = lng
      this.lat = lat
    }
  }

  // 搜索框文字变换
  searchInputContent(content){
    this.setState({
      searchContent: content
    }) 
  }

  // 点击搜索触发操作
  clickSearchBtn(searchResult){
    // console.log('clickSearchBtn searchResult===>', searchResult)
    // 进入搜索页面
    Geolocation.geocode(this.city, searchResult).then(data=>{
      // console.log('clickSearchBtn data==>', data)
      if(Boolean(data.errmsg)){
        throw new Error(data.errmsg)
      } else {
        this.setState({
          showLng: Boolean(data.longitude) ? data.longitude : 0.0,
          showLat: Boolean(data.latitude) ? data.latitude : 0.0
        })
      }
    }).catch(e=>{
      console.log('geocode e===>', e)
      toastShort(e)
    })
  }

  handleHardwareBackPress(){
    this._backClick()
		return true
  }

	render(){
		let {showLat, showLng, searchContent} = this.state
		if(!Boolean(showLat) || !Boolean(showLng)){
			return null
		}
		return (
			<View style={{flex: 1, backgroundColor: '#fff', }}>
        {true ? null : <SearchInputText placeText='搜索位置' showText={searchContent} updateSearch={this.searchInputContent} 
          onSearchSubmit={this.clickSearchBtn} 
        />}
        <View style={{flex: 1}}>
          <MapView key={new Date().getTime()}
            trafficEnabled={false}
            baiduHeatMapEnabled={false}
            mapType={MapTypes.NORMAL}
            zoom={15}
            center={{longitude: showLng, latitude: showLat}}
            onMapStatusChange = {this._onMapStatusChange}
            onMapStatusChangeFinish={this._onMapStatusChangeFinish}
            style={{width: distances.deviceWidth, height: Height}}
          />
          <Image style={{position: 'absolute', left: (distances.deviceWidth-37.0/2)/2, top: (Height/2-28)}} 
            source={require('../../../../sources/images/home/location_orange.png')}
          />
          <TouchableHighlight onPress={this._getCurrentPosition} underlayColor='rgba(0,0,0,0.0)'
            style={{position: 'absolute', left: 20, bottom: 30}}
          >
            <Image source={require('../../../../sources/images/home/new_location.png')}/>
          </TouchableHighlight>
        </View>
			</View>
		)
	}
}

export default (EnhancedBackAndroid()(MapContainer))