/**
 * create at 04/25/17
 */
import React, {Component} from 'react';
import {Text, Image, TouchableHighlight, View, ScrollView, Alert} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Actions} from 'react-native-router-flux'

// components
import {
    TopComponent,
    TeacherInfo,
    DesComponent,
    PhotosComponent,
    SaveComponent
} from '../components/listeningCourse/EditComponents'
import TimeSectionComponent from '../components/listeningCourse/EditTimeGroup'
import PickerModal from '../../../../components/modal/PickerModal'
import LoadingFloatingLayer from '../../../../components/common/LoadingFloatingLayer'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {submitData} from '../../../../redux/modules/home/store/listenCourseEditRedux'

// presenters
import {fetchCourseAddRequest, fetchCourseChangeRequest} from '../presenters/listeningCoursePresenter'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// common
import {toastShort} from '../../../../constants/toast'
import _ from 'lodash'
import {httpIP} from '../../../../helpers/Upload'
import {validate} from '../../../../constants/utils/validate'

// data
const DayArr = ['工作日', '周六日', '全周']
const TIME_GROUP_COUNT = 5
const InitTimeGroup = [{select: '', min: '', max: ''}]

const mapStateToProps = state => ({
    submiting: state.listenCourseEdit.submit_loading,
    submit_success: state.listenCourseEdit.submit_loading_success,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({submitData}, dispatch), dispatch
})

class Container extends Component {
    constructor(props) {
        super(props)

        // 照片数据，在photoSelect 组件中已通过state控制刷新，这里只需记录数据变化
        this.upload_photos = [] // 上传用 每次根据 photoSelect 反馈做变化
        this.lesson_photos = [] // 给 photoSelect 组件用, 会初始化一次
        this.dayIndex = 0 // 记录是哪个pickerModal
        this.type = 'add' // 编辑情况
        this.courseId = 0 // 课程id
        this.coursePhotosId = 0 // 课程相册id
        this.editable = false  // 是否可编辑
        this.state = {
            name: '', // 试听课程名称
            student_min: '', // 开班最小人数
            student_max: '', // 开班最大人数
            time_groups: [], // 试听时段
            teacher: '', // 教师姓名
            teacher_tel: '', // 教师电话
            teacher_duty: '', // 教师职务
            desc: '', // 试听课程描述
            dayModal: false
        }

        this._initData = this._initData.bind(this)
        this._updateInput = this._updateInput.bind(this)
        this._timeSelect = this._timeSelect.bind(this)
        this._timeConfirm = this._timeConfirm.bind(this)
        this._timeGroupAdd = this._timeGroupAdd.bind(this)
        this._timeGroupDelete = this._timeGroupDelete.bind(this)
        this._photosDelete = this._photosDelete.bind(this)
        this._photosUpload = this._photosUpload.bind(this)
        this._photosClick = this._photosClick.bind(this)
        this._saveClick = this._saveClick.bind(this)
        this._requestData = this._requestData.bind(this)
    }

    componentWillMount() {
        if (Boolean(this.props.routerData) && Boolean(this.props.routerData.type)
            && this.props.routerData.type == 'edit') {
            // 编辑情况
            this.type = 'edit'
            if (Boolean(this.props.routerData.editable)) {
                this.editable = true
            }
            this._initData()
        } else {
            // 新建情况
            this.type = 'add'
            this.editable = true
            let timeGroup = _.cloneDeep(InitTimeGroup)
            this.setState({
                time_groups: timeGroup
            })
        }
    }

    _initData() {
        let {data} = this.props.routerData
        this.courseId = (typeof data.id === 'number') ? data.id : 0
        let timeGroup = []
        if (Array.isArray(data.trial_time) && data.trial_time.length > 0) {
            // 有时段数据取数据
            timeGroup = _.cloneDeep(data.trial_time)
        } else {
            // 没有时段数据，添加一个
            timeGroup = _.cloneDeep(InitTimeGroup)
        }
        this.coursePhotosId = (Boolean(data.album) && Boolean(data.album.id)) ? data.album.id : 0
        if (Boolean(data.album) && Array.isArray(data.album.pics) && data.album.pics.length > 0) {
            // 修改时相册id, server端用，客户端透传
            data.album.pics.forEach((item, idx) => {
                this.lesson_photos.push({
                    fileName: Boolean(item.file_id) ? item.file_id : '',
                    isStored: true,
                    url: Boolean(item.file_path) ? httpIP.substring(0, httpIP.length - 1) + item.file_path : '',
                    upload: {
                        progress: 1,
                        uploadFailed: false,
                        uploadInfo: {
                            file_id: Boolean(item.file_id) ? item.file_id : '',
                            url_path: Boolean(item.file_path) ? item.file_path : ''
                        }
                    }
                })
            })
            this.upload_photos = _.cloneDeep(data.album.pics)
        }
        this.setState({
            name: Boolean(data.name) ? data.name : '',
            desc: Boolean(data.desc) ? data.desc : '',
            teacher: Boolean(data.teacher) ? data.teacher : '',
            teacher_tel: Boolean(data.teacher_tel) ? data.teacher_tel : '',
            teacher_duty: Boolean(data.teacher_duty) ? data.teacher_duty : '',
            student_min: Boolean(data.student_min) ? data.student_min : '',
            student_max: Boolean(data.student_max) ? data.student_max : '',
            time_groups: timeGroup
        })
    }

