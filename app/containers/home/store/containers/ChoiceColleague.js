/**
 * Created by Joe on 2017/6/2.
 */
import React, { Component } from 'react'
import { View, Text, Image, InteractionManager, TouchableHighlight, Alert, DeviceEventEmitter } from 'react-native'
import { Actions } from 'react-native-router-flux'

// 界面组件
import {SearchInputText} from './../../../../components/search/Search'
import SortListView from './../../../../components/list/SortList'
import NoData from './../../../../components/list/NoData'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  loadData,
  setState,
  rsetState,
} from '../../../../redux/modules/home/store/choiceColleagueRedux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// presenters

const mapStateToProps = state => ({
  loading: state.choiceColleague.loading,
  loading_success: state.choiceColleague.loading_success,
  listData: state.choiceColleague.listData,
  sectionIDs: state.choiceColleague.sectionIDs,
  rowIDs: state.choiceColleague.rowIDs,
  letters: state.choiceColleague.letters,
  totalHeight: state.choiceColleague.totalHeight,
  list: state.choiceColleague.list,
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({
    loadData,
    setState,
    rsetState,
  }, dispatch),
  dispatch,
})

const rowHeight = 60;
const sectionHeight = 30;
const icon = require('./../../../../sources/images/list_no_data.png');
const des = '暂时没有哦！';

class ChoiceColleague extends Component{
  constructor(props){
    super(props)
    this.getListData = this.getListData.bind(this)
    this.getListDatas = this.getListDatas.bind(this)
    this.transferTo = this.transferTo.bind(this)
    this.transferTos = this.transferTos.bind(this)
    this.setListData = this.setListData.bind(this)
    this._clickSearchBtn = this._clickSearchBtn.bind(this)
    this._searchInputContent = this._searchInputContent.bind(this)
    this.transfer = this.transfer.bind(this)
    this._renderRow = this._renderRow.bind(this)
    this._renderSectionHeader = this._renderSectionHeader.bind(this)
    this._renderLetterRow = this._renderLetterRow.bind(this)
    this.state = {
      searchContent: '',
    }
  }

  componentWillMount(){
    this.getListData();
  }

  getListData(){
    this.props.myactions.loadData(
      '/am_api/am/store/AMList',
      {
        _AT: global.UserInfo.token,
        name: this.state.searchContent,
      },
      this.getListDatas
    );
  }

  async getListDatas(client, path, param) {
    try {
      let list = await client.post(path, {data: param});
      let obj = this.setListData(list);
      this.props.myactions.setState(
        {
          listData:obj.listData,
          sectionIDs:obj.sectionIDs,
          rowIDs:obj.rowIDs,
          letters:obj.letters,
          totalHeight:obj.totalHeight,
          list: list,
        },
        true
      );
      return list;
    } catch (e) {
      console.log(e.message);
    }
  }

  transferTo(rowData){
    this.props.myactions.loadData(
      '/am_api/am/store/toAM',
      {
        _AT: global.UserInfo.token,
        id:this.props.routerData.id,
        am_id:rowData.id,
        am_name:rowData.name,
      },
      this.transferTos
    );
  }

  async transferTos(client, path, param) {
    try {
      let data = await client.post(path, {data: param});
      let result = data=='success'?'成功':'失败';
      Alert.alert(
        '转给他人'+result,
        '',
        [
          {text: '确定', onPress: ()=> {
            // 刷新数据
            let {emitKey} = this.props;
            if (emitKey) {
              DeviceEventEmitter.emit(emitKey);
            }
            Actions.popTo('myStorePage');
          }},
        ]
      )
      return data;
    } catch (e) {
      console.log(e.message);
    }
  }

  setListData(data){
    let listData = new Object();
    let sectionIDs = new Array();
    let rowIDs = new Array();
    let letters = new Array();
    let totalHeight = new Array();
    for(var z of data){
      sectionIDs.push(z.letter);
      letters.push(z.letter.toUpperCase());
      listData[z.letter]=z.letter.toUpperCase();
      totalHeight.push(z.user.length*(rowHeight+sectionHeight));
      let rows = new Array();
      for(var a in z.user){
        listData[z.letter+'-'+a]={
          name:z.user[a].name,
          id:z.user[a].id,
          department_name:z.user[a].department_name,
        };
        rows.push(z.letter+'-'+a);
      }
      rowIDs.push(rows);
    }
    return {
      listData:listData,
      sectionIDs:sectionIDs,
      rowIDs:rowIDs,
      letters:letters,
      totalHeight:totalHeight,
    }
  }

  // 点击搜索触发操作
  _clickSearchBtn(searchResult){
    this.getListData();
  }

  // 搜索框文字变换
  _searchInputContent(content){
    this.setState({
      searchContent: content
    })
  }

  transfer(rowData){
    Alert.alert(
      '确认转让给他人',
      '确认将'+this.props.routerData.name+'门店转让给'+rowData.name+'么？',
      [
        {text: '取消', onPress: () => {}},
        // 跳转到门店详情，状态为编辑状态
        {text: '确定', onPress: ()=> {this.transferTo(rowData)}},
      ]
    )
  }

  _renderRow(rowData, rowId){
    return(
      <TouchableHighlight
        underlayColor='#ededed'
        onPress={()=>{this.transfer(rowData)}}
        style={{
          backgroundColor: '#fff',
          height: rowHeight,
          justifyContent: 'center',
          paddingLeft:distances.contractLeftMargin,
          paddingRight:distances.contractLeftMargin,
          borderBottomWidth:distances.borderWidth,
          borderColor:colors.borderColor,
        }}
      >
        <View>
          <Text style={{ color:'#333', fontSize:16 }}>
            {rowData.name}
          </Text>
          <Text style={{ color:'#999', fontSize:12, marginTop:5 }}>
            {rowData.department_name}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  _renderSectionHeader(sectionData, sectionID){
    return(
      <View
        style={{
          backgroundColor: '#eee',
          height: sectionHeight,
          justifyContent: 'center',
          paddingLeft:distances.contractLeftMargin,
          paddingRight:distances.contractLeftMargin,
        }}
      >
        <Text
          style={{
            color:'#333',
            fontSize:18
          }}
        >
          {sectionData}
        </Text>
      </View>
    )
  }

  _renderLetterRow(itemData){
    return(
      <View style={{
				justifyContent: 'center',
				alignItems: 'center',
				width: 15,
				height: 30,
			}}>
        <Text
          style={{
            color:colors.blueColor,
            fontSize:12
          }}
        >
          {itemData}
        </Text>
      </View>
    )
  }


  render(){
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <SearchInputText
          placeText='搜索'
          showText={this.state.searchContent}
          updateSearch={this._searchInputContent}
          onSearchSubmit={this._clickSearchBtn}
        />
        {
          util.isEmptyObject(this.props.listData)?
            <NoData visible={true} icon={icon} des={des}/>:
            <SortListView
              containerStyle={{flex: 1}}
              listData={this.props.listData}
              sectionIDs={this.props.sectionIDs}
              rowIDs={this.props.rowIDs}
              renderListRow={this._renderRow}
              renderSectionHeader={this._renderSectionHeader}
              letters={this.props.letters}
              renderLetterRow={this._renderLetterRow}
              totalHeight={this.props.totalHeight}
            />
        }
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChoiceColleague)