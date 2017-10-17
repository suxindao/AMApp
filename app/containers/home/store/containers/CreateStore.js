/**
 * Created by Joe on 2017/4/21.
 */
import React, {Component} from 'react';
import {View, TextInput, Text, TouchableHighlight, Alert} from 'react-native'
import _ from 'lodash'
import {Actions} from 'react-native-router-flux'
//组件
import DatePicker from 'react-native-datepicker'
import {toastShort} from '../../../../constants/toast'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
// common
import {isNull} from '../../../../constants/common'
import {notification, store} from '../../../../constants/common'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {loadData, setState, rsetState} from '../../../../redux/modules/home/store/createStoreRedux'

const emitKey = notification.viewStoreInfo;

const mapStateToProps = state => ({
    isRender: state.createStore.isRender,                      //是否渲染
    loading: state.createStore.loading,
    loading_success: state.createStore.loading_success,
    date: util.getNull2Str(state.createStore.date),
    code: util.getNull2Str(state.createStore.code),
    store_info: state.createStore.store_info,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setState,
        rsetState
    }, dispatch), dispatch
})

class CreateStore extends Component {
    constructor(props) {
        super(props)
        this.dateCallback = this.dateCallback.bind(this)
        this.inputCallback = this.inputCallback.bind(this)
        this.checkData = this.checkData.bind(this)
        this.initLocalData = this.initLocalData.bind(this)
        this.checked = this.checked.bind(this)
        this.subInfo = this.subInfo.bind(this)
    }

    shouldComponentUpdate(np, ns) {
        return np.isRender;
    }

    componentWillUnmount() {
        this.props.myactions.rsetState();
    }

    /**
     * 日期返回函数
     */
    dateCallback(date) {
        this.props.myactions.setState({
            date: date
        });
    }

    /**
     * 输入框返回函数
     */
    inputCallback(value) {
        this.props.myactions.setState({
            code: value
        });
    }

    /**
     * 校验当前编号门店是否存在
     */
    checkData(code) {
        let data = this.props.myactions.loadData(
            '/am_api/am/store/search',
            {
                _AT: global.UserInfo.token,
                cms_code: code,
            },
            this.initLocalData
        );
    }

    async initLocalData(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            if (data.errorCode === 1) {
                // 没有重复门店，跳转到基础信息页面
                Actions.basicStoreInfo(
                    {
                        routerData: {
                            data: {
                                cms_code: `P0#${this.props.date}-${this.props.code}`,
                            },
                            status: 'add',
                            editable: {
                                cms_code: true,
                                brand_name: true,
                                branch: true,
                                store_type: true,
                                store_tel: true,
                                region: true,
                                address: true,
                                location: true,
                                area: true,
                                found_year: true,
                                tag: true,
                                contacts: true,
                            }
                        },
                        emitKey: emitKey
                    }
                );
            } else {
                // 存在基础门店
                // 赋值门店基础信息
                this.props.myactions.setState({store_info: data}, true);
                // 弹出门店基础信息
                Alert.alert(
                    '门店已存在',
                    '\n名称：' + util.getNull2Str(data.name) + '\n' +
                    '编号：' + `P0#${this.props.date}-${this.props.code}` + '\n' +
                    '电话：' + util.getNull2Str(data.store_tel) + '\n',
                    data.editable ?
                        [
                            {
                                text: '取消', onPress: () => {
                            }
                            },
                            // 跳转到门店详情，状态为编辑状态
                            {
                                text: '编辑', onPress: () => {
                                Actions.viewStoreInfo({routerData: {id: data.id, status: 'update'}})
                            }
                            },
                        ] :
                        [
                            {
                                text: '确认', onPress: () => {
                            }
                            },
                        ]
                )
            }
            return data;
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * 校验门店编号格式
     */
    checked() {
        if (isNull(this.props.date) ||
            isNull(this.props.code) ||
            this.props.code.length !== 4) {
            toastShort('请输入有效的门店编号');
            return;
        }
        this.checkData(`P0#${this.props.date}-${this.props.code}`);
    }

    /**
     * 点击创建按钮
     */
    subInfo() {
        this.checked();
    }

    render() {
        return (
            <View
                style={{
                    backgroundColor: colors.bgColor,
                    flex: 1,
                    alignItems: 'center',
                }}
            >
                <View style={{marginTop: 30}}>
                    <Text style={{fontSize: 16 * fontScale, color: '#666'}}>请输入销售易中的门店编号</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 25,
                    }}
                >
                    <Text style={{marginRight: distances.contractLeftMargin, fontSize: 16 * fontScale}}>P0#</Text>
                    <DatePicker
                        ref='DatePicker'
                        customStyles={{
                            dateInput: {
                                borderWidth: distances.borderWidth,
                                borderColor: colors.borderColor,
                                borderRadius: 3,
                                backgroundColor: colors.labBgColor,
                                alignItems: 'flex-start',
                                marginRight: 5,
                                paddingLeft: 13,
                                width: 130,
                                height: 38,
                            },
                            placeholderText: {
                                fontSize: 15 * fontScale,
                                color: '#ccc'
                            },
                            dateText: {
                                color: colors.inputColor,
                                fontSize: 15 * fontScale,
                            },
                            btnTextConfirm: {
                                color: colors.blueColor
                            },
                            btnTextCancel: {
                                color: colors.blueColor
                            },
                        }}
                        date={this.props.date}
                        mode="date"
                        placeholder={'请选择'}
                        format="YYYYMMDD"
                        minDate={"1901-01-01"}
                        maxDate={"2100-12-31"}
                        showIcon={false}
                        confirmBtnText="完成"
                        cancelBtnText="取消"
                        onDateChange={(date) => {
                            this.dateCallback(date)
                        }}
                    />
                    <View>
                        <TextInput
                            placeholder={'请填写'}
                            placeholderTextColor='#ccc'
                            underlineColorAndroid="transparent"
                            keyboardType='numeric'
                            maxLength={4}
                            onChange={(e) => {
                                this.inputCallback(e.nativeEvent.text);
                            }}
                            style={{
                                width: 90,
                                height: 38,
                                backgroundColor: colors.labBgColor,
                                borderWidth: distances.borderWidth,
                                borderColor: colors.borderColor,
                                borderRadius: 3,
                                color: colors.inputColor,
                                fontSize: 15 * fontScale,
                                paddingLeft: 13,
                            }}
                            value={this.props.code}
                        />
                    </View>
                </View>
                <TouchableHighlight
                    underlayColor='#fafafa'
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.blueColor,
                        marginTop: 50,
                        width: distances.deviceWidth - 76,
                        height: 38,
                        borderRadius: 3,
                    }}
                    onPress={this.subInfo}
                >
                    <Text style={{fontSize: 15 * fontScale, color: '#fff'}}>创建</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateStore)