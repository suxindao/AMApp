/**
 * Created by Joe on 2017/5/9.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
import _ from 'lodash'
// 组件
import ContentComponent from '../../../../components/common/ContentComponent'
// common
import {getTitle} from './../presenters/contractContact'
import {contractContact} from '../../../../constants/operation/contractManage'

/**
 * 主体合同组件
 */
export default class ContractContact extends Component {
    constructor(props) {
        super(props)
        this.getInner = this.getInner.bind(this);
    }

    getInner() {
        let {config, data} = this.props;
        let new_data = new Array();
        for (var a of contractContact) {
            for (var s of data) {
                if (s.status === a.status) {
                    new_data.push(s);
                    break;
                }
            }
        }
        if (new_data.length == 0) {
            for (var d of contractContact) {
                new_data.push({status: d.status});
            }
        }
        let Tag = new Array();
        for (var z of new_data) {
            let item = z;
            if (item.status !== 'hz')
                continue;
            Tag.push(
                <View key={item.status}>
                    <ContentComponent
                        config={{
                            hasLine: true,
                            title: getTitle(item.status),
                            type: 'input',
                            placeholder: '请输入姓名',
                            editable: config.editable.contact,
                            key: 'contact',
                            value: item.contact
                        }}
                        callback={data => {
                            config.callback(data, item.status)
                        }}
                    />
                    {item.status == 'hz' && <ContentComponent
                        config={{
                            hasLine: true,
                            title: '职务',
                            type: 'input',
                            placeholder: '请输入职务',
                            editable: config.editable.contact,
                            key: 'duty',
                            value: item.duty
                        }}
                        callback={data => {
                            config.callback(data, item.status)
                        }}
                    />}
                    <ContentComponent
                        config={{
                            hasLine: false,
                            title: '联系电话',
                            type: 'input',
                            placeholder: '请输入电话',
                            keyboardType: 'numeric',
                            maxLength: 11,
                            editable: config.editable.contact_detail,
                            key: 'contact_detail',
                            value: item.contact_detail
                        }}
                        callback={data => {
                            config.callback(data, item.status)
                        }}
                    />
                    {
                        item.status === 'hz' ?
                            null :
                            <View
                                style={{
                                    backgroundColor: colors.labBgColor,
                                    width: distances.deviceWidth,
                                    height: 5,
                                    borderTopWidth: distances.borderWidth,
                                    borderBottomWidth: distances.borderWidth,
                                    borderColor: '#d3d3d3',
                                }}
                            >
                            </View>
                    }
                </View>
            );
        }
        return Tag;
    }

    render() {
        return (
            <View style={{backgroundColor: colors.bgColor, flex: 1}}>
                {this.getInner()}
            </View>
        )
    }
}