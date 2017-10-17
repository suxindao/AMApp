import React, {Component, PropTypes} from "react";
import {
    Platform, AppRegistry, Dimensions, View, Text,
    TouchableHighlight, StyleSheet, ActivityIndicator
} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //width: this.props.overlayWidth,
        //height: this.props.overlayHeight,
    },
    text: {
        color: 'black',
        fontSize: 14,
        marginTop: 8,
    },
});

export default class Loading extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        // this.props.loadingMounted()
    }

    componentWillReceiveProps() {
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.overlay}>
                    <ActivityIndicator color={this.props.color} size={"large"}/>
                    <Text style={styles.text}>{this.props.text}</Text>
                </View>
            </View>
        )
    }
}