/**
 * create at 05/26/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux'

import _ from 'lodash'

// components
import ListViewComponent from '../../../../components/list/list'
import ListFoot from '../../../../components/list/foot'
import ListNoData from '../../../../components/list/NoData'
import ListItem from '../../../../components/list/items/RecordItem'
import Keyboards from './../../../../components/common/Keyboards';

import {colors, distances, fontScale} from './../../../../constants/style'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loadMoreData, reloadData} from '../../../../redux/modules/home/records/recordsReducer'

// presenters 
import {fetchRecordsData} from '../presenters'

// common
import {LIST_ITEM_COUNT} from '../../../../constants/default.config'

const mapStateToProps = state => ({
    list_loading: state.recordsList.list_loading,
    list_refresh: state.recordsList.list_refresh,
    list_error: state.recordsList.list_error,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({loadMoreData, reloadData}, dispatch),
    dispatch,
})

class Page extends Component {
    constructor(props) {
        super(props)

        // UI
        this.renderListRow = this.renderListRow.bind(this)
        this.renderFooter = this.renderFooter.bind(this)

        // Function
        this.loadMoreData = this.loadMoreData.bind(this)
        this.reloadData = this.reloadData.bind(this)
        this._getMore = this._getMore.bind(this)
        this._getReload = this._getReload.bind(this)
        this.replayID = '';
    }

    renderListRow(rowData, sectionID, rowID) {
        return (
            <ListItem from="list" rowData={rowData} callback={id => {
                this.refs.tipt.clear();
                this.refs.tipt.focus();
                this.replayID = id;
            }}/>
        )
    }

    renderFooter() {
        let ended = (typeof this.data.ended === 'boolean' && this.data.ended) ? true : false
        return (
            <ListFoot loadEnd={true} error={this.props.list_error} moreTouchPress={this._loadMoreData}/>
        )
    }

    loadMoreData() {
        let ended = (typeof this.data.ended === 'boolean' && this.data.ended) ? true : false
        if (ended)
            return
        this.props.myactions.loadMoreData(this._getMore)
    }

    async _getMore() {
        try {
            let {bodyData} = this.props
            let body = _.cloneDeep(bodyData)
            body.page.next_key = Boolean(this.data.next_key) ? this.data.next_key : ''
            let ret = await fetchRecordsData(body, '')()
            if (typeof this.data.ended === 'boolean') {
                this.data.ended = ret.ended
            }
            if (Boolean(this.data.list)) {
                this.data.list = Boolean(ret.list) ? this.data.list.concat(ret.list) : this.data.list
            }
            if (Boolean(this.data.next_key)) {
                this.data.next_key = Boolean(ret.next_key) ? ret.next_key : ''
            }
            return true
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
            let {bodyData} = this.props
            let body = _.cloneDeep(bodyData)
            body.page.next_key = ''
            let ret = await fetchRecordsData(body, '')()
            if (typeof this.data.ended === 'boolean') {
                this.data.ended = ret.ended
            }
            if (Boolean(this.data.list)) {
                this.data.list = Boolean(ret.list) ? ret.list : this.data.list
            }
            if (Boolean(this.data.next_key)) {
                this.data.next_key = Boolean(ret.next_key) ? ret.next_key : ''
            }
            return true
        } catch (e) {
            console.log('_getReload e===>', e)
            throw e
        }
    }

    render() {
        let {init_data} = this.props
        if (Boolean(init_data)) {
            this.data = init_data
            if (Array.isArray(this.data.list) && this.data.list.length > 0) {
                return (
                    <View style={{flex: 1}}>
                        <ListViewComponent
                            data={this.data.list}
                            renderListRow={this.renderListRow}
                            renderFooter={this.renderFooter}
                            loadMoreData={this.loadMoreData}
                            reloadLists={this.reloadData}
                            loading={this.props.list_loading}
                            refreshing={this.props.list_refresh}
                            style={{position: 'absolute', height: distances.deviceHeight - 45, top: 0, left: 0}}
                        />
                        <TextInput
                            ref="tipt"
                            style={{bottom: -45, height: 45, backgroundColor: '#fff'}}
                            placeholder='输入评论内容'
                            underlineColorAndroid={'transparent'}
                            blurOnSubmit={true}
                            onSubmitEditing={(e) => {
                                this.props.callback(e.nativeEvent.text, this.replayID);
                            }}
                            defaultValue=""
                            returnKeyType="send"
                        />
                        <Keyboards bottomH={45}/>
                    </View>
                )
            }
            return (
                <ListNoData visible={true} icon={require('../../../../sources/images/list_no_data.png')} des='暂时没有哦'/>
            )
        }
        return null
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)