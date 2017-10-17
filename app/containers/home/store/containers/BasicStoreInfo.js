/**
 * Created by Joe on 2017/4/21.
 */
import React, {Component} from 'react';
import {ScrollView, View, TextInput, Text, TouchableOpacity, DeviceEventEmitter, Keyboard, Platform} from 'react-native'
import _ from 'lodash'
import {toastShort} from '../../../../constants/toast'
import {Actions} from 'react-native-router-flux'
import uuid from 'uuid'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
// common
import {notification, isNull} from '../../../../constants/common'
import {getLocation} from '../../../../modules/location/'
import {checkPhone} from '../../../../constants/utils/validate'
//组件
import ContentComponent from '../../../../components/common/ContentComponent'
import Regions from '../../../../components/modal/regions'
import Positions from '../../../../components/modal/positions'
import SpecialTag from '../components/SpecialTag'
import MapComponent from './../../../home/store/components/MapComponent'
import StoreTel from './../components/StoreTel'
import Contact from './../components/Contact'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {loadData, setState, rsetState, loadLocal} from '../../../../redux/modules/home/store/basicStoreInfoRedux'

const emitKeyviewStore = notification.viewStore;

const mapStateToProps = state => ({
    isRender: state.basicStoreInfo.isRender,                      //是否渲染
    loading: state.basicStoreInfo.loading,
    loading_success: state.basicStoreInfo.loading_success,
    editable: state.basicStoreInfo.editable,
    data: state.basicStoreInfo.data,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setState,
        rsetState,
        loadLocal,
    }, dispatch), dispatch
})


class BasicStoreInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showMap: true
        }

        this.setInitData = this.setInitData.bind(this)
        this.getEditable = this.getEditable.bind(this)
        this._loadData = this._loadData.bind(this)
        this.locationCallback = this.locationCallback.bind(this)
        this.mapShowFunc = this.mapShowFunc.bind(this)
        this.detailsSelect = this.detailsSelect.bind(this)
        this.callback = this.callback.bind(this)
        this.tagCallback = this.tagCallback.bind(this)
        this.openCityCallback = this.openCityCallback.bind(this)
        this.openPositionCallack = this.openPositionCallack.bind(this)
        this.areaCallback = this.areaCallback.bind(this)
        this.getStoreTelData = this.getStoreTelData.bind(this)
        this.checkData = this.checkData.bind(this)
        this.setData = this.setData.bind(this)
        this.initLocalData = this.initLocalData.bind(this)
        this.renderLable = this.renderLable.bind(this)
        this.renderTR = this.renderTR.bind(this)
        this.setStorelData = this.setStorelData.bind(this)
        this.getContactsKey = this.getContactsKey.bind(this)
        this.getTagData = this.getTagData.bind(this)
        this.setTagData = this.setTagData.bind(this)
        this.subInfo = this.subInfo.bind(this)
        this.status = this.props.routerData.status;
        this.defaultTag = []
    }

    componentWillMount() {
        this.getEditable();
        this.setInitData();
    }

    componentWillUnmount() {
        this.props.myactions.rsetState();
        Keyboard.dismiss()
    }

    shouldComponentUpdate(np, ns) {
        return np.isRender;
    }

    /**
     * 初始化数据
     */
    setInitData() {
        let next = data => {
            // 获取默认特色服务数据
            this.props.myactions.loadData(
                '/am_api/am/store/tags',
                {
                    _AT: global.UserInfo.token,
                },
                this.getTagData
            ).then(tag => {
                this.defaultTag = tag;
                let store_tel_data = this.setStorelData(data.store_tel);
                data.store_tel_data = store_tel_data;
                let contacts = this.getContactsKey(data.contacts);
                data.contacts = contacts;
                let tagData = this.setTagData(data);
                data.tagData = tagData;
                this.props.myactions.setState({data: data}, true);
            }).catch(err => {
                console.log(err)
            });
        }
        // 获取当前数据
        let data = _.cloneDeep(this.props.data);
        // 判断是否存在路由数据，存在则合并路由数据
        if (this.props.routerData) {
            Object.assign(data, _.cloneDeep(this.props.routerData.data));
        }
        // 判断是否存在地理位置信息
        if (!data.location_lon && !data.location_lat) {
            // 如果不存在，则获取当前地理位置
            this._loadData().then(location => {
                data.location_lon = location.lng;
                data.location_lat = location.lat;
                // 初始化其他页面信息
                next(data);
            })
        } else {
            // 存在地理位置新
            // 初始化其他页面信息
            next(data);
        }
    }

    /**
     * 获取页面是否可编辑
     */
    getEditable() {
        let {routerData} = this.props;
        // 获取路由数据，设置是否可编辑
        if (routerData && routerData.editable)
            this.props.myactions.setState({editable: routerData.editable}, true);
    }

    /**
     * 获取地理位置
     * @returns {function(*, *=)}
     * @private
     */
    async _loadData() {
        let location = ''
        try {
            location = await getLocation()
        } catch (e) {
            location = {lng: 0, lat: 0};
        }
        return location
    }

    /**
     * 点击地图，进入大地图页面
     */
    locationCallback() {
        // 在这里设置是否可点击
        let {data, editable} = this.props;
        let mapPress = editable.location
        if (mapPress) {
            // 这时拿到的位置或是由tx->bd的，或者直接是bd的
            Actions.storeEditMap(
                {
                    routerData: {
                        location: {
                            lng: data.location_lon,
                            lat: data.location_lat
                        },
                        handlerPositionChange: this.detailsSelect,
                        backFunc: this.mapShowFunc
                    }
                })
            this.mapShowFunc()
        }
    }

    mapShowFunc() {
        if (Platform.OS === 'android') {
            this.setState({
                showMap: !this.state.showMap
            })
        }
    }

    /**
     * 大地图页面点击保存，经纬度回调
     */
    detailsSelect(lng, lat) {
        this.callback(
            {
                location_lon: lng,
                location_lat: lat
            }
        );
    }

    /**
     * 回调函数，赋值数据
     */
    callback(obj) {
        let data = _.cloneDeep(this.props.data);
        for (var z in obj) {
            data[z] = obj[z];
        }
        this.props.myactions.setState({data}, true);
    }

    /**
     * 特色服务标签回调函数
     */
    tagCallback(obj) {
        this.callback(obj);
        return;
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
    openPositionCallack() {
        this.refs.positions.slideModal();
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
        )
    }

    /**
     * 门店位置选择回调
     */
    positionCallback(obj) {
        console.log("obj =>", obj)
        this.callback(obj)
    }

    /**
     * 前台电话号回调
     */
    getStoreTelData() {
        let {store_tel = ''} = this.props.data;
        let stArr = store_tel.split(',');
        let newstArr = new Array();
        for (var z of stArr) {
            if (z.length > 0) {
                newstArr.push(z);
            }
        }
        return newstArr.join();
    }

    /**
     * 校验数据
     */
    checkData() {
        let tel = this.getStoreTelData();
        // 存在电话号则校验
        if (!isNull(tel)) {
            let phoneArr = tel.split(',');
            for (var z in phoneArr) {
                if (!checkPhone(phoneArr[z]).pass) {
                    toastShort('前台电话格式有误，请修正！');
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 设置保存草稿数据
     */
    setData() {
        let {data} = this.props;
        if (data.found_year) {
            let flag = true;
            for (var z = 1970; z <= new Date().Format('yyyy'); z++) {
                if (data.found_year == z) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                toastShort('请输入4位有效成立年份');
                return;
            }
        }
        let obj = {
            _AT: global.UserInfo.token,
            brand_name: data.brand_name,
            branch: data.branch,
            store_type: data.store_type,
            store_tel: this.getStoreTelData(),
            region_code: data.region_code,
            position: data.position,
            address: data.address,
            location_lon: data.location_lon,
            location_lat: data.location_lat,
            area: data.area,
            found_year: data.found_year,
            tag: data.tag,
            contacts: data.contacts,
        };
        // 如果当前为修改状态，则添加剂门店id参数；否则添加编号数据
        if (this.status === 'update')
            obj.id = this.props.routerData.id;
        else
            obj.cms_code = data.cms_code;
        // 提交数据
        this.props.myactions.loadData(
            this.status === 'update' ? '/am_api/am/store/modifyDetail' : '/am_api/am/store/createDetail',
            obj,
            this.initLocalData
        );
    }

    async initLocalData(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            if (data.errorCode === 1) {
                toastShort(data.message);
            } else {
                // 返回上页
                if (this.status === 'add') {
                    Actions.pop({popNum: 2, refresh: {routerData: {id: data.id, status: 'update'}}});
                } else {
                    Actions.pop({routerData: {id: data.id, status: this.status}});
                }
                // 刷新数据
                let {emitKey} = this.props;
                if (emitKey) {
                    DeviceEventEmitter.emit(emitKey, data.id);
                }
                // 刷新首页列表数据
                DeviceEventEmitter.emit(emitKeyviewStore);
            }
            return data;
        } catch (e) {
            toastShort(e.message);
        }
    }

    async getTagData(client, path, param) {
        try {
            let tag = await client.post(path, {data: param});
            return tag;
        } catch (e) {
            toastShort(e.message);
        }
    }

    /**
     * 返回分栏标签
     */
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

    /**
     * 设置前台电话数据
     */
    setStorelData(store_tel) {
        let store_tel_data = new Array();
        // 已经存在前台电话
        if (store_tel && store_tel.length > 0) {
            // 切分数据
            let tel_arr = store_tel.split(',');
            for (var z of tel_arr) {
                // 遍历切分后的数据，为每一项添加剂一个唯一的key，用于编辑操作
                store_tel_data.push(
                    {
                        key: uuid.v4().replace(/-/g, ""),
                        store_tel: z,
                    }
                );
            }
        }
        return store_tel_data;
    }

    /**
     * 获取联系人数据
     */
    getContactsKey(contacts) {
        let con = _.cloneDeep(contacts);
        // 遍历已存在数据，添加唯一标识key，用于修改
        if (contacts.length > 0) {
            for (var z in con) {
                con[z].key = uuid.v4().replace(/-/g, "");
            }
        }
        return con;
    }

    /**
     * 设置特色服务标签
     */
    setTagData(data) {
        let tagArr = new Array();
        if (data.tag.length > 0) {
            // 切分标签数据
            let tag = data.tag.split(',');
            // 遍历已存在标签数据，均设为已经选中
            for (var z of tag) {
                let flag = true;
                for (var a of this.defaultTag) {
                    if (z === a.tag) {
                        flag = false;
                        a.checked = true;
                        break;
                    }
                }
                if (flag) {
                    tagArr.push(
                        {
                            tag: z,
                            checked: true
                        }
                    );
                }
            }
        }
        return this.defaultTag.concat(tagArr);
    }

    /**
     * 保存基础信息
     */
    subInfo() {
        this.setData();
    }

    render() {
        let {data, editable} = this.props;
        return (
            <View style={{flex: 1}}>
                <KeyboardAwareScrollView
                    style={{
                        backgroundColor: colors.labBgColor,
                        flex: 1,
                        marginBottom: this.status === 'view' ? 0 : 60,
                    }}
                    bounces={false}>
                    <View style={{width: distances.deviceWidth, backgroundColor: '#fff',}}>
                        {this.renderLable(`门店编号：${util.getNull2Str(this.props.data.cms_code)}`)}
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '品牌名称',
                                type: 'input',
                                placeholder: '请填写',
                                editable: editable.brand_name,
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
                                editable: editable.branch,
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
                                editable: editable.store_type,
                                key: 'store_type',
                                value: this.props.data.store_type
                            }}
                            callback={this.callback}
                        />
                        <StoreTel editable={editable.store_tel}/>
                        {this.renderTR()}
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '城市区域',
                                type: 'touch',
                                placeholder: '请选择',
                                editable: editable.region,
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
                            cityCallback={(city) => {
                                this.areaCallback(city)
                            }}
                        />
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '门店位置',
                                type: 'touch',
                                placeholder: '请选择',
                                editable: editable.position,
                                key: 'position',
                                value: data.position ? data.position.name : ''
                            }}
                            touchCallback={this.openPositionCallack}
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
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '详细地址',
                                type: 'input',
                                placeholder: '请填写',
                                editable: editable.address,
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
                                mapPress={this.locationCallback}
                                showMap={this.state.showMap}
                            />
                        </View>
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '门店面积',
                                type: 'input',
                                placeholder: '请填写',
                                keyboardType: 'numeric',
                                editable: editable.area,
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
                                editable: editable.found_year,
                                key: 'found_year',
                                value: util.getNull2Str(data.found_year) + ''
                            }}
                            callback={this.callback}
                        />
                        {this.renderTR()}
                        <Contact editable={editable.contacts} callback={this.callback} data={data}/>
                        <SpecialTag
                            dataKey='tag'
                            data={data.tagData}
                            callback={this.tagCallback}
                            editable={editable.tag}
                        />
                    </View>
                </KeyboardAwareScrollView>
                {
                    this.status === 'view' ?
                        null :
                        <View
                            style={{
                                width: distances.deviceWidth,
                                height: 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#fff',
                                borderTopWidth: distances.borderWidth,
                                borderColor: colors.borderColor,
                                position: 'absolute',
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <TouchableOpacity
                                //underlayColor='#fafafa'
                                style={{
                                    width: distances.deviceWidth - 100,
                                    height: 38,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: colors.blueColor,
                                    borderRadius: 3,
                                }}
                                onPress={this.subInfo}
                            >
                                <Text
                                    style={{
                                        fontSize: 16 * fontScale,
                                        color: '#fff',
                                    }}
                                >
                                    {this.status === 'add' ? '创建' : '保存'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                }
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicStoreInfo)