    _updateInput(text, code) {
        switch (code) {
            case 'name': {
                this.setState({
                    name: text
                })
            }
                break;
            case 'max': {
                this.setState({
                    student_max: text
                })
            }
                break;
            case 'min': {
                this.setState({
                    student_min: text
                })
            }
                break;
            case 'teacher': {
                this.setState({
                    teacher: text
                })
            }
                break;
            case 'teacher_tel': {
                this.setState({
                    teacher_tel: text
                })
            }
                break;
            case 'teacher_duty': {
                this.setState({
                    teacher_duty: text
                })
            }
                break;
            case 'des': {
                this.setState({
                    desc: text
                })
            }
                break;
            default:
                break;
        }
    }

    _timeSelect(code, index, text) {
        switch (code) {
            case 'day': {
                this.dayIndex = index // 将TimeGroup 中的 index传递给pickerModal
                this.setState({
                    dayModal: !this.state.dayModal
                })
            }
                break;
            default:
                break;
        }
    }

    _timeConfirm(code, index, text) {
        // toastShort(`code==${code}&&text==${text}&&index==${index}`)
        let groups = _.cloneDeep(this.state.time_groups)
        if (index > groups.length - 1) {
            // 溢出检测
            return
        }
        switch (code) {
            case 'day': {
                if (Array.isArray(text) && text.length > 0) {
                    groups[index].select = text[0]
                } else if (typeof text === 'string') {
                    groups[index].select = text
                }
            }
                break;
            case 'from': {
                groups[index].min = text
            }
                break;
            case 'to': {
                groups[index].max = text
            }
                break;
            default:
                break;
        }
        this.setState({
            time_groups: groups
        })
    }

    _timeGroupAdd(index) {
        let groups = _.cloneDeep(this.state.time_groups)
        if (groups.length > TIME_GROUP_COUNT - 1) {
            toastShort(`最多只能添加${TIME_GROUP_COUNT}个时段哦！`)
        } else {
            let newGroup = {select: '', min: '', max: ''}
            groups.push(newGroup)
            this.setState({
                time_groups: groups
            })
        }
    }

    _timeGroupDelete(index) {
        let groups = _.cloneDeep(this.state.time_groups)
        if (groups.length < 2) {
            toastShort(`至少要保留一个时段哦！`)
        } else {
            Alert.alert(
                '',
                '确定删除时段',
                [
                    {
                        text: '取消', onPress: () => null
                    },
                    {
                        text: '确认', onPress: () => {
                        groups.splice(index, 1)
                        this.setState({
                            time_groups: groups
                        })
                    }
                    },
                ]
            )
        }
    }

    _photosDelete(data) {
        // console.log('_photosDelete data===>', data)
        let contract_pics = _.cloneDeep(this.upload_photos)
        let new_contract_pics = new Array()
        if (Boolean(data.file_id)) {
            contract_pics.forEach((item, idx) => {
                if (item.file_id != data.file_id) {
                    new_contract_pics.push(item)
                }
            })
            this.upload_photos = new_contract_pics
        }
    }

    _photosUpload(data) {
        // console.log('_photosUpload data===>', data)
        if (Boolean(data.uploadInfo)) {
            let {uploadInfo} = data
            let contract_pics = _.cloneDeep(this.upload_photos)
            let obj = {};
            obj.file_id = Boolean(uploadInfo.file_id) ? uploadInfo.file_id : ''
            obj.file_path = Boolean(uploadInfo.url_path) ? uploadInfo.url_path : ''
            contract_pics.push(obj)
            this.upload_photos = contract_pics
        }
    }

    _photosClick(index) {
        // console.log('_photosClick data===>', this.upload_photos)
        let pics = this.upload_photos
        if (Array.isArray(pics) && pics.length > 0) {
            Actions.photoSwiper({
                photo_data: pics,
                index
            })
        }
    }

