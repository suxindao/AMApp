/**
 * create at 03/13/17
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'

// 组件

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// common
import {contractStatusType, handleContractTitle} from '../../../../constants/operation/contractManage'

const picObj = {
	drafts_uri: require('../../../../sources/images/contract/drafts.png'),
	handling_uri: require('../../../../sources/images/contract/handling.png'),
	handle_finish_uri: require('../../../../sources/images/contract/handle_finish.png'),
	handle_fail_uri: require('../../../../sources/images/contract/handle_fail.png'),
	no_handle_uri: require('../../../../sources/images/contract/no_handle.png'),
}

export default class ListItem extends Component{
	constructor(props){
		super(props)

		this.itemClick = this.itemClick.bind(this)
	}

	itemClick(){
		let {data} = this.props
		switch(data.code){
			case contractStatusType.drafts:
				{
					Actions.draftsList()
				}
				break;
			default:
				{
					let title = handleContractTitle(data.code)
					Actions.contractOtherList({routerData: {code: data.code}, title: title})
				}
				break;
		}
	}

	render(){
		let {data} = this.props
		let img_uri = selectPic(data.code)
		return(
			<TouchableHighlight 
				style={{height: 60}}
				underlayColor={colors.touchBgColor}
				onPress={this.itemClick}
			>
				<View style={{
					flexDirection: 'row', alignItems: 'center', flex: 1
				}}>
					<Image 
						style={{marginLeft: distances.leftMargin, width: 25, height: 25}}
						source={img_uri}
					/>
					<View style={{
						marginLeft: 30, flexDirection: 'row', alignItems: 'center', flex: 1, height: 60,
						borderColor: colors.borderColor, borderBottomWidth: distances.borderWidth,
					}}>
						<Text style={{flex: 1, fontSize: 16*fontScale, color: '#333'}}>
							{data.title}
						</Text>
						<Text style={{fontSize: 14*fontScale, color: '#999'}}>
							{data.number}
						</Text>
						<Image style={{width: 12/2, height: 20/2, marginLeft: 10, marginRight: distances.leftMargin}} 
							source={require('../../../../sources/images/arrow_right.png')}
						/>
					</View>
				</View>
			</TouchableHighlight>
		)
	}
}

function selectPic(code){
	let img_uri = picObj.handling_uri
	switch(code){
		case contractStatusType.drafts:
			{
				img_uri = picObj.drafts_uri
			}
			break;
		case contractStatusType.reviewing:
			{
				img_uri = picObj.handling_uri
			}
			break;
		case contractStatusType.reviewReject:
			{
				img_uri = picObj.handle_fail_uri
			}
			break;
		case contractStatusType.noHandle:
			{
				img_uri = picObj.no_handle_uri
			}
			break;
		case contractStatusType.toBeExpire:
			{
				img_uri = picObj.handle_fail_uri
			}
			break;
		case contractStatusType.handling:
			{
				img_uri = picObj.handling_uri
			}
			break;
		case contractStatusType.all:
			{
				img_uri = picObj.handle_finish_uri
			}
			break;
		default:
			break;
	}
	return img_uri
}