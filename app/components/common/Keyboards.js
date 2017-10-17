/**
 * Created by Joe on 2017/8/2.
 */
import React, {Component, PropTypes} from 'react';
import {
    Keyboard,
    LayoutAnimation,
    View,
    Dimensions,
    Platform,
    StyleSheet
} from 'react-native';

const ReactNative = require('react-native');
const ReactPropTypes = require('prop-types');
const {ViewPropTypes} = ReactNative;

const styles = StyleSheet.create({
    container: {
        left: 0,
        right: 0,
        bottom: 0,
    },
});

// From: https://medium.com/man-moon/writing-modern-react-native-ui-e317ff956f02
const defaultAnimation = {
    duration: 500,
    create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
    },
    update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 200
    }
};

export default class Keyboards extends Component {
    static propTypes = {
        topSpacing: ReactPropTypes.number,
        onShowKeyboard: ReactPropTypes.func,
        onHideKeyboard: ReactPropTypes.func,
        style: ViewPropTypes.style,
    };

    static defaultProps = {
        topSpacing: 0,
        onShowKeyboard: () => null,
        onHideKeyboard: () => null,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            keyboardSpace: 0,
            isKeyboardOpened: false
        };
        this._listeners = null;
        this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
        this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
    }

    componentDidMount() {
        const updateListener = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
        const resetListener = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
        this._listeners = [
            Keyboard.addListener(updateListener, this.updateKeyboardSpace),
            Keyboard.addListener(resetListener, this.resetKeyboardSpace)
        ];
    }

    componentWillUnmount() {
        this._listeners.forEach(listener => listener.remove());
        Keyboard.dismiss()
    }

    updateKeyboardSpace(event) {
        if (!event.endCoordinates) {
            return;
        }

        let animationConfig = defaultAnimation;
        let keyboardSpace = this.props.bottomH;
        if (Platform.OS === 'ios') {
            animationConfig = LayoutAnimation.create(
                event.duration,
                LayoutAnimation.Types[event.easing],
                LayoutAnimation.Properties.opacity,
            );
            // get updated on rotation
            const screenHeight = Dimensions.get('window').height;
            keyboardSpace = (screenHeight - event.endCoordinates.screenY) + this.props.topSpacing + keyboardSpace;
        }
        LayoutAnimation.configureNext(animationConfig);
        this.setState({
            keyboardSpace,
            isKeyboardOpened: true
        }, this.props.onShowKeyboard(true, keyboardSpace));
    }

    resetKeyboardSpace(event) {
        let animationConfig = defaultAnimation;
        if (Platform.OS === 'ios') {
            animationConfig = LayoutAnimation.create(
                event.duration,
                LayoutAnimation.Types[event.easing],
                LayoutAnimation.Properties.opacity,
            );
        }
        LayoutAnimation.configureNext(animationConfig);

        this.setState({
            keyboardSpace: 0 - this.props.bottomH,
            isKeyboardOpened: false
        }, this.props.onHideKeyboard(false, 0));
    }

    render() {
        return (
            <View style={[styles.container, {height: this.state.keyboardSpace}, this.props.style]}/>);
    }
}
