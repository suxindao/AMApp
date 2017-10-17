/**
 * create at 05/24/17
 */
import React, { Component } from "react"
import { ListView, View, Text, TouchableOpacity } from 'react-native'

var getRowData = (dataBlob, sectionID, rowID) => {
	return dataBlob[rowID]
}

var getSectionData = (dataBlob, sectionID) => {
	return dataBlob[sectionID]
}

const ds = new ListView.DataSource({
	getRowData: getRowData,
	getSectionHeaderData: getSectionData,
	rowHasChanged: (row1, row2) => row1 !== row2,
	sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
})

export default class SortListView extends Component{
	constructor(props){
		super(props)

	}

	_scrollTo(index){
		let position = 0
		for(let i=0;i<index;i++){
			position+=this.props.totalHeight[i]
		}
		this.refs._listView.scrollTo({
			y: position
		})
	}

	render(){
		let {
			containerStyle, listData, sectionIDs, rowIDs, renderListRow, renderSectionHeader,
			letters, lettersStyle, renderLetterRow
		} = this.props
		return(
			<View style={{flex: 1}}>
				<ListView 
					style={containerStyle}
					ref="_listView"
					dataSource={ ds.cloneWithRowsAndSections(listData, sectionIDs, rowIDs) }
					enableEmptySections={true}
					initialListSize={300}
					renderRow={renderListRow}
					renderSectionHeader={renderSectionHeader}
				/>
				<View style={[{
						position: 'absolute', top: 0, bottom: 0, right: 0, backgroundColor: '#fff',
						justifyContent: 'center', alignItems: 'center',
					}, lettersStyle]
				}>
					{
						letters.map((item, idx)=>{
							return (
								<TouchableOpacity key={idx} activeOpacity={0.6} onPress={()=>{this._scrollTo(idx)}}>
									{renderLetterRow(item)}
								</TouchableOpacity>
							)
						})
					}
				</View>
			</View>
		)
	}
}