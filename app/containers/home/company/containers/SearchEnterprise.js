/**
 * Created by Joe on 2017/3/20.
 */

import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, Alert, DeviceEventEmitter, TouchableHighlight} from 'react-native'
import {Actions} from 'react-native-router-flux'
import _ from 'lodash'

// 组件
import {SearchInputText} from '../../../../components/search/Search'
import ListView from '../../../../components/list/list'
import ListFoot from '../../../../components/list/foot'
import ListItem from '../../../../containers/home/contract/components/OtherItem'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
import {notification} from '../../../../constants/common'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {
    loadData,
    loadMoreData,
    reloadData,
    setSearchEnterpriseState,
    rsetSearchEnterpriseState
} from '../../../../redux/modules/home/contact/SearchEnterpriseRedux'

const mapStateToProps = state => ({
    isRender: state.searchEnterprise.isRender,                      //是否渲染
    list_loading: state.searchEnterprise.list_loading,
    list_refreshing: state.searchEnterprise.list_refreshing,
    list_error: state.searchEnterprise.list_error,
    ended: state.searchEnterprise.ended,
    next_key: state.searchEnterprise.next_key,
    limit: state.searchEnterprise.limit,
    queryOK: state.searchEnterprise.queryOK,
    list: state.searchEnterprise.list,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        loadMoreData,
        reloadData,
        setSearchEnterpriseState,
        rsetSearchEnterpriseState
    }, dispatch), dispatch
})
/**
 * 主体合同组件
 */
const emitKey = notification.SearchEnterprise;

class SearchEnterprise extends Component {
    constructor(props) {
        super(props)
        // data
        this.state = {
            searchContent: '',
        }

        // function
        this.clickSearchBtn = this.clickSearchBtn.bind(this)
        this.searchInputContent = this.searchInputContent.bind(this)
        this.renderFooter = this.renderFooter.bind(this)
        this.renderListRow = this.renderListRow.bind(this)
        this.goReloadData = this.goReloadData.bind(this)
        this.reloadDatas = this.reloadDatas.bind(this)
        this.goLoadMoreData = this.goLoadMoreData.bind(this)
        this.loadMoreDatas = this.loadMoreDatas.bind(this)
        this.refresh = ''
    }

    componentWillMount() {
        this.goReloadData();
        this.refresh = DeviceEventEmitter.addListener(emitKey, param => this.goReloadData());
    }

    componentWillUnmount() {
        this.props.myactions.rsetSearchEnterpriseState();
        this.refresh.remove();
    }

    // 点击搜索触发操作
    clickSearchBtn(searchResult) {
        this.goReloadData();
    }

    // 搜索框文字变换
    searchInputContent(content) {
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
            <TouchableHighlight
                underlayColor='#ededed'
                onPress={() => {
                    Actions.enterprise({routerData: rowData})
                }}
                style={{
                    borderWidth: distances.borderWidth,
                    borderColor: '#d3d3d3',
                    borderRadius: 3,
                    marginLeft: distances.contractLeftMargin,
                    marginRight: distances.contractLeftMargin,
                    width: distances.deviceWidth - (distances.contractLeftMargin * 2),
                    marginBottom: 10,
                    backgroundColor: '#fff',
                }}
            >
                <View
                    style={{
                        borderWidth: distances.borderWidth,
                        borderColor: '#d3d3d3',
                        borderRadius: 3,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: 15,
                        paddingBottom: 15,
                    }}
                >
                    <View
                        style={{
                            marginLeft: distances.contractLeftMargin,
                        }}
                    >
                        <Text style={{color: '#000', fontSize: 16 * fontScale}}>{rowData.name}</Text>
                        <Text style={{
                            color: '#999',
                            fontSize: 13 * fontScale,
                            marginTop: 5
                        }}>注册号：{rowData.reg_code}</Text>
                    </View>
                    <Image
                        style={{
                            marginRight: distances.contractLeftMargin,
                        }}
                        source={require('../../../../sources/images/arrow_right.png')}
                    />
                </View>
            </TouchableHighlight>
        )
    }

    goReloadData() {
        this.props.myactions.reloadData(
            '/am_api/am/enterprise/search',
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
                this.props.myactions.setSearchEnterpriseState(
                    {
                        list: data.list,
                        next_key: data.next_key,
                        ended: data.ended,
                        // queryOK:true,
                    },
                    true
                )
            } else {
                this.props.myactions.setSearchEnterpriseState(
                    {
                        list: [],
                        ended: true,
                        // queryOK:false,
                    },
                    true
                )
                Alert.alert(
                    '提示！',
                    '未找到相关企业， 确认新建该企业？',
                    [
                        {
                            text: '取消', onPress: () => {
                        }
                        },
                        {
                            text: '确认', onPress: () => {
                            Actions.creatMainContract({
                                emitKey: emitKey,
                                isNew: true,
                                routerData: {
                                    btnType: 2,
                                    fromPage: 'enterprise'
                                }
                            });
                        }
                        },
                    ]
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
            '/am_api/am/enterprise/search',
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
                this.props.myactions.setSearchEnterpriseState(
                    {
                        list: list,
                        next_key: data.next_key,
                        ended: data.ended,
                        // queryOK:true,
                    },
                    true
                )
            } else {
                this.props.myactions.setSearchEnterpriseState(
                    {
                        ended: true,
                        // queryOK:false,
                    },
                    true
                )
            }
            return data
        } catch (e) {
            console.log('loadMoreData:' + e)
        }
    }

    render() {
        return (
            <View style={{backgroundColor: colors.labBgColor, flex: 1}}>
                <SearchInputText
                    placeText='请输入完整企业名称'
                    showText={this.state.searchContent}
                    updateSearch={this.searchInputContent}
                    onSearchSubmit={this.clickSearchBtn}
                />
                {
                    this.props.queryOK ?
                        (
                            <View
                                style={{
                                    marginTop: 15,
                                    marginBottom: 10,
                                    marginLeft: distances.leftMargin,
                                    marginRight: distances.leftMargin,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 13 * fontScale,
                                        color: '#ccc'
                                    }}
                                >
                                    检测到企业已在系统中存在，可在已存在的企业下增加服务合同。
                                </Text>
                            </View>
                        ) : null
                }
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
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchEnterprise)