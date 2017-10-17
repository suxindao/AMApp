/**
 * Created by Joe on 2017/3/30.
 */

import React, {Component} from 'react';
import {ScrollView, View, Text, TouchableOpacity, Image, Alert} from 'react-native'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

/**
 * btnType={0} 0无按钮 1编辑合同 2保存草稿，提交审核 3提交审核(编辑合同)
 * fromPage={1==1?'edit':'drafts'}编辑/草稿（用于区分点击提交审核时候，调用'编辑'接口还是'提交审核'接口）
 * editTouch={()=>console.log('点击编辑按钮')}
 * editInfo={()=>console.log('编辑合同')}
 * temporary={()=>console.log('保存草稿')}
 * subInfo={()=>console.log('提交审核')}
 */
export default class ContractButton extends Component {
    constructor(props) {
        super(props)
        this.renderButton = this.renderButton.bind(this);
    }

    renderButton() {
        let btnType = typeof this.props.btnType == 'number' ? this.props.btnType : 2
        if (btnType === 0) {
            return (
                <View style={{
                    marginTop: 11,
                    marginBottom: 11,
                    marginLeft: 25,
                    marginRight: 25,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flex: 1
                }}>
                </View>
            )
        }
        if (btnType === 1) {
            return (
                <View style={{
                    marginTop: 11,
                    marginBottom: 11,
                    marginLeft: 25,
                    marginRight: 25,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flex: 1
                }}>
                    <TouchableOpacity activeOpacity={0.8}
                                      onPress={this.props.editTouch}
                                      style={{
                                          height: 38, width: distances.deviceWidth - 50, alignItems: 'center',
                                          justifyContent: 'center', backgroundColor: colors.blueColor,
                                          borderRadius: 3
                                      }}
                    >
                        <Text style={{fontSize: 16 * fontScale, color: '#fff'}}>编辑合同</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        if (btnType === 3) {
            return (
                <View
                    style={{
                        marginTop: 11,
                        marginBottom: 11,
                        marginLeft: 25,
                        marginRight: 25,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 1
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={
                            () => {
                                if (this.props.fromPage == 'edit') {
                                    this.props.editInfo();
                                }
                                if (this.props.fromPage == 'drafts') {
                                    this.props.subInfo();
                                }
                            }
                        }
                        style={{
                            height: 38, width: distances.deviceWidth - 50, alignItems: 'center',
                            justifyContent: 'center', backgroundColor: colors.blueColor,
                            borderRadius: 3
                        }}
                    >
                        <Text style={{fontSize: 16 * fontScale, color: '#fff'}}>提交审核</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        if (btnType === 2) {
            return (
                <View
                    style={{
                        marginTop: 11,
                        marginBottom: 11,
                        marginLeft: 25,
                        marginRight: 25,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 1
                    }}
                >
                    <TouchableOpacity activeOpacity={0.8} onPress={this.props.temporary}
                                      style={{
                                          height: 38, width: 140, alignItems: 'center',
                                          justifyContent: 'center', backgroundColor: colors.labBgColor, borderRadius: 3
                                      }}
                    >
                        <Text style={{fontSize: 16 * fontScale, color: colors.blueColor}}>保存草稿</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8}
                                      onPress={this.props.subInfo}
                                      style={{
                                          height: 38, width: 140, alignItems: 'center',
                                          justifyContent: 'center', backgroundColor: colors.blueColor,
                                          borderRadius: 3
                                      }}
                    >
                        <Text style={{fontSize: 16 * fontScale, color: '#fff'}}>提交审核</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    render() {
        return (
            <View>
                {this.renderButton()}
            </View>
        )
    }
}