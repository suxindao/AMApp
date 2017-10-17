/**
 *  create by Qi at 16/09/23
 */
import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity, PixelRatio, Platform, ScrollView,
    Image, Dimensions, StyleSheet, Animated
} from 'react-native';
import Modal from 'react-native-root-modal';
import ApiClient from '../../helpers/ApiClient';
import LoadingFloatingLayer from '../common/LoadingFloatingLayer';
import TimerMixin from 'react-timer-mixin'

import ListModal from './src/1.0.0/list'

import {colors, distances, fontScale} from '../../constants/style'

const WIDTH = Dimensions.get('window').width
const Height = 310

var _scrollView = ScrollView;

let x = 0

const styles = StyleSheet.create({
    button: {
        fontSize: 14 * fontScale,
        color: '#73b1fa',
    }
})

/**
 * params:
 *        visible: 是否显示  Boolean
 *        touchClose: 点击关闭， Function
 */
export default class CityRegions extends Component {
    constructor() {
        super(...arguments)
        this.clickItem = this.clickItem.bind(this)
        this.post = this.post.bind(this)
        this.subInfo = this.subInfo.bind(this)
        this.previseClick = this.previseClick.bind(this)
        this.fetchURL = '/am_api/am/store/city_region'
        this.ChooseData = {}
        this.mixin = TimerMixin
        this._isMounted = false
        this.state = {
            visible: false,
            y: new Animated.Value(0),
            classA: [],
            classB: [],
        }
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillMount() {
        this.post(
            {
                data: {
                    _AT: global.UserInfo.token,
                    region_id: '110099' //北京区
                }
            },
            this.fetchURL,
            response => {
                if (this._isMounted) {
                    this.setState({
                        classA: response
                    })
                }
            }
        )
    }

    componentWillUnmount() {
        this.mixin && clearTimeout(this.mixin)
        x = 0
        _scrollView = null
        this._isMounted = false
    }

    /**
     * 调用接口
     * @param obj 上传数据
     * @param path 接口路径
     * @param callback 回调函数
     */
    post(obj, path, callback) {
        let _client = new ApiClient()
        _client.post(path, obj).then((data) => {
            if (typeof callback === 'function') {
                callback(data)
            }
        }).catch(err => {
            console.log('region===>', err);
        });
    }

    slideModal = () => {
        this.state.y.setValue(0);
        this.setState({
            visible: true
        });
    };

    hideModal = () => {
        this.props.touchClose()
        x = 0;
        this.state.y.setValue(distances.deviceHeight);
        this.setState({
            visible: false
        });
    };

    hide = () => {
        x = 0;
        this.state.y.setValue(distances.deviceHeight);
        this.setState({
            visible: false
        });
    };

    clickItem(item, page) {
        this.getNextRegionData(item, page);
    }

    getNextRegionData(item, page) {
        if (page === 0) {
            this.refs.LoadingFloatingLayer.show();
            let req = {
                _AT: global.UserInfo.token,
                region_id: item.region_id,
            }
            this.post(
                {data: req},
                this.fetchURL,
                response => {
                    this.refs.LoadingFloatingLayer.hide();
                    if (response.length > 0) {
                        this.nextClick(item, page);
                        this.setState({
                            classB: response
                        })
                    } else {
                        this.subInfo()
                    }
                }
            )
        }
        if (page === 1) {
            this.ChooseData = {};
            this.ChooseData[this.props.data_key] = item;
            this.subInfo()
        }
    }

    subInfo() {
        this.hide()
        this.props.cityRegionsCallback(this.ChooseData)
    }

    previseClick(page) {
        if (x > 0) {
            x -= WIDTH
        }
        _scrollView.scrollTo({x: x, y: 0, animated: true})
    }

    nextClick() {
        if (x < WIDTH * 2) {
            x += WIDTH
        }
        _scrollView.scrollTo({x: x, y: 0, animated: true})
    }

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
                <LoadingFloatingLayer ref="LoadingFloatingLayer"/>
                <ListModal
                    hideModal={this.hideModal}
                    listStyle={{height: Height, width: WIDTH, backgroundColor: '#fff'}}
                    headerView={() => null}
                    contentView={(() => {
                        return (
                            <View
                                onStartShouldSetResponder={() => true}
                                style={{flex: 1}}
                            >
                                <ScrollView
                                    ref={(scrollView) => {
                                        _scrollView = scrollView
                                    }}
                                    horizontal={true} showsHorizontalScrollIndicator={false}
                                    style={{flex: 1, flexDirection: 'row'}}
                                    scrollEnabled={false}
                                >
                                    <ViewControl leftTitle='' title='请选择' data={this.state.classA} page={0}
                                                 previseTouch={this.previseClick} closeTouch={this.hideModal}
                                                 itemTouch={this.clickItem}/>
                                    <ViewControl leftTitle='上一步' title='请选择' data={this.state.classB} page={1}
                                                 previseTouch={this.previseClick} closeTouch={this.hideModal}
                                                 itemTouch={this.clickItem}
                                    />
                                </ScrollView>
                            </View>
                        )
                    })()}
                    footerView={() => null}
                    location={{justifyContent: 'flex-end'}}
                />
            </Animated.Modal>
        )
    }
}

