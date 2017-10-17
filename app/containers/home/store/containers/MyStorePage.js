/**
 * Created by Joe on 2017/5/31.
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, DeviceEventEmitter} from 'react-native'
import {Actions} from 'react-native-router-flux'

// 界面组件
import {SearchInputText} from '../../../../components/search/Search'
import ListView from '../../../../components/list/list'
import ListFoot from '../../../../components/list/foot'
import {btn} from './../../../../components/common/RenderRightButton'
import NoData from './../../../../components/list/NoData'
import ActionSheet from '../../../../components/modal/ActionSheet'
import ListItem from '../components/storeList/MyStorePageItem'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {
    loadData,
    reloadData,
    loadMoreData,
    setState,
    rsetState,
} from '../../../../redux/modules/home/store/myStorePageRedux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// common
import {notification} from '../../../../constants/common'

const mapStateToProps = state => ({
    loading: state.myStorePage.loading,
    loading_success: state.myStorePage.loading_success,
    list_loading: state.myStorePage.list_loading,
    list_refresh: state.myStorePage.list_refresh,
    list_error: state.myStorePage.list_error,
    ended: state.myStorePage.ended,
    next_key: state.myStorePage.next_key,
    limit: state.myStorePage.limit,
    queryOK: state.myStorePage.queryOK,
    list: state.myStorePage.list,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        reloadData,
        loadMoreData,
        setState,
        rsetState,
    }, dispatch),
    dispatch,
})

const emitKey = notification.myStorePage;
const icon = require('./../../../../sources/images/list_no_data.png');
const des = '暂时没有哦！';

class MyStorePage extends Component {
    constructor(props) {
        super(props)

        // data
        this.refresh = ''
        this.state = {
            searchContent: '',
            showActionSheet: false, // 展示 actonSheet浮层
        }

        // UI
        this.renderFooter = this.renderFooter.bind(this)
        this.renderListRow = this.renderListRow.bind(this)
        // request
        this.goReloadData = this.goReloadData.bind(this)
        this.reloadDatas = this.reloadDatas.bind(this)
        this.goLoadMoreData = this.goLoadMoreData.bind(this)
        this.loadMoreDatas = this.loadMoreDatas.bind(this)
        // click
        this._rightBarClick = this._rightBarClick.bind(this)
        this._clickSearchBtn = this._clickSearchBtn.bind(this)
        this._searchInputContent = this._searchInputContent.bind(this)
        // modal
        this._hideActionSheet = this._hideActionSheet.bind(this)
        this._actionItem = this._actionItem.bind(this)
    }

    componentWillMount() {
        Actions.refresh(
            {
                renderRightButton: () => <btn.MoreButton callback={this._rightBarClick}/>,
            }
        );
        this.goReloadData();
        // 添加监听事件用于返回刷新页面数据
        this.refresh = DeviceEventEmitter.addListener(emitKey, () => {
            this.goReloadData();
        });
    }

    componentWillUnMount() {
        this.props.myactions.rsetState();
        this.refresh.remove();
    }

    _rightBarClick() {
        this.setState({
            showActionSheet: true
        })
    }

    _hideActionSheet() {
        this.setState({
            showActionSheet: false
        })
    }

    // 点击搜索触发操作
    _clickSearchBtn(searchResult) {
        this.goReloadData();
    }

    // 搜索框文字变换
    _searchInputContent(content) {
        this.setState({
            searchContent: content
        })
    }

    renderFooter() {
        let ended = (typeof this.props.ended === 'boolean' && this.props.ended) ? true : false
        return (
            <ListFoot loadEnd={ended} error={this.props.list_error} moreTouchPress={this.loadMoreDatas}/>
        )
    }

    renderListRow(rowData, sectionID, rowID) {
        return (
            <ListItem rowData={rowData} emitKey={emitKey}/>
        )
    }

    goReloadData() {
        this.props.myactions.reloadData(
            '/am_api/am/store/offlineStoreList',
            {
                _AT: global.UserInfo.token,
                name: this.state.searchContent,
                page: {
                    limit: this.props.limit,
                    next_key: 0
                }
            },
            this.reloadDatas
        )
    }

    async reloadDatas(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            if (data.list.length > 0) {
                this.props.myactions.setState(
                    {
                        list: data.list,
                        next_key: data.next_key,
                        ended: data.ended,
                        queryOK: true,
                    },
                    true
                )
            } else {
                this.props.myactions.setState(
                    {
                        list: [],
                        ended: true,
                        queryOK: false,
                    },
                    true
                )
            }
            return data
        } catch (e) {
            console.log('reloadDatas:' + e)
        }
    }

    goLoadMoreData() {
        if (this.props.ended)
            return;
        this.props.myactions.loadMoreData(
            '/am_api/am/store/offlineStoreList',
            {
                _AT: global.UserInfo.token,
                name: this.state.searchContent,
                page: {
                    limit: this.props.limit,
                    next_key: this.props.next_key
                }
            },
            this.loadMoreDatas
        )
    }

    async loadMoreDatas(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            if (data.list.length > 0) {
                let list = this.props.list.concat(data.list);
                this.props.myactions.setState(
                    {
                        list: list,
                        next_key: data.next_key,
                        ended: data.ended,
                        queryOK: true,
                    },
                    true
                )
            } else {
                this.props.myactions.setState(
                    {
                        ended: true,
                        queryOK: false,
                    },
                    true
                )
            }
            return data
        } catch (e) {
            console.log('loadMoreData:' + e)
        }
    }

    _actionItem(key) {
        if (key === 1) {
            Actions.createMyStore({emitKey: emitKey})
        } else if (key === 0) {
            Actions.viewStoreApply();
        } else if (key === 'cancel') {
            console.log('ActionSheet click cancel')
        }
        this._hideActionSheet()
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.labBgColor}}>
                <SearchInputText
                    placeText='搜索门店'
                    showText={this.state.searchContent}
                    updateSearch={this._searchInputContent}
                    onSearchSubmit={this._clickSearchBtn}
                />
                {
                    this.props.queryOK ?
                        null :
                        <NoData visible={true} icon={icon} des={des}/>
                }
                <ListView
                    data={this.props.list}
                    renderListRow={this.renderListRow}
                    renderFooter={this.renderFooter}
                    loadMoreData={this.goLoadMoreData}
                    reloadLists={this.goReloadData}
                    loading={this.props.list_loading}
                    refreshing={this.props.list_refresh}
                    style={{flex: 1}}
                />
                <ActionSheet visible={this.state.showActionSheet} modalPress={this._hideActionSheet}
                             itemPress={this._actionItem} contentItems={['门店审核', '创建门店']}
                />
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyStorePage)