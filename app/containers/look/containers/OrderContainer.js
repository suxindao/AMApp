/**
 * create at 06/19/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, InteractionManager} from 'react-native'
import { Actions } from 'react-native-router-flux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import _ from 'lodash'

// 界面组件
import WrapLoading from '../../../components/load/wraploading'
import TextTabBar from '../../../components/scrollTabBar/textDefaultTabBar'
import Page from './OrderList'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadData } from '../../../redux/modules/look/orderList'

// style
import {colors, distances, fontScale} from '../../../constants/style'

// presenter 
import {fetchOrderListData} from '../presenters/orderPresenter'

// common
import {LIST_ITEM_COUNT} from '../../../constants/default.config'
import {lookDateType, manageOrderTitleTime} from '../../../constants/operation/lookManage'
import {getDayStartAndEnd} from '../../../constants/operation/time'

// const 
const INTO_ORDER = 'into_order' // 进件订单
const LOAN_ORDER = 'loan_order' // 放款订单

const mapStateToProps = state => ({
  loading: state.lookOrderList.loading,
  loading_success: state.lookOrderList.loading_success,
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({loadData}, dispatch),
  dispatch,
})

class OrderContainer extends Component{
	constructor(props){
		super(props)

		this.tabs = [
			{code: INTO_ORDER, name: '进件订单'},
			{code: LOAN_ORDER, name: '放款订单'}
		]

		this.body = {
			_AT: global.UserInfo.token,
			store_id: 0,
			type: 1,   // 1-进件(默认) 2-放款
			from_date: 0,
			to_date: 0,
			page:{
				limit: LIST_ITEM_COUNT,
				next_key: ''
			}
		}

		// UI
		this._renderTabs = this._renderTabs.bind(this)
		// request
		this._requestData = this._requestData.bind(this)
		this._loadData = this._loadData.bind(this)
		// click
		this._changeTab = this._changeTab.bind(this)
	}

	componentWillMount(){
		if(this.props.routerData){
			// 处理routerData
			let {id, rowData, dateType, dateStr} = this.props.routerData
			// 处理 id
			this.body.store_id = Boolean(id) ? id : 0
			if(dateType == lookDateType.day){
				// 日订单
				let {startNum, endNum} = getDayStartAndEnd(dateStr)
				this.body.from_date = startNum
				this.body.to_date = endNum
				this.timeStr = dateStr
			} else {
				// 月订单
				if(rowData && rowData.range){
					// 处理开始时间结束时间
					let {start, end} = rowData.range
					this.body.from_date = (Boolean(start)) ? parseInt(start) : 0
					this.body.to_date = (Boolean(end)) ? parseInt(end) : 0
					// 处理显示 时间
					this.timeStr = manageOrderTitleTime(rowData)
				}
			}
		}
	}

	componentDidMount(){
		InteractionManager.runAfterInteractions(() => {
      this._requestData()
    })
	}

	_requestData(){
		this.props.myactions.loadData(this._loadData)
	}

	async _loadData(){
		try{
			let newBody = _.cloneDeep(this.body)
			let ret = await fetchOrderListData(newBody, '')()
			this.data = ret
			return true
		}catch(e){
			console.log('_loadLocationData e===>', e)
			throw e
		}
	}

	_changeTab(idx){
		if(idx === 0){
			this.body.type = 1
		} else {
			this.body.type = 2
		}
		this._requestData()
	}

	_renderTabs(tabs){
		let {data} = this.props
		return tabs.map((item)=>{
			return (
				<WrapLoading {...this.props} onErrorPress={this._requestData} 
					key={item.code}>
					<Page code={item.code} init_data={this.data} pageBody={this.body} timeStr={this.timeStr}/>
				</WrapLoading>
			)
		})
	}

	render(){
		return (
			<View style={{flex: 1, backgroundColor: colors.labBgColor}}>
				<ScrollableTabView
					renderTabBar={()=>
						<TextTabBar
							tabArr={this.tabs}
							containerStyle={{ 
								height: 44, backgroundColor: '#fff', borderColor: colors.borderColor, borderBottomWidth: distances.borderWidth,
							}}
							itemStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
							activeTextColor='#73b1fa'
							inactiveTextColor='#666'
							textStyle={{ fontSize: 13 * fontScale }}
							underlineHeight={distances.scrollTabActiveBorderWidth}
							underlineColor={colors.blueColor} 
						/>
					}
					onChangeTab={(obj)=>{
						this._changeTab(obj.i)
					}}
					locked={true}
				>
					{this._renderTabs(this.tabs)}
				</ScrollableTabView>
			</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderContainer)