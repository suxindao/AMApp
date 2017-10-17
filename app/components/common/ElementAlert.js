/**
 * Created by Joe on 2017/3/14.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Animated
} from 'react-native';

import Modal from 'react-native-root-modal';
// style
import {colors, distances, fontScale} from '../../constants/style'

export default class ElementAlert extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            visible: false,
            y: new Animated.Value(0)
        };
    }

    slideModal = () => {
        this.state.y.setValue(0);
        this.setState({
            visible: true
        });
    };

    hideModal = () => {
        if (typeof this.props.hideCallback == 'function')
            this.props.hideCallback();
        this.state.y.setValue(distances.deviceHeight);
        this.setState({
            visible: false
        });
    };

    hide = () => {
        this.state.y.setValue(distances.deviceHeight);
        this.setState({
            visible: false
        });
    };

    render() {
        return (
            <Animated.Modal
                visible={this.state.visible}
                style={{
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    transform: [{translateY: this.state.y}]
                }}
            >
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: distances.deviceWidth,
                        height: distances.deviceHeight,
                    }}
                    onPress={() => {
                        if (!this.props.tapBackHide) {
                            this.hideModal();
                        }
                    }}
                >
                </TouchableOpacity>
                {this.props.innerElement}
            </Animated.Modal>
        )
    }
}