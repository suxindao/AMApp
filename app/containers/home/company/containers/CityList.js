/**
 * create at 03/11/17
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TouchableHighlight, DeviceEventEmitter } from 'react-native'

//页面组件相关
//高阶组件  包装android 硬件回退
import NavView from '../components/NavView'
import CityContent from '../components/CityListComponent'
import EnhancedBackAndroid from '../../../../modules/enhanced/back.android'
import { storeCity } from '../../../../constants/common'

import { Actions } from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

export default class CityList extends Component{
  constructor(props){
		super(props)

		this.selectCityClick = this.selectCityClick.bind(this)
		this.state = {
			cities : storeCity.cities,
			currentCity: storeCity.cities[0]
		}
	}

	componentWillMount(){
		this.setState({
			currentCity:this.props.currentCity
		})
	}

	selectCityClick(city){
		this.setState({currentCity:city})
		let { emitKey } = this.props;
		if(emitKey)
			DeviceEventEmitter.emit(emitKey, city);
		Actions.pop();
	}

	render(){
		let {cities, currentCity} = this.props
		return (
			<View style={{flex: 1, backgroundColor: colors.bgColor}}>
				<NavView pressClose={Actions.pop}/>
				<CityContent cities={this.state.cities} currentCity={this.state.currentCity} citySelect={this.selectCityClick}/>
			</View>
		)
	}
}