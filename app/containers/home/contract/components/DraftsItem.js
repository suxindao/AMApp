/**
 * create at 03/20/17
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Image, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// common js
import {contractType} from '../../../../constants/operation/contractManage'
import {notification} from '../../../../constants/common'

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
		if(Boolean(rowData.baseInfo)){
			let {baseInfo, detailInfo} = rowData
			detailInfo = JSON.parse(detailInfo)
			// console.log('itemClick detailInfo===>', detailInfo)
			// console.log('rowData ===>', rowData)
			let drakey = (Boolean(baseInfo.code) && Boolean(baseInfo.companyName)) ? (baseInfo.code+baseInfo.companyName) : ''
			if(baseInfo.type == contractType.main){
				Actions.creatMainContract({
					draftsKey: drakey,
					emitKey: notification.contractListNotify,
					routerData: {
						...detailInfo,
						btnType: 3,
						fromPage: 'drafts',
					}
				})
			} else if(baseInfo.type == contractType.server){
				Actions.creatServiceContract({
					draftsKey: drakey,
					emitKey: notification.contractListNotify,
					routerData: {
						editable:{
							name:false,
							code:false,
							signed_date:false,
							from_date:false,
							to_date:false,
							am_name:false,
							srv_instalment:false,
							fin_codes:false,
							srv_straight:false,
							straight_fee:false,
							srv_mini:false,
							srv_roll:false,
							stores:false,
							contract_pics:false,
						},
						btnType: 3, 
						fromPage: 'drafts',
						...detailInfo
					}
				})
			}  else if(baseInfo.type == contractType.server_FQ){
				Actions.createStageContract({
					draftsKey: drakey,
					emitKey: notification.contractListNotify,
					routerData: {
						btnType: 3, 
						fromPage: 'drafts',
						data: detailInfo
					}
				})
			}  else if(baseInfo.type == contractType.server_ZT){
				Actions.createStraightContract({
					draftsKey: drakey,
					emitKey: notification.contractListNotify,
					routerData: {
						btnType: 3, 
						fromPage: 'drafts',
						data: detailInfo
					}
				})
			}  else if(baseInfo.type == contractType.server_TG){
				Actions.createExtendContract({
					draftsKey: drakey,
					emitKey: notification.contractListNotify,
					routerData: {
						btnType: 3, 
						fromPage: 'drafts',
						data: detailInfo
					}
				})
			} else {
				console.log('DraftsItem type is error')
			}
		} else {
			console.log('DraftsItem baseInfo is null')
		}
	}

	render(){
		let {rowData} = this.props
		// console.log('DraftsItem rowData===>', rowData)
		if(!Boolean(rowData.baseInfo)){
			return null
		}
		let {baseInfo} = rowData
		let contractTypeStr = ''
		//  1-主体合同 2-服务合同 3-分期合同 4-直通车合同 5-推广合同
		if(baseInfo.type == contractType.main){
			contractTypeStr = '框架协议'
		} else if(baseInfo.type == contractType.server){
			contractTypeStr = '服务合同'
		} else if(baseInfo.type == contractType.server_FQ){
			contractTypeStr = '分期协议'
		} else if(baseInfo.type == contractType.server_ZT){
			contractTypeStr = '直通车协议'
		} else if(baseInfo.type == contractType.server_TG){
			contractTypeStr = '推广合同'
		}
		return(
			<View >
				<TouchableHighlight
					onPress={this.itemClick}
					underlayColor={colors.touchBgColor}
					style={{
						backgroundColor: '#fff'
					}}
				>
					<View style={{
						flex: 1, marginLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 15, 
						borderColor: colors.borderColor, borderBottomWidth: distances.borderWidth,
					}}>
						<TopComponent type={contractTypeStr}
							code={Boolean(baseInfo.code) ? baseInfo.code : ''}
							status={Boolean(baseInfo.statusDes) ? baseInfo.statusDes : ''}
						/>
						<Text numberOfLines={1} style={{fontSize: 13*fontScale, color: '#999', marginTop: 13, marginLeft: 60}}>
							{Boolean(baseInfo.companyName) ? baseInfo.companyName : ''}
						</Text>
						<Text style={{fontSize: 13*fontScale, color: '#999', marginTop: 9, marginLeft: 60}}>
							<Text>{'保存时间：'}</Text>
							<Text>{Boolean(baseInfo.time) ? baseInfo.time : ''}</Text>
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
		let {type, code, status} = this.props
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
				<Text style={{fontSize: 14*fontScale, color: '#999'}}>
					{status}
				</Text>
			</View>
		)
	}
}