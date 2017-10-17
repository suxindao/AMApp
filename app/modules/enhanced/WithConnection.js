/**
 * by QianShu at 2016
 */
import React from 'react'
import {NetInfo} from 'react-native'

/**
 * 网络检测高阶组件
 * @param  {React.Component}  ComposedComponent  需要包装的原始组件
 * @param  {Boolean} isRegisterListener         是否要注册实时监听
 * @return {React.Component}                     包装之后的组件
 */
const withConnection = (ComposedComponent, isRegisterListener = true) => class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isConnected: true,
        };
        this._handleIsConnected = this._handleIsConnected.bind(this)
    }

    componentWillMount() {
        NetInfo.isConnected.fetch().done((isConnected) => {
            // console.log('isConnected====>', isConnected)
            this._handleIsConnected(isConnected)
            if (isRegisterListener) {
                NetInfo.isConnected.addEventListener('connectionChange', this._handleIsConnected)
            }
        })
    }

    componentWillUnmount() {
        if (isRegisterListener) {
            NetInfo.isConnected.removeEventListener('connectionChange', this._handleIsConnected)
        }
    }

    _handleIsConnected(isConnected) {
        this.setState({isConnected});
    }

    render() {
        return (
            <ComposedComponent {...this.props} connection={this.state.isConnected}/>
        )
    }
}

export default withConnection;