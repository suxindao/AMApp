/**
 * create at 04/20/17
 */
import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// verify
import {verifyFunction} from '../../../../constants/utils/validate'
// common op
import {currentSortStatus} from '../../../../constants/operation/lookManage'
// const 
export const ItemHight = 45
const SortWidth = 40
const NameWidth = 50
const ShowWidth = 60
export const LeftWidth = SortWidth+NameWidth
const LimitWidth = 85

const sortIcon = {
	upSel: require('../../../../sources/images/look/up_sel.png'),
	upNor: require('../../../../sources/images/look/up_nor.png'),
	downSel: require('../../../../sources/images/look/down_sel.png'),
	downNor: require('../../../../sources/images/look/down_nor.png'),
}

// title 名次不可点击标题
export class TitleSort extends Component{
	render(){
		let {title} = this.props
		return (
			<View style={styles.sortView}>
				<Text style={styles.titleText}>{title}</Text>
			</View>
		)
	}
}
// title 名字不可点击标题
export class TitleName extends Component{
	render(){
		let {title} = this.props
		return (
			<View style={styles.nameView}>
				<Text style={styles.titleText}>{title}</Text>
			</View>
		)
	}
}
// title 环比不可点击标题
export class TitleRadio extends Component{
	render(){
		let {title} = this.props
		return (
			<View style={styles.radioView}>
				<Text style={styles.titleText}>{title}</Text>
			</View>
		)
	}
}
// title 进件额度可点击排序标题
export class TitleLimit extends Component{
	constructor(props){
		super(props)

		// click
		this._sortClick = this._sortClick.bind(this)
	}

	_sortClick(){
		let {currentCode, sortPress, selectStatus} = this.props
		if(verifyFunction(sortPress, 'look tabsComponent TitleLimit click', 'sortPress')){
			sortPress(currentCode, selectStatus)
		}
	}

	render(){
		let {title, selectStatus, currentCode, selectCode} = this.props
		// 赋值 status
		let showStatus = (selectCode === currentCode) ? selectStatus : currentSortStatus.default
		let isTextSelect = (selectCode === currentCode) ? true : false
		return (
			<TouchableHighlight underlayColor={colors.touchBgColor} onPress={this._sortClick}
				style={styles.titleLimitTouch}
			>
				<View style={styles.titleLimitView}>
					<Text style={[styles.titleText, isTextSelect ? {color: colors.blueColor} : null]}>{title}</Text>
					{showLimitIcon(showStatus)}
				</View>
			</TouchableHighlight>
		)
	}
}
function showLimitIcon(status){
	let imgUp = sortIcon.upNor, imgDown = sortIcon.downNor
	if(status === currentSortStatus.ascend){
		// 升序
		imgUp = sortIcon.upSel
		imgDown = sortIcon.downNor
	} else if(status === currentSortStatus.descend){
		// 降序
		imgUp = sortIcon.upNor
		imgDown = sortIcon.downSel
	}
	return (
		<View style={styles.limitIconView}>
			<Image source={imgUp}/>
			<Image style={{marginTop: 3}} source={imgDown}/>
		</View>
	)
}

// content 名次内容展示
export class ContentSort extends Component{
	render(){
		let {content} = this.props
		return (
			<View style={styles.sortView}>
				<Text style={styles.contentText}>{content}</Text>
			</View>
		)
	}
}
// content 姓名内容展示
export class ContentName extends Component{
	render(){
		let {content} = this.props
		return (
			<View style={styles.nameView}>
				<Text style={styles.contentText}>{content}</Text>
			</View>
		)
	}
}

// content 额度
export class ContentLimit extends Component{
	render(){
		let {content} = this.props
		return (
			<View style={styles.contentLimitView}>
				<Text style={styles.contentText}>{content}</Text>
			</View>
		)
	}
}

// content 环比
export class ContentRadio extends Component{
	render(){
		let {content} = this.props
		let textColor = colors.redColor2
		ratioNum = parseInt(content)
		if(ratioNum < 0){
			textColor = colors.greenColor 
		}
		return (
			<View style={styles.radioView}>
				<Text style={[styles.contentText, {color: textColor}]}>{content}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	sortView: {
		width: SortWidth,
		height: ItemHight,
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	nameView: {
		width: NameWidth,
		height: ItemHight,
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	radioView: {
		width: ShowWidth,
		height: ItemHight,
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	titleText: {
		color: '#999', 
		fontSize: 12*fontScale
	},
	titleLimitTouch: {
		width: LimitWidth,
		height: ItemHight,
	},
	titleLimitView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	limitIconView: {
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 5,
	},
	contentText: {
		color: '#333', 
		fontSize: 14*fontScale
	},
	contentLimitView: {
		width: LimitWidth,
		height: ItemHight,
		justifyContent: 'center',
		alignItems: 'flex-start',
	}
})