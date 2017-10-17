/**
 * Created by Joe on 2017/6/1.
 */
import React, {Component} from 'react';
import {TouchableOpacity, Text, Alert} from 'react-native';
import {Actions} from 'react-native-router-flux'
//组件
import MyStore from './../components/MyStore'

export default class CreateMyStore extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        Actions.refresh(
            {
                renderBackButton: () =>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                '确定不保存当前编辑内容么？',
                                '',
                                [
                                    {
                                        text: '取消', onPress: () => {
                                    }
                                    },
                                    {text: '确认', onPress: Actions.pop},
                                ]
                            )
                        }}
                    >
                        <Text
                            style={{
                                width: 36,
                                height: 18,
                                marginLeft: 10,
                                marginRight: 10,
                                marginTop: 5,
                                marginBottom: 20,
                                fontSize: 14,
                                color: '#fff',
                            }}
                        >
                            取消
                        </Text>
                    </TouchableOpacity>
            }
        );
    }

    render() {
        return (
            <MyStore
                editable={true}
                status='add'
                emitKey={this.props.emitKey}
            />
        )
    }
}