/**
 * create at 03/16/17
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, ScrollView, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'

// common js
import {contractType} from '../../../../constants/operation/contractManage'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

/**
 * 合同详情上部组件
 * 		params: 
 * 				data: object
 * 				companyPress: function 点击公司
 */
export class TopComponent extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let {data, infoType, companyPress} = this.props
		return(
			<View style={{paddingLeft: 15, paddingRight: 15, backgroundColor: colors.blueColor}}>
				<CompanyComponent data={data} infoType={infoType} companyPress={companyPress}/>
				<InfoComponent data={data}/>
			</View>
		)
	}
}

/**
 * 功能介绍：company click
 * 		params:
 * 			visible: boolean show or hide this component
 * 			companyPress: function 点击公司
 * 			data: object, company info
 */
class CompanyComponent extends Component{
	constructor(props){
		super(props)

		this.companyClick = this.companyClick.bind(this)
	}

	companyClick(){
		let {companyPress, data} = this.props
		if(Boolean(data.enterprise))
		companyPress(data.enterprise)
	}

	render(){
		let {data, infoType, companyPress} = this.props
		let contract_type_des = ''
		if(infoType == contractType.main){
			contract_type_des = '框架协议'
		} else if(infoType == contractType.server){
			contract_type_des = '服务合同'
		}else if(infoType == contractType.server_FQ){
			contract_type_des = '分期协议'
		}else if(infoType == contractType.server_ZT){
			contract_type_des = '直通车协议'
		}else if(infoType == contractType.server_TG){
			contract_type_des = '推广合同'
		}
		return(
			<TouchableHighlight
				onPress={this.companyClick}
				underlayColor={colors.blueColor}
			>
				<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
					<View style={{
						paddingTop: 2, paddingBottom: 2, paddingLeft: 4, paddingRight: 4, 
						backgroundColor: '#e9b951', borderRadius: 2,
					}}>
						<Text style={{color: '#fff', fontSize: 11 * fontScale}}>
							{contract_type_des}
						</Text>
					</View>
					<Text style={{color: '#fff', fontSize: 15 * fontScale, marginLeft: 10,flex: 1}} numberOfLines={1}>
						{(Boolean(data.enterprise) && Boolean(data.enterprise.name)) ? data.enterprise.name : ''}
					</Text>
					<Image source={require('../../../../sources/images/arrow_right.png')}/>
				</View>
			</TouchableHighlight>
		)
	}
}

/**
 * 合同详情 合同摘要
 * 		params: 
 * 				data: data
 */
class InfoComponent extends Component{
	constructor(props){
		super(props)
	}

	render(){
		if(!Boolean(this.props.data)){
			return null
		}
		let {data} = this.props
		return(
			<View style={{
				paddingTop: 15, paddingBottom: (15-9), 
			}}>
				<InfoItem title='合同编号：' content={Boolean(data.code) ? data.code : '' } des=''/>
				<InfoItem title='服务状态：' content={Boolean(data.status_state) ? data.status_state : '' } des=''/>
				<InfoItem title='审核状态：' content={Boolean(data.audit_status_state) ? data.audit_status_state : '' } des=''/>
				<InfoItem title='归档状态：' content={Boolean(data.archive_flag_state) ? data.archive_flag_state : '' } des=''/>
				<InfoItem title='开始日期：' content={Boolean(data.from_date) ? data.from_date : '' } des=''/>
				<InfoItem title='结束日期：' content={Boolean(data.to_date) ? data.to_date : '' } 
					des={Boolean(data.expired_state) ? data.expired_state : '' }
				/>
			</View>
		)
	}
}

/**
 * info item
 */
class InfoItem extends Component{
	render(){
		let {title, content, des} = this.props
		return(
			<View style={{
				flexDirection: 'row', alignItems: 'center', paddingBottom: 9,
			}}>
				<Text style={{color: '#fff', fontSize: 13 * fontScale}}>
					{title}
				</Text>
				<Text style={{flex: 1, color: '#fff', fontSize: 13 * fontScale}} numberOfLines={1}>
					{content}
				</Text>
				<Text style={{color: '#f35e5e', fontSize: 13 * fontScale}}>
					{des}
				</Text>
			</View>
		)
	}
}

/**
 * 主体合同和服务合同 只显示状态下， 浮动button
 * params 
 * 		type: number, 1 编辑状态, 
 * 		btnTouch: function
 */
export class ButtonComponent extends Component{
	render(){
		let {type, btnTouch} = this.props
		if(type == 1){
			return(
        <View style={{
          marginTop: 11, marginBottom: 11
        }}>
          <TouchableOpacity activeOpacity={0.8} onPress={btnTouch}
            style={{
              height: 38, marginLeft: 50, marginRight: 50, alignItems: 'center',
              justifyContent: 'center', backgroundColor: colors.blueColor, borderRadius:3
            }}
          >
            <Text style={{fontSize: 16*fontScale, color: '#fff'}}>编辑合同</Text>
          </TouchableOpacity>
        </View>
      )
		}
		return null
	}
}
