/**
 * Created by Joe on 2017/6/26.
 */
import React, {Component} from 'react';
import {ScrollView, TouchableHighlight, Text, View, DeviceEventEmitter} from 'react-native'
import _ from 'lodash'
import {Actions} from 'react-native-router-flux'
//组件
import PhotoSelect from '../../../../components/photoSelect'
import {btn} from './../../../../components/common/RenderRightButton'
import WrapLoading from '../../../../components/load/wraploading'
import ListNoData from '../../../../components/list/NoData'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
// common
import {notification, store} from '../../../../constants/common'
import {httpIP} from '../../../../helpers/Upload'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {loadData, setState, rsetState} from '../../../../redux/modules/home/store/byStagesPackageListRedux'
import {setState as setStageState} from '../../../../redux/modules/home/store/byStagesPackageRedux'

const emitKey = notification.byStagesPackage;

const mapStateToProps = state => ({
    isRender: state.byStagesPackageList.isRender,                      //是否渲染
    loading: state.byStagesPackageList.loading,
    loading_success: state.byStagesPackageList.loading_success,
    editable: state.byStagesPackageList.editable,
    list: state.byStagesPackageList.list,
    data: state.byStagesPackage.data,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setState,
        setStageState,
        rsetState
    }, dispatch), dispatch
})

class ByStagesPackageList extends Component {
    constructor(props) {
        super(props)
        this.getPhotoData = this.getPhotoData.bind(this)
        this.getInner = this.getInner.bind(this)
        this.editCourse = this.editCourse.bind(this)
        this.getData = this.getData.bind(this)
        this.initLocalData = this.initLocalData.bind(this)
        this.getInstalmentInfo = this.getInstalmentInfo.bind(this)
        this.getInstalmentInfos = this.getInstalmentInfos.bind(this)
        this.photoClick = this.photoClick.bind(this)
        this.refresh = '';
        this.editable = this.props.status === 'view' ? false : true;
    }

    componentWillMount() {
        this.refresh = DeviceEventEmitter.addListener(emitKey, param => {
            this.getData();
        });
        this.getData();
        if (this.editable) {
            Actions.refresh({
                renderRightButton: () => <btn.ByStagesPackageRightButton id={this.props.id}
                                                                         callback={this.getInstalmentInfo}/>
            })
        }
    }

    componentWillUnmount() {
        this.props.myactions.rsetState();
        this.refresh.remove();
    }

    shouldComponentUpdate(np, ns) {
        return np.isRender;
    }

    /**
     * 初始化列表数据
     */
    getPhotoData(data) {
        let pics = new Array();
        if (data.pics) {
            for (var z of data.pics) {
                pics.push(
                    {
                        fileName: z.file_id,
                        isStored: true,
                        url: httpIP.substring(0, httpIP.length - 1) + z.file_path,
                        upload: {
                            progress: 1,
                            uploadFailed: false,
                            uploadInfo: {
                                file_id: z.file_id,
                                url_path: z.file_path
                            }
                        }
                    }
                )
            }
        }
        return pics;
    }

    /**
     * 照片预览
     */
    photoClick(data, index) {
        if (Array.isArray(data) && data.length > 0) {
            Actions.photoSwiper({
                photo_data: data,
                index
            })
        }
    }

