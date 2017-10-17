/**
 * Created by Joe on 2017/3/14.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert, Image} from 'react-native'
import {Actions} from 'react-native-router-flux'
import _ from 'lodash'
import {httpIP} from '../../../../helpers/Upload'
import moment from 'moment-timezone'

// common
import {subsectionText} from '../../../../constants/common'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// 组件
import ContentComponent from '../../../../components/common/ContentComponent'
import ElementAlert from '../../../../components/common/ElementAlert'
import CheckBox from 'react-native-check-box'
import PhotoSelect from '../../../../components/photoSelect'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {
    setCreateServiceConState,
    rsetCreateServiceConState
} from '../../../../redux/modules/home/contact/creatServiceContractRedux'

const mapStateToProps = state => ({
    stores: state.createServiceCon.stores,                          //门店信息
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        setCreateServiceConState,
        rsetCreateServiceConState
    }, dispatch), dispatch
})

/**
 * 服务合同组件
 */
class ServiceContract extends Component {
    constructor(props) {
        super(props)
        this.callback = this.callback.bind(this);
        this.replaceCheckboxValue = this.replaceCheckboxValue.bind(this);
        this.checkboxCallback = this.checkboxCallback.bind(this);
        this.renderLable = this.renderLable.bind(this);
        this.renderStoreList = this.renderStoreList.bind(this);

        this.touchFinCodeCallback = this.touchFinCodeCallback.bind(this);
        this.getFinCodesElement = this.getFinCodesElement.bind(this);
        this.setFincodesItem = this.setFincodesItem.bind(this);
        this.setFinCodeInfo = this.setFinCodeInfo.bind(this);
        this.hideFinCodeCallback = this.hideFinCodeCallback.bind(this);
        this.subFinCodeCallback = this.subFinCodeCallback.bind(this);

        this.photoCallback = this.photoCallback.bind(this);
        this.photoDeleteCallback = this.photoDeleteCallback.bind(this);
        this.photoSwiper = this.photoSwiper.bind(this);

        this.rmStoreItem = this.rmStoreItem.bind(this);
        this.fincodesInfo = '';
    }

    // input回调上一页面设置redux
    callback(obj) {
        if (typeof this.props.contractCallback == 'function') {
            this.props.contractCallback(obj);
        }
    }

    // checkbox将redux值替换为组件认识的true|false
    replaceCheckboxValue(value) {
        let newValue;
        if (value === true) {
            newValue = 1;
        } else if (value === false) {
            newValue = 0;
        } else if (value === 1) {
            newValue = true;
        } else if (value === 0) {
            newValue = false;
        }
        return newValue;
    }

    // checkbox回调
    checkboxCallback(value, key) {
        if (typeof this.props.contractCallback == 'function') {
            let robj = {};
            robj[key] = this.replaceCheckboxValue(value);
            this.props.contractCallback(robj);
        }
    }

    // 返回列表模块标题
    renderLable(text, h) {
        return (
            <View
                style={{
                    backgroundColor: colors.labBgColor,
                    width: distances.deviceWidth,
                    height: h || 30,
                    justifyContent: 'center',
                    borderTopWidth: distances.borderWidth,
                    borderBottomWidth: distances.borderWidth,
                    borderColor: '#d3d3d3',
                }}
            >
                <Text
                    style={{
                        fontSize: 13 * fontScale,
                        color: '#999',
                        marginLeft: distances.contractLeftMargin
                    }}
                >
                    {text}
                </Text>
            </View>
        )
    }

