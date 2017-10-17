import React, {Component} from 'react'
import { View, BackHandler, WebView } from 'react-native'

export default class MyWebView extends Component {
	constructor(props){
		super(props)

		this._goBack = this._goBack.bind(this)
		this._onNavigationStateChange = this._onNavigationStateChange.bind(this)
		this.canGoBack = false
	}

	componentWillMount(){
		// android 返回键
		BackHandler.addEventListener('hardwareBackPress', this._goBack);
	}

	componentWillUnmount(){
		this.canGoBack = false
		BackHandler.removeEventListener('hardwareBackPress', this._goBack)
	}

	_goBack(){
		if(this.canGoBack){
			this.webview.goBack()
			return true
		}
		return false
	}

	_onNavigationStateChange(navState){
		this.canGoBack = navState.canGoBack
	}

	render(){
		const {gotoUrl, renderErrorPage=()=>null} = this.props
		return (
			<View style={{flex: 1}}>
				<WebView
				  ref={webview => { this.webview = webview } }
					automaticallyAdjustContentInsets={false}
					source={{uri: gotoUrl}}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					scalesPageToFit={true}
					startInLoadingState={true}
					onMessage={this._handleMessage}
					onNavigationStateChange={this._onNavigationStateChange}
					renderError={renderErrorPage}
				/>
			</View>
		)
	}
}