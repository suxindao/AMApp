/**
 * Created by Joe on 2017/3/9.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView, TouchableHighlight} from 'react-native'
import {httpIP} from '../../../../helpers/Upload'
import moment from 'moment-timezone'
// common
import {subsectionText} from '../../../../constants/common'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
import _ from 'lodash'
// 组件
import ContentComponent from '../../../../components/common/ContentComponent'
import Regions from '../../../../components/modal/regions'
import PhotoSelect from '../../../../components/photoSelect'
import ContractContact from './ContractContact'
import ElementAlert from '../../../../components/common/ElementAlert'
import Prompt from '../../../../components/common/Prompt';
import {Actions} from 'react-native-router-flux'

/**
 * 主体合同组件
 */
export default class MainContract extends Component {
    constructor(props) {
        super(props)
        this.callback = this.callback.bind(this);
        this.contactCallback = this.contactCallback.bind(this);
        this.modifyOperatorType = this.modifyOperatorType.bind(this);
        this.operatorTypeCB = this.operatorTypeCB.bind(this);
        this.getOperatorType = this.getOperatorType.bind(this);
        this.openCityCallback = this.openCityCallback.bind(this);
        this.areaCallback = this.areaCallback.bind(this);
        this.photoCallback = this.photoCallback.bind(this);
        this.photoDeleteCallback = this.photoDeleteCallback.bind(this);
        this.photoSwiper = this.photoSwiper.bind(this);
        this.renderLable = this.renderLable.bind(this);
    }

    callback(obj) {
        if (typeof this.props.contractCallback == 'function') {
            this.props.contractCallback(obj);
        }
    }

    contactCallback(obj, status) {
        let {data} = this.props;
        let contacts = _.cloneDeep(data.contacts);
        for (var z of contacts) {
            if (z.status === status) {
                Object.assign(z, obj);
            }
        }
        this.callback({contacts: contacts});
    }

    modifyOperatorType(text) {
        this.callback({operator_type_other: text})
    }

    operatorTypeCB(v) {
        this.callback({operator_type: v})
        if (v.id === 4) {
            this.refs.prompt.show();
        }
    }

