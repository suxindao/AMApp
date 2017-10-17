/**
 * create at 03/11/17
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TouchableHighlight } from 'react-native'
import { Actions } from 'react-native-router-flux'

// 组件

// style
import {colors, distances, fontScale} from '../../../../constants/style'

export default class CitiesComponent extends Component{
	constructor(props){
		super(props)
	}

	render(){
    let {cities = [], currentCity = '', citySelect} = this.props
    return (
      <ScrollView style={{flex: 1}}>
        <TitleComponent title='当前位置'/>
        <ContentComponent content={currentCity} index={0} hasLine={false} citySelect={citySelect}/>
        <TitleComponent title='省市列表'/>
        {(()=>{
          if(Array.isArray(cities)){
            return cities.map((city, idx)=>{
              return <ContentComponent key={idx} content={city} hasLine={true} citySelect={citySelect}/>
            })
          }
          return null
        })()}
      </ScrollView>
    )
  }
}

/**
 * city title
 */
class TitleComponent extends Component{
  constructor(props){
    super(props)
  }

  render(){
    let { title }= this.props
    return (
      <View style={{
        height: 30, borderColor: colors.borderColor, 
        borderTopWidth: distances.borderWidth, borderBottomWidth: distances.borderWidth,
        justifyContent: 'center',
      }}>
        <Text style={{
            marginLeft: distances.leftMargin, color: '#ccc', fontSize: 14*fontScale,
          }}
        >
          {title}
        </Text>
      </View>
    )
  }
}

/**
 * city item centent
 */
class ContentComponent extends Component{
  constructor(props){
    super(props)

		this.citySelect = this.citySelect.bind(this)
  }

  citySelect(content){
		return ()=>{
			this.props.citySelect(content)
		}
  }

  render(){
    let {content, hasLine} = this.props
    if(!Boolean(content)){
      return (
        <TouchableHighlight 
          style={[
            {
              backgroundColor: '#fff', borderColor: colors.borderColor,
              height: 50, justifyContent: 'center',
            }, 
            hasLine ? {borderBottomWidth: distances.borderWidth} : null
          ]}
          underlayColor={colors.touchBgColor}
        >
          <Text style={{ marginLeft: distances.leftMargin, color: '#666', fontSize: 18*fontScale }} >
            未知
          </Text>
        </TouchableHighlight>
      )
    }
    return (
      <TouchableHighlight 
        style={[
          {
            backgroundColor: '#fff', borderColor: colors.borderColor,
            height: 50, justifyContent: 'center',
          }, 
          hasLine ? {borderBottomWidth: distances.borderWidth} : null
        ]}
        onPress={this.citySelect(content)}
        underlayColor={colors.touchBgColor}
      >
        <Text style={{ marginLeft: distances.leftMargin, color: '#666', fontSize: 18*fontScale }}>
          {content.name}
        </Text>
      </TouchableHighlight>
    )
  }
}