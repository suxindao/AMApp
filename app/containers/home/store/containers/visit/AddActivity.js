/**
 * Created by Joe on 2017/6/5.
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native'
import {Actions} from 'react-native-router-flux'
import _ from 'lodash'
import {toastShort} from '../../../../../constants/toast'

//组件
import LoadingFloatingLayer from '../../../../../components/common/LoadingFloatingLayer'
import {ConfirmButton} from '../../../../../components/common'
import {
    TitleLabel, DesComponent, ShowPositionComponent, ShowWorkContentComponent, ShowOperationContentComponent
} from '../../components/visit/AddActivityCommon'
import ContentComponent from '../../../../../components/common/ContentComponent'

// style
import {colors, distances, fontScale} from '../../../../../constants/style'

import {isNull} from '../../../../../constants/common'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loadData, setState, rsetState} from '../../../../../redux/modules/home/store/visit/addActivityRedux'

const mapStateToProps = state => ({
    loading: state.addActivity.loading,
    loading_success: state.addActivity.loading_success,
    isRender: state.addActivity.isRender,
    data: state.addActivity.data,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({loadData, setState, rsetState}, dispatch),
    dispatch,
})

class AddActivity extends Component {
    constructor(props) {
        super(props)

        // data
        this.visitWorkStr = '' // 显示的拜访人
        this.contact_person_id = -1 // 提交的拜访联系人id, 0-陌拜
        this.visitContactStr = '' // 显示的拜访工作内容
        this.detail = '' // 提交的工作内容 string
        this.location_lon = '';
        this.location_lat = '';
        this.state = {
            pageRefresh: false
        }

        // function
        this.callback = this.callback.bind(this);
        this.setLocalPosition = this.setLocalPosition.bind(this);
        this.setLocalPositions = this.setLocalPositions.bind(this);
        this.localCallback = this.localCallback.bind(this)
        // 拜访人
        this.visitContactClick = this.visitContactClick.bind(this)
        this._visitContactSelect = this._visitContactSelect.bind(this)
        // 拜访工作内容
        this._visitContentSelect = this._visitContentSelect.bind(this)
        this.visitContentClick = this.visitContentClick.bind(this)
        //
        this.subInfo = this.subInfo.bind(this);
        this.subInfos = this.subInfos.bind(this);
    }

    shouldComponentUpdate(np, ns) {
        return np.isRender;
    }

    componentWillUnmount() {
        this.props.myactions.rsetState();
    }

    callback(obj) {
        let data = _.cloneDeep(this.props.data);
        Object.assign(data, obj);
        this.props.myactions.setState({data: _.cloneDeep(data)}, true);
    }

    setLocalPosition(obj) {
        this.location_lon = obj.location_lon;
        this.location_lat = obj.location_lat;
        this.refs.LoadingFloatingLayer.show();
        this.props.myactions.loadData(
            '/am_api/am/store/baiduAddress',
            {
                _AT: global.UserInfo.token,
                location_lon: obj.location_lon,
                location_lat: obj.location_lat,
            },
            this.setLocalPositions
        );
    }

    async setLocalPositions(client, path, param) {
        try {
            let address = await client.post(path, {data: param});
            this.callback({address: address.address});
            return address;
        } catch (e) {
            toastShort('获取地理位置失败')
        } finally {
            this.refs.LoadingFloatingLayer.hide();
        }
    }

    localCallback() {
        Actions.mapPosition({routerData: {callback: this.setLocalPosition}});
    }

    // 拜访人
    _visitContactSelect(backObj) {
        if (backObj && backObj.isDefault) {
            // 0 陌拜情况
            this.visitContactStr = '陌拜，没有联系人或联系人信息不详'
            this.contact_person_id = 0
        } else {
            // 有联系人
            let {rowData} = backObj
            let remindStr = ''
            if (rowData) {
                if (rowData.contacts_name) {
                    remindStr = rowData.contacts_name
                }
                if (rowData.phone_num) {
                    remindStr += ' ' + rowData.phone_num
                }
                if (rowData.contacts_duty) {
                    remindStr += ' ' + rowData.contacts_duty
                }
                if (rowData.contacts_isKP) {
                    remindStr += ' ' + rowData.contacts_isKP
                }
            }
            this.visitContactStr = remindStr
            this.contact_person_id = (rowData && rowData.contacts_id) ? rowData.contacts_id : 0
        }
        // 刷新
        this.setState({
            pageRefresh: !this.state.pageRefresh
        })
    }

    visitContactClick() {
        Actions.visitContactList({
            routerData: {
                id: this.props.routerData.id, callback: this._visitContactSelect
            }
        })
    }

    // 拜访工作内容跳转和回调
    _visitContentSelect(tags) {
        let name_arr = new Array()
        let id_arr = new Array()
        for (var z of tags) {
            if (z.isChecked) {
                name_arr.push(z.tag)
                id_arr.push(z.id)
            }
        }
        this.detail = id_arr.join(',')
        this.visitWorkStr = name_arr.join(',')
        // 刷新
        this.setState({
            pageRefresh: !this.state.pageRefresh
        })
    }

    visitContentClick() {
        Actions.visitWorkList({routerData: {callback: this._visitContentSelect}})
    }

    subInfo() {
        // console.log(new Date().getTime())
        let {data} = this.props;
        let {routerData} = this.props;

        let obj = new Object();
        obj._AT = global.UserInfo.token;
        obj.id = routerData.id;
        obj.type = routerData.type;

        if (routerData.type !== 3) {
            if (isNull(data.comment)) {
                toastShort('请填写拜访内容');
                return;
            }
            obj.comment = data.comment
        }

        // 拜访联系人
        if (this.contact_person_id === -1) {
            toastShort('请选择拜访联系人')
            return
        }
        obj.contact_person_id = this.contact_person_id

        if (routerData.type === 2) {
            if (isNull(data.address)) {
                toastShort('请选择当前所在位置');
                return;
            }
            if (isNull(this.detail)) {
                toastShort('请选择拜访工作内容');
                return;
            }
            obj.address = data.address;
            obj.detail = this.detail;
            obj.location_lon = this.location_lon;
            obj.location_lat = this.location_lat;
        }

        if (routerData.type === 3) {
            if (isNull(data.payoff)) {
                toastShort('请选择是否正常发工资');
                return;
            }
            if (isNull(data.sales)) {
                toastShort('请填写上月流水');
                return;
            }
            if (isNull(data.target)) {
                toastShort('请填写本月业绩目标');
                return;
            }
            obj.payoff = data.payoff;
            obj.sales = data.sales;
            obj.target = data.target;
        }

        this.props.myactions.loadData(
            '/am_api/am/store/creatTrack',
            obj,
            this.subInfos
        );
    }

    async subInfos(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            this.props.routerData.callback();
            Actions.pop();
            return data;
        } catch (e) {
            console.log(e.message);
        }
    }

    render() {
        let {data, routerData} = this.props;
        return (
            <View style={{flex: 1, backgroundColor: colors.labBgColor}}>
                <View style={{flex: 1}}>
                    <TitleLabel labelText={
                        routerData.type === 1 ? '电话' :
                            routerData.type === 2 ? '拜访签到' : '经营情况收集'
                    }/>
                    <DesComponent data={util.getNull2Str(data.comment)}
                                  editable={true}
                                  updateInput={v => {
                                      this.callback({comment: v})
                                  }}
                                  visiable={routerData.type !== 3}
                    />
                    <ShowOperationContentComponent positionTouch={this.localCallback}
                                                   visiable={routerData.type === 3}
                                                   onChangeTextCallback={this.callback}
                                                   operatorData={data}
                    />
                    <ShowPositionComponent positionTouch={this.localCallback}
                                           address={data.address}
                                           visiable={routerData.type === 2}
                    />
                    <ShowWorkContentComponent workTouch={this.visitContactClick} touchStyle={{marginTop: 10}}
                                              workTitle='拜访人' workContent={this.visitContactStr}
                                              visiable={true}
                    />
                    <ShowWorkContentComponent workTouch={this.visitContentClick} touchStyle={{marginTop: 10}}
                                              workTitle='拜访工作内容' workContent={this.visitWorkStr}
                                              visiable={routerData.type === 2}
                    />
                </View>
                <ConfirmButton confirmPress={this.subInfo}
                               touchStyle={{marginLeft: 50, marginRight: 50}} confirmText='保存'
                />
                <LoadingFloatingLayer ref="LoadingFloatingLayer"/>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddActivity)