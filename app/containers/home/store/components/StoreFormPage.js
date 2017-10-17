/**
 * Created by Joe on 2017/6/1.
 */
import React, {Component} from 'react';
import {ScrollView, View, TextInput, Text, TouchableOpacity, DeviceEventEmitter, Keyboard, Platform} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
//组件
import ContentComponent from '../../../../components/common/ContentComponent'
import Regions from '../../../../components/modal/regions'
import CityRegions from '../../../../components/modal/CityRegions'
import Positions from '../../../../components/modal/positions'
import SpecialTag from '../components/SpecialTag'
import MapComponent from './../../../home/store/components/MapComponent'
import StoreTels from './../components/StoreTels'
import Contact from './../components/Contact'
import {ConfirmButton} from '../../../../components/common'

export default class StoreFormPage extends Component {
    constructor(props) {
        super(props)
        this.renderTR = this.renderTR.bind(this);
        this.callback = this.callback.bind(this);
        this.openCityCallback = this.openCityCallback.bind(this);
        this.openPosition = this.openPosition.bind(this);
        this.openCityRegion = this.openCityRegion.bind(this);
        this.areaCallback = this.areaCallback.bind(this);
        this.positionCallback = this.positionCallback.bind(this);
        this.cityRegionCallback = this.cityRegionCallback.bind(this);
    }

    /**
     * 返回无title的空标签
     */
    renderTR() {
        return (
            <View
                style={{
                    backgroundColor: colors.labBgColor,
                    width: distances.deviceWidth,
                    height: 10,
                    borderTopWidth: distances.borderWidth,
                    borderBottomWidth: distances.borderWidth,
                    borderColor: '#d3d3d3',
                }}
            >
            </View>
        )
    }

    callback(obj) {
        this.props.setStateFunc(obj);
    }

    /**
     * 点击打开城市选择
     */
    openCityCallback() {
        this.refs.citys.slideModal();
    }

    /**
     * 点击打开门店位置选择
     */
    openPosition() {
        this.refs.positions.slideModal();
    }

    /**
     * 点击打开片区选择
     */
    openCityRegion() {
        this.refs.city_region.slideModal();
    }

    /**
     * 城市选择回调
     */
    areaCallback(obj) {
        let region = '';
        let region_code = '';
        for (var z of obj) {
            region += z.fullname + '-';
            region_code += z.region_id + ',';
        }
        region = region.substring(0, region.length - 1);
        region_code = region_code.substring(0, region_code.length - 1);
        this.callback(
            {
                region_code: region_code,
                region: region
            }
        );
    }

    /**
     * 门店位置选择回调
     */
    positionCallback(obj) {
        this.callback(obj)
    }

    /**
     * 片区选择回调
     */
    cityRegionCallback(obj) {
        this.callback(obj)
    }

