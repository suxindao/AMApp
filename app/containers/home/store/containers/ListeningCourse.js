/**
 * Created by Joe on 2017/4/25.
 */

import React, {Component} from 'react';
import {Text, View, Image, TouchableHighlight, InteractionManager} from 'react-native'
import _ from 'lodash'
import {Actions} from 'react-native-router-flux'

// components
import WrapLoading from '../../../../components/load/wraploading'
import Page from './ListeningCoursePage'
import {NavBarRightImg} from '../../../../components/NavBar/NavBarWithoutLeft'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {loadData, setPageRefresh} from '../../../../redux/modules/home/store/listeningCourseRedux'
// presenters
import {fetchListenCourseRequest} from '../presenters/listeningCoursePresenter'

const rightImg = require('../../../../sources/images/contract/contract_add.png')

const mapStateToProps = state => ({
    loading: state.listeningCourse.loading,
    loading_success: state.listeningCourse.loading_success,
    pageRefresh: state.listeningCourse.pageRefresh
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({loadData, setPageRefresh}, dispatch), dispatch
})

class ListeningCourse extends Component {
    constructor(props) {
        super(props)

        this.showRightBar = false
        this.editable = false

        this._requestData = this._requestData.bind(this)
        this._getData = this._getData.bind(this)
        this._handleRightClick = this._handleRightClick.bind(this)
    }

    componentWillMount() {
        if (Boolean(this.props.editable)) {
            this.showRightBar = true
            this.editable = true
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._requestData()
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.reload && this.props.pageRefresh) {
            console.log('componentWillReceiveProps ===> 课程编辑成功刷新界面')
            this._requestData()
        }
    }

    _handleRightClick() {
        this.props.myactions.setPageRefresh()
        Actions.listenCourseEdit({routerData: {type: 'add', storeId: this.storeId}})
    }

    _requestData() {
        this.props.myactions.loadData(this._getData)
    }

    async _getData() {
        try {
            this.storeId = Boolean(this.props.id) ? this.props.id : 0
            let body = {
                _AT: global.UserInfo.token,
                id: this.storeId
            }
            let ret = await fetchListenCourseRequest(body, '')()
            this.data = ret
            return true
        } catch (e) {
            console.log('_getData e===>', e)
            throw e
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.labBgColor}}>
                <NavBarRightImg title='试听课程' img={rightImg} rightFun={this._handleRightClick}
                                showRight={this.showRightBar}/>
                <WrapLoading {...this.props} onErrorPress={this._requestData}>
                    <Page init_data={this.data} storeId={this.storeId} editable={this.editable}/>
                </WrapLoading>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListeningCourse)