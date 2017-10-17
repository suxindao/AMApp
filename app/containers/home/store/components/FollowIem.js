/**
 * Created by Joe on 2017/6/1.
 */

import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, TextInput} from 'react-native'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
// 组件
import RrcordItem from './../../../../components/list/items/RecordItem'
import NoData from './../../../../components/list/NoData'
import Keyboards from './../../../../components/common/Keyboards';
import ListSimple from '../../../../components/list/ListSimple'

const icon = require('./../../../../sources/images/list_no_data.png');
const des = '暂时没有哦！';

export default class FollowIem extends Component {
    constructor(props) {
        super(props)
        this.getList = this.getList.bind(this);
        this.getInner = this.getInner.bind(this);
        this.replayID = '';
        this.state = {
            show: true
        }
    }

    getList(rowData, sectionID, rowID) {
        rowData.store_name = this.props.name;
        return (
            <RrcordItem rowData={rowData} callback={id => {
                this.refs.tipt.clear();
                this.setState({show: !this.state.show})
                this.refs.tipt.focus();
                this.replayID = id;
            }}
            />
        )
    }

    getInner(list) {
        let detail = new Array();
        for (var z of list) {
            detail.push(z.name);
        }
        return (
            <Text>拜访工作内容：{detail.join(',')}</Text>
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {
                    this.props.list.length === 0 ?
                        <NoData visible={true} icon={icon} des={des}/> :
                        <ListSimple
                            style={{flex: 1}}
                            renderListRow={this.getList}
                            data={this.props.list}/>
                }
                <View
                    key={'ipt_btn_' + new Date().getTime()}
                    style={[
                        {
                            width: distances.deviceWidth,
                            height: 60,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            borderTopWidth: distances.borderWidth,
                            borderColor: colors.borderColor,
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                        },
                        this.state.show ? {zIndex: 2} : null
                    ]}
                >
                    <TouchableOpacity
                        style={{
                            width: distances.deviceWidth - 100,
                            height: 38,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.blueColor,
                            borderRadius: 3,
                        }}
                        onPress={this.props.callback}
                    >
                        <Text
                            style={{
                                fontSize: 16 * fontScale,
                                color: '#fff',
                            }}
                        >
                            输入跟进记录
                        </Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    ref="tipt"
                    style={
                        {
                            height: 60,
                            paddingLeft: distances.contractLeftMargin,
                            paddingRight: distances.contractLeftMargin,
                            bottom: 0,
                            backgroundColor: this.state.show ? 'transparent' : '#fff',
                        }
                    }
                    onBlur={() => {
                        this.setState({show: !this.state.show})
                    }}
                    placeholder={'输入评论内容'}
                    underlineColorAndroid={'transparent'}
                    blurOnSubmit={true}
                    onSubmitEditing={(e) => {
                        this.props.replayCallback(e.nativeEvent.text, this.replayID);
                    }}
                    defaultValue=""
                    returnKeyType="send"
                />
                <Keyboards bottomH={0}/>
            </View>
        )
    }
}