/**
 * Created by Joe on 2017/3/22.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, Alert, DeviceEventEmitter} from 'react-native'
import {Actions} from 'react-native-router-flux'
import CheckBox from 'react-native-check-box'
import _ from 'lodash'
import {notification, storeCity, isNull} from '../../../../constants/common'

// 组件
import {SearchWithCity} from '../../../../components/search/Search'
import ListView from '../../../../components/list/list'
import ListFoot from '../../../../components/list/foot'
import ListItem from '../../../../containers/home/contract/components/OtherItem'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {
    loadData,
    loadMoreData,
    reloadData,
    setSearchStoreState,
    rsetSearchStoreState
} from '../../../../redux/modules/home/contact/SearchStoreRedux'

const mapStateToProps = state => ({
    isRender: state.searchStore.isRender,                      //是否渲染
    list_loading: state.searchStore.list_loading,
    list_refreshing: state.searchStore.list_refreshing,
    list_error: state.searchStore.list_error,
    ended: state.searchStore.ended,
    next_key: state.searchStore.next_key,
    limit: state.searchStore.limit,
    queryOK: state.searchStore.queryOK,
    list: state.searchStore.list,
    account: state.searchStore.account,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        loadMoreData,
        reloadData,
        setSearchStoreState,
        rsetSearchStoreState,
    }, dispatch), dispatch
})

const emitKey = notification.SearchStore;

class SearchStore extends Component {
    constructor(props) {
        super(props)

        // data
        this.state = {
            searchContent: '',
        }

        // function
        this.clickSearchBtn = this.clickSearchBtn.bind(this)
        this.searchInputContent = this.searchInputContent.bind(this)
        this.cityClick = this.cityClick.bind(this)
        this.renderFooter = this.renderFooter.bind(this)
        this.renderListRow = this.renderListRow.bind(this)
        this.changeCheckedType = this.changeCheckedType.bind(this)
        this.renderTag = this.renderTag.bind(this)
        this.goReloadData = this.goReloadData.bind(this)
        this.reloadDatas = this.reloadDatas.bind(this)
        this.goLoadMoreData = this.goLoadMoreData.bind(this)
        this.loadMoreDatas = this.loadMoreDatas.bind(this)
        this.getCheckStoreNum = this.getCheckStoreNum.bind(this)
        this.connectStore = this.connectStore.bind(this)
        this.refresh = '';
        this.currentCity = storeCity.cities[0]
    }

    componentWillMount() {
        this.goReloadData();
        this.refresh = DeviceEventEmitter.addListener(emitKey, param => {
            this.currentCity = param;
            this.goReloadData()
        });
    }

    componentWillUnmount() {
        this.props.myactions.rsetSearchStoreState();
        this.refresh.remove();
    }


    renderFooter() {
        let ended = (typeof this.props.ended === 'boolean' && this.props.ended) ? true : false
        return (
            <ListFoot loadEnd={ended} error={this.props.list_error} moreTouchPress={this.loadMoreDatas}/>
        )
    }

    renderListRow(rowData, sectionID, rowID) {
        return (
            <View style={{backgroundColor: '#fff'}}>
                <View
                    style={{
                        flexDirection: 'row',
                        borderBottomWidth: distances.borderWidth,
                        borderColor: colors.borderColor,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginLeft: distances.contractLeftMargin,
                    }}
                >
                    <View
                        style={{
                            paddingTop: 15,
                            paddingBottom: 15,
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{color: '#333', fontSize: 16 * fontScale}}>{rowData.branch}</Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                marginTop: 10,
                                marginBottom: 10
                            }}
                        >
                            {rowData.services.length < 1 ? this.renderTag(['未合作'], 1) : this.renderTag(rowData.services, 2)}
                        </View>
                        <Text style={{
                            color: '#666',
                            fontSize: 13 * fontScale
                        }}>{isNull(rowData.enterprise) ? '' : rowData.enterprise.name}</Text>
                    </View>
                    <CheckBox
                        style={{
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            width: distances.deviceWidth - 10 - distances.contractLeftMargin,
                            height: 96,
                            position: 'absolute',
                            left: 0,
                            top: 0,
                        }}
                        onClick={() => {
                            this.changeCheckedType(rowData.id, rowID)
                        }}
                        isChecked={rowData.onSelected}
                        rowID={rowID}
                        checkedImage={<Image source={require('../../../../sources/images/radio_yes.png')}/>}
                        unCheckedImage={<Image source={require('../../../../sources/images/radio_no.png')}/>}
                    />
                </View>
            </View>
        )
    }

    changeCheckedType(id, index) {
        let list = _.cloneDeep(this.props.list);
        list[index].onSelected = !list[index].onSelected;
        this.props.myactions.setSearchStoreState({
            list: list
        }, true)
    }

    renderTag(tagArr, status) {
        let color = status == 1 ? '#e9b951' : '#73b1fa';
        let tagEle = new Array();
        for (var z of tagArr) {
            tagEle.push(
                <View key={z} style={{backgroundColor: color, borderRadius: 2, marginRight: 10}}>
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 11 * fontScale,
                            marginLeft: 4,
                            marginRight: 4,
                            marginTop: 2,
                            marginBottom: 2,
                        }}
                    >
                        {z}
                    </Text>
                </View>
            )
        }
        return tagEle;
    }

    goReloadData() {
        this.props.myactions.reloadData(
            '/am_api/am/contract/searchStore',
            {
                _AT: global.UserInfo.token,
                enterprise_id: this.props.routerData.enterprise_id,
                name: this.state.searchContent,
                city_code: this.currentCity.id,
                page: {
                    limit: this.props.limit,
                    next_key: 0,
                }
            },
            this.reloadDatas
        )
    }

    async reloadDatas(client, path, param) {
        try {
            let data = await client.post(path, {data: param})
            let stores = this.props.routerData.stores;
            if (data.list.length > 0) {
                for (var z = 0; z < data.list.length; z++) {
                    for (var a = 0; a < stores.length; a++) {
                        if (data.list[z].id == stores[a].store_info.id) {
                            data.list[z].onSelected = true;
                            break;
                        } else {
                            data.list[z].onSelected = false;
                        }
                    }
                }
                this.props.myactions.setSearchStoreState(
                    {
                        list: data.list,
                        // account:data.account,
                        next_key: data.next_key,
                        ended: data.ended,
                        queryOK: true,
                    },
                    true
                )
            } else {
                this.props.myactions.setSearchStoreState(
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
            throw e
        }
    }

    goLoadMoreData() {
        if (this.props.ended)
            return;
        this.props.myactions.loadMoreData(
            '/am_api/am/contract/searchStore',
            {
                _AT: global.UserInfo.token,
                name: this.state.searchContent,
                enterprise_id: this.props.routerData.enterprise_id,
                city_code: this.currentCity.id,
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
            let data = await client.post(path, {data: param})
            if (data.list.length > 0) {
                for (var z = 0; z < data.list.length; z++) {
                    data.list[z].onSelected = false;
                }
                let list = this.props.list.concat(data.list);

                let stores = this.props.routerData.stores;
                for (var z = 0; z < list.length; z++) {
                    for (var a = 0; a < stores.length; a++) {
                        if (list[z].id == stores[a].store_info.id) {
                            list[z].onSelected = true;
                            break;
                        } else {
                            list[z].onSelected = false;
                        }
                    }
                }

                this.props.myactions.setSearchStoreState(
                    {
                        list: list,
                        // account:data.account,
                        next_key: data.next_key,
                        ended: data.ended,
                        queryOK: true,
                    },
                    true
                )
            } else {
                this.props.myactions.setSearchStoreState(
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

    // 点击搜索触发操作
    clickSearchBtn(searchResult) {
        this.props.myactions.setSearchStoreState(
            {
                list: [],
                next_key: '',
                ended: false,
                queryOK: false,
            },
            true
        )
        this.goReloadData();
    }

    // 搜索框文字变换
    searchInputContent(content) {
        this.setState({
            searchContent: content
        })
    }

    // 进入城市选择列表
    cityClick() {
        Actions.cityList({emitKey: emitKey, currentCity: this.currentCity})
    }

    getCheckStoreNum() {
        let num = 0;
        for (var z of this.props.list) {
            if (z.onSelected)
                num++;
        }
        return num;
    }

    // connectStore() {
    //     let STORE = this.props.routerData.stores;
    //     let stores = new Array();
    //     for (var z of this.props.list) {
    //         let store_info = {};
    //         let account_info = {};
    //         if (!z.onSelected)
    //             continue;
    //         for (var a in STORE) {
    //             if (STORE[a].store_info.id == z.id) {
    //                 account_info = {
    //                     id: STORE[a].account_info.id,
    //                     type: STORE[a].account_info.type,
    //                     name: STORE[a].account_info.name,
    //                     bank_name: STORE[a].account_info.bank_name,
    //                     bank_account: STORE[a].account_info.bank_account,
    //                     enterprise_id: this.props.routerData.enterprise_id,
    //                 }
    //             }
    //         }
    //         store_info = {
    //             id: z.id,
    //             branch: z.branch,
    //             address: z.address,
    //             enterprise_id: this.props.routerData.enterprise_id,
    //         }
    //         let obj = new Object();
    //         obj.store_info = store_info;
    //         if (account_info) {
    //             obj.account_info = account_info;
    //         }
    //         stores.push(obj);
    //     }
    //     this.props.callback({stores: stores})
    //     Actions.pop();
    // }

    connectStore() {
        let stores = _.cloneDeep(this.props.routerData.stores);

        for (let z of this.props.list) {

            let store = stores.find(item => {
                return item.store_info.id === z.id
            })

            if (store) {
                if (!z.onSelected) {
                    let index = stores.indexOf(store)
                    stores.splice(index, 1)
                }
            } else {
                if (z.onSelected) {
                    let store_info = {
                        id: z.id,
                        branch: z.branch,
                        address: z.address,
                        enterprise_id: this.props.routerData.enterprise_id,
                    }
                    let obj = {};
                    obj.store_info = store_info;
                    stores.push(obj)
                }
            }
        }

        this.props.callback({stores: stores})
        Actions.pop();
    }

    render() {
        return (
            <View style={{backgroundColor: colors.labBgColor, flex: 1}}>
                <SearchWithCity city={this.currentCity.name} cityClick={this.cityClick} placeText='搜索门店名称'
                                showText={this.state.searchContent} updateSearch={this.searchInputContent}
                                onSearchSubmit={this.clickSearchBtn}
                />
                <ListView
                    data={this.props.list}
                    renderListRow={this.renderListRow}
                    renderFooter={this.renderFooter}
                    loadMoreData={this.goLoadMoreData}
                    reloadLists={this.goReloadData}
                    loading={this.props.list_loading}
                    refreshing={this.props.list_refreshing}
                    style={{flex: 1}}
                />
                <View
                    style={{
                        width: distances.deviceWidth,
                        height: 60,
                        backgroundColor: '#fff',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                        style={{
                            marginLeft: distances.contractLeftMargin,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{fontSize: 16 * fontScale, color: colors.inputColor}}>
                            已选择
                            <Text style={{
                                fontSize: 16 * fontScale,
                                color: colors.blueColor
                            }}>{this.getCheckStoreNum()}</Text>
                            家门店
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            width: 140,
                            height: 38,
                            backgroundColor: colors.blueColor,
                            marginRight: 25,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 3,
                        }}
                        onPress={this.connectStore}
                    >
                        <Text style={{fontSize: 16, color: '#fff'}}>确定关联</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchStore)