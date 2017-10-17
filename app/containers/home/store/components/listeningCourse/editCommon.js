/**
 * create at 04/26/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet, Platform, TextInput} from 'react-native'

// style
import {colors, distances, fontScale} from '../../../../../constants/style'

// group title
export function showGroupTitle(title, showDelete = false, deleteFun = ()=> null, index = 0){
	return(
		<View style={{height: 40, alignItems: 'center', flexDirection: 'row'}}>
			<Text style={{
				paddingLeft: distances.contractLeftMargin, color: '#999', fontSize: 13*fontScale, flex: 1
			}}>{title}</Text>
			{
				showDelete ? (
					<TouchableHighlight underlayColor={colors.touchBgColor} onPress={()=>{deleteFun(index)}} style={{
						height: 40, justifyContent: 'center', paddingRight: distances.contractLeftMargin,
					}}>
						<Image source={require('../../../../../sources/images/store/del_store.png')}/>
					</TouchableHighlight>
				) : null
			}
		</View>
	)
}
// group left title
export function groupContentLeft(title){
	return 	<Text style={styles.groupTitle}>{title}</Text>
}

// '至' 控件 两个控件中间显示字的控件
export function middleShow(title){
	return <Text style={{color: '#333', fontSize: 16*fontScale, marginLeft: 10, marginRight: 10}}>{title}</Text>
}

// 普通输入框
export function textInput(
	showText, submit, updateInput, placeText = '', keyboardType = 'default', maxLength = 5,
	clearButtonMode = 'while-editing', style, editable = true
){
	if(Platform.OS === 'ios') {
		return <TextInput style={[styles.textInput, style]}
			placeholder={placeText}
			placeholderTextColor='#ccc'
			onChange={(event) => {
				updateInput(event.nativeEvent.text)
			}}
			returnKeyType='done'
			autoFocus={false}
			value={ showText }
			onSubmitEditing={submit}
			keyboardType={keyboardType}
			maxLength={maxLength}
			editable={editable}
			clearButtonMode={clearButtonMode}/>
	}
	return (
		<View style={{flex: 1, flexDirection:'row'}}>
			<TextInput style={[
				{paddingTop:0, paddingBottom:0, backgroundColor:'transparent'},
				styles.textInput, style
				]}
				underlineColorAndroid = {'transparent'}
				placeholder={placeText}
				placeholderTextColor='#ccc'
				onChange={(event) => {
					updateInput(event.nativeEvent.text)
				}}
				onBlur ={ () => {
					null
				} }
				blurOnSubmit={false}
				autoFocus={false}
				value={showText}
				returnKeyType='done'
				onSubmitEditing={submit}
				keyboardType={keyboardType}
				maxLength={maxLength}
				editable={editable}
				clearButtonMode={clearButtonMode}/>
		</View>
	)
}

// 多行输入框
export function multilineTextInput( showText, updateInput, placeText = '', maxLength = 50, editable = true ){
	// multiline为true时onSubmitEditing属性不可用
	if(Platform.OS === 'ios') {
		return <TextInput style={[styles.textInput]}
			placeholder={placeText}
			placeholderTextColor='#ccc'
			onChange={(event) => {
				updateInput(event.nativeEvent.text)
			}}
			returnKeyType='done'
			autoCapitalize='none'
			autoFocus={false}
			value={ showText }
			blurOnSubmit={true}
			multiline={true}
			keyboardType='default'
			maxLength={maxLength}
			editable={editable}
		/>
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
					updateInput(event.nativeEvent.text)
				}}
				onBlur ={ () => {
					null
				} }
				blurOnSubmit={true}
				autoFocus={false}
				value={showText}
				returnKeyType='done'
			  autoCapitalize='none'
				multiline={true}
				keyboardType='default'
				maxLength={maxLength}
			  editable={editable}
			/>
		</View>
	)
}

export const styles = StyleSheet.create({
	textInput:{
    flex: 1,
    fontSize: 15*fontScale,
    color: '#666',
  },
	groupTitle: {
		color: '#333', 
		fontSize: 16*fontScale, 
		width: 110,
	},
	groupContent: {
		height: 60, 
		flexDirection: 'row', 
		alignItems: 'center',
		borderColor: colors.borderColor, 
		paddingRight: distances.contractLeftMargin,
		borderBottomWidth: distances.borderWidth
	}
})


