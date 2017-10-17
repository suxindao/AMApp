/**
 * create at 04/19/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, TouchableOpacity, StyleSheet} from 'react-native'
import { Actions } from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../constants/style'

// common
import {outputdollars} from '../../../constants/utils/validate'
import {lookDateType} from '../../../constants/operation/lookManage'

// 布局比例 3: 5: 5(月份: 进件: 放款) 
const TITLE_COE = 3
const INTO_COE = 5
const LOAN_COE = 5
// 左右边距 icon width: 6, marginLeft :10
const ICON_WIDTH = distances.contractLeftMargin+6+10

export default class ListItem extends Component{
	constructor(props){
		super(props)

		this._itemClick = this._itemClick.bind(this)
	}

	_itemClick(){
		let {rowData, storeName, storeId} = this.props
		Actions.lookOrderList({
			routerData: {
				dateType: lookDateType.month,
				rowData: rowData, 
				id: storeId,
			}, 
			title: Boolean(storeName) ? storeName : ''
		})
	}

	render(){
		let {rowData} = this.props
		let touchAble = checkData(rowData)
		if(touchAble){
			return (
				<TouchableHighlight underlayColor={colors.touchBgColor}
				  onPress={this._itemClick} style={[styles.container]}
				>
					<View style={[styles.containerView]}>
						{commonComponent(rowData)}
						<Image style={{marginRight: distances.contractLeftMargin}} source={require('../../../sources/images/arrow_right.png')}/>
					</View>
				</TouchableHighlight>
			)
		} else {
			return (
				<View style={[styles.container]}>
					<View style={[styles.containerView]}>
						{commonComponent(rowData)}
					</View>
				</View>
			)
		}
	}
}
/**
 * 公共 view
 * @param {*} rowData 
 */
function commonComponent(rowData){
	return(
		<View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
			<Text style={{flex: TITLE_COE, textAlign: 'left', color: '#999', fontSize: 12*fontScale}}>
				{Boolean(rowData.month) ? rowData.month+'月' : ''}
			</Text>
			<CommonItem styleView={{flex: INTO_COE}} 
				topText={Boolean(rowData.bails_count) ? rowData.bails_count : 0} 
				bottomText={Boolean(rowData.bails_value) ? rowData.bails_value : 0} 
			/>
			<CommonItem styleView={{flex: LOAN_COE}} 
				topText={Boolean(rowData.loans_count) ? rowData.loans_count : 0} 
				bottomText={Boolean(rowData.loans_value) ? rowData.loans_value : 0} 
			/>
		</View>
	)
}
class CommonItem extends Component{
	render(){
		let {topText = 0, bottomText = 0, styleView = null} = this.props
		let monkeyValue = outputdollars(bottomText)
		return(
			<View style={[styleView, {
				alignItems: 'flex-start', justifyContent: 'center'
			}]}>
				<Text style={{color: '#999', fontSize: 15*fontScale, marginBottom: 8}}>{topText}</Text>
				<Text style={{color: '#333', fontSize: 16*fontScale}}>{monkeyValue}</Text>
			</View>
		)
	}
}
/**
 * SectionHeaderView
 * @param {*} year 
 */
export function sectionHeaderView(year){
	return (
		<View style={{height: 35}}>
			<View style={styles.sectionContainer}>
				<Text style={{flex: TITLE_COE, textAlign: 'left', color: '#333', fontSize: 12*fontScale}}>
					{Boolean(year) ? year+'年' : ''}
				</Text>
				<Text style={{flex: INTO_COE, textAlign: 'left', color: '#999', fontSize: 12*fontScale}}>
					{'进件数/额'}
				</Text>
				<Text style={{flex: LOAN_COE, textAlign: 'left', color: '#999', fontSize: 12*fontScale}}>
					{'放款数/额'}
				</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container:{
		backgroundColor: '#fff',
		height: 65, 
		paddingLeft: distances.contractLeftMargin
	},
	containerView: {
		flex: 1, 
		borderColor: colors.borderColor, 
		borderBottomWidth: distances.borderWidth,
		flexDirection: 'row', 
		alignItems: 'center'
	},
	sectionContainer:{
		flex: 1,
		flexDirection: 'row', 
		alignItems: 'center',
		paddingLeft: distances.contractLeftMargin, 
		paddingRight: distances.contractLeftMargin+ICON_WIDTH,
		height: 35, 
		borderColor: colors.borderColor, 
		borderBottomWidth: distances.borderWidth, 
		borderTopWidth: distances.borderWidth,
	}
})

function checkData(data){
	if(	Boolean(data.bails_count) || Boolean(data.bails_value) 
		|| Boolean(data.loans_count) ||Boolean(data.loans_value)
	){
		// 任意一项数据大于0则可点击
		return true
	} else {
		// 任意一项都不大于0
		return false
	}
}