/**
 * create at 08/07/17
 */
import React, { Component } from 'react'
import {View, Text, Image, TouchableHighlight, InteractionManager, StyleSheet} from 'react-native'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'

// components
import {NavBarRightImg} from '../../../components/NavBar/NavBarWithoutLeft'
import WrapLoading from '../../../components/load/wraploading'
import ListViewComponent from '../../../components/list/list'
import ListNoData from '../../../components/list/NoData'
import ListFoot from '../../../components/list/foot'
import ListItem from '../components/SignStoreItem'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
	loadData, loadMoreData, reloadData
} from '../../../redux/modules/look/signStoreList.js'
// presenter
import {fetchSignStoreList} from '../presenters/storePresenter'

// style
import {colors, distances, fontScale} from '../../../constants/style'
// common
import {LIST_ITEM_COUNT} from '../../../constants/default.config'
import { getToday } from '../../../constants/operation/time'
import {signStoreType} from '../../../constants/operation/lookManage'
const screenImg = require('../../../sources/images/home/navbar_screens.png')

const mapStateToProps = state => ({
  loading: state.lookSignStoreList.loading,
	loading_success: state.lookSignStoreList.loading_success,
	list_loading: state.lookSignStoreList.list_loading,
	list_refresh: state.lookSignStoreList.list_refresh,
	list_error: state.lookSignStoreList.list_error
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({loadData, loadMoreData, reloadData}, dispatch),
  dispatch,
})

class SignStoreList extends Component{
	constructor(props){
		super(props)

		// data
		this.body = {
			_AT: '',
			date: '',
			status: null, // 签约通过状态: Number null-全部 0-初始 1-通过 2-已结束
			type: null,   // 合同类型: Number null-全部 1-主体合同 2-服务合同 3-分期合同 4-直通车合同 5-推广合同
			am_id: null,
			group_id: null,
			page: {
				limit: LIST_ITEM_COUNT,
				next_key: ''
			}
		}
		this.nav_title = ''
		this.oldTypeObj = null
		this.typeShow = '全部'

		// request
		this._requestData = this._requestData.bind(this)
		this._getLoad = this._getLoad.bind(this)
		this.loadMoreData = this.loadMoreData.bind(this)
    this.reloadData = this.reloadData.bind(this)
    this._getMore = this._getMore.bind(this)
		this._getReload = this._getReload.bind(this)
		// click
		this._rightBarClick = this._rightBarClick.bind(this)
		this._rightBarBack = this._rightBarBack.bind(this)
		// UI
		this.renderListRow = this.renderListRow.bind(this)
		this.renderFooter = this.renderFooter.bind(this)
	}

	componentWillMount(){
		if(this.props.routerData){
			let {code, bodyData, dateTime} = this.props.routerData
			this.body._AT = global.UserInfo.token
			if(code === signStoreType.commit){
				// 提交签约门店
				this.nav_title = '提交签约门店'
			} else {
				// 签约通过门店
				this.nav_title = '签约通过门店'
				this.body.status = 1
			}
			if(Array.isArray(bodyData.group_id)){
				// 组
				this.body.group_id = bodyData.group_id
			} else {
				// 成员
				let arr = []
				arr.push(global.UserInfo.user_id)
				this.body.am_id = Array.isArray(bodyData.am_id) ? bodyData.am_id : arr
			}
			this.body.date = Boolean(dateTime) ? dateTime : getToday()
		} else {
			// routerData null or underfine
			this.body._AT = global.UserInfo.token
			this.body.date = getToday()
		}
	}

	componentDidMount(){
		InteractionManager.runAfterInteractions(() => {
      this._requestData()
    })
	}

	_requestData(){
		this.props.myactions.loadData(this._getLoad)
	}

	async _getLoad(){
		try{
			let ret = await fetchSignStoreList(this.body, '')()
			this.data = ret
			return true
		}catch(e){
			throw e
		}
	}

	loadMoreData(){
    let ended = (typeof this.data.ended === 'boolean' && this.data.ended) ? true : false
    if (ended)
      return
    this.props.myactions.loadMoreData(this._getMore)
  }

  async _getMore(){
    try{
      let body = _.cloneDeep(this.body)
      body.next_key = Boolean(this.data.next_key) ? this.data.next_key : ''
      let ret = await fetchSignStoreList(body, '')()
      if(typeof this.data.ended === 'boolean'){
        this.data.ended = ret.ended 
      } 
      if(Boolean(this.data.list)){
        this.data.list = Boolean(ret.list) ? this.data.list.concat(ret.list) : this.data.list
      } 
      if(Boolean(this.data.next_key)){
        this.data.next_key = Boolean(ret.next_key) ? ret.next_key : ''
      } 
      return true
    }catch(e){
      console.log('_getMore e===>', e)
      throw e
    }
  }

