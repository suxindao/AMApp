/**
 * create at 03/13/17
 * 合同详情
 */

import React, {Component} from 'react';
import {View, Text, TouchableOpacity, InteractionManager, DeviceEventEmitter} from 'react-native'
import {Actions} from 'react-native-router-flux'

// 组件
import WrapLoading from '../../../../components/load/wraploading'
import Page from './InfoPage'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loadData} from '../../../../redux/modules/contract/infoReducer'

// presenter
import {fetchContractInfo} from '../presenters/infoPresenters'

// common js
import {notification} from '../../../../constants/common'
import {contractType} from '../../../../constants/operation/contractManage'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

const mapStateToProps = state => ({
    loading: state.contractInfo.loading,
    loading_success: state.contractInfo.loading_success,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({loadData}, dispatch),
    dispatch,
})

class ContractInfo extends Component {
    constructor(props) {
        super(props)

        this.requestData = this.requestData.bind(this)
        this._loadData = this._loadData.bind(this)
    }

    //
    componentWillMount() {
        if (Boolean(this.props.routerData)) {
            // console.log('componentWillMount routerData===>', this.props.routerData)
            let {routerData} = this.props
            // 获取合同类型
            if (typeof routerData.type == 'number') {
                //  1-主体合同 2-服务合同 3-分期合同 4-直通车合同 5-推广合同
                if (routerData.type == 1) {
                    // 1 主体合同
                    this.infoType = contractType.main
                } else if (routerData.type == 2) {
                    // 2 服务合同
                    this.infoType = contractType.server
                } else if (routerData.type == 3) {
                    // 3-分期合同
                    this.infoType = contractType.server_FQ
                } else if (routerData.type == 4) {
                    // 4-直通车合同
                    this.infoType = contractType.server_ZT
                } else if (routerData.type == 5) {
                    // 5-推广合同
                    this.infoType = contractType.server_TG
                }
            }
            if (typeof routerData.id == 'number') {
                this.infoId = routerData.id
            }
        }
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener(notification.contractInfoNotify, () => {
            // info页面刷新
            this.props.myactions.loadData(this._loadData)
            // 通知列表刷新
            DeviceEventEmitter.emit(notification.contractListNotify)
        })
        InteractionManager.runAfterInteractions(() => {
            this.requestData()
        })
    }

    componentWillUnmount() {
        this.subscription.remove()
    }

    requestData() {
        this.props.myactions.loadData(this._loadData)
    }

    async _loadData() {
        try {
            let body = {
                _AT: global.UserInfo.token,
                contract_id: this.infoId
            }
            let ret = await fetchContractInfo(body, '', this.infoType)()
            this.infoData = ret
            // console.log('_loadLocationData ret===>', ret)
            return true
        } catch (e) {
            console.log('OtherList >>> _loadLocationData >>> e ===>', e)
            throw e
        }
    }

    render() {
        return (
            <View style={{backgroundColor: colors.labBgColor, flex: 1}}>
                <WrapLoading {...this.props} onErrorPress={this.requestData}>
                    <Page init_data={this.infoData} infoType={this.infoType}/>
                </WrapLoading>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContractInfo)