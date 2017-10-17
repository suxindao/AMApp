/**
 * create at 04/19/17
 */
import React, {Component} from 'react'
import {View, Image, Text, TouchableOpacity, TouchableHighlight} from 'react-native'
import Modal from 'react-native-root-modal';

//高阶组件  包装android 硬件回退
import EnhancedBackAndroid from '../../../modules/enhanced/back.android'

// style
import {colors, distances, fontScale} from '../../../constants/style'

/**
 * visible bool, 控制 modal层显示和隐藏
 * contentView 包裹的内容
 * contentStyle style, 包裹内容相对于modal层的布局，垂直、水平向的, 默认值为null(非必须)
 * modalPress function, 触发modal消失的方法
 */
class ModalBase extends Component{
	constructor(props){
		super(props)

		this.modalTouch = this.modalTouch.bind(this)
	}

	modalTouch(){
    this.props.modalPress();
  }

	handleHardwareBackPress(){
		if(this.props.visible){
			this.modalTouch()
    	return true
		}
  }

	render(){
		let {visible, contentView, contentStyle = null, modalPress} = this.props
		return (
			<Modal
				visible={visible}
				style={{
					top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)', 
				}}
			> 
				<TouchableHighlight onPress={this.modalTouch} underlayColor={'rgba(0, 0, 0, 0.3)'}
					style={[{flex: 1}, contentStyle]}
				>
					{contentView}
				</TouchableHighlight>
			</Modal>
		)
	}
}

export default (EnhancedBackAndroid()(ModalBase))