/**
 * Created at 03/16/17
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TouchableHighlight, StyleSheet, TextInput, Platform} from 'react-native';

// style
import {distances, colors, fontScale} from '../../../constants/style'

/**
 *  功能: 密码、账号 TextInput 封装
 *  params: 
 * 				style: style
 *        placeText: placeholder 文字;
 *        showText: value 显示的文字;
 *        searchSubmit: 点击键盘 ‘search’/ 'go' 
 *        updateSearch: 键盘输入变换后反馈
 * 				secureTextEntry: TextInpute 密码状态显示
 * 				securePress: function eyeBtn click
 * 				eyeVisible: Boolean eye icon show or hide
 */
export default class InputComponent extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let {
			style, placeText, showText, searchSubmit, updateSearch, secureTextEntry, securePress, eyeVisible, returnKeyType
		} = this.props
    return (
      <View style={[
        { 
					flexDirection: 'row', alignItems: 'center', height: 38,
					borderColor: '#ccc', borderWidth: distances.borderWidth, borderRadius: 3,
				},
        style
      ]}>
        <InputTextComponent placeText={placeText} showText={showText} returnKeyType={returnKeyType}
          searchSubmit={searchSubmit} updateSearch={updateSearch} secureTextEntry={secureTextEntry}
        />
				<EyeComponent visible={eyeVisible} securePress={securePress} secureTextEntry={secureTextEntry}/>
      </View>
    )
	}
}

/**
 * eye 
 */

const eyeImg = {
	on: require('../../../sources/images/login/eye_close.png'),
	off: require('../../../sources/images/login/eye_open.png')
}

class EyeComponent extends Component{
	render(){
		let {visible, securePress, secureTextEntry} = this.props
		if(!visible){
			return null
		}
		return(
			<TouchableOpacity onPress={securePress}
				activeOpacity={colors.touchActive}
				style={{justifyContent: 'center'}}
			>
				<Image style={{marginRight: 10}} source={secureTextEntry ? eyeImg.on : eyeImg.off}/>
			</TouchableOpacity>
		)
	}
}

/**
 *  功能: 安卓、iOS TextInput 封装
 *  params: 
 *        placeText: placeholder 文字;
 *        showText: value 显示的文字;
 *        searchSubmit: 点击键盘 ‘search’/ 'go' 
 *        updateSearch: 键盘输入变换后反馈
 */
class InputTextComponent extends Component{
  constructor(props){
    super(props)

    this.searchChange = this.searchChange.bind(this)
  }

  searchChange(val){
    this.props.updateSearch(val)
  }

  render(){
    let {placeText, showText, searchSubmit, secureTextEntry, returnKeyType} = this.props
    if(Platform.OS === 'ios') {
      return <TextInput style={[styles.textInput]}
        placeholder={placeText}
        placeholderTextColor='#ccc'
        onChange={(event) => {
          this.searchChange(event.nativeEvent.text)
        }}
        returnKeyType={returnKeyType}
        autoFocus={false}
				secureTextEntry={secureTextEntry}
        value={ showText }
        selectionColor={colors.orangeColor}
        onSubmitEditing={searchSubmit}
        clearButtonMode="while-editing"/>
    }
    return (
      <View style={{flex: 1, flexDirection:'row'}}>
        <TextInput style={[
          {paddingTop:0, paddingBottom:0, backgroundColor:'transparent'},
          styles.textInput
          ]}
          underlineColorAndroid = {'transparent'}
          placeholder={placeText}
          placeholderTextColor='#ccc'
          onChange={(event) => {
            this.searchChange(event.nativeEvent.text)
          }}
          onBlur ={ () => {
            null
          } }
          blurOnSubmit={false}
          autoFocus={false}
					secureTextEntry={secureTextEntry}
          value={showText}
          selectionColor={colors.orangeColor}
          returnKeyType={returnKeyType}
          onSubmitEditing={searchSubmit}
          clearButtonMode="while-editing"/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textInput:{
    flex: 1,
    fontSize: 14*fontScale,
    color: '#333',
    marginLeft: 6,
  }
})