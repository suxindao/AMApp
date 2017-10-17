/**
 * Created by Joe on 2017/5/4.
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
import {loadData, setState, rsetState} from '../../../../redux/modules/home/store/storeCourseListRedux'

const emitKey = notification.storeCourseList;

const mapStateToProps = state => ({
    isRender: state.storeCourseList.isRender,                      //是否渲染
    loading: state.storeCourseList.loading,
    loading_success: state.storeCourseList.loading_success,
    editable: state.storeCourseList.editable,
    list: state.storeCourseList.list,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setState,
        rsetState
    }, dispatch), dispatch
})

class StoreCourseList extends Component {
    constructor(props) {
        super(props)
        this.getPhotoData = this.getPhotoData.bind(this)
        this.getInner = this.getInner.bind(this)
        this.editCourse = this.editCourse.bind(this)
        this.getData = this.getData.bind(this)
        this.initLocalData = this.initLocalData.bind(this)
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
                renderRightButton: () => <btn.StoreCourseRightButton id={this.props.id}/>
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
                                marginTop: distances.contractLeftMargin,
                                paddingLeft: distances.contractLeftMargin,
                                paddingRight: distances.contractLeftMargin,
                            }}
                        >
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>开班人数：</Text>
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>
                                {list[index].student_min + '-' + list[index].student_max + '人'}
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
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>课时长度：</Text>
                            <Text style={{fontSize: 13 * fontScale, color: '#999'}}>
                                {list[index].class_min}
                            </Text>
                        </View>
                        <View
                            style={{
                                justifyContent: 'flex-start',
                                marginTop: 5,
                                paddingLeft: distances.contractLeftMargin,
                                paddingRight: distances.contractLeftMargin,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14 * fontScale,
                                    color: '#666',
                                    lineHeight: 24,
                                }}
                            >
                                {list[index].desc}
                            </Text>
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
        Actions.storeCourse({routerData: {status: this.props.status, data: data}});
    }

    /**
     * 初始化数据
     */
    getData() {
        this.props.myactions.loadData(
            '/am_api/am/store/Course',
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

export default connect(mapStateToProps, mapDispatchToProps)(StoreCourseList)