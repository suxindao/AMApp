/**
 * 照片选择器， 每一个Item
 */
import React, {Component} from 'react';
import {
    Image,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';

const ReactNative = require('react-native');
const ReactPropTypes = require('prop-types');
const {ViewPropTypes} = ReactNative;

// style
import {view_margin} from './styles'

/**
 * 功能： photoitem
 *    params:
 *          imagesPerRow: number, 每行照片数量
 *                imageMargin:  number, 每个照片margin
 *                  containerWidth: number, 这个组件width, 默认为设备屏宽
 *          item: obj, 每一个photo item
 *          selected: bool,
 *          selectedMarker: element,
 *          onClick: func,
 */
class ImageItem extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        var {width} = Dimensions.get('window');
        var {imageMargin, imagesPerRow, containerWidth} = this.props;
        if (typeof containerWidth != "undefined") {
            width = containerWidth;
        }
        this._imageSize = (width - ((imagesPerRow + 1) * imageMargin + imagesPerRow * 2 * view_margin) ) / imagesPerRow;
    }

    render() {
        var {item, selected, selectedMarker, imageMargin} = this.props;

        var marker = selectedMarker ? selectedMarker :
            <Image
                style={[styles.marker, {width: 25, height: 25}]}
                source={require('../../sources/images/circle-check.png')}
            />;

        var image = item.node.image;
        return (
            <TouchableWithoutFeedback
                style={{marginBottom: imageMargin, marginRight: imageMargin}}
                onPress={() => this._handleClick(image)}>
                <View style={{height: this._imageSize, width: this._imageSize, margin: view_margin}}>
                    <Image
                        source={{uri: image.uri}}
                        style={{height: this._imageSize, width: this._imageSize}}/>
                    <View style={styles.mask}/>
                    {(selected) ? marker : null}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _handleClick(item) {
        this.props.onClick(item);
    }
}

const styles = StyleSheet.create({
    marker: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'transparent',
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    }
})

ImageItem.defaultProps = {
    item: {},
    selected: false,
}

ImageItem.propTypes = {
    item: ReactPropTypes.object,
    selected: ReactPropTypes.bool,
    selectedMarker: ReactPropTypes.element,
    imageMargin: ReactPropTypes.number,
    imagesPerRow: ReactPropTypes.number,
    onClick: ReactPropTypes.func,
}

export default ImageItem;