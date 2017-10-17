/**
 * Created by Joe on 2017/4/11.
 */
import React, {Component} from 'react';
import {
    View, ActivityIndicator
} from 'react-native';
import ElementAlert from './ElementAlert';

import {colors, distances, fontScale} from '../../constants/style'

export default class LoadingFloatingLayer extends Component {
    constructor(props) {
        super(props)
        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
        this.getActivityIndicator = this.getActivityIndicator.bind(this)
    }


    show() {
        this.refs.ActivityIndicatorInner.slideModal();
    }

    hide() {
        this.refs.ActivityIndicatorInner.hide();
    }

    getActivityIndicator() {
        return (
            <ActivityIndicator animating={true} size='large' color="#fff"/>
        )
    }

    render() {
        return (
            <ElementAlert
                ref="ActivityIndicatorInner"
                innerElement={this.getActivityIndicator()}
                tapBackHide={true}
            />
        )
    }
}