  reloadData(){
    this.props.myactions.reloadData(this._getReload)
  }

  async _getReload(){
    try{
      let body = _.cloneDeep(this.body)
      body.next_key = ''
      let ret = await fetchSignStoreList(body, '')()
      if(typeof this.data.ended === 'boolean'){
        this.data.ended = ret.ended 
      } 
      if(Boolean(this.data.list)){
        this.data.list = Boolean(ret.list) ? ret.list : this.data.list
      } 
      if(Boolean(this.data.next_key)){
        this.data.next_key = Boolean(ret.next_key) ? ret.next_key : ''
      } 
      return true
    }catch(e){
      console.log('_getReload e===>', e)
      throw e
    }
  }

	renderListRow(rowData, sectionID, rowID){
		return (
			<ListItem rowData={rowData}/>
		)
	}

	renderFooter(){
		let ended = (typeof this.data.ended === 'boolean' && this.data.ended) ? true : false
    return (
      <ListFoot loadEnd={ended} error={this.props.list_error} moreTouchPress={this.loadMoreData}/>
    )
	}

	_rightBarClick(){
		Actions.lookSignStoreScreen({
			routerData: {
				comfirmBack: this._rightBarBack,
				oldTypeObj: this.oldTypeObj,
			}
		})
	}

	_rightBarBack(typeObj){
		this.oldTypeObj = typeObj
		this.typeShow = manageShowType(typeObj)
		if(typeObj.id === 0){
			this.body.type = null
		} else {
			this.body.type = Boolean(typeObj.id) ? typeObj.id : null
		}
		// 请求
		this._requestData()
	}

	render(){
		return (
			<View style={{flex: 1, backgroundColor: colors.labBgColor}}>
				<NavBarRightImg 
					title={this.nav_title} img={screenImg} showRight={true}
					rightFun={this._rightBarClick}
				/>
				<WrapLoading {...this.props} onErrorPress={this._requestData}>
					{
						Boolean(this.data) ? (
							Array.isArray(this.data.list) && this.data.list.length > 0 ? (
								<View style={{flex: 1}}>
									<HeaderView type={this.typeShow} sum={Boolean(this.data.sum) ? this.data.sum : 0}/>
									<ListViewComponent
										data={this.data.list}
										renderListRow={this.renderListRow}
										renderFooter={this.renderFooter}
										loadMoreData={this.loadMoreData}
										reloadLists={this.reloadData}
										loading={this.props.list_loading}
										refreshing={this.props.list_refresh}
										style={{flex: 1}}
									/>
								</View>
							) : (
								<ListNoData 
									visible={true} des='暂时没有哦'
									icon={require('../../../sources/images/list_no_data.png')} 
								/>
							)
						) : null
					}
        </WrapLoading>
			</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SignStoreList)

class HeaderView extends Component{
	render(){
		let {type = '', sum = 0} = this.props
		return (
			<View style={[styles.headerView]}>
				<Text style={styles.headerText}>
					<Text style={styles.headerTitle}>签约类型：</Text>
					<Text style={styles.headerContent}>{type}</Text>
				</Text>
				<Text style={[styles.headerText, {marginLeft: 50}]}>
					<Text style={styles.headerTitle}>总数：</Text>
					<Text style={styles.headerContent}>{sum+'个'}</Text>
				</Text>
			</View>
		)
	}
}

function manageShowType(obj){
	let result = '全部'
	if(obj.id){
		if(obj.id == 3){
			result = '分期'
		} else if(obj.id == 4){
			result = '直通车'
		} else if(obj.id == 5){
			result = '推广'
		} else {
			result = '全部'
		}
	}
	return result
}

const styles = StyleSheet.create({
	headerView: {
		flexDirection: 'row',
		paddingLeft: distances.contractLeftMargin,
		paddingRight: distances.contractLeftMargin,
		paddingTop: 15,
		paddingBottom: 15,
		alignItems: 'center',
		borderColor: colors.borderColor,
		borderBottomWidth: distances.borderWidth,
	},
	headerText: {
		fontSize: 12*fontScale
	},
	headerTitle: {
		color: '#999',
	},
	headerContent: {
		color: '#333'
	}
})