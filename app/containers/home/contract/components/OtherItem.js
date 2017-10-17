/**
 * create at 03/14/17
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Image, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
import {contractStatusType} from '../../../../constants/operation/contractManage'

// common js

/**
 * params:
 * 			rowData: data
 * 			itemPress: function
 */
export default class OtherItem extends Component{
	constructor(props){
		super(props)

		this.itemClick = this.itemClick.bind(this)
	}

	itemClick(){
		let {rowData} = this.props
		// console.log('itemClick rowData===>', rowData)
		Actions.contractInfo({routerData: rowData})
	}

	render(){
		let {rowData, itemType} = this.props
		let contractTypeStr = ''
		if(typeof rowData.type === 'number'){
			//  1-主体合同 2-服务合同 3-分期合同 4-直通车合同 5-推广合同
			if(rowData.type == 1){
				contractTypeStr = '框架协议'
			}else if(rowData.type == 2){
				contractTypeStr = '服务合同'
			}else if(rowData.type == 3){
				contractTypeStr = '分期协议'
			}else if(rowData.type == 4){
				contractTypeStr = '直通车协议'
			}else if(rowData.type == 5){
				contractTypeStr = '推广合同'
			}
		} 
		let stateColor = '#999'
		if(typeof rowData.state_high_light === 'number' && rowData.state_high_light == 1){
			stateColor = '#f35e5e'
		}
		let time_type_title = '结束日期：'
		if(itemType == contractStatusType.reviewReject){
			time_type_title = '提交日期：'
		}
		return(
			<View>
				<TouchableHighlight
					onPress={this.itemClick}
					underlayColor={colors.touchBgColor}
					style={{
						backgroundColor: '#fff',
					}}
				>
					<View style={{
						flex: 1, marginLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 15, 
						borderColor: colors.borderColor, borderBottomWidth: distances.borderWidth,
					}}>
						<TopComponent type={contractTypeStr} stateColor={stateColor}
							code={Boolean(rowData.code) ? rowData.code : ''}
							status={Boolean(rowData.state) ? rowData.state : ''}
						/>
						<Text numberOfLines={1} style={{fontSize: 13*fontScale, color: '#999', marginTop: 13, marginLeft: 60}}>
							{Boolean(rowData.enterprise_name) ? rowData.enterprise_name : ''}
						</Text>
						<Text style={{fontSize: 13*fontScale, color: '#999', marginTop: 9, marginLeft: 60}}>
							<Text>{time_type_title}</Text>
							<Text>{Boolean(rowData.to_date) ? rowData.to_date : ''}</Text>
						</Text>
					</View>
				</TouchableHighlight>
			</View>
		)
	}
}

/**
 * top component
 */
class TopComponent extends Component{
	render(){
		let {type, code, status, stateColor} = this.props
		return(
			<View style={{flexDirection: 'row', alignItems: 'center'}}>
				<View style={{
					paddingTop: 2, paddingBottom: 2, paddingLeft: 4, paddingRight: 4, 
					backgroundColor: '#73b1fa', borderRadius: 2,
				}}>
					<Text style={{color:'#fff', fontSize: 11*fontScale}}>
						{type}
					</Text>
				</View>
				<Text numberOfLines={1} style={{
					color:'#333', fontSize: 16*fontScale, marginLeft: 10, flex: 1
				}}>
					{code}
				</Text>
				<Text style={{fontSize: 14*fontScale, color: stateColor}}>
					{status}
				</Text>
			</View>
		)
	}
}