    // 返回门店列表组件
    renderStoreList(editable) {
        let stores = this.props.data.stores;
        return stores.map((v, index) => {
            let value = v;
            return (
                <View
                    key={'storeList' + index}
                    style={{
                        flexDirection: 'row',
                        marginRight: distances.contractLeftMargin,
                        marginLeft: distances.contractLeftMargin,
                        marginTop: 10,
                        paddingTop: 15,
                        paddingBottom: 15,
                        borderBottomWidth: distances.borderWidth,
                        borderColor: colors.borderColor
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            flex: 1
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16 * fontScale,
                                color: '#333'
                            }}
                        >
                            {value.store_info.branch}
                        </Text>
                        <Text
                            style={{
                                marginTop: 4,
                                fontSize: 13,
                                color: '#666',
                                lineHeight: 22
                            }}
                        >
                            地址：{value.store_info.address}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: '#666',
                                lineHeight: 22
                            }}
                        >
                            收款账号：{subsectionText(value.account_info.bank_account, 4)}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        {
                            editable ?
                                <TouchableOpacity
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={
                                        () => {
                                            Alert.alert(
                                                '提示！',
                                                '是否从合同中移除门店“' + value.store_info.branch + '”？',
                                                [
                                                    {
                                                        text: '取消', onPress: () => {
                                                    }
                                                    },
                                                    {
                                                        text: '确认', onPress: () => {
                                                        this.rmStoreItem(value.store_info.id);
                                                    }
                                                    },
                                                ]
                                            )
                                        }
                                    }
                                >
                                    <Image style={{width: 17, height: 17}}
                                           source={require('../../../../sources/images/delete.png')}/>
                                </TouchableOpacity>
                                :
                                null
                        }
                        {
                            editable ?
                                <TouchableOpacity
                                    onPress={
                                        () => {
                                            if (!editable)
                                                return;
                                            Actions.replaceBankAccount(
                                                {
                                                    routerData: value,
                                                    stores: this.props.stores,
                                                    callback: this.props.contractCallback
                                                }
                                            )
                                        }
                                    }
                                >
                                    <Text
                                        style={{
                                            color: colors.blueColor,
                                            fontSize: 16 * fontScale
                                        }}
                                    >
                                        更换
                                    </Text>
                                </TouchableOpacity>
                                :
                                null
                        }
                    </View>
                </View>
            )
        })
    }

    // 分期产品touch组件点击回调
    touchFinCodeCallback() {
        this.fincodesInfo = _.cloneDeep(this.props.data.fin_codes_info);
        let fin_codes_info = this.fincodesInfo;
        let fin_codes = this.props.data.fin_codes;
        let fin_codes_arr = fin_codes.split(',');
        for (var z = 0; z < fin_codes_info.length; z++) {
            for (var a of fin_codes_arr) {
                if (fin_codes_info[z].fincode == a) {
                    fin_codes_info[z].isChecked = true;
                }
            }
        }
        this.props.contractCallback({fin_codes_info: _.cloneDeep(fin_codes_info)});
        this.refs.finCodes.slideModal();
    }

    // 获取金融产品弹出框内容
    getFinCodesElement() {
        return (
            <View
                style={{
                    width: distances.deviceWidth,
                    height: distances.deviceHeight * 0.5,
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        height: 64,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        width: distances.deviceWidth
                    }}
                >
                    <TouchableOpacity onPress={() => {
                        this.refs.finCodes.hide();
                    }}>
                        <Text
                            style={{
                                fontSize: 15 * fontScale,
                                marginLeft: 15,
                                color: colors.blueColor
                            }}
                        >
                            取消
                        </Text>
                    </TouchableOpacity>
                    <View>
                        <Text
                            style={{
                                fontSize: 15 * fontScale
                            }}
                        >
                            选择金融产品
                        </Text>
                    </View>
                    <TouchableOpacity onPress={this.subFinCodeCallback}>
                        <Text
                            style={{
                                fontSize: 15 * fontScale,
                                marginRight: 15,
                                color: colors.blueColor
                            }}
                        >
                            确认
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    style={{
                        width: distances.deviceWidth,
                        backgroundColor: '#fff',
                        marginBottom: 20
                    }}
                >
                    <View style={{paddingBottom: 15}}>
                        {this.setFincodesItem()}
                    </View>
                </ScrollView>
            </View>
        )
    }

    // 获取金融产品弹出框内部的金融产品列表
    setFincodesItem() {
        let fincodesInfo = this.props.data.fin_codes_info;
        let itmes = new Array();
        for (var z = 0; z < fincodesInfo.length; z++) {
            let finInfo = fincodesInfo[z];
            let order = z;
            itmes.push(
                <CheckBox
                    key={'fincodesItme' + z}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        height: 44,
                        width: distances.deviceWidth,
                        borderBottomWidth: distances.borderWidth,
                        borderColor: colors.borderColor,
                    }}
                    onClick={() => {
                        this.setFinCodeInfo(!finInfo.isChecked, order)
                    }}
                    isChecked={finInfo.isChecked}
                    rightText={finInfo.info}
                    rightTextStyle={{
                        marginLeft: 25,
                        fontSize: 15 * fontScale,
                        color: '#333',
                        marginRight: 15
                    }}
                    checkedImage={<Image style={{marginLeft: 15}}
                                         source={require('../../../../sources/images/radio_yes.png')}/>}
                    unCheckedImage={<Image style={{marginLeft: 15}}
                                           source={require('../../../../sources/images/radio_no.png')}/>}
                />
            )
        }
        return itmes;
    }

    // 分期产品列表checkbox选中与取消选中的回调
    setFinCodeInfo(isChecked, order) {
        this.fincodesInfo[order].isChecked = isChecked;
    }

    // 隐藏分期产品弹出框时的回调
    hideFinCodeCallback() {
        // this.fincodesInfo = _.cloneDeep(this.props.data.fin_codes_info);
    }

    // 分期产品弹出框点击确定提交选中内容
    subFinCodeCallback() {
        this.refs.finCodes.hide();
        if (typeof this.props.contractCallback == 'function') {
            let fincodesArr = new Array();
            let finnamesArr = new Array();
            for (var z of this.fincodesInfo) {
                if (z.isChecked) {
                    fincodesArr.push(z.fincode);
                    finnamesArr.push(z.info);
                }
            }
            this.props.contractCallback(_.cloneDeep({
                fin_codes_info: this.fincodesInfo,
                fin_codes: fincodesArr.join(),
                fin_names: finnamesArr.join('\n')
            }));
        }
    }

    // 删除门店数据
    rmStoreItem(id) {
        let stores = this.props.stores;
        for (var z = 0; z < stores.length; z++) {
            if (stores[z].store_info.id == id) {
                stores.splice(z, 1);
                break;
            }
        }
        this.props.myactions.setCreateServiceConState({stores: _.cloneDeep(stores)}, true);
    }

    photoCallback(data) {
        if (data.uploadInfo) {
            if (typeof this.props.contractCallback == 'function') {
                let contract_pics = this.props.data.contract_pics;
                let obj = {};
                obj.file_id = data.uploadInfo.file_id;
                obj.file_path = data.uploadInfo.url_path;
                contract_pics.push(obj);
                this.props.contractCallback({contract_pics: contract_pics});
            }
        }
    }

    photoDeleteCallback(data) {
        if (typeof this.props.contractCallback == 'function') {
            let contract_pics = this.props.data.contract_pics;
            let new_contract_pics = new Array();
            for (var z of contract_pics) {
                if (z.file_id != data.file_id) {
                    new_contract_pics.push(z);
                }
            }
            this.props.contractCallback({contract_pics: new_contract_pics});
        }
    }

    photoSwiper(index) {
        let pics = this.props.data.contract_pics
        if (Array.isArray(pics) && pics.length > 0) {
            Actions.photoSwiper({
                photo_data: pics,
                index
            })
        }
    }

    render() {
        let editable = this.props.data.editable;
        let pics = new Array();
        if (this.props.data.contract_pics.length > 0) {
            let contract_pics = this.props.data.contract_pics;
            for (var z = 0; z < contract_pics.length; z++) {
                pics.push(
                    {
                        fileName: contract_pics[z].file_id,
                        isStored: true,
                        url: httpIP.substring(0, httpIP.length - 1) + contract_pics[z].file_path,
                        upload: {
                            progress: 1,
                            uploadFailed: false,
                            uploadInfo: {
                                file_id: contract_pics[z].file_id,
                                url_path: contract_pics[z].file_path
                            }
                        }
                    }
                )
            }
        }
        return (
            <View style={{
                backgroundColor: colors.bgColor,
                flex: 1,
                borderTopWidth: distances.borderWidth,
                borderColor: '#d3d3d3',
            }}>
                <ContentComponent
                    config={{
                        hasLine: false,
                        title: '企业名称',
                        type: 'text',
                        placeholder: '',
                        editable: editable.name,
                        key: 'name',
                        value: this.props.data.name
                    }}
                    callback={this.callback}
                />
                {this.renderLable('基础信息')}
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '编号',
                        type: 'input',
                        placeholder: '',
                        editable: editable.code,
                        key: 'code',
                        value: this.props.data.code
                    }}
                    callback={this.callback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '签约日期',
                        type: 'date',
                        placeholder: moment().format('YYYY-MM-DD'),
                        editable: editable.signed_date,
                        key: 'signed_date',
                        value: this.props.data.signed_date
                    }}
                    callback={this.callback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '开始日期',
                        type: 'date',
                        placeholder: moment().format('YYYY-MM-DD'),
                        editable: editable.from_date,
                        key: 'from_date',
                        value: this.props.data.from_date
                    }}
                    callback={this.callback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '结束日期',
                        type: 'date',
                        placeholder: '请选择',
                        editable: editable.to_date,
                        key: 'to_date',
                        value: this.props.data.to_date
                    }}
                    callback={this.callback}
                />
                <ContentComponent
                    config={{
                        hasLine: false,
                        title: '签约AM',
                        type: 'input',
                        placeholder: '请输入签约AM',
                        editable: editable.am_name,
                        key: 'am_name',
                        value: this.props.data.am_name
                    }}
                    callback={this.callback}
                />
                {this.renderLable('签约服务')}
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '分期合作',
                        type: 'checkbox',
                        editable: editable.srv_instalment,
                        key: 'srv_instalment',
                        value: this.replaceCheckboxValue(this.props.data.srv_instalment)
                    }}
                    checkboxCallback={this.checkboxCallback}
                />
                <ContentComponent
                    config={{
                        hasLine: false,
                        title: '服务费率',
                        type: 'touch',
                        placeholder: '请选择服务费率',
                        editable: editable.fin_codes,
                        key: '',
                        value: this.props.data.fin_names
                    }}
                    touchCallback={this.touchFinCodeCallback}
                />
                <ElementAlert ref="finCodes" innerElement={this.getFinCodesElement()}
                              hideCallback={this.hideFinCodeCallback}/>
                {this.renderLable('', 15)}
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '直通车合作',
                        type: 'checkbox',
                        editable: editable.srv_straight,
                        key: 'srv_straight',
                        value: this.replaceCheckboxValue(this.props.data.srv_straight)
                    }}
                    checkboxCallback={this.checkboxCallback}
                />
                {
                    this.replaceCheckboxValue(this.props.data.srv_straight) ?
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '金额',
                                type: 'input',
                                placeholder: '请输入金额',
                                editable: editable.straight_fee,
                                key: 'straight_fee',
                                value: this.props.data.straight_fee + ''
                            }}
                            callback={this.callback}
                        /> : null
                }
                {this.renderLable('', 15)}
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: 'MINI课推广',
                        type: 'checkbox',
                        editable: editable.srv_mini,
                        key: 'srv_mini',
                        value: this.replaceCheckboxValue(this.props.data.srv_mini)
                    }}
                    checkboxCallback={this.checkboxCallback}
                />
                {this.renderLable('', 15)}
                <ContentComponent
                    config={{
                        hasLine: false,
                        title: '客多多推广',
                        type: 'checkbox',
                        editable: editable.srv_roll,
                        key: 'srv_roll',
                        value: this.replaceCheckboxValue(this.props.data.srv_roll)
                    }}
                    checkboxCallback={this.checkboxCallback}
                />
                {this.renderLable('合作门店')}
                <View
                    style={{
                        backgroundColor: '#fff'
                    }}
                >
                    {this.renderStoreList(editable.stores)}
                    {
                        editable.stores ?
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 60
                                }}
                            >
                                <TouchableOpacity
                                    onPress={
                                        () => {
                                            Actions.searchStore({
                                                routerData: {
                                                    enterprise_id: this.props.data.enterprise_id,
                                                    stores: this.props.stores
                                                },
                                                callback: this.callback
                                            })
                                        }
                                    }
                                >
                                    <Text
                                        style={{
                                            fontSize: 16 * fontScale,
                                            color: colors.blueColor
                                        }}
                                    >
                                        关联门店
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            :
                            null
                    }
                </View>
                {this.renderLable('服务合同照片')}
                <PhotoSelect
                    photoNumber={20}
                    style={{
                        backgroundColor: '#fff',
                        paddingBottom: distances.contractLeftMargin
                    }}
                    dataPics={pics}
                    imagesPerRow={4}
                    imageMargin={distances.contractLeftMargin}
                    onItemUpload={(data) => {
                        this.photoCallback(data)
                    }}
                    onItemDelete={(data) => {
                        this.photoDeleteCallback(data)
                    }}
                    onItemClick={(data) => {
                        this.photoSwiper(data)
                    }}
                    isAddLast={editable.contract_pics}
                    hideItemDelete={!editable.contract_pics}
                />
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceContract)