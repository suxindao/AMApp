/**
 * create at 04/25/17
 */
import React, {Component} from 'react'
import {View, Text, Image} from 'react-native'
import {Actions} from 'react-native-router-flux'

// components
import ListViewSimple from '../../../../components/list/ListSimple'
import ListNoData from '../../../../components/list/NoData'
import ListItem from '../components/listeningCourse/courseItem'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {setPageRefresh} from '../../../../redux/modules/home/store/listeningCourseRedux'

const mapStateToProps = state => ({})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({setPageRefresh}, dispatch), dispatch
})

class Page extends Component {
    constructor(props) {
        super(props)

        this._renderListRow = this._renderListRow.bind(this)
        this._listRowClick = this._listRowClick.bind(this)
    }

    _renderListRow(rowData, sectionID, rowID) {
        return <ListItem rowData={rowData} itemPress={this._listRowClick}/>
    }

    _listRowClick(rowData) {
        this.props.myactions.setPageRefresh()
        Actions.listenCourseEdit({
            routerData: {
                type: 'edit', data: rowData, storeId: this.props.storeId, editable: this.props.editable
            }
        })
    }

    render() {
        if (Boolean(this.props.init_data)) {
            let {init_data} = this.props
            if (Array.isArray(init_data) && init_data.length > 0) {
                return (
                    <ListViewSimple
                        style={{flex: 1}}
                        renderListRow={this._renderListRow}
                        data={init_data}
                    />
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