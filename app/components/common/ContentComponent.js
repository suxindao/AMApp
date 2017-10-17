/**
 * Created by Joe on 2017/3/9.
 */
import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, Keyboard, StyleSheet, ScrollView} from 'react-native'
import DatePicker from 'react-native-datepicker'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import CheckBox from 'react-native-check-box'

// style
import {colors, distances, fontScale} from '../../constants/style'

const
    INPUT = 'input',
    DATE = 'date',
    RADIO = 'radio',
    CHECKBOX = 'checkbox',
    SELECT = 'select',
    TOUCH = 'touch',
    TEXTLABLE = 'textlable',
    CUSTOM = 'custom',
    TEXT = 'text';

/**
 * 带标题文字的输入框
 */
export default class ContentComponent extends Component {
    constructor(props) {
        super(props)
        this.getSelected = this.getSelected.bind(this);
        this.setChecked = this.setChecked.bind(this);
        this.inputCallback = this.inputCallback.bind(this);
        this.dateCallback = this.dateCallback.bind(this);
        this.radioCallback = this.radioCallback.bind(this);
        this.lableInputCallback = this.lableInputCallback.bind(this);
        this.checkboxCallback = this.checkboxCallback.bind(this);
        this.touchCallback = this.touchCallback.bind(this);
        this.renderInner = this.renderInner.bind(this);
        if (this.props.config.type == TEXTLABLE && this.props.config.value) {
            this.state = {
                noValue0: this.props.config.value.substring(0, 4),
                noValue1: this.props.config.value.substring(4, 6),
                noValue2: this.props.config.value.substring(6, 10),
            }
        }
        this.flag = true;
    }

    componentDidMount() {
        if (this.props.config.type == RADIO)
            this.getSelected();
        if (this.props.config.type == CHECKBOX)
            this.setChecked();
    }

    componentDidUpdate() {
        if (this.props.config.type == RADIO)
            this.getSelected();
        if (this.props.config.type == CHECKBOX)
            this.setChecked();
    }

    componentWillReceiveProps(np) {
        if (this.flag && np.config.type == TEXTLABLE && np.config.value) {
            this.setState(
                {
                    noValue0: np.config.value.substring(0, 4),
                    noValue1: np.config.value.substring(4, 6),
                    noValue2: np.config.value.substring(6, 10),
                }
            )
            this.flag = false;
        }
    }

    componentWillUnmount() {
        Keyboard.dismiss()
    }

    getSelected() {
        let order;
        for (var z = 0; z < this.props.config.radio.length; z++) {
            if (this.props.config.value === this.props.config.radio[z].id) {
                order = z;
                break;
            }
        }
        this.refs.radioGroups.setState({
            selectedIndex: order
        });
        return order;
    }

    setChecked() {
        let {config} = this.props;
        this.refs.checkBox.setState(
            {
                isChecked: config.value
            }
        )
    }

    inputCallback(value, key) {
        if (typeof this.props.callback == 'function') {
            let robj = {};
            robj[key] = value.replaceAll(' ', '');
            this.props.callback(robj);
        }
    }

    dateCallback(value, key) {
        if (typeof this.props.callback == 'function') {
            let robj = {};
            robj[key] = value;
            this.props.callback(robj);
        }
    }

    lableInputCallback(value, vKey, key) {
        let obj = {};
        let eValue = '';
        if (vKey == 'noValue0') {
            eValue = value + this.state.noValue1 + this.state.noValue2
        } else if (vKey == 'noValue1') {
            eValue = this.state.noValue0 + value + this.state.noValue2
        } else if (vKey == 'noValue2') {
            eValue = this.state.noValue0 + this.state.noValue1 + value
        }
        obj[vKey] = value;
        this.setState(obj);
        let robj = {};
        robj[key] = eValue;
        this.props.callback(robj);
    }

    radioCallback(value, key) {
        if (typeof this.props.callback == 'function') {
            let robj = {};
            robj[key] = value;
            this.props.callback(robj);
        }
    }

