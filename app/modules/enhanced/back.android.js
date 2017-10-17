/**
 * by QianShu at 2016
 */

import React, {Component, createElement} from 'react'
import {BackHandler, Platform} from 'react-native'
export default function EnhancedBackHandler(){
	return (oldComponent) => {
		return class newComponent extends Component{
			constructor(props){
				super(props)
			}

			componentWillMount(){
				if(Platform.OS === 'android'){
			      BackHandler.addEventListener('hardwareBackPress', () => {
			      		if(Boolean(this.refs.wrapcomponent))
			        		return this.refs.wrapcomponent.handleHardwareBackPress()
			        	return false
			      })
			    }
			}

			componentWillUnmount(){
			    if(Platform.OS === 'android'){
				    BackHandler.removeEventListener('hardwareBackPress', () => {

				    })
			    }
			}

			render(){
				return createElement(oldComponent, {...this.props, ref: 'wrapcomponent'} )
			}
		}
	}
}