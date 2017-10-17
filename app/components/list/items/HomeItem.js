/**
 * create at 03/15/17
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, TouchableHighlight, Image, Platform} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {colors, distances, fontScale} from '../../../constants/style'

export default class ItemComponent extends Component {
    constructor(props) {
        super(props)

        this.itemClick = this.itemClick.bind(this)
    }
    
    itemClick(code) {
        return () => {
            switch (code) {
                case 'store': {
                    Actions.myStorePage()
                }
                    break;
                case 'record': {
                    Actions.upRecordList()
                }
                    break;
                case 'contact': {
                    Actions.contactsList()
                }
                    break;
                case 'contract': {
                    Actions.contractList()
                }
                    break;
                case 'company': {
                    Actions.searchEnterprise()
                }
                    break;
                case 'order': {
                    Actions.referOrderList()
                }
                    break;
                default:
                    break;
            }
        }
    }

    render() {
        let {rowData, sectionID, rowID} = this.props
        return (
            <TouchableHighlight onPress={this.itemClick(rowData.code)} underlayColor='#fafafa'>
                <View style={{height: 60, flexDirection: 'row'}}>
                    <Image
                        style={{marginLeft: distances.leftMargin, width: 50 / 2, height: 50 / 2, alignSelf: 'center'}}
                        source={rowData.icon_uri}
                    />
                    <View style={[
                        {
                            marginLeft: 30, height: 60, flex: 1,
                            flexDirection: 'row', alignItems: 'center',
                            borderColor: colors.borderColor,
                        },
                        (sectionID === 'groupA' && rowID == 2) ? null : {borderBottomWidth: distances.borderWidth}
                    ]}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Text style={{color: '#333', fontSize: 15 * fontScale}}>{rowData.title}</Text>
                        </View>
                        <Image style={{width: 12 / 2, height: 20 / 2, marginRight: distances.leftMargin}}
                               source={require('../../../sources/images/arrow_right.png')}/>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}