    checkboxCallback(value, key) {
        if (typeof this.props.checkboxCallback == 'function') {
            this.props.checkboxCallback(value, key);
        }
    }

    touchCallback(editable) {
        if (!editable)
            return;
        if (typeof this.props.touchCallback == 'function') {
            this.props.touchCallback();
        }
    }

    renderInner() {
        let {config} = this.props;
        let lablestyle = {
            fontSize: 15 * fontScale,
            color: colors.inputColor,
            justifyContent: 'center',
            textAlign: 'center',
            marginRight: 5,
            width: 59,
            height: 35,
            backgroundColor: config.editable === true ? colors.labBgColor : '#fff',
            borderRadius: 2,
            paddingTop: 0,
            paddingBottom: 0,
        };
        switch (config.type) {
            case INPUT:
                return (
                    <TextInput
                        style={{
                            fontSize: 15 * fontScale,
                            color: colors.inputColor,
                            flex: 1,
                            marginRight: distances.leftMargin,
                            backgroundColor: '#fff',
                            paddingRight: 0,
                            paddingLeft: 0,
                        }}
                        onChange={(e) => {
                            this.inputCallback(e.nativeEvent.text, config.key);
                        }}
                        placeholderTextColor={'#d3d3d3'}
                        placeholder={config.placeholder}
                        value={config.value}
                        keyboardType={config.keyboardType}
                        underlineColorAndroid={'transparent'}
                        maxLength={config.maxLength}
                        editable={config.editable}
                    />
                )
            case DATE:
                return (
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            marginRight: distances.leftMargin,
                            backgroundColor: '#fff',
                            flexDirection: 'row'
                        }}
                    >
                        <DatePicker
                            ref='DatePicker'
                            style={{flex: 1}}
                            customStyles={{
                                disabled: {
                                    backgroundColor: '#fff'
                                },
                                dateInput: {
                                    borderWidth: 0,
                                    backgroundColor: '#fff',
                                    alignItems: 'flex-start',
                                },
                                dateText: {
                                    color: colors.inputColor
                                },
                                btnTextConfirm: {
                                    color: colors.blueColor
                                },
                                btnTextCancel: {
                                    color: colors.blueColor
                                },
                            }}
                            disabled={config.editable === false}
                            date={config.value}
                            mode={config.mode ? config.mode : "date"}
                            placeholder={config.placeholder}
                            format={config.format ? config.format : "YYYY-MM-DD"}
                            minDate={config.minDate ? config.minDate : "1970-01-01"}
                            maxDate={config.maxDate ? config.maxDate : "2100-12-31"}
                            showIcon={false}
                            confirmBtnText="确认"
                            cancelBtnText="取消"
                            onDateChange={(date) => {
                                this.dateCallback(date, config.key)
                            }}
                        />
                        {
                            config.editable === true ?

                                <Image
                                    style={{
                                        width: 6,
                                        height: 10
                                    }}
                                    source={require('../../sources/images/arrow_right.png')}
                                /> :
                                null
                        }
                    </TouchableOpacity>
                )
            case TEXTLABLE:
                return (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginRight: distances.leftMargin
                        }}
                    >
                        <TextInput
                            style={lablestyle}
                            onChange={(e) => {
                                this.lableInputCallback(e.nativeEvent.text, 'noValue0', config.key);
                            }}
                            placeholderTextColor={'#d3d3d3'}
                            value={this.state.noValue0}
                            keyboardType={config.keyboardType}
                            underlineColorAndroid={'transparent'}
                            maxLength={config.maxLength}
                            editable={config.editable}
                        />
                        <TextInput
                            style={lablestyle}
                            onChange={(e) => {
                                this.lableInputCallback(e.nativeEvent.text, 'noValue1', config.key);
                            }}
                            placeholderTextColor={'#d3d3d3'}
                            value={this.state.noValue1}
                            keyboardType={config.keyboardType}
                            underlineColorAndroid={'transparent'}
                            maxLength={2}
                            editable={config.editable}
                        />
                        <TextInput
                            style={lablestyle}
                            onChange={(e) => {
                                this.lableInputCallback(e.nativeEvent.text, 'noValue2', config.key);
                            }}
                            placeholderTextColor={'#d3d3d3'}
                            value={this.state.noValue2}
                            keyboardType={config.keyboardType}
                            underlineColorAndroid={'transparent'}
                            maxLength={config.maxLength}
                            editable={config.editable}
                        />
                    </View>
                )
            case RADIO:
                return (
                    <RadioGroup
                        ref="radioGroups"
                        color={colors.blueColor}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flex: 1,
                            height: 40,
                            marginRight: distances.leftMargin,
                        }}
                        onSelect={(index, value) => {
                            this.radioCallback(value, config.key)
                        }}>
                        <RadioButton value={config.radio[0].id} disabled={config.editable === false}>
                            <Text>{config.radio[0].name}</Text>
                        </RadioButton>
                        <RadioButton value={config.radio[1].id} disabled={config.editable === false}>
                            <Text>{config.radio[1].name}</Text>
                        </RadioButton>
                    </RadioGroup>
                )
            case CHECKBOX:
                return (
                    <View style={{flex: 1}}>
                        <CheckBox
                            ref='checkBox'
                            style={{flex: 1, justifyContent: 'center', opacity: config.editable ? 1 : 0.4}}
                            onClick={() => {
                                this.checkboxCallback(!config.value, config.key)
                            }}
                            checkedImage={<Image source={require('../../sources/images/radio_yes.png')}/>}
                            unCheckedImage={<Image source={require('../../sources/images/radio_no.png')}/>}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                height: 60,
                                width: 253,
                                top: 0,
                                left: 0,
                                zIndex: config.editable === false ? 1 : -1,
                                backgroundColor: 'rgba(0,0,0,0)'
                            }}>
                        </View>
                    </View>
                )
            case TOUCH:
                return (
                    <View style={{flex: 1}}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                paddingRight: distances.leftMargin,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                this.touchCallback(config.editable)
                            }}
                        >
                            <Text
                                style={{
                                    flex: 1,
                                    fontSize: 16 * fontScale,
                                    color: config.value ? colors.inputColor : '#d3d3d3',
                                    paddingRight: 0,
                                    paddingLeft: 0,
                                    width: 500
                                }}
                                value={config.value}
                                placeholderTextColor={'#d3d3d3'}
                                placeholder={config.placeholder}
                                underlineColorAndroid={'transparent'}
                                editable={false}
                            >
                                {config.value ? config.value : config.placeholder}
                            </Text>

                            {
                                config.editable === true ?

                                    <Image
                                        style={{
                                            width: 6,
                                            height: 10
                                        }}
                                        source={require('../../sources/images/arrow_right.png')}
                                    /> :
                                    null
                            }
                        </TouchableOpacity>
                    </View>
                )
            case TEXT:
                return (
                    <View style={{flex: 1}}>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                marginRight: distances.leftMargin,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    flex: 1,
                                    fontSize: 16 * fontScale,
                                    color: colors.inputColor,
                                }}
                            >
                                {config.value}
                            </Text>
                        </View>
                    </View>
                )
            case CUSTOM:
                return config.innerElemet;
            default:
                return null
        }
    }

    render() {
        let {config} = this.props
        return (
            <View
                style={
                    [
                        {
                            minHeight: 60,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: colors.borderColor,
                            backgroundColor: '#fff',
                            marginLeft: distances.contractLeftMargin,
                        },
                        config.hasLine ? {borderBottomWidth: distances.borderWidth} : null
                    ]
                }
            >
                <Text style={{
                    fontSize: 16 * fontScale,
                    color: '#333',
                    width: 110,
                }}>
                    {config.title}
                </Text>
                {this.renderInner()}
            </View>
        )
    }
}