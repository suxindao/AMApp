/**
 * create at 08/04/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, ScrollView, StyleSheet} from 'react-native'
import { Actions } from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// common op
import {signStoreType} from '../../../../constants/operation/lookManage'
// verify
import {verifyFunction} from '../../../../constants/utils/validate'

/**
 * stats module title
 */
export class StatsHeader extends Component{
	render(){
		let {title} = this.props
		return(
			<View style={styles.statsHeaderView}>
				<Text style={{fontWeight: 'bold', color: '#333', fontSize: 15*fontScale}}>{title}</Text>
			</View>
		)
	}
}
/**
 * store 头部
 */
export class HeaderComponent extends Component{
	render(){
		let {title, content, noBold = false} = this.props
		return (
			<View style={styles.headerView}>
				<Text style={[styles.headerLeft, noBold ? null : {fontWeight: 'bold'}]}>{title}</Text>
				<Text style={styles.headerRight}>{content}</Text>
			</View>
		)
	}
}
/**
 * 日数据 和 月数据 查看跟进记录
 */
export class RecordsItem extends Component{
	constructor(props){
		super(props)

		this._recordsClick = this._recordsClick.bind(this)
	}

	_recordsClick(){
		let {recordPress = ()=>null } = this.props
		if(verifyFunction(recordPress, 'look day or month records click', 'recordPress')){
			recordPress()
		}
	}

	render(){
		let {count} = this.props
		return(
			<TouchableHighlight underlayColor={colors.touchBgColor} onPress={this._recordsClick}
				style={styles.recordsItemTouch}
			>
				<View style={styles.recordsView}>
					<Text style={{color: colors.blueColor, fontSize: 14*fontScale}}>
						{'查看跟进记录'}
					</Text>
					<Text style={{color: '#999', fontSize: 14*fontScale}}>
						{'('+count+')'}
					</Text>
				</View>
			</TouchableHighlight>
		)
	}
}

/**
 * 月数据中 提交签约门店 | 签约通过门店
 */
export class SignStoreComponent extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let {
			monthSignPress = ()=>null, passStore = 0, store = 0,
		} = this.props
		return (
			<View style={styles.signView}>
				<SignItem title={'提交签约门店'} content={store} signPress={monthSignPress} 
					leftLine={false} code={signStoreType.commit}
				/>
				<SignItem title={'签约通过门店'} content={passStore} signPress={monthSignPress} 
					leftLine={true} code={signStoreType.pass}
				/>
			</View>
		)
	}
}

class SignItem extends Component{
	constructor(props){
		super(props)

		this._signClick = this._signClick.bind(this)
	}

	_signClick(){
		let {signPress = ()=>null, code = ''} = this.props
		if(verifyFunction(signPress, 'look month online sign', 'signPress')){
			signPress(code)
		}
	}

	render(){
		let {
			title = '', content = '', leftLine = false,
		} = this.props
		return (
			<TouchableHighlight underlayColor={colors.touchBgColor} onPress={this._signClick}
				style={[styles.signItemTouch, 
					leftLine ? {borderLeftWidth: distances.borderWidth} : null
				]}
			>
				<View style={styles.signItemView}>
					<Text style={styles.titleText}>
						{title}
					</Text>
					<Text style={[styles.contentText, {marginLeft: 15}]}>
						{content}
					</Text>
				</View>
			</TouchableHighlight>
		)
	}
}

const styles = StyleSheet.create({
	statsHeaderView: {
		height: 40,
		borderColor: colors.borderColor,
		borderTopWidth: distances.borderWidth,
		paddingLeft: distances.contractLeftMargin,
		justifyContent: 'center'
	},
	headerView: {
		flexDirection: 'row', 
		alignItems: 'center', 
		height: 55, 
		paddingLeft: distances.contractLeftMargin,
	},
	headerLeft: {
		textAlign: 'left', 
		flex: 1, 
		color: '#333', 
		fontSize: 15*fontScale, 
	},
	headerRight: {
		marginRight: 35, 
		color: '#999', 
		fontSize: 15*fontScale
	},
	signView: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: colors.borderColor,
		borderBottomWidth: distances.borderWidth,
	},
	signItemTouch: {
		flex: 1,
		borderColor: colors.borderColor,
	},
	signItemView: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: distances.contractLeftMargin,
		paddingRight: distances.contractLeftMargin,
	},
	contentText:{
		color: colors.blueColor, 
		fontSize: 20*fontScale,
		fontWeight: 'bold'
	},
	titleText:{
		color: '#999', 
		fontSize: 12*fontScale,
	},
  recordsItemTouch: {
		height: 50,
		borderColor: colors.borderColor,
		borderBottomWidth: distances.borderWidth,
	},
	recordsView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
})