/**
 * Created by Joe on 2017/6/1.
 */
import React, {Component} from 'react';
import {DeviceEventEmitter, Keyboard, Platform, Alert} from 'react-native'
import _ from 'lodash'
import {toastShort} from './../../../../constants/toast'
import {Actions} from 'react-native-router-flux'
import uuid from 'uuid'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
// common
import {isNull} from '../../../../constants/common'
import {getLocation} from '../../../../modules/location/'
import {checkPhone} from '../../../../constants/utils/validate'
//组件
import StoreFormPage from './StoreFormPage'
import WrapLoading from '../../../../components/load/wraploading'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {loadData, setState, rsetState, loadLocal} from '../../../../redux/modules/home/store/createMyStoreRedux'

const mapStateToProps = state => ({
    isRender: state.createMyStore.isRender,                      //是否渲染
    loading: state.createMyStore.loading,
    loading_success: state.createMyStore.loading_success,
    data: state.createMyStore.data,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setState,
        rsetState,
        loadLocal,
    }, dispatch), dispatch
})


class MyStore extends Component {
    constructor(props) {
        super(props)
        this.setInitData = this.setInitData.bind(this)
        this._loadLocationData = this._loadLocationData.bind(this)
        this.locationCallback = this.locationCallback.bind(this)
        this.mapShowFunc = this.mapShowFunc.bind(this)
        this.detailsSelect = this.detailsSelect.bind(this)
        this.callback = this.callback.bind(this)
        this.getStoreTelData = this.getStoreTelData.bind(this)
        this.checkData = this.checkData.bind(this)
        this.setData = this.setData.bind(this)
        this.initLocalData = this.initLocalData.bind(this)
        this.setStorelData = this.setStorelData.bind(this)
        this.getContactsKey = this.getContactsKey.bind(this)
        this.getTagData = this.getTagData.bind(this)
        this.setTagData = this.setTagData.bind(this)
        this.subInfo = this.subInfo.bind(this)
        this.defaultTag = []
        this.defaultPosition = []
        this.state = {
            status: this.props.status,
            editable: this.props.editable,
            showMap: true
        }
        this.location = {
            location_lon: 0,
            location_lat: 0
        }
    }

    componentWillMount() {
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
            )
                .then(tag => {
                    this.defaultTag = tag;
                    let store_tel_data = this.setStorelData(data.store_tel);
                    data.store_tel_data = store_tel_data;
                    let contacts = this.getContactsKey(data.contacts);
                    data.contacts = contacts;
                    let tagData = this.setTagData(data);
                    data.tagData = tagData;
                    this.props.myactions.setState({data: data}, true);
                })
                .catch(err => {
                    console.log(err)
                })
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
            this._loadLocationData().then(location => {
                data.location_lon = location.lng;
                data.location_lat = location.lat;
                // 初始化其他页面信息
                next(data);
            })
        } else {
            this.location.location_lat = data.location_lat;
            this.location.location_lon = data.location_lon;
            // 存在地理位置新
            // 初始化其他页面信息
            next(data);
        }
    }

    /**
     * 获取地理位置
     * @returns {function(*, *=)}
     * @private
     */
    async _loadLocationData() {
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
        let {data} = this.props;
        this.location.location_lat = data.location_lat;
        this.location.location_lon = data.location_lon;
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
        for (let z in obj) {
            data[z] = obj[z];
        }
        this.props.myactions.setState({data}, true);
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
     * 设置保存
     */
    setData() {
        let {data} = this.props;
        if (isNull(data.brand_name)) {
            toastShort('请输入品牌名称');
            return;
        }
        if (isNull(data.branch)) {
            toastShort('请输入分店名称');
            return;
        }
        if (isNull(data.position)) {
            toastShort('请选择门店位置');
            return;
        }
        // if (isNull(data.city_region)) {
        //     toastShort('请选择门店片区');
        //     return;
        // }
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
        let {status} = this.state;
        let url = '';
        let obj = {
            _AT: global.UserInfo.token,
            brand_name: data.brand_name,
            branch: data.branch,
            store_type: data.store_type,
            store_tel: this.getStoreTelData(),
            region_code: data.region_code,
            address: data.address,
            location_lon: data.location_lon,
            location_lat: data.location_lat,
            revised: (this.location.location_lat === data.location_lat && this.location.location_lon === data.location_lon) ? 0 : 1,
            area: data.area,
            found_year: data.found_year,
            tag: data.tag,
            contacts: data.contacts,
            position: data.position,
            city_region: data.city_region,
        };
        if (status == 'add') {
            url = '/am_api/am/store/createDetail';
            obj.level = 0;
        }
        if (status == 'update') {
            url = '/am_api/am/store/modifyDetail';
            obj.id = data.id;
        }
        // 提交数据
        this.props.myactions.loadData(
            url,
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
                // 刷新数据
                let {emitKey} = this.props;
                if (emitKey) {
                    DeviceEventEmitter.emit(emitKey);
                }
                // 返回上页
                Actions.pop();
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
     * 设置前台电话数据
     */
    setStorelData(store_tel) {
        let store_tel_data = new Array();
        // 已经存在前台电话
        if (store_tel.length > 0) {
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
        let {editable, status} = this.state;
        if (status == 'update' && !editable) {
            this.setState({editable: true});
        } else {
            if (status == 'update') {
                //编辑门店信息
                Alert.alert(
                    '门店提醒',
                    '信息修改后，审核通过的门店将被重新审核。\n\n请确认是否修改?',
                    [
                        {text: '取消', onPress: () => null},
                        {text: '确定', onPress: this.setData}
                    ]
                )
            } else {
                //创建/更新新门店
                this.setData()
            }
        }
    }

    render() {
        let {data} = this.props;
        let {editable, status} = this.state;
        return (
            <WrapLoading {...this.props} onErrorPress={this.setInitData}>
                <StoreFormPage
                    data={data}
                    editable={editable}
                    status={status}
                    setStateFunc={this.callback}
                    locationCallback={this.locationCallback}
                    subInfo={this.subInfo}
                    showMap={this.state.showMap}
                />
            </WrapLoading>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyStore)