    /**
     * 获取列表数据标签
     */
    getInner() {
        let {list = new Array()} = this.props;
        let tag = new Array();
        for (var z in list) {
            let index = z;
            let pics = list[index].album.pics
            tag.push(
                <TouchableHighlight
                    key={'course_' + index}
                    underlayColor='#fafafa'
                    onPress={() => {
                        this.editCourse(list[index])
                    }}
                >
                    <View
                        style={{
                            marginTop: 10,
                            borderTopWidth: distances.borderWidth,
                            borderBottomWidth: distances.borderWidth,
                            borderColor: colors.borderColor,
                            backgroundColor: '#fff',
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                marginTop: distances.contractLeftMargin,
                                paddingLeft: distances.contractLeftMargin,
                                paddingRight: distances.contractLeftMargin,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16 * fontScale,
                                    color: '#333',
                                }}
                            >
                                {list[index].name}
                            </Text>
                        </View>
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                marginTop: 10,
                                paddingLeft: distances.contractLeftMargin,
                                paddingRight: distances.contractLeftMargin,
                            }}
                        >
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>课时数：</Text>
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>
                                {list[index].course_num}
                            </Text>
                        </View>
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                marginTop: 10,
                                paddingLeft: distances.contractLeftMargin,
                                paddingRight: distances.contractLeftMargin,
                            }}
                        >
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>课程原价：</Text>
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>
                                {list[index].original_price}元
                            </Text>
                        </View>
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                marginTop: 10,
                                paddingLeft: distances.contractLeftMargin,
                                paddingRight: distances.contractLeftMargin,
                            }}
                        >
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>课程现价：</Text>
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>
                                {list[index].current_price}元
                            </Text>
                        </View>
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                marginTop: 10,
                                paddingLeft: distances.contractLeftMargin,
                                paddingRight: distances.contractLeftMargin,
                            }}
                        >
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>分期数：</Text>
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>
                                {list[index].instalment.name}
                            </Text>
                        </View>
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                marginTop: 10,
                                paddingLeft: distances.contractLeftMargin,
                                paddingRight: distances.contractLeftMargin,
                            }}
                        >
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>月供金额：</Text>
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>
                                {list[index].monthly_repayment}元
                            </Text>
                        </View>
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                marginTop: 10,
                                paddingLeft: distances.contractLeftMargin,
                                paddingRight: distances.contractLeftMargin,
                            }}
                        >
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>门店自由课程照片</Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: '#fff',
                            }}
                        >
                            <PhotoSelect
                                photoNumber={20}
                                dataPics={this.getPhotoData(list[index].album)}
                                style={{backgroundColor: '#fff', marginBottom: 15}}
                                imagesPerRow={4}
                                imageMargin={distances.contractLeftMargin}
                                initDataWillMount={true}
                                isAddLast={false}
                                hideItemDelete={true}
                                onItemClick={(index) => {
                                    this.photoClick(pics, index)
                                }}
                            />
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }
        return tag;
    }

    /**
     * 点击编辑按钮
     */
    editCourse(data) {
        this.getInstalmentInfo();
        let datas = _.cloneDeep(data);
        datas.instalment = data.instalment.id;
        Actions.byStagesPackage({routerData: {status: this.props.status, data: datas}});
    }

    /**
     * 初始化数据
     */
    getData() {
        this.props.myactions.loadData(
            '/am_api/am/store/instalmentCourse',
            {
                _AT: global.UserInfo.token,
                id: this.props.id,
            },
            this.initLocalData
        );
    }

    async initLocalData(client, path, param) {
        try {
            let list = await client.post(path, {data: param});
            this.props.myactions.setState({list: list}, true);
            return list;
        } catch (e) {
            console.log(e)
        }
    }

    getInstalmentInfo() {
        this.props.myactions.loadData(
            '/am_api/am/store/instalmentCourseSetting',
            {_AT: global.UserInfo.token},
            this.getInstalmentInfos
        );
    }

    async getInstalmentInfos(client, path, param) {
        try {
            let result = await client.post(path, {data: param});
            this.props.myactions.setStageState({instalment: result}, true);
            return result;
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        let {list = new Array()} = this.props;
        return (
            <ScrollView style={{backgroundColor: colors.labBgColor, flex: 1}} bounces={false}>
                <WrapLoading {...this.props} onErrorPress={this.getData}>
                    {
                        list.length <= 0 ?
                            <ListNoData
                                visible={true}
                                icon={require('./../../../../sources/images/list_no_data.png')}
                                des='暂时没有哦'
                            /> :
                            this.getInner()
                    }
                </WrapLoading>
            </ScrollView>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ByStagesPackageList)