/**
 * Created by Joe on 2017/7/18.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert, Image, DeviceEventEmitter, TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux'
import _ from 'lodash'
import AutoKeywordScrollView from '../../../../components/common/AutoKeywordScrollView'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import moment from 'moment-timezone'

// style
import {colors, distances, fontScale} from './../../../../constants/style'

// common
import {subsectionText} from './../../../../constants/common'
import {httpIP} from './../../../../helpers/Upload'
import {toastShort} from './../../../../constants/toast'
import {checkPhone} from '../../../../constants/utils/validate'
import {addOneDrafts, deleteOneDrafts} from '../../../../modules/storage/draftsHistory'
import {isNull} from '../../../../constants/common'
import {contractType} from '../../../../constants/operation/contractManage'

// 组件
import ContentComponent from '../../../../components/common/ContentComponent'
import PhotoSelect from '../../../../components/photoSelect'
import ContractButton from './../components/ContractButton'
import ElementAlert from '../../../../components/common/ElementAlert'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {
    loadData,
    setState,
    rsetState
} from '../../../../redux/modules/home/contact/createStraightContractRedux'

import {VALID_DAYS, contractDuringDays} from '../../../../constants/utils/contractDuringDayCheck'

const mapStateToProps = state => ({
    loading: state.createStraightContract.loading,
    loading_success: state.createStraightContract.loading_success,
    isRender: state.createStraightContract.isRender,                      //是否渲染
    data: state.createStraightContract.data,
    editable: state.createStraightContract.editable,
    btnType: state.createStraightContract.btnType,
    fromPage: state.createStraightContract.fromPage,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setState,
        rsetState
    }, dispatch), dispatch
})

class CreateStraightContract extends Component {
    constructor(props) {
        super(props)
        this.setEditAble = this.setEditAble.bind(this);
        this.setData = this.setData.bind(this);
        this.getCODE = this.getCODE.bind(this);
        this.getCODEs = this.getCODEs.bind(this);
        this.setPictureData = this.setPictureData.bind(this);
        this.renderLable = this.renderLable.bind(this);
        this.renderStoreList = this.renderStoreList.bind(this);
        this.photoCallback = this.photoCallback.bind(this);
        this.photoDeleteCallback = this.photoDeleteCallback.bind(this);
        this.photoSwiper = this.photoSwiper.bind(this);
        this.callback = this.callback.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.validate = this.validate.bind(this);
        this.popRefresh = this.popRefresh.bind(this);
        this.getSubData = this.getSubData.bind(this);
        this.editTouch = this.editTouch.bind(this);
        this.temporary = this.temporary.bind(this);
        this.getMini_course = this.getMini_course.bind(this);
        this.getMini_courses = this.getMini_courses.bind(this);
        this.checkValidDate = this.checkValidDate.bind(this);
        this.addSubmit = this.addSubmit.bind(this);
        this.addSubmits = this.addSubmits.bind(this);
        this.modifySubmit = this.modifySubmit.bind(this);
        this.modifySubmits = this.modifySubmits.bind(this);
        this.pics = new Array();
    }

    componentWillMount() {
        this.setEditAble();
        this.setData();
    }

    componentWillUnmount() {
        this.props.myactions.rsetState();
    }

    setEditAble() {
        let {routerData} = this.props;
        let obj = new Object();
        routerData.editable ? obj.editable = routerData.editable : null;
        !isNull(routerData.btnType) ? obj.btnType = routerData.btnType : null;
        !isNull(routerData.fromPage) ? obj.fromPage = routerData.fromPage : null;
        if (obj) {
            this.props.myactions.setState({...obj}, true);
        }
    }

    setData() {
        let obj = new Object();
        let {routerData} = this.props;
        this.getMini_course();
        if (routerData.fromPage == 'drafts') {
            this.callback({...routerData.data})
        } else {
            if (routerData && routerData.data) {
                let {data} = routerData;
                !isNull(data.enterprise.id) ? obj.enterprise_id = data.enterprise.id : null;
                !isNull(data.id) ? obj.contract_id = data.id : null;
                !isNull(data.main_contract_id) ? obj.main_contract_id = data.main_contract_id : null;
                !isNull(data.enterprise.name) ? obj.name = data.enterprise.name : null;
                !isNull(data.code) ? obj.code = data.code : null;
                !isNull(data.signed_date) ? obj.signed_date = data.signed_date : null;
                !isNull(data.from_date) ? obj.from_date = data.from_date : null;
                !isNull(data.to_date) ? obj.to_date = data.to_date : null;
                !isNull(data.am_name) ? obj.am_name = data.am_name : null;
                !isNull(data.ZT_info && data.ZT_info.fee_type) ? obj.fee_type = data.ZT_info.fee_type : null;
                !isNull(data.ZT_info && data.ZT_info.fixed_fee) ? obj.fixed_fee = data.ZT_info.fixed_fee : null;
                !isNull(data.ZT_info && data.ZT_info.flexible_fee_total) ? obj.flexible_fee_total = data.ZT_info.flexible_fee_total : null;
                !isNull(data.ZT_info && data.ZT_info.flexible_fee_min) ? obj.flexible_fee_min = data.ZT_info.flexible_fee_min : null;
                !isNull(data.ZT_info && data.ZT_info.srv_mini) ? obj.srv_mini = data.ZT_info.srv_mini : null;
                !isNull(data.ZT_info && data.ZT_info.mini_course_num) ? obj.mini_course_num = data.ZT_info.mini_course_num : null;
                !isNull(data.ZT_info && data.ZT_info.memo) ? obj.memo = data.ZT_info.memo : null;
                data.contacts ? obj.contacts = data.contacts : null;
                data.stores ? obj.stores = data.stores : null;
                data.pics ? obj.pics = data.pics : null;
                this.callback(obj);
            }
            if (this.props.isNew) {
                this.getCODE();
            }
        }
    }

    getCODE() {
        this.props.myactions.loadData(
            '/am_api/am/contract/getContractCode',
            {
                _AT: global.UserInfo.token,
                contract_type: 'BC-ZT'
            },
            this.getCODEs
        )
    }

    async getCODEs(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            this.callback({code: data.code, am_name: global.UserInfo.user_name});
            return data
        } catch (e) {
            toastShort(e.message);
        }
    }

    setPictureData(data) {
        let picsarr = new Array();
        if (data && data.pics && data.pics.length > 0) {
            let pics = data.pics;
            for (var z = 0; z < pics.length; z++) {
                picsarr.push(
                    {
                        fileName: pics[z].file_id,
                        isStored: true,
                        url: httpIP.substring(0, httpIP.length - 1) + pics[z].file_path,
                        upload: {
                            progress: 1,
                            uploadFailed: false,
                            uploadInfo: {
                                file_id: pics[z].file_id,
                                url_path: pics[z].file_path
                            }
                        }
                    }
                )
            }
        }
        return picsarr;
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
    renderStoreList() {
        let {editable, data} = this.props;
        return data.stores.map((v, index) => {
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
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap'
                        }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: '#666',
                                    lineHeight: 22
                                }}
                            >
                                收款账号：
                            </Text>
                            <View style={{flex: 1}}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: '#666',
                                        lineHeight: 22
                                    }}
                                >
                                    {value.account_info ? value.account_info.bank_name : ''}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: '#666',
                                        lineHeight: 22
                                    }}
                                >
                                    {subsectionText(value.account_info ? value.account_info.bank_account : '', 4)}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        {
                            editable.stores ?
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
                            editable.stores ?
                                <TouchableOpacity
                                    onPress={
                                        () => {
                                            Actions.replaceBankAccount(
                                                {
                                                    routerData: {
                                                        ...value,
                                                        enterprise_id: data.enterprise_id
                                                    },
                                                    stores: data.stores,
                                                    callback: this.callback
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

    // 删除门店数据
    rmStoreItem(id) {
        let stores = _.cloneDeep(this.props.data.stores);
        for (var z = 0; z < stores.length; z++) {
            if (stores[z].store_info.id == id) {
                stores.splice(z, 1);
                break;
            }
        }
        this.callback({stores: stores});
    }

    photoCallback(data) {
        if (data.uploadInfo) {
            let pics = this.props.data.pics;
            let obj = {};
            obj.file_id = data.uploadInfo.file_id;
            obj.file_path = data.uploadInfo.url_path;
            pics.push(obj);
            this.callback({pics: pics});
        }
    }

    photoDeleteCallback(data) {
        let pics = this.props.data.pics;
        let new_pics = new Array();
        for (var z of pics) {
            if (z.file_id != data.file_id) {
                new_pics.push(z);
            }
        }
        this.callback({pics: new_pics});
    }

    photoSwiper(index) {
        let pics = this.props.data.pics
        if (Array.isArray(pics) && pics.length > 0) {
            Actions.photoSwiper({
                photo_data: pics,
                index
            })
        }
    }

    callback(result) {
        let data = _.cloneDeep(this.props.data);
        let new_data = Object.assign(data, result);
        this.props.myactions.setState({data: new_data}, true)
    }

    getTitle(status) {
        let title = '';
        for (var z of contractContact) {
            if (z.status === status) {
                title = z.title;
                break;
            }
        }
        return title;
    }

    validate() {
        let {data} = this.props;
        let res = {};
        if (isNull(data.signed_date)) {
            toastShort('签约日期不允许为空');
            return false;
        }
        if (isNull(data.from_date)) {
            toastShort('开始日期不允许为空');
            return false;
        }
        if (isNull(data.to_date)) {
            toastShort('结束日期不允许为空');
            return false;
        }
        if (data.to_date < data.from_date) {
            toastShort('开始日期不能大于结束日期');
            return false;
        }
        if (isNull(data.am_name)) {
            toastShort('签约AM不允许为空');
            return false;
        }
        if (isNull(data.fee_type)) {
            toastShort('请选择服务费用');
            return false;
        }
        if (data.fee_type === 1) {
            if (isNull(data.fixed_fee)) {
                toastShort('请输入固定金额费用');
                return false;
            }
        }
        if (data.fee_type === 2) {
            if (isNull(data.flexible_fee_total)) {
                toastShort('请输入非固定金额订单总价百分比');
                return false;
            }
            if (isNull(data.flexible_fee_min)) {
                toastShort('请输入非固定金额最低价');
                return false;
            }
        }
        let contacts = data.contacts;
        for (var z of contacts) {
            if (isNull(z.contact)) {
                toastShort(`请填写${this.getTitle(z.status)}姓名`);
                return false;
            }
            if (z.status == 'hz' && isNull(z.duty)) {
                toastShort(`请填写${this.getTitle(z.status)}职务`);
                return false;
            }
            if (isNull(z.contact_detail)) {
                toastShort(`请填写${this.getTitle(z.status)}电话`);
                return false;
            } else {
                res = checkPhone(z.contact_detail);
                if (!res.pass) {
                    toastShort(`${this.getTitle(z.status)}电话号格式有误`);
                    return false;
                }
            }
        }
        if (data.srv_mini === 1) {
            if (isNull(data.mini_course_num)) {
                toastShort('请选择总课节数');
                return false;
            }
        }
        if (data.stores.length < 1) {
            toastShort('请选择关联门店');
            return false;
        }
        for (var z of data.stores) {
            if (!z.account_info || !z.account_info.id) {
                toastShort('请选择' + z.store_info.branch + '的收款账号');
                return false;
            }
        }
        if (isNull(data.pics) || data.pics.length === 0) {
            toastShort('请上传合同照片');
            return false;
        }
        return true;
    }

    popRefresh() {
        let {popRefresh, emitKey} = this.props;
        if (typeof popRefresh == 'function')
            popRefresh('straight');
        if (emitKey)
            DeviceEventEmitter.emit(emitKey);
        Actions.pop()
    }

    getSubData() {
        let data = _.cloneDeep(this.props.data);
        let stores = new Array();
        for (var z of data.stores) {
            stores.push(
                (z.account_info && z.account_info.id !== null) ?
                    {
                        store_id: z.store_info.id,
                        account_id: z.account_info.id
                    } :
                    {
                        store_id: z.store_info.id,
                    }
            )
        }
        data.stores = stores;
        data.mini_course_num = data.mini_course_num.id;
        data._AT = global.UserInfo.token;
        return data;
    }

    editTouch() {
        this.props.myactions.setState({
            editable: {
                signed_date: true,
                from_date: true,
                to_date: true,
                am_name: true,
                straight_fee: true,
                contacts: true,
                srv_mini: true,
                mini_course_num: true,
                memo: true,
                stores: true,
                pics: true,
            },
            btnType: 3
        });
    }

    temporary() {
        let {data} = this.props;
        if (!addOneDrafts(contractType.server_ZT, data.code, data.name, '未提交', data)) {
            toastShort('保存草稿失败！');
        } else {
            let {emitKey} = this.props;
            if (emitKey)
                DeviceEventEmitter.emit(emitKey);
            Actions.pop();
            toastShort('保存草稿成功');
        }
    }

    getMini_course() {
        this.props.myactions.loadData(
            '/am_api/am/contract/ZTMiniCourseType',
            {_AT: global.UserInfo.token},
            this.getMini_courses
        )
    }

    async getMini_courses(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            this.callback({mini_courses: data})
            return data
        } catch (e) {
            console.log('addSubmits===>', e.message);
        }
    }

    checkValidDate(fun) {
        if (this.validate()) {
            let duringDay = contractDuringDays(this.props.data.from_date, this.props.data.to_date)
            if (duringDay < VALID_DAYS) {
                Alert.alert(
                    '协议时间提醒',
                    '协议有效期为 ' + duringDay + ' 天，请确认有效期是否正确',
                    [
                        {text: '取消', onPress: () => null},
                        {text: '确定', onPress: fun}
                    ]
                )
            } else {
                fun()
            }
        }
    }

    addSubmit() {
        this.checkValidDate(() => {
            this.props.myactions.loadData(
                '/am_api/am/contract/createService_ZT',
                this.getSubData(),
                this.addSubmits
            )
        })
    }

    async addSubmits(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            if (data.contract_id) {
                if (this.props.fromPage === 'drafts' && !isNull(this.props.draftsKey)) {
                    deleteOneDrafts(this.props.draftsKey)
                }
                toastShort('提交审核成功')
                this.popRefresh();
            }
            return data
        } catch (e) {
            console.log('addSubmits===>', e.message);
        }
    }

    modifySubmit() {
        this.checkValidDate(() => {
            this.props.myactions.loadData(
                '/am_api/am/contract/modifyService_ZT',
                this.getSubData(),
                this.modifySubmits
            )
        })
    }

    async modifySubmits(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            if (data.contract_id) {
                toastShort('提交审核成功')
                this.popRefresh();
            }
            return data
        } catch (e) {
            console.log('modifySubmits===>', e.message);
        }
    }

    render() {
        let {
            data, editable, btnType, fromPage, routerData, scrollEnabled = true, needKeyWord = true
        } = this.props;
        return (
            <AutoKeywordScrollView scrollStyle={{flex: 1}} scrollBounces={false}
                                   scrollEnabled={scrollEnabled} needKeyWord={needKeyWord}>
                <InputItem data={data} editable={editable} renderLable={this.renderLable} callback={this.callback}/>
                <FeeItem data={data} editable={editable.fee_type} renderLable={this.renderLable}
                         callback={this.callback}/>
                <Contract data={data} editable={editable.contacts} renderLable={this.renderLable}
                          callback={this.callback}/>
                <Mini data={data} editable={editable.mini_course_num} renderLable={this.renderLable}
                      callback={this.callback}/>
                <StoresItem data={data} editable={editable} renderStoreList={this.renderStoreList}
                            renderLable={this.renderLable} callback={this.callback}/>
                {this.renderLable('服务合同照片')}
                <PhotoSelect
                    photoNumber={20}
                    style={{
                        backgroundColor: '#fff',
                        paddingBottom: distances.contractLeftMargin
                    }}
                    dataPics={this.setPictureData(routerData.data)}
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
                    isAddLast={editable.pics}
                    hideItemDelete={!editable.pics}
                />
                <ContractButton
                    btnType={btnType}
                    fromPage={fromPage}
                    editTouch={this.editTouch}
                    editInfo={this.modifySubmit}
                    temporary={this.temporary}
                    subInfo={this.addSubmit}
                />
            </AutoKeywordScrollView>
        )
    }
}

class InputItem extends Component {
    render() {
        let {data, editable, renderLable, callback} = this.props;
        return (
            <View style={{backgroundColor: '#fff'}}>
                <ContentComponent
                    config={{
                        hasLine: false,
                        title: '企业名称',
                        type: 'text',
                        placeholder: '',
                        editable: editable.name,
                        key: 'name',
                        value: data.name
                    }}
                    callback={callback}
                />
                {renderLable('基础信息')}
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '编号',
                        type: 'text',
                        key: 'code',
                        value: data.code
                    }}
                    callback={callback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '签约日期',
                        type: 'date',
                        placeholder: moment().format('YYYY-MM-DD'),
                        editable: editable.signed_date,
                        key: 'signed_date',
                        value: data.signed_date
                    }}
                    callback={callback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '开始日期',
                        type: 'date',
                        placeholder: moment().format('YYYY-MM-DD'),
                        editable: editable.from_date,
                        key: 'from_date',
                        value: data.from_date
                    }}
                    callback={callback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '结束日期',
                        type: 'date',
                        placeholder: '请选择',
                        editable: editable.to_date,
                        key: 'to_date',
                        value: data.to_date
                    }}
                    callback={callback}
                />
                <ContentComponent
                    config={{
                        hasLine: false,
                        title: '签约AM',
                        type: 'input',
                        placeholder: '请输入签约AM',
                        editable: editable.am_name,
                        key: 'am_name',
                        value: data.am_name
                    }}
                    callback={callback}
                />
            </View>
        )
    }
}

class FeeItem extends Component {
    constructor(props) {
        super(props)
        this.setRadio = this.setRadio.bind(this);
    }

    componentDidMount() {
        this.setRadio()
    }

    componentDidUpdate() {
        this.setRadio()
    }

    setRadio() {
        let {data} = this.props;
        let order = null;
        if (data.fee_type === 1) {
            order = 0;
        }
        if (data.fee_type === 2) {
            order = 1;
        }
        this.refs.radioGroups.setState({selectedIndex: order});
    }

    render() {
        let {data, editable, renderLable, callback} = this.props;
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                {renderLable('服务费用')}
                <RadioGroup
                    ref="radioGroups"
                    color={colors.blueColor}
                    style={{
                        flexDirection: 'column',
                        flex: 1,
                        paddingLeft: distances.contractLeftMargin,
                    }}
                    onSelect={(index, value) => {
                        callback({fee_type: value})
                    }}>
                    <RadioButton
                        style={{
                            height: 60,
                            borderBottomWidth: distances.borderWidth,
                            borderColor: colors.borderColor,
                            alignItems: 'center',
                        }}
                        value={1}
                        isSelected={data.fee_type === 1}
                        disabled={editable === false}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{fontSize: 16 * fontScale, color: '#333'}}>固定金额</Text>
                            {
                                data.fee_type === 1 &&
                                <TextInput
                                    style={{
                                        width: distances.deviceWidth * 0.6,
                                        height: 40,
                                        marginLeft: 15,
                                    }}
                                    onChange={(e) => {
                                        callback({fixed_fee: e.nativeEvent.text});
                                    }}
                                    placeholderTextColor={'#d3d3d3'}
                                    placeholder='必填'
                                    value={data.fixed_fee}
                                    keyboardType='numeric'
                                    underlineColorAndroid='transparent'
                                    editable={editable}
                                />
                            }
                        </View>
                    </RadioButton>
                    <RadioButton
                        style={{
                            height: 60,
                            alignItems: 'center',
                        }}
                        value={2}
                        isSelected={true}
                        disabled={editable === false}
                    >
                        <Text style={{fontSize: 16 * fontScale, color: '#333'}}>非固定金额</Text>
                    </RadioButton>
                </RadioGroup>
                {
                    data.fee_type === 2 &&
                    <View
                        style={{
                            marginLeft: distances.contractLeftMargin,
                            borderTopWidth: distances.borderWidth,
                            borderColor: colors.borderColor,
                        }}
                    >
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '订单总价(%)',
                                keyboardType: 'numeric',
                                type: 'input',
                                placeholder: '必填',
                                editable: true,
                                key: 'flexible_fee_total',
                                value: util.getNull2Str(data.flexible_fee_total + '')
                            }}
                            callback={callback}
                        />
                        <ContentComponent
                            config={{
                                hasLine: false,
                                title: '最低(元)',
                                keyboardType: 'numeric',
                                type: 'input',
                                placeholder: '必填',
                                editable: true,
                                key: 'flexible_fee_min',
                                value: util.getNull2Str(data.flexible_fee_min)
                            }}
                            callback={callback}
                        />
                    </View>
                }
            </View>
        )
    }
}

class StoresItem extends Component {
    render() {
        let {data, editable, renderStoreList, renderLable, callback} = this.props;
        return (
            <View>
                {renderLable('合作门店')}
                <View
                    style={{
                        backgroundColor: '#fff'
                    }}
                >
                    {renderStoreList()}
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
                                                    enterprise_id: data.enterprise_id,
                                                    stores: data.stores
                                                },
                                                callback: callback
                                            })
                                        }
                                    }
                                >
                                    <Text style={{fontSize: 16 * fontScale, color: colors.blueColor}}>
                                        关联门店
                                    </Text>
                                </TouchableOpacity>
                            </View> : null
                    }
                </View>
            </View>
        )
    }
}

class Mini extends Component {
    constructor(props) {
        super(props)
        this.replaceCheckboxValue = this.replaceCheckboxValue.bind(this);
        this.getMiniCourseNum = this.getMiniCourseNum.bind(this);
    }

    // 0:false, 1:true
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

    getMiniCourseNum(mini_courses) {
        let {callback} = this.props;
        let tag = new Array();
        for (var z of mini_courses) {
            let a = z;
            tag.push(
                <TouchableOpacity
                    activeOpacity={0.8}
                    key={'mini_' + z.id}
                    style={{
                        backgroundColor: '#fff',
                        width: distances.deviceWidth,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderColor: colors.borderColor,
                    }}
                    onPress={() => {
                        callback({mini_course_num: a})
                        this.refs.miniCourseNum.hideModal()
                    }}
                >
                    <Text style={{color: colors.inputColor, fontSize: 15 * fontScale}}>{z.name}</Text>
                </TouchableOpacity>
            )
        }
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: distances.deviceWidth,
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0)'
                }}
            >
                {tag}
                <TouchableOpacity
                    key={'mini_' + z}
                    style={{
                        backgroundColor: '#fff',
                        width: distances.deviceWidth,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderColor: colors.borderColor,
                    }}
                    onPress={() => {
                        this.refs.miniCourseNum.hideModal()
                    }}
                >
                    <Text style={{color: colors.inputColor, fontSize: 15 * fontScale}}>取消</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let {data, editable, renderLable, callback} = this.props;
        return (
            <View style={{backgroundColor: '#fff'}}>
                {renderLable('Mini课')}
                <ContentComponent
                    config={{
                        hasLine: data.srv_mini === 1,
                        title: 'Mini课',
                        type: 'checkbox',
                        editable: editable,
                        key: 'srv_mini',
                        value: this.replaceCheckboxValue(data.srv_mini)
                    }}
                    checkboxCallback={v => callback({srv_mini: this.replaceCheckboxValue(v)})}
                />
                {
                    data.srv_mini === 1 &&
                    <View>
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '课节数',
                                type: 'touch',
                                placeholder: '请选择',
                                editable: editable,
                                key: 'mini_course_num',
                                value: util.getNull2Str(data.mini_course_num.name)
                            }}
                            touchCallback={() => this.refs.miniCourseNum.slideModal()}
                        />
                        <ContentComponent
                            config={{
                                hasLine: false,
                                title: '备注',
                                type: 'input',
                                placeholder: '选填',
                                editable: editable,
                                key: 'memo',
                                value: data.memo
                            }}
                            callback={callback}
                        />
                    </View>
                }
                <ElementAlert
                    ref="miniCourseNum"
                    innerElement={this.getMiniCourseNum(data.mini_courses)}
                />
            </View>
        )
    }
}

let contractContact = [
    {
        status: 'hz',
        title: '合作接口人'
    },
    {
        status: 'cw',
        title: '财务负责人'
    },
    {
        status: 'xs',
        title: '销售负责人'
    },
]

class Contract extends Component {
    constructor(props) {
        super(props)
        this.contactCallback = this.contactCallback.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.getInner = this.getInner.bind(this);
    }

    contactCallback(obj, status) {
        let {data, callback} = this.props;
        let contacts = _.cloneDeep(data.contacts);
        for (var z of contacts) {
            if (z.status === status) {
                Object.assign(z, obj);
            }
        }
        callback({contacts: contacts});
    }

    getTitle(status) {
        let title = '';
        for (var z of contractContact) {
            if (z.status === status) {
                title = z.title;
                break;
            }
        }
        return title;
    }

    getInner() {
        let {renderLable, data, editable} = this.props;
        let new_data = new Array();
        for (var a of contractContact) {
            for (var s of data.contacts) {
                if (s.status === a.status) {
                    new_data.push(s);
                    break;
                }
            }
        }
        if (new_data.length == 0) {
            for (var d of contractContact) {
                new_data.push({status: d.status});
            }
        }
        let Tag = new Array();
        for (var z of new_data) {
            let item = z;
            Tag.push(
                <View key={item.status}>
                    {renderLable(this.getTitle(item.status))}
                    <ContentComponent
                        config={{
                            hasLine: true,
                            title: '姓名',
                            type: 'input',
                            placeholder: '必填',
                            editable: editable,
                            key: 'contact',
                            value: item.contact
                        }}
                        callback={data => {
                            this.contactCallback(data, item.status)
                        }}
                    />
                    {
                        item.status == 'hz' ?
                            <ContentComponent
                                config={{
                                    hasLine: true,
                                    title: '职务',
                                    type: 'input',
                                    placeholder: '必填',
                                    editable: editable,
                                    key: 'duty',
                                    value: item.duty
                                }}
                                callback={data => {
                                    this.contactCallback(data, item.status)
                                }}
                            /> : null
                    }
                    <ContentComponent
                        config={{
                            hasLine: false,
                            title: '手机号',
                            type: 'input',
                            placeholder: '必填',
                            keyboardType: 'numeric',
                            maxLength: 11,
                            editable: editable,
                            key: 'contact_detail',
                            value: item.contact_detail
                        }}
                        callback={data => {
                            this.contactCallback(data, item.status)
                        }}
                    />
                </View>
            );
        }
        return Tag;
    }

    render() {
        return (
            <View style={{backgroundColor: colors.bgColor, flex: 1}}>
                {this.getInner()}
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateStraightContract)