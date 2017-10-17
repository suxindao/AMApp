/**
 * create at 04/25/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../../constants/style'

// common
import {nEveryRow} from '../../../../../constants/utils/ui'
import {httpIP} from '../../../../../helpers/Upload'

// const
const ImgRowCount = 4
const ImgWidth = (distances.deviceWidth - distances.contractLeftMargin * 2 - 3 * 10) / ImgRowCount

export default class CourseItem extends Component {
    constructor(props) {
        super(props)

        this._itemClick = this._itemClick.bind(this)
    }

    _itemClick() {
        let {rowData, itemPress} = this.props
        itemPress(rowData)
    }

    render() {
        let {rowData} = this.props
        let peopleNumber = ''
        if ((typeof rowData.student_min === 'number') && (typeof rowData.student_max === 'number')) {
            peopleNumber = '开班人数：' + rowData.student_min + '-' + rowData.student_max + '人'
        } else if (typeof rowData.student_min === 'number') {
            peopleNumber = '开班人数：' + rowData.student_min + '人'
        } else if (typeof rowData.student_max === 'number') {
            peopleNumber = '开班人数：' + rowData.student_max + '人'
        } else {
            peopleNumber = '开班人数：'
        }

        return (
            <TouchableHighlight underlayColor={colors.touchBgColor} onPress={this._itemClick}
                                style={{
                                    marginTop: 10, backgroundColor: '#fff', borderColor: colors.borderColor,
                                    borderTopWidth: distances.borderWidth, borderBottomWidth: distances.borderWidth,
                                }}>
                <View style={{paddingLeft: distances.contractLeftMargin, paddingRight: distances.contractLeftMargin}}>
                    <Text style={{marginTop: 15, color: '#333', fontSize: 16 * fontScale}}>{
                        Boolean(rowData.name) ? rowData.name : ''
                    }</Text>
                    <Text style={[{marginTop: 15}, styles.titleItem]}>{
                        peopleNumber
                    }</Text>
                    {showTimeGroup(rowData.trial_time)}
                    {showTeacherInfo(rowData)}
                    {showDes(rowData.desc)}
                    {
                        showPhotos(
                            (
                                Boolean(rowData.album) && Array.isArray(rowData.album.pics) ? rowData.album.pics : []
                            ),
                            rowData.desc
                        )
                    }
                </View>
            </TouchableHighlight>
        )
    }
}

function showTeacherInfo(data) {
    if (Boolean(data.teacher) || Boolean(data.teacher_tel) || Boolean(data.teacher_duty)) {
        // 教师名字/教师电话/教师职务 有其一便显示组件
        return (
            <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={[styles.titleItem]}>{'教师联系：'}</Text>
                <View>
                    {teacherItem(data.teacher, false)}
                    {teacherItem(data.teacher_tel, true)}
                    {teacherItem(data.teacher_duty, true)}
                </View>
            </View>
        )
    }
    return null
}

/**
 * teacher item
 */
function teacherItem(itemContent, hasMargin) {
    return (
        <Text style={[styles.titleItem, hasMargin ? {marginTop: 10} : null]}>{
            Boolean(itemContent) ? itemContent : ''
        }</Text>
    )
}

/**
 * 展示试听时间段组件
 */
function showTimeGroup(data) {
    return (
        <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={[styles.titleItem]}>{'试听时段：'}</Text>
            {(() => {
                if (Array.isArray(data) && data.length > 0) {
                    return (
                        <View>
                            {(() => {
                                return data.map((item, idx) => {
                                    return timeItem(item, idx)
                                })
                            })()}
                        </View>
                    )
                }
                return null
            })()}
        </View>
    )
}

/**
 * time item
 */
function timeItem(item, idx) {
    let itemStr = ''
    let itemTimeStr = ''
    if (
        (Boolean(item.min) && item.min.length > 0) && (Boolean(item.max) && item.max.length > 0)
    ) {
        itemTimeStr = '（' + item.min + '-' + item.max + '）'
    } else if (Boolean(item.min) && item.min.length > 0) {
        itemTimeStr = '（' + item.min + '）'
    } else if (Boolean(item.max) && item.max.length > 0) {
        itemTimeStr = '（' + item.max + '）'
    }
    if (Boolean(item.select)) {
        itemStr = item.select + itemTimeStr
    } else {
        itemStr = itemTimeStr
    }
    return (
        <Text key={idx} style={[styles.titleItem, idx == 0 ? null : {marginTop: 10}]}>{
            itemStr
        }</Text>
    )
}

/**
 * 课程信息描述
 */
function showDes(des) {
    if (Boolean(des) && des.length > 0) {
        return (
            <Text style={{
                marginTop: 10, marginBottom: 10, color: '#666', fontSize: 14 * fontScale, lineHeight: 14 + 5 * 2
            }}>{des}</Text>
        )
    }
    return null
}

/**
 * 照片预览
 */
function photoClick(data, index) {
    if (Array.isArray(data) && data.length > 0) {
        Actions.photoSwiper({
            photo_data: data,
            index
        })
    }
}

/**
 * 课程照片
 */
function showPhotos(photos, des) {
    if (Array.isArray(photos) && photos.length > 0) {
        let photosGroup = nEveryRow(photos, ImgRowCount)
        return (
            <TouchableHighlight underlayColor={colors.touchBgColor} onPress={() => {
                photoClick(photos, 0)
            }}>
                <View style={Boolean(des) && des.length > 0 ? null : {marginTop: 10}}>
                    {(() => {
                        return photosGroup.map((group, idx) => {
                            return showPhotosRow(group, idx)
                        })
                    })()}
                </View>
            </TouchableHighlight>
        )
    }
    return null
}

/**[
 * 一行照片
 */
function showPhotosRow(group, index) {
    if (Array.isArray(group) && group.length > 0) {
        // console.log('group===>', group)
        return (
            <View key={index} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
                {
                    group.map((item, idx) => {
                        return (
                            <Image style={[{
                                width: ImgWidth,
                                height: ImgWidth
                            }, idx == ImgRowCount - 1 ? null : {marginRight: 10}]}
                                   source={{uri: Boolean(item.file_path) ? httpIP.substring(0, httpIP.length - 1) + item.file_path : ''}}
                                   key={idx}
                            />
                        )
                    })
                }
            </View>
        )
    }
    return null
}

const styles = StyleSheet.create({
    titleItem: {
        color: '#999',
        fontSize: 13 * fontScale
    }
})