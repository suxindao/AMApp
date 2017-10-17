/**
 * create at 08/07/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native'
import { Actions } from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../constants/style'

export default class StoreComponent extends Component{
	constructor(props){
		super(props)

		// func
		this.itemClick = this.itemClick.bind(this)
	}

	itemClick(){
		let {rowData} = this.props
		Actions.contractInfo({
			routerData: {
				id: Boolean(rowData.contract_id) ? rowData.contract_id : 0,
				type: Boolean(rowData.contract_type) ? rowData.contract_type : 0
			}
		})
	}

	render(){
		let {rowData} = this.props
		if(!rowData){
			return null
		}
		let typeStr = ''
		if(typeof rowData.contract_type == 'number'){
        //  1-主体合同 2-服务合同 3-分期合同 4-直通车合同 5-推广合同
        if(rowData.contract_type == 3) {
					// 3-分期合同
					typeStr = '分期'
        } else if(rowData.contract_type == 4) {
					// 4-直通车合同
					typeStr = '直通车'
        } else if(rowData.contract_type == 5) {
          // 5-推广合同
          typeStr = '推广'
        }
      }
		return(
			<TouchableHighlight onPress={this.itemClick} underlayColor={colors.touchBgColor}
					style={[styles.itemTouch]}
				>
				<View style={[styles.itemView]}>
					<Text style={{color: '#333', fontSize: 16*fontScale}}>{
						(Boolean(rowData.store_info) && Boolean(rowData.store_info.name)) ? rowData.store_info.name : ''
					}</Text>
					<Text style={{marginTop: 10, color: '#999', fontSize: 13*fontScale}}>{
						(Boolean(rowData.store_info) && Boolean(rowData.store_info.address)) ? '地址：'+rowData.store_info.address : ''
					}</Text>
					<Text style={{marginTop: 10, color: '#999', fontSize: 13*fontScale}}>{
						(Boolean(rowData.store_info) && Boolean(rowData.store_info.owner_name)) ? '维护AM：'+rowData.store_info.owner_name : ''
					}</Text>
					<Text style={{marginTop: 10, color: '#999', fontSize: 13*fontScale}}>{
						'类型：'+typeStr
					}</Text>
				</View>
			</TouchableHighlight>
		)
	}
}

const styles = StyleSheet.create({
	itemTouch: {
		backgroundColor: '#fff',
		borderColor: colors.borderColor,
		borderBottomWidth: distances.borderWidth,
	},
	itemView: {
		paddingLeft: distances.contractLeftMargin, 
		paddingRight: distances.contractLeftMargin,
		paddingTop: 15,
		paddingBottom: 15,
	}
})