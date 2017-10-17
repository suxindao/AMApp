import React, {Component, createElement} from 'react'
import {View} from 'react-native'
import Loading from './loading'
import Error from './error'

export default class WrapLoading extends Component {
    render() {
        if (Boolean(this.props.loading)) {
            return <Loading/>
        } else if (!Boolean(this.props.loading_success)) {
            return <Error onPress={this.props.onErrorPress}/>
        } else {
            return (<View style={{flex: 1}}>
                {this.props.children}
            </View>)
        }
    }
}
