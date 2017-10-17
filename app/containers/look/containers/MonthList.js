/**
 * create at 04/19/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, InteractionManager} from 'react-native'
import { Actions } from 'react-native-router-flux'

// 界面组件
import WrapLoading from '../../../components/load/wraploading'
import Page from './MonthListPage'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {loadData} from '../../../redux/modules/look/monthList'

// style
import {colors, distances, fontScale} from '../../../constants/style'

// presenters
import {fetchMonthWithoutCache} from '../presenters/monthPresenter'

const mapStateToProps = state => ({
  loading: state.lookMonthList.loading,
  loading_success: state.lookMonthList.loading_success,
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({loadData}, dispatch),
  dispatch,
})

class MonthContainer extends Component{
	constructor(props){
		super(props)

		this._requestData = this._requestData.bind(this)
		this._getLoad = this._getLoad.bind(this)
	}

	componentWillMount(){
		if(this.props.routerData && this.props.routerData.data){
			let {data} = this.props.routerData
			this.storeName = Boolean(data.name) ? data.name : ''
			this.storeId = Boolean(data.id) ? data.id : ''
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
			let {routerData} = this.props
			let body = {
				_AT: global.UserInfo.token,
				id:  (Boolean(routerData.data) && Boolean(routerData.data.id)) ? routerData.data.id : 0,
			}
			let ret = await fetchMonthWithoutCache(body, '')()
			this.data = ret
			return true
		}catch(e){
			console.log('_getLoad e===>', e)
			throw e
		}
	}

	render(){
		return (
			<View style={{flex: 1, backgroundColor: colors.labBgColor}}>
				<WrapLoading {...this.props} onErrorPress={this._requestData}>
          <Page init_data={this.data} storeName={this.storeName} storeId={this.storeId}/>
        </WrapLoading>
			</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthContainer)