import React, {Component} from 'react'
import {View, Text, Image, Linking, ScrollView} from 'react-native'
import {Actions} from 'react-native-router-flux'

// components
import ActionSheet from '../../../../components/modal/ActionSheet'
import {BottomButton} from '../components/common'
import {InfoEveryItem, MissingData} from '../components/InfoComponents'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
import {toastShort} from '../../../../constants/toast'

export default class Page extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showActionSheet: false
        }

        // click
        this._actionShow = this._actionShow.bind(this)
        this._actionHide = this._actionHide.bind(this)
        this._actionItem = this._actionItem.bind(this)
    }

    _actionShow() {
        this.setState({
            showActionSheet: true
        })
    }

    _actionHide() {
        this.setState({
            showActionSheet: false
        })
    }

    _actionItem(key) {
        if (key !== 'cancel') {
            let url = "tel:" + this.currentTel
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => {
                console.error('An error occurred', err)
            })
        }
        this._actionHide()
    }

    render() {
        let {init_data} = this.props
        if (Boolean(init_data)) {
            let bailStatus = '', isBailStatus = false, telAble = false, telArr = []
            // 支付状态
            if (Boolean(init_data.bail_info) && (typeof init_data.bail_info.status === 'number')) {
                // 0-未支付 1-已支付
                if (init_data.bail_info.status == 0) {
                    bailStatus = '未支付'
                    isBailStatus = true
                } else if (init_data.bail_info.status == 1) {
                    bailStatus = '已支付'
                    isBailStatus = false
                }
            }
            // 是否能拨打电话给CC
            if ((typeof init_data.cc_tel === 'string') && init_data.cc_tel.length > 0) {
                telAble = true
                telArr.push(init_data.cc_tel)
                this.currentTel = init_data.cc_tel
            }
            return (
                <View style={{flex: 1}}>
                    <ScrollView>
                        <InfoEveryItem
                            title='订单编号' content={Boolean(init_data.code) ? init_data.code : ''}
                            isGrayBg={true}
                        />
                        <InfoEveryItem
                            title='订单状态' content={Boolean(init_data.status) ? init_data.status : ''}
                            isGrayBg={false} isContentMark={false}
                        />
                        <InfoEveryItem
                            title='城市' content={Boolean(init_data.city_name) ? init_data.city_name : ''}
                            isGrayBg={true}
                        />
                        <InfoEveryItem
                            title='门店' content={Boolean(init_data.store_name) ? init_data.store_name : ''}
                            isGrayBg={false}
                        />
                        <InfoEveryItem
                            title='课程名称' content={Boolean(init_data.lesson_name) ? init_data.lesson_name : ''}
                            isGrayBg={true}
                        />
                        <InfoEveryItem
                            title='课时数' content={Boolean(init_data.lesson_hours) ? init_data.lesson_hours + '课' : ''}
                            isGrayBg={false}
                        />
                        <InfoEveryItem
                            title='申请时间' content={Boolean(init_data.create_time) ? init_data.create_time : ''}
                            isGrayBg={true}
                        />
                        <InfoEveryItem
                            title='履约保证金'
                            content={(Boolean(init_data.bail_info) && Boolean(init_data.bail_info.amount)) ? init_data.bail_info.amount : ''}
                            isGrayBg={false} isContentMark={false} isStatusMark={isBailStatus}
                            status={bailStatus}
                        />
                        <InfoEveryItem
                            title='所属AM' content={Boolean(init_data.am_name) ? init_data.am_name : ''}
                            isGrayBg={true}
                        />
                        <InfoEveryItem
                            title='借款人' content={Boolean(init_data.user_name) ? init_data.user_name : ''}
                            isGrayBg={false}
                        />
                        <MissingData data={Boolean(init_data.missing) ? init_data.missing : []}/>
                        <InfoEveryItem
                            title='拒绝原因' content={Boolean(init_data.refuse_reason) ? init_data.refuse_reason : ''}
                            isGrayBg={false}
                        />
                        <InfoEveryItem
                            title='邀请CC' content={Boolean(init_data.cc_name) ? init_data.cc_name : ''}
                            isGrayBg={true}
                        />
                        <BottomButton touchPress={this._actionShow} title='拨打电话给CC' touchAble={telAble}/>
                    </ScrollView>
                    <ActionSheet visible={this.state.showActionSheet} modalPress={this._actionHide}
                                 itemPress={this._actionItem} contentItems={telArr}
                    />
                </View>
            )
        }
        return null
    }
}

// export default WithConnection(Page)
