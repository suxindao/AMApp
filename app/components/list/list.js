import React, {Component, PropTypes} from "react";
import {AppRegistry, Text, View, ListView, RefreshControl} from "react-native";

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

export default class ListViewComponent extends Component {
    constructor(props) {
        super(props);
        this._onEndReached = this._onEndReached.bind(this);
    }

    // 数据加载到底部时候拉取新数据
    _onEndReached() {
        // 防止多次重复加载
        // console.log('to do===>')
        if (this.props.refreshing) {
            return
        }

        if (!this.props.loading) {
            this.props.loadMoreData(this.props.list)
        }
    }

    render() {
        // console.log(this.props.data);
        return (
            <View style={{flex: 1}}>
                <ListView
                    style={this.props.style}
                    initialListSize={3} // 指定在组件刚挂载的时候渲染多少行数据。用这个属性来确保首屏显示合适数量的数据，而不是花费太多帧逐步显示出来。
                    pageSize={10} // 每次事件循环（每帧）渲染的行数
                    scrollRenderAheadDistance={5}
                    scrollEnabled={true}
                    removeClippedSubviews={true}
                    dataSource={ds.cloneWithRows(this.props.data)} // 渲染的数据聚合
                    renderRow={this.props.renderListRow}  // 单一条数模板
                    minPulldownDistance={10}   // 最新下拉长度
                    enableEmptySections={true}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={3}
                    renderHeader={this.props.renderHeader}
                    renderFooter={this.props.renderFooter}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.refreshing}
                            onRefresh={this.props.reloadLists}
                            tintColor="gray"
                            title="正在刷新..."
                        />
                    }
                />
            </View>
        )
    }
}

AppRegistry.registerComponent('ListViewComponent', () => ListViewComponent)
