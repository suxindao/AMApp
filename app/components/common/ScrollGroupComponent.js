/**
 * create at 08/02/17
 * 同时支持多个 ScrollGroup
 */
import React, {Component} from 'react'
import {
    View, Text, Image, StyleSheet, TouchableHighlight, PixelRatio, ScrollView,
} from 'react-native'

// style
import {colors, distances, fontScale} from '../../constants/style'
// op common
import {nEveryRow, nGroupItemWidth} from '../../constants/utils/ui'
// verify
import {verifyFunction} from '../../constants/utils/validate'

/**
 * 标题加纵向滚动组合组件
 * @param {*} title string, 每个ScrollGroup 标题
 * @param {*} data obj, ScrollGroup 数据
 *                      data中每个item 需要 {id: number, name: string}格式，这两个字段必填
 * @param {*} itemBtnPress function, item click function
 * @param {*} code string, 用于区分每一个ScrollGroup 标识
 * @param {*} currentItem obj, 选中的item 符合data中每一个item 字段规则
 * @param {*} num number, 每行item数量
 * @param {*} itemMargin number (选填), 每个item距右边的距离
 */
export default class ScrollGroupComponent extends Component {
    render() {
        let {
            title, data, itemBtnPress, code, currentItem, num, itemMargin = 15,
        } = this.props
        // 处理data
        let newData = nEveryRow(data, num)
        let itemWidth = nGroupItemWidth(num, distances.contractLeftMargin, 15)
        return (
            <View style={styles.container}>
                <TitleComponent title={title}/>
                <ItemsRowsComponent code={code} data={newData} itemWidth={itemWidth} itemMargin={itemMargin}
                                    btnPress={itemBtnPress} currentItem={currentItem}
                />
            </View>
        )
    }
}

/**
 * 标题
 */
class TitleComponent extends Component {
    render() {
        let {title} = this.props
        return (
            <View style={styles.titleView}>
                <Text style={styles.titleText}>{title}</Text>
            </View>
        )
    }
}

/**
 * 多行 itemsRow
 */
class ItemsRowsComponent extends Component {
    render() {
        let {data, currentItem, btnPress, code, itemWidth, itemMargin} = this.props
        if (Array.isArray(data) && data.length > 0) {
            return (
                <ScrollView bounces={false}>
                    {
                        data.map((items, idx) => {
                            return (
                                <RowComponent key={idx} items={items} itemWidth={itemWidth} itemMargin={itemMargin}
                                              code={code} currentItem={currentItem} btnPress={btnPress}
                                />
                            )
                        })
                    }
                </ScrollView>
            )
        }
        return null
    }
}

/**
 * 一行 item
 */
class RowComponent extends Component {
    render() {
        let {items, currentItem, btnPress, code, itemWidth, itemMargin} = this.props
        if (Array.isArray(items) && items.length > 0) {
            return (
                <View style={styles.itemsRowView}>
                    {
                        items.map((item, idx) => {
                            return (
                                <ButtonComponent key={idx} code={code} itemWidth={itemWidth} itemMargin={itemMargin}
                                                 data={item} btnPress={btnPress} currentItem={currentItem}
                                />
                            )
                        })
                    }
                </View>
            )
        }
        return null
    }
}

/**
 * item button 每一个单元item
 */
class ButtonComponent extends Component {
    constructor(props) {
        super(props)

        this.btnClick = this.btnClick.bind(this)
    }

    btnClick() {
        let {data, btnPress, code} = this.props
        // code 用于标识多个ScrollGroup
        if (verifyFunction(btnPress, 'components common ScrollGroup item', 'btnPress')) {
            btnPress(code, data)
        }
    }

    render() {
        let {data, currentItem, itemWidth, itemMargin} = this.props
        let isMarked = false
        if ((typeof data.id === 'number') && (typeof currentItem.id === 'number')) {
            isMarked = (data.id === currentItem.id) ? true : false
        }
        return (
            <TouchableHighlight
                onPress={this.btnClick} underlayColor={colors.touchBgColor}
                style={[
                    styles.itemBtnTouch, {width: itemWidth, marginRight: itemMargin},
                    isMarked ? styles.itemBtnTouchMark : null
                ]}
            >
                <Text style={[
                    {fontSize: 14 * fontScale},
                    isMarked ? {color: colors.blueColor} : {color: '#333'}
                ]}>{Boolean(data.name) ? data.name : ''}</Text>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: distances.contractLeftMargin,
    },
    titleView: {
        paddingBottom: 10
    },
    titleText: {
        color: '#999',
        fontSize: 12 * fontScale
    },
    itemsRowView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
    },
    itemBtnTouch: {
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 3 / PixelRatio.get(),
    },
    itemBtnTouchMark: {
        borderColor: colors.blueColor,
        borderWidth: 2 / PixelRatio.get()
    }
})