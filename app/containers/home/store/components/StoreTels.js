/**
 * Created by Joe on 2017/6/2.
 */
import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native'
import _ from 'lodash'
import uuid from 'uuid'
//组件
import ContentComponent from '../../../../components/common/ContentComponent'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {loadData, setState, rsetState} from '../../../../redux/modules/home/store/createMyStoreRedux'

const mapStateToProps = state => ({
    data: state.createMyStore.data,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setState,
        rsetState
    }, dispatch), dispatch
})

class StoreTels extends Component {
    constructor(props) {
        super(props)
        this.getStoreTel = this.getStoreTel.bind(this);
        this.getAddStoreTel = this.getAddStoreTel.bind(this);
        this.addStoreTel = this.addStoreTel.bind(this);
        this.delStoreTel = this.delStoreTel.bind(this);
        this.modifyStoreTel = this.modifyStoreTel.bind(this);
    }

    /**
     * 生成电话号dom标签
     */
    getStoreTel() {
        let {store_tel_data = new Array()} = this.props.data;
        let storeTelTag = new Array();
        // 遍历数据，生成dom标签
        for (var z = 0; z < store_tel_data.length; z++) {
            let index = z;
            storeTelTag.push(
                <View
                    key={'store_tel' + index}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingLeft: 10,
                        paddingRight: 30,
                    }}
                >
                    <ContentComponent
                        config={{
                            hasLine: true,
                            title: '前台电话' + (index + 1),
                            type: 'input',
                            keyboardType: 'numeric',
                            maxLength: 11,
                            placeholder: '请填写',
                            editable: this.props.editable,
                            key: 'store_tel',
                            value: store_tel_data[index].store_tel || '',
                        }}
                        callback={data => {
                            this.modifyStoreTel(data, store_tel_data[index].key)
                        }}
                    />
                    {
                        this.props.editable ?
                            <TouchableOpacity
                                onPress={
                                    () => {
                                        this.delStoreTel(store_tel_data[index].key)
                                    }
                                }
                            >
                                <Image
                                    style={{
                                        width: 20,
                                        height: 20,
                                    }}
                                    source={require('../../../../sources/images/delete.png')}
                                />
                            </TouchableOpacity> :
                            <View
                                style={{
                                    width: 20,
                                    height: 20,
                                }}
                            />
                    }

                </View>
            );
        }
        return storeTelTag;
    }

    /**
     * 获取添加剂按钮标签
     */
    getAddStoreTel() {
        let {store_tel_data = new Array()} = this.props.data;
        return (
            store_tel_data.length < 5 && this.props.editable ?
                <TouchableOpacity
                    style={{
                        width: distances.deviceWidth,
                        height: 60,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: distances.borderWidth,
                        borderColor: colors.borderColor,
                    }}
                    onPress={this.addStoreTel}
                >
                    <Image
                        style={{
                            width: 18,
                            height: 18,
                            marginRight: 10,
                        }}
                        source={require('../../../../sources/images/store/add_contacts.png')}
                    />
                    <Text
                        style={{
                            fontSize: 16 * fontScale,
                            color: colors.blueColor,
                        }}
                    >
                        添加前台电话
                    </Text>
                </TouchableOpacity> :
                null
        )
    }

    /**
     * 删除按钮
     */
    delStoreTel(key) {
        let store_tel_data = _.cloneDeep(this.props.data.store_tel_data);
        let store_tel = new Array();
        for (var z in store_tel_data) {
            let index = z;
            if (store_tel_data[index].key === key) {
                store_tel_data.splice(Number(index), 1);
                break;
            }
        }
        for (var a of store_tel_data) {
            store_tel.push(a.store_tel)
        }

        let data = _.cloneDeep(this.props.data);
        data.store_tel_data = store_tel_data;
        data.store_tel = store_tel.join();
        this.props.myactions.setState({data: data}, true);
    }

    /**
     * 点击添加按钮
     */
    addStoreTel() {
        let {store_tel_data = new Array(), store_tel = ''} = this.props.data;
        let data = _.cloneDeep(this.props.data);
        // 添加新的一组数据到电话号标签当中
        store_tel_data.push(
            {
                key: uuid.v4().replace(/-/g, ""),
                store_tel: '',
            }
        )
        data.store_tel_data = store_tel_data;
        data.store_tel = store_tel + ',';
        this.props.myactions.setState({data: data}, true);
    }

    /**
     * 编辑电话号回调函数
     */
    modifyStoreTel(obj, key) {
        let store_tel_data = _.cloneDeep(this.props.data.store_tel_data);
        let store_tel = new Array();
        // 通过key获取到正在编辑的电话号，赋值编辑后的数据到存在key的电话号数据
        for (var z in store_tel_data) {
            if (store_tel_data[z].key === key) {
                Object.assign(store_tel_data[z], obj);
                break;
            }
        }
        // 将修改后的数据放进只存放电话号的容器当中（用于提交数据）
        for (var a of store_tel_data) {
            store_tel.push(a.store_tel)
        }
        let data = _.cloneDeep(this.props.data);
        data.store_tel_data = store_tel_data;
        data.store_tel = store_tel.join();
        this.props.myactions.setState({data: data}, true);
    }

    render() {
        return (
            <View>
                {this.getStoreTel()}
                {this.getAddStoreTel()}
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreTels)