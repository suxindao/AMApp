/**
 * create at 06/22/17
 */
import React, {Component} from 'react'
import {View, Text, Image, InteractionManager} from 'react-native'
import {Actions} from 'react-native-router-flux'

// 界面组件
import WrapLoading from '../../../../components/load/wraploading'
import Page from './OrderInfoPage'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loadData} from '../../../../redux/modules/home/order/referOrderInfoReducer'

// presenter
import {fetchReferOrderInfo} from '../presenters'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

const mapStateToProps = state => ({
    loading: state.referOrderInfo.loading,
    loading_success: state.referOrderInfo.loading_success
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({loadData}, dispatch),
    dispatch,
})

class InfoContainer extends Component {
    constructor(props) {
        super(props)

        // request
        this._requestData = this._requestData.bind(this)
        this._getLoad = this._getLoad.bind(this)
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._requestData()
        })
    }

    _requestData() {
        this.props.myactions.loadData(this._getLoad)
    }

    async _getLoad() {
        try {
            let {routerData} = this.props
            let body = {
                _AT: global.UserInfo.token,
                id: routerData.id
            }
            let ret = await fetchReferOrderInfo(body, '')()
            this.data = ret
            return true
        } catch (e) {
            console.log('_getLoad e===>', e)
            throw e
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.labBgColor}}>
                <WrapLoading {...this.props} onErrorPress={this._requestData}>
                    <Page init_data={this.data}/>
                </WrapLoading>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoContainer)