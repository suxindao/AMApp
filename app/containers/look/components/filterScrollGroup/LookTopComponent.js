/**
 * create at 04/15/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native'
import { Actions } from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

const explainImg = require('../../../../sources/images/look/explain.png')

export default class TopComponent extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let {departmentName, timeStr} = this.props
		return(
			<View style={styles.container}>
				<View style={styles.groupView}>
					<Text style={styles.groupText}>
						{Boolean(timeStr) ? timeStr : ''}
					</Text>
					<Text style={[styles.groupText, {marginTop: 2}]}>
						{Boolean(departmentName) ? departmentName : ''}
					</Text>
				</View>
				<TouchableHighlight onPress={Actions.lookExplanation} underlayColor={colors.touchBgColor}
				  style={styles.touchView}
				>	
					<Image source={explainImg}/>
				</TouchableHighlight>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	groupView: {
		flex: 1,
		paddingLeft: distances.contractLeftMargin,
		paddingTop: 5,
		paddingBottom: 5,
	},
	groupText: {
		fontSize: 14*fontScale,
		color: '#666'
	},
	touchView: {
		width: 80,
		justifyContent: 'center', 
		paddingRight: distances.contractLeftMargin,
		alignItems: 'flex-end',
		paddingTop: 5,
		paddingBottom: 5,
	}
})