    _saveClick() {
        let {
            name, student_min, student_max, time_groups, teacher, teacher_tel, teacher_duty,
            desc, lesson_photos, dayModal
        } = this.state
        if (name.length == 0) {
            toastShort('课程名称不可为空哦。')
            return
        }
        if (student_min.length == 0 || student_max.length == 0) {
            toastShort('请填写开班人数哦。')
            return
        }
        if (teacher.length == 0) {
            toastShort('教师姓名不可为空哦。')
            return
        }
        if (teacher_tel.length == 0) {
            toastShort('教师电话不可为空哦。')
            return
        }
        if (teacher_duty.length == 0) {
            toastShort('教师职位不可为空哦。')
            return
        }
        let peopleMinRes = validate('positiveIntegerZero', student_min)
        let peopleMaxRes = validate('positiveIntegerZero', student_max)
        if (!peopleMinRes.pass || !peopleMaxRes.pass) {
            toastShort('开班人数应该为大于0的整数,且只能为数字哦。')
            return
        }
        let numStudentMin = parseInt(student_min)
        let numStudentMax = parseInt(student_max)
        if (numStudentMin >= numStudentMax) {
            toastShort('开班人数后面的值要大于前面的值哦。')
            return
        }
        if (time_groups.length == 0) {
            toastShort('至少添加一个试听时段哦。')
            return
        }
        for (let i = 0; i < time_groups.length; i++) {
            let timeItem = time_groups[i]
            if (timeItem.select.length == 0
                || timeItem.min.length == 0
                || timeItem.max.length == 0
            ) {
                toastShort(`试听时段${i + 1}信息不完整，请补充哦。`)
                return
            }
        }
        this.refs.submitLoadingLayer.show()
        this.props.myactions.submitData(this._requestData)
    }

    async _requestData() {
        try {
            let {
                name, student_min, student_max, time_groups, teacher, teacher_tel, teacher_duty,
                desc, lesson_photos, dayModal
            } = this.state
            if (this.type == 'edit') {
                // 编辑
                let body = {
                    _AT: global.UserInfo.token,
                    id: this.courseId,
                    name: name,
                    student_min: student_min,
                    student_max: student_max,
                    trial_time: time_groups,
                    desc: desc,
                    teacher: teacher,
                    teacher_tel: teacher_tel,
                    teacher_duty: teacher_duty,
                    album: {
                        id: this.coursePhotosId,
                        pics: this.upload_photos,
                    }
                }
                console.log('edit body===>', body)
                let ret = await fetchCourseChangeRequest(body, '')()
                this.refs.submitLoadingLayer.hide()
                toastShort('提交成功！')
                Actions.pop({refresh: {reload: true}})
                return true
            } else {
                // 添加
                let body = {
                    _AT: global.UserInfo.token,
                    id: (Boolean(this.props.routerData) && (this.props.routerData.storeId)) ? this.props.routerData.storeId : 0, //门店id
                    name: name,
                    student_min: student_min,
                    student_max: student_max,
                    trial_time: time_groups,
                    desc: desc,
                    teacher: teacher,
                    teacher_tel: teacher_tel,
                    teacher_duty: teacher_duty,
                    pics: this.upload_photos
                }
                let ret = await fetchCourseAddRequest(body, '')()
                this.refs.submitLoadingLayer.hide()
                toastShort('提交成功！')
                Actions.pop({refresh: {reload: true}})
                return true
            }
        } catch (e) {
            console.log('_requestData e===>', e)
            toastShort('提交失败！')
            this.refs.submitLoadingLayer.hide()
            throw e
        }
    }

    render() {
        let {
            name, student_min, student_max, time_groups,
            teacher, teacher_tel, teacher_duty, desc,
            lesson_photos, dayModal
        } = this.state
        return (
            <View style={{flex: 1, backgroundColor: colors.labBgColor}}>
                <KeyboardAwareScrollView style={this.editable ? {marginBottom: 60 - 10} : null}>
                    <TopComponent name={name} max={student_max}
                                  min={student_min} inputSubmit={() => null} updateInput={this._updateInput}
                                  editable={this.editable}
                    />
                    <TimeSectionComponent data={time_groups} addPress={this._timeGroupAdd} editable={this.editable}
                                          deletePress={this._timeGroupDelete} timePress={this._timeSelect}
                                          confirmPress={this._timeConfirm}
                    />
                    <TeacherInfo teacherName={teacher} teacherTel={teacher_tel} teacherDuty={teacher_duty}
                                 updateInput={this._updateInput} editable={this.editable}
                    />
                    <DesComponent data={desc} updateInput={this._updateInput} editable={this.editable}/>
                    <PhotosComponent data={this.lesson_photos} onItemUpload={this._photosUpload}
                                     onItemDelete={this._photosDelete} onItemClick={this._photosClick}
                                     editable={this.editable}
                    />
                </KeyboardAwareScrollView>
                {this.editable ? <SaveComponent savePress={this._saveClick}/> : null}
                <PickerModal visible={dayModal} code='day' index={this.dayIndex} modalPress={this._timeSelect}
                             confirmPress={this._timeConfirm} pickersData={DayArr}
                />
                <LoadingFloatingLayer ref="submitLoadingLayer"/>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)