/**
 * 功能region 表头
 * params:
 *       leftTitle: 左边 leftBar '上一步'
 *       title:
 *       data: 当页数据， Array
 *       page: 第几页， Number
 *       previseTouch: 点击上一步 Function
 *       closeTouch:  点击关闭 Function
 *       itemTouch:   点击第几行, Function
 */
class ViewControl extends Component {
    constructor(props) {
        super(props)

        this.previseClick = this.previseClick.bind(this)
        this.closeClick = this.closeClick.bind(this)
    }

    previseClick() {
        let {page, previseTouch} = this.props
        previseTouch(page)
    }

    closeClick() {
        let {closeTouch} = this.props
        closeTouch()
    }

    render() {
        let {leftTitle, title, data, page, closeTouch, itemTouch} = this.props
        return (
            <View style={{width: WIDTH, height: Height, flexDirection: 'column'}}>
                <View style={{
                    flexDirection: 'row', height: 60, alignItems: 'center',
                    borderColor: colors.borderColor, borderBottomWidth: distances.borderWidth,
                }}>
                    <TouchableOpacity style={{paddingLeft: distances.leftMargin}} onPress={this.previseClick}>
                        <Text style={styles.button}>{leftTitle}</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 18 * fontScale, color: '#333'}}>{title}</Text>
                    </View>
                    <TouchableOpacity style={{paddingRight: distances.leftMargin}} onPress={this.closeClick}>
                        <Text style={styles.button}>关闭</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{flex: 1}}>
                    <ItemsComponent data={data} page={page} itemTouch={itemTouch}/>
                </ScrollView>
            </View>
        )
    }
}

/**
 * 功能： 列表
 * params:
 *        data: 每个列表数据， Array
 *        page: 第几个列表， Number
 *        itemTouch: 点击第几行, Function
 */
class ItemsComponent extends Component {
    constructor(props) {
        super(props)

    }

    itemClick(item) {
        let {itemTouch, page} = this.props
        itemTouch(item, page)
    }

    render() {
        let {data} = this.props
        return (
            <View>
                {(() => {
                    if (Array.isArray(data) && data.length > 0) {
                        return data.map((item, idx) => {
                            return (
                                <TouchableOpacity activeOpacity={0.5} key={idx}
                                                  style={{
                                                      height: 50,
                                                      justifyContent: 'center',
                                                      borderColor: colors.borderColor,
                                                      borderBottomWidth: distances.borderWidth,
                                                  }}
                                                  onPress={this.itemClick.bind(this, item)}
                                >
                                    <Text style={{
                                        marginLeft: distances.leftMargin, alignSelf: 'flex-start',
                                        fontSize: 16 * fontScale, color: '#666',
                                    }}>{item.name ? item.name : ''}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                    return null
                })()}
            </View>
        )
    }
}