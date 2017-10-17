/**
 * update at 2017/09/20
 */

import React, {Component} from 'react'

const ReactPropTypes = require('prop-types');
import {View, FlatList, Text, Image, TouchableHighlight, DeviceEventEmitter} from 'react-native'
import {notification} from './../../../constants/common'

// 组件
import ListItem from '../components/HistoryItem'
import ListNoData from '../../../components/list/NoData'
import WrapLoading from '../../../components/load/wraploading'

// presenters
import {fetchHistoryListData} from './../presenters/historyPresenter'

// styles
import {colors, distances, fontScale} from '../../../constants/style'

export default class HistoryComponent extends Component {
    constructor(props) {
        super(props)
        this.renderListRow = this.renderListRow.bind(this)
        this._getReload = this._getReload.bind(this)
        this.renderList = this.renderList.bind(this)
        this.historyList = []
        this.state = {
            loading: this.props.loading,
            loading_success: this.props.loading_success,
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        this._getReload();
    }

    renderListRow(rowData) {
        return (
            <ListItem rowData={rowData}/>
        )
    }

    async _getReload() {
        try {
            let body = {
                _AT: global.UserInfo.token
            }
            this.historyList = await fetchHistoryListData(body, '')();
            this.setState({
                loading: false,
                loading_success: true,
            })
        } catch (e) {
            this.setState({
                loading: false,
                loading_success: false,
            })
            this.historyList = []
            console.log('_getReload e===>', e)
            throw e
        }
    }

    renderList() {
        let historyList = this.historyList
        return (
            <View style={{flex: 1}}>
                <FlatList
                    initialNumToRender={5}
                    keyExtractor={item => {
                        return item.id
                    }}
                    data={historyList} // 渲染的数据聚合
                    renderItem={this.renderListRow}  // 单一条数模板
                    ListEmptyComponent={<ListNoData visible={true}
                                                    icon={require('../../../sources/images/list_no_data.png')}
                                                    des='暂时没有哦'/>}
                />
            </View>
        )

    }

    render() {
        return (
            <WrapLoading {...this.state} onErrorPress={this._getReload}>
                {this.renderList()}
            </WrapLoading>
        )
    }
}


HistoryComponent.propTypes = {
    loading: ReactPropTypes.bool,
    loading_success: ReactPropTypes.bool,
}

HistoryComponent.defaultProps = {
    loading: true,
    loading_success: false,
}