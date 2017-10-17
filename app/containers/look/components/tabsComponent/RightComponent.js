/**
 * create at 04/20/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet, ScrollView} from 'react-native'

// components
import ListSimple from '../../../../components/list/ListSimple'
import { 
	TitleRadio, TitleLimit, ContentLimit, ContentRadio 
} from './common'

// style
import {distances, colors, fontScale} from '../../../../constants/style'

// common
import {outputdollars} from '../../../../constants/utils/validate'
// common op
import {currentStatsType, currentSortElement} from '../../../../constants/operation/lookManage'

export default class Container extends Component{
	constructor(props){
		super(props)

		// UI
		this._renderListrow = this._renderListrow.bind(this)
	}

	_renderListrow(rowData, sectionID, rowID){
		let {code} = this.props
		if(code === currentStatsType.week){
			return (
				<WeekItemView rowData={rowData}/>
			)
		} else {
			return (
				<MonthItemView rowData={rowData}/>
			)
		}
	}

	render(){
		let {
			rightStyle, code, data,
			weekSelectElement, weekSortPress, weekSelectStatus,
			monthSelectElement, monthSortPress, monthSelectStatus
		} = this.props
		if(Array.isArray(data) && data.length>0){
			return (
				<ScrollView style={rightStyle} horizontal={true} bounces={false} showsHorizontalScrollIndicator={false} >
					<View style={{flex: 1}}>
						{
							(code === currentStatsType.week) ? (
								<WeekTitleView selectCode={weekSelectElement} 
									sortPress={weekSortPress} selectStatus={weekSelectStatus}
								/>
							) : (
								<MonthTitleView selectCode={monthSelectElement} 
									sortPress={monthSortPress} selectStatus={monthSelectStatus}
								/>
							)
						}
						<ListSimple 
							style={null}
							data={data}
							renderListRow={this._renderListrow}
							scrollEnabled={false}
						/>
					</View>
				</ScrollView>
			)
		}
		return null
	}
}
// 周 title
class WeekTitleView extends Component{
	render(){
		let {selectCode, sortPress, selectStatus} = this.props
		return (
			<ScrollView scrollEnabled={false} horizontal={true} bounces={false} showsHorizontalScrollIndicator={false} >
				<View style={styles.itemView}>
					<TitleLimit title='进件额度' currentCode={currentSortElement.bailValue} 
						selectStatus={selectStatus} sortPress={sortPress} selectCode={selectCode} 
					/>
					<TitleRadio title='环比'/>
					<TitleLimit title='放款额度' currentCode={currentSortElement.loanValue} 
						selectStatus={selectStatus} sortPress={sortPress} selectCode={selectCode} 
					/>
					<TitleRadio title='环比'/>
				</View>
			</ScrollView>
		)
	}
}
// 月 title
class MonthTitleView extends Component{
	render(){
		let {selectCode, sortPress, selectStatus} = this.props
		return (
			<ScrollView scrollEnabled={false} horizontal={true} bounces={false} showsHorizontalScrollIndicator={false} >
				<View style={styles.itemView}>
					<TitleLimit title='进件额度' currentCode={currentSortElement.bailValue} 
						selectStatus={selectStatus} sortPress={sortPress} selectCode={selectCode} 
					/>
					<TitleRadio title='环比'/>
					<TitleLimit title='放款额度' currentCode={currentSortElement.loanValue} 
						selectStatus={selectStatus} sortPress={sortPress} selectCode={selectCode} 
					/>
					<TitleRadio title='环比'/>
					<TitleLimit title='活跃门店' currentCode={currentSortElement.activeStore} 
						selectStatus={selectStatus} sortPress={sortPress} selectCode={selectCode} 
					/>
					<TitleRadio title='环比'/>
					<TitleLimit title='非活跃门店' currentCode={currentSortElement.inactiveStore} 
						selectStatus={selectStatus} sortPress={sortPress} selectCode={selectCode} 
					/>
					<TitleRadio title='环比'/>
					<TitleLimit title='未出单' currentCode={currentSortElement.noLoanStore} 
						selectStatus={selectStatus} sortPress={sortPress} selectCode={selectCode} 
					/>
					<TitleRadio title='环比'/>
					<TitleLimit title='转冰冻' currentCode={currentSortElement.almostFrozenStore} 
						selectStatus={selectStatus} sortPress={sortPress} selectCode={selectCode} 
					/>
					<TitleRadio title='环比'/>
				</View>
			</ScrollView>
		)
	}
}
// 周 content
class WeekItemView extends Component{
	render(){
		let {rowData} = this.props
		return (
			<ScrollView scrollEnabled={false} horizontal={true} bounces={false} showsHorizontalScrollIndicator={false} >
				<View style={styles.itemView}>
					<ContentLimit content={
						(Boolean(rowData.bails) && Boolean(rowData.bails.value))
							? outputdollars(rowData.bails.value) : 0
					}/>
					<ContentRadio content={
						(Boolean(rowData.bails) && Boolean(rowData.bails.link_relative_ratio))
							? rowData.bails.link_relative_ratio : 0
					}/>
					<ContentLimit content={
						(Boolean(rowData.loans) && Boolean(rowData.loans.value))
							? outputdollars(rowData.loans.value) : 0
					}/>
					<ContentRadio content={
						(Boolean(rowData.loans) && Boolean(rowData.loans.link_relative_ratio))
							? rowData.loans.link_relative_ratio : 0
					}/>
				</View>
			</ScrollView>
		)
	}
}
// 月 content
class MonthItemView extends Component{
	render(){
		let {rowData} = this.props
		return (
			<ScrollView scrollEnabled={false} horizontal={true} bounces={false} showsHorizontalScrollIndicator={false} >
				<View style={styles.itemView}>
					<ContentLimit content={
						(Boolean(rowData.bails) && Boolean(rowData.bails.value))
							? outputdollars(rowData.bails.value) : 0
					}/>
					<ContentRadio content={
						(Boolean(rowData.bails) && Boolean(rowData.bails.link_relative_ratio))
							? rowData.bails.link_relative_ratio : 0
					}/>
					<ContentLimit content={
						(Boolean(rowData.loans) && Boolean(rowData.loans.value))
							? outputdollars(rowData.loans.value) : 0
					}/>
					<ContentRadio content={
						(Boolean(rowData.loans) && Boolean(rowData.loans.link_relative_ratio))
							? rowData.loans.link_relative_ratio : 0
					}/>
					<ContentLimit content={
						(Boolean(rowData.store) && Boolean(rowData.store.active) && Boolean(rowData.store.active.count))
							? rowData.store.active.count : 0
					}/>
					<ContentRadio content={
						(Boolean(rowData.store) && Boolean(rowData.store.active) && Boolean(rowData.store.active.link_relative_ratio))
							? rowData.store.active.link_relative_ratio : 0
					}/>
					<ContentLimit content={
						(Boolean(rowData.store) && Boolean(rowData.store.inactive) && Boolean(rowData.store.inactive.count))
							? rowData.store.inactive.count : 0
					}/>
					<ContentRadio content={
						(Boolean(rowData.store) && Boolean(rowData.store.inactive) && Boolean(rowData.store.inactive.link_relative_ratio))
							? rowData.store.inactive.link_relative_ratio : 0
					}/>
					<ContentLimit content={
						(Boolean(rowData.store) && Boolean(rowData.store.no_loan) && Boolean(rowData.store.no_loan.count))
							? rowData.store.no_loan.count : 0
					}/>
					<ContentRadio content={
						(Boolean(rowData.store) && Boolean(rowData.store.no_loan) && Boolean(rowData.store.no_loan.link_relative_ratio))
							? rowData.store.no_loan.link_relative_ratio: 0
					}/>
					<ContentLimit content={
						(Boolean(rowData.store) && Boolean(rowData.store.almost_frozen) && Boolean(rowData.store.almost_frozen.count))
							? rowData.store.almost_frozen.count : 0
					}/>
					<ContentRadio content={
						(Boolean(rowData.store) && Boolean(rowData.store.almost_frozen) && Boolean(rowData.store.almost_frozen.link_relative_ratio))
							? rowData.store.almost_frozen.link_relative_ratio : 0
					}/>
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	itemView: {
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: colors.borderColor,
		borderBottomWidth: distances.borderWidth,
	}
})