    render() {
        let {data, editable, showMap} = this.props;
        return (
            <View style={{flex: 1}}>
                <KeyboardAwareScrollView
                    style={{
                        backgroundColor: colors.labBgColor,
                        flex: 1,
                    }}
                    bounces={false}
                >
                    <View style={{width: distances.deviceWidth, backgroundColor: '#fff',}}>
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '品牌名称',
                                type: 'input',
                                placeholder: '请填写',
                                editable: editable,
                                key: 'brand_name',
                                value: data.brand_name
                            }}
                            callback={this.callback}
                        />
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '分店名称',
                                type: 'input',
                                placeholder: '请填写',
                                editable: editable,
                                key: 'branch',
                                value: data.branch
                            }}
                            callback={this.callback}
                        />
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '门店类型',
                                type: 'radio',
                                radio: [
                                    {
                                        id: 0,
                                        name: '连锁'
                                    },
                                    {
                                        id: 1,
                                        name: '单店'
                                    }
                                ],
                                editable: editable,
                                key: 'store_type',
                                value: data.store_type
                            }}
                            callback={this.callback}
                        />
                        <StoreTels editable={editable}/>
                        {this.renderTR()}
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '城市区域',
                                type: 'touch',
                                placeholder: '请选择',
                                editable: editable,
                                key: 'region',
                                value: data.region
                            }}
                            touchCallback={this.openCityCallback}
                        />
                        <Regions
                            ref="citys"
                            visible={true}
                            touchClose={() => {
                            }}
                            cityCallback={
                                city => {
                                    this.areaCallback(city)
                                }
                            }
                        />
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '门店位置',
                                type: 'touch',
                                placeholder: '请选择',
                                editable: editable,
                                key: 'position',
                                value: data.position ? data.position.name : ''
                            }}
                            touchCallback={this.openPosition}
                        />
                        <Positions
                            ref="positions"
                            data_key="position"
                            visible={true}
                            touchClose={() => {
                            }}
                            positionCallback={
                                position => {
                                    this.positionCallback(position)
                                }
                            }
                        />
                        {/*//片区选择*/}
                        {/*<ContentComponent*/}
                        {/*config={{*/}
                        {/*hasLine: true,*/}
                        {/*title: '所在片区',*/}
                        {/*type: 'touch',*/}
                        {/*placeholder: '请选择',*/}
                        {/*editable: editable,*/}
                        {/*key: 'city_region',*/}
                        {/*value: data.city_region ? data.city_region.name : ''*/}
                        {/*}}*/}
                        {/*touchCallback={this.openCityRegion}*/}
                        {/*/>*/}
                        {/*<CityRegions*/}
                        {/*ref="city_region"*/}
                        {/*data_key="city_region"*/}
                        {/*visible={true}*/}
                        {/*touchClose={() => {*/}
                        {/*}}*/}
                        {/*cityRegionsCallback={*/}
                        {/*city_region => {*/}
                        {/*this.cityRegionCallback(city_region)*/}
                        {/*}*/}
                        {/*}*/}
                        {/*/>*/}
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '详细地址',
                                type: 'input',
                                placeholder: '请填写',
                                editable: editable,
                                key: 'address',
                                value: data.address
                            }}
                            callback={this.callback}
                        />
                        <View
                            style={{
                                flex: 1,
                                borderTopWidth: distances.borderWidth,
                                borderBottomWidth: distances.borderWidth,
                                borderColor: colors.borderColor,
                            }}
                        >
                            <MapComponent
                                width={distances.deviceWidth}
                                height={240}
                                lng={data.location_lon}
                                lat={data.location_lat}
                                mapPress={editable ? this.props.locationCallback : null}
                                showMap={showMap}
                            />
                        </View>
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '门店面积',
                                type: 'input',
                                placeholder: '请填写',
                                keyboardType: 'numeric',
                                editable: editable,
                                key: 'area',
                                value: data.area === 0 ? '' : data.area + ''
                            }}
                            callback={this.callback}
                        />
                        <ContentComponent
                            config={{
                                hasLine: false,
                                title: '成立年份',
                                type: 'input',
                                placeholder: '请填写',
                                keyboardType: 'numeric',
                                maxLength: 4,
                                editable: editable,
                                key: 'found_year',
                                value: util.getNull2Str(data.found_year) + ''
                            }}
                            callback={this.callback}
                        />
                        {this.renderTR()}
                        <Contact editable={editable} callback={this.callback} data={data}/>
                        <SpecialTag
                            dataKey='tag'
                            data={data.tagData}
                            callback={this.callback}
                            editable={editable}
                        />
                    </View>
                </KeyboardAwareScrollView>
                {
                    this.props.status === 'view' ?
                        null : (
                            <ConfirmButton confirmPress={this.props.subInfo}
                                           touchStyle={{marginLeft: 50, marginRight: 50}}
                                           confirmText={editable ? '保存' : '编辑'}
                            />
                        )
                }
            </View>
        )
    }
}