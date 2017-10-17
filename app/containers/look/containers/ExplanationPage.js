/**
 * create at 07/14/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, InteractionManager} from 'react-native'

// 界面组件
import MyWebView from '../../../components/webView'
import NodataComponent from '../../../components/list/NoData'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// style
import {colors, distances, fontScale} from '../../../constants/style'

import {apiHost, apiPort} from '../../../helpers/config'

const URL_PATH = 'http://'+apiHost+':'+apiPort+'/am_api/web/static/manual'

const mapStateToProps = state => ({
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({}, dispatch),
  dispatch,
})

class ExplanationPage extends Component{
	constructor(props){
		super(props)

		// UI 
		this._renderError = this._renderError.bind(this)
	}

	_renderError(){
		return (
			<NodataComponent visible={true} 
				icon={require('../../../sources/images/list_no_data.png')}
				des='暂时没有哦'
			/>
		)
	}

	render(){
		// console.log('url===>', URL_PATH)
		return(
			<View style={{flex: 1, backgroundColor: colors.labBgColor}}>
				<MyWebView gotoUrl={URL_PATH}
					renderErrorPage={this._renderError}
				/>
			</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ExplanationPage)