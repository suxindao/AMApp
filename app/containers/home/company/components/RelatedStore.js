/**
 * Created by Joe on 2017/3/27.
 */

import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import {Actions} from 'react-native-router-flux'

// components
import ListViewSimple from '../../../../components/list/ListSimple'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

export default class RelatedStore extends Component {
    constructor(props) {
        super(props)

        // UI
        this._renderListRow = this._renderListRow.bind(this)
        this.goView = this.goView.bind(this)
    }

    goView(rowData) {
        Actions.myStoreViewInfo({
            routerData: {
                id: Boolean(rowData.id) ? rowData.id : 0,
                name: Boolean(rowData.branch) ? rowData.branch : ''
            }
        })
    }

    _renderListRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.goView(rowData)
                }}
            >
                <ListItem rowData={rowData}/>
            </TouchableOpacity>
        )
    }

    render() {
        let {data, scrollEnabled} = this.props
        if (Array.isArray(data) && data.length > 0) {
            return (
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    <ListViewSimple style={{flex: 1}}
                                    scrollEnabled={scrollEnabled}
                                    data={data}
                                    renderListRow={this._renderListRow}
                    />
                </View>
            )
        }
        return null
    }
}

// listItem
class ListItem extends Component {
    render() {
        let {rowData} = this.props
        return (
            <View style={styles.itemView}>
                <View style={{marginTop: distances.contractLeftMargin}}>
                    <Text style={{fontSize: 16 * fontScale, color: '#333'}}>
                        {Boolean(rowData.branch) ? rowData.branch : ''}
                    </Text>
                </View>
                <View style={{marginTop: 13}}>
                    <Text style={{fontSize: 13 * fontScale, color: '#999'}}>
                        {'地址：' + (Boolean(rowData.address) ? rowData.address : '')}
                    </Text>
                </View>
                <ServicesComponent services={rowData.services}/>
                <View style={{marginTop: 9, marginBottom: distances.contractLeftMargin}}>
                    <Text style={{fontSize: 13 * fontScale, color: '#999'}}>
                        {'维护AM' + (Boolean(rowData.owner_name) ? rowData.owner_name : '')}
                    </Text>
                </View>
            </View>
        )
    }
}

// services array component
class ServicesComponent extends Component {
    render() {
        let {services} = this.props
        let newServices = manageServices(services)
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {
                    newServices.map((item, idx) => {
                        return (
                            <View key={idx} style={[styles.serviceItem, {
                                backgroundColor: Boolean(item.bgColor) ? item.bgColor : colors.blueColor
                            }]}>
                                <Text style={styles.serviceItemText}>{Boolean(item.name) ? item.name : ''}</Text>
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}

/**
 * 处理 services
 * @param {*} services
 */
function manageServices(services) {
    let result = []
    if (Array.isArray(services) && services.length > 0) {
        // services 是 array 且长度大于0
        services.forEach((item, idx) => {
            let newItem = {
                name: (typeof item === 'string' ? item : ''),
                bgColor: colors.blueColor
            }
            result.push(newItem)
        })
    } else {
        // services 不是 array 或者长度等于0， 返回
        result = [{name: '未合作', bgColor: '#e9b951'}]
    }
    return result
}

const styles = StyleSheet.create({
    itemView: {
        marginLeft: distances.contractLeftMargin,
        borderBottomWidth: distances.borderWidth,
        borderColor: colors.borderColor,
    },
    serviceItem: {
        borderRadius: 2,
        marginTop: 9,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 16,
    },
    serviceItemText: {
        color: '#fff',
        fontSize: 11 * fontScale,
        marginLeft: 4,
        marginRight: 4
    }
})