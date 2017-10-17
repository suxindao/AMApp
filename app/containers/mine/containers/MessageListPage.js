/**
 * update at 06/21/17
 */

import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, DeviceEventEmitter} from 'react-native'
import {notification} from './../../../constants/common'

// 组件
import ListView from '../../../components/list/list'
import ListFoot from '../../../components/list/foot'
import ListItem from '../components/MsgItem'
import ListNoData from '../../../components/list/NoData'

// presenters
import {fetchMessageListData, setRead} from './../presenters/messagePresenter'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loadData, loadMoreData, reloadData, setState, rsetState} from '../../../redux/modules/mine/message'
import {setMineTabbarPoint} from '../../../redux/modules/tabbarReducer'

// styles
import {colors, distances, fontScale} from '../../../constants/style'

const mapStateToProps = state => ({
    list_loading: state.mineMessage.list_loading,
    list_refresh: state.mineMessage.list_refresh,
    list_error: state.mineMessage.list_error,
    ended: state.mineMessage.ended,
    next_key: state.mineMessage.next_key,
    limit: state.mineMessage.limit,
    list: state.mineMessage.list,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        loadMoreData,
        reloadData,
        setState,
        rsetState,
        setMineTabbarPoint
    }, dispatch),
    dispatch,
})

class Page extends Component {
    constructor(props) {
        super(props)
        this.renderListRow = this.renderListRow.bind(this)
        this.renderFooter = this.renderFooter.bind(this)
        this.loadMoreData = this.loadMoreData.bind(this)
        this._setRead = this._setRead.bind(this)
        this.reloadData = this.reloadData.bind(this)
        this._getMore = this._getMore.bind(this)
        this._getReload = this._getReload.bind(this)
    }

    componentWillMount() {
        this.reloadData();
        // 取消我的红点
        this.props.myactions.setMineTabbarPoint(false)
    }

    componentWillUnmount() {
        this.props.myactions.rsetState();
    }

    renderListRow(rowData, sectionID, rowID) {
        return (
            <ListItem rowData={rowData}/>
        )
    }

    renderFooter() {
        let ended = (typeof this.props.ended === 'boolean' && this.props.ended) ? true : false
        return (
            <ListFoot loadEnd={ended} error={this.props.list_error} moreTouchPress={this.loadMoreData}/>
        )
    }

    loadMoreData() {
        let ended = (typeof this.props.ended === 'boolean' && this.props.ended) ? true : false
        if (ended)
            return
        this.props.myactions.loadMoreData(this._getMore)
    }

    async _getMore() {
        try {
            let body = {
                _AT: global.UserInfo.token,
                page: {
                    next_key: this.props.next_key,
                    limit: this.props.limit
                }
            }
            let ret = await fetchMessageListData(body, '')()
            let list = this.props.list.concat(ret.data);
            if (list.length > 0) {
                this.props.myactions.loadData(this._setRead, list)
            }
            this.props.myactions.setState({
                list: list,
                ended: ret.page.ended,
                next_key: ret.page.next_key,
            }, true);
            return ret
        } catch (e) {
            console.log('_getMore e===>', e)
            throw e
        }
    }

    reloadData() {
        this.props.myactions.reloadData(this._getReload)
    }

    async _getReload() {
        try {
            let body = {
                _AT: global.UserInfo.token,
                page: {
                    next_key: 0,
                    limit: this.props.limit
                }
            }
            let ret = await fetchMessageListData(body, '')()
            if (ret.data.length > 0) {
                this.props.myactions.loadData(this._setRead, ret.data)
            }
            this.props.myactions.setState({
                list: ret.data,
                ended: ret.page.ended,
                next_key: ret.page.next_key,
            }, true);
            return ret;
        } catch (e) {
            console.log('_getReload e===>', e)
            throw e
        }
    }

    async _setRead(list) {
        try {
            let body = {
                _AT: global.UserInfo.token,
                min_id: list[list.length - 1].id,
                max_id: list[0].id
            }
            let ret = await setRead(body, '')()
            DeviceEventEmitter.emit(notification.unReadMessage);
            return ret
        } catch (e) {
            console.log('_setRead e===>', e)
            throw e
        }
    }

    render() {
        let {list} = this.props;
        if (Boolean(list)) {
            this.data = list
            if (Array.isArray(list) && list.length > 0) {
                return (
                    <View style={{flex: 1}}>
                        <ListView
                            data={list}
                            renderListRow={this.renderListRow}
                            renderFooter={this.renderFooter}
                            loadMoreData={this.loadMoreData}
                            reloadLists={this.reloadData}
                            loading={this.props.list_loading}
                            refreshing={this.props.list_refresh}
                            style={{flex: 1, backgroundColor: colors.labBgColor}}
                        />
                    </View>
                )
            }
            return (
                <ListNoData visible={true} icon={require('../../../sources/images/list_no_data.png')} des='暂时没有哦'/>
            )
        }
        return null
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)