    getOperatorType() {
        let operator_types = _.cloneDeep(this.props.data.operator_types);
        let tag = new Array();
        for (var idx in operator_types) {
            let z = idx;
            tag.push(
                <TouchableHighlight
                    underlayColor='#fafafa'
                    key={'oper_' + z}
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
                        this.refs.operatorType.hideModal()
                        this.operatorTypeCB(operator_types[z])
                    }}
                >
                    <Text style={{color: colors.inputColor, fontSize: 15 * fontScale}}>{operator_types[z].name}</Text>
                </TouchableHighlight>
            )
        }
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: distances.deviceWidth,
                position: 'absolute',
                left: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0)'
            }}>
                {tag}
            </View>
        )
    }

    openCityCallback() {
        this.refs.citys.slideModal();
    }

    areaCallback(obj) {
        if (typeof this.props.contractCallback == 'function') {
            let area = '';
            let area_code = '';
            for (var z of obj) {
                area += z.fullname + '-';
                area_code = z.region_id;
            }
            area = area.substring(0, area.length - 1);
            this.props.contractCallback(
                {
                    area_code: area_code,
                    area: area
                }
            );
        }
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

    /**
     * 照片预览函数
     */
    photoSwiper(index) {
        let pics = this.props.data.contract_pics
        if (Array.isArray(pics) && pics.length > 0) {
            Actions.photoSwiper({
                photo_data: pics,
                index
            })
        }
    }

    renderLable(text) {
        return (
            <View
                style={{
                    backgroundColor: colors.labBgColor,
                    width: distances.deviceWidth,
                    height: 30,
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
            <View style={{backgroundColor: colors.bgColor, flex: 1}}>
                {this.renderLable('基础信息')}
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '编号',
                        type: 'text',
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
                        placeholder: '请选择',
                        editable: editable.signed_date,
                        key: 'signed_date',
                        maxDate: moment().format('YYYY-MM-DD'),
                        value: this.props.data.signed_date
                    }}
                    callback={this.callback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '开始日期',
                        type: 'date',
                        placeholder: '请选择',
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
                        title: '签约AM',
                        type: 'input',
                        placeholder: '请输入签约AM',
                        editable: editable.am_name,
                        key: 'am_name',
                        value: this.props.data.am_name,
                        hasLine: false
                    }}
                    callback={this.callback}
                />
                {this.renderLable('企业信息')}
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '企业名称',
                        type: 'input',
                        placeholder: '请输入企业名称',
                        editable: editable.name,
                        key: 'name',
                        value: this.props.data.name
                    }}
                    callback={this.callback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '工商注册号',
                        type: 'input',
                        placeholder: '请输入工商注册号',
                        maxLength: 20,
                        editable: editable.reg_code,
                        key: 'reg_code',
                        value: this.props.data.reg_code
                    }}
                    callback={this.callback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '法定代表人',
                        type: 'input',
                        placeholder: '必填',
                        editable: editable.legal_person,
                        key: 'legal_person',
                        value: this.props.data.legal_person
                    }}
                    callback={this.callback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '运营品牌',
                        type: 'input',
                        placeholder: '必填',
                        editable: editable.operator_brand,
                        key: 'operator_brand',
                        value: this.props.data.operator_brand
                    }}
                    callback={this.callback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '运营模式',
                        type: 'touch',
                        placeholder: '请选择',
                        editable: editable.operator_type,
                        key: 'operator_type',
                        value:
                            this.props.data.operator_type.id === 4 ?
                                util.getNull2Str(this.props.data.operator_type_other) :
                                util.getNull2Str(this.props.data.operator_type.name)
                    }}
                    touchCallback={param => {
                        this.refs.operatorType.slideModal()
                    }}
                />
                <ElementAlert
                    ref="operatorType"
                    innerElement={this.getOperatorType()}
                />
                <Prompt
                    ref="prompt"
                    title="运营模式"
                    inner="请输入运营模式"
                    placeholder="请输入"
                    rightBtn="确定"
                    onSubmint={this.modifyOperatorType}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '联系电话',
                        type: 'input',
                        keyboardType: 'numeric',
                        maxLength: 11,
                        placeholder: '必填',
                        editable: editable.tel,
                        key: 'tel',
                        value: this.props.data.tel
                    }}
                    callback={this.callback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '合作对接专用邮箱',
                        type: 'input',
                        placeholder: '必填',
                        editable: editable.email,
                        key: 'email',
                        value: this.props.data.email
                    }}
                    callback={this.callback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '企业注册所在地区',
                        type: 'touch',
                        placeholder: '请选择地区',
                        editable: editable.area,
                        key: 'area',
                        value: this.props.data.area
                    }}
                    touchCallback={this.openCityCallback}
                />
                <ContentComponent
                    config={{
                        hasLine: true,
                        title: '办公地址',
                        type: 'input',
                        placeholder: '请输入详细地址',
                        editable: editable.address,
                        key: 'address',
                        value: this.props.data.address
                    }}
                    callback={this.callback}
                />
                {this.renderLable('企业联系人')}
                <ContractContact
                    config={{
                        editable: {
                            contact: editable.contact,
                            contact_detail: editable.contact_detail,
                        },
                        callback: this.contactCallback,
                    }}
                    data={this.props.data.contacts}
                />
                <Regions
                    ref="citys"
                    visible={true}
                    touchClose={() => {
                    }}
                    cityCallback={(city) => {
                        this.areaCallback(city)
                    }}
                />
                {this.renderLable('框架协议照片')}
                <PhotoSelect
                    photoNumber={20}
                    dataPics={pics}
                    style={{
                        backgroundColor: '#fff',
                        paddingBottom: distances.contractLeftMargin
                    }}
                    imagesPerRow={4}
                    imageMargin={distances.contractLeftMargin}
                    onItemUpload={(data) => {
                        this.photoCallback(data)
                    }}
                    onItemDelete={(data) => {
                        this.photoDeleteCallback(data)
                    }}
                    onItemClick={(index) => {
                        this.photoSwiper(index)
                    }}
                    isAddLast={editable.contract_pics}
                    hideItemDelete={!editable.contract_pics}
                />
                <View
                    style={{
                        backgroundColor: colors.labBgColor,
                        width: distances.deviceWidth,
                        height: 10,
                        justifyContent: 'center',
                        borderTopWidth: distances.borderWidth,
                        borderBottomWidth: distances.borderWidth,
                        borderColor: '#d3d3d3',
                    }}
                >
                </View>
            </View>
        )
    }
}