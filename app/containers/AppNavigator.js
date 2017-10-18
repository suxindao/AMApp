import React from 'react'
import {BackHandler, ToastAndroid} from "react-native";
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addNavigationHelpers, StackNavigator, NavigationActions} from 'react-navigation'
import TimerMixin from 'react-timer-mixin'

// 组件
import {btn} from './../components/common/RenderRightButton'
// 公共
// 照片选择和拍照
import PhotoPicker from '../components/photoPicker'
import PhotoSwiper from '../components/photoSwiper'
import Camera from '../components/camera'
// 登录
import Start from './login/Start'
import Login from './login/Login'
// look
import LookerComponent from './look/LookerContainer'
import LookStoreList from './look/containers/StoreList'
import LookMonthList from './look/containers/MonthList'
import LookOrderList from './look/containers/OrderContainer'
import LookExplanation from './look/containers/ExplanationPage'
import LookPageScreen from './look/containers/LookScreen'
import LookSignStoreList from './look/containers/SignStoreList'
import LookSignStoreScreen from './look/containers/SignStoreScreen'
// home
import HomeComponent from './HomeContainer'
// 合同
import ContractList from './home/contract/containers/First'
import ContractSearchList from './home/contract/containers/SearchList'
import DraftsList from './home/contract/containers/DraftsList'
import ContractOtherList from './home/contract/containers/OtherList'
import ContractInfo from './home/contractInfo/containers/Info'
import CreatMainContract from './home/contract/containers/CreatMainContract'
import CreateStageContract from './home/contract/containers/CreateStageContract'
import CreateStraightContract from './home/contract/containers/CreateStraightContract'
import CreateExtendContract from './home/contract/containers/CreateExtendContract'
import CreatServiceContract from './home/contract/containers/CreatServiceContract'
import ContractTransitionPage from './home/contract/components/ContractTransitionPage'
// // 企业
import CityList from './home/company/containers/CityList'
import SearchEnterprise from './home/company/containers/SearchEnterprise'
import SearchStore from './home/company/containers/SearchStore'
import Enterprise from './home/company/containers/Enterprise'
import ReplaceBankAccount from './home/contract/containers/ReplaceBankAccount'
import CreateBankAccount from './home/contract/containers/CreateBankAccount'
// 门店
import ViewStoreApply from './home/store/containers/ViewStoreApply'
import DraftStoreInfo from './home/store/containers/DraftStoreInfo'
import RejectedStoreInfo from './home/store/containers/RejectedStoreInfo'
import PendingStoreInfo from './home/store/containers/PendingStoreInfo'
import ThroughStoreInfo from './home/store/containers/ThroughStoreInfo'
import SendToMerchant from './home/store/containers/SendToMerchant'
import CreateStore from './home/store/containers/CreateStore'
import ViewStoreInfo from './home/store/containers/ViewStoreInfo'
import BasicStoreInfo from './home/store/containers/BasicStoreInfo'
import ListeningCourse from './home/store/containers/ListeningCourse'
import ListenCourseEdit from './home/store/containers/ListeningCourseEdit'
import StoreEditMap from './home/store/containers/MapDetails'
import EditContact from './home/store/containers/EditContact'
import StorePhotoInfo from './home/store/containers/StorePhotoInfo'
import StoreCourse from './home/store/containers/StoreCourse'
import StoreCourseList from './home/store/containers/StoreCourseList'
import ByStagesPackage from './home/store/containers/ByStagesPackage'
import ByStagesPackageList from './home/store/containers/ByStagesPackageList'
import MyStorePage from './home/store/containers/MyStorePage'
import CreateMyStore from './home/store/containers/CreateMyStore'
import MyStoreViewInfo from './home/store/containers/MyStoreViewInfo'
import AddActivity from './home/store/containers/visit/AddActivity'
import VisitWorkList from './home/store/containers/visit/VisitWorkList'
import VisitContactList from './home/store/containers/visit/VisitContactList'
import MapPosition from './home/store/components/MapPosition'
import ChoiceColleague from './home/store/containers/ChoiceColleague'
// 跟进记录
import UpRecordList from './home/records/containers/RecordList'
import RecordScreenPage from './home/records/containers/ScreenPage'
import ShowMap from './home/records/containers/ShowMap'
// 联系人
import ContactsList from './home/contacts/containers/ContactList'
import ContactsScreenPage from './home/contacts/containers/ScreenPage'
// 订单状态查询
import ReferOrderList from './home/order/containers/OrderList'
import ReferOrderInfo from './home/order/containers/OrderInfo'
import ReferOrderSearch from './home/order/containers/OrderSearch'
import OrderScreenPage from './home/order/containers/ScreenPage'
// mine
import MineComponent from './MineContainer'
import MineAbout from './mine/containers/About'
import MineHistory from './mine/containers/History'
import MineMsgList from './mine/containers/MessageListPage'

// style
import {colors, globleStyles, distances} from '../constants/style'


export const AppNavigator = StackNavigator({   // 堆栈导航，所有屏幕的集合
    /* common */
    photoPicker: {screen: PhotoPicker},
    camera: {screen: Camera},
    photoSwiper: {screen: LookerComponent},
    /* login && start */
    start: {screen: Start},
    login: {screen: Login},
    /* look */
    look: {screen: LookerComponent},
    lookStoreList: {screen: LookStoreList},
    lookMonthList: {screen: LookMonthList},
    lookOrderList: {screen: LookOrderList},
    lookExplanation: {screen: LookExplanation},
    lookPageScreen: {screen: LookPageScreen},
    lookSignStoreList: {screen: LookSignStoreList},
    lookSignStoreScreen: {screen: LookSignStoreScreen},
    /* home */
    home: {screen: HomeComponent},
    /* home contract*/
    contractList: {screen: ContractList},
    contractSearchList: {screen: ContractSearchList},
    draftsList: {screen: DraftsList},
    contractOtherList: {screen: ContractOtherList},
    contractInfo: {screen: ContractInfo},
    creatMainContract: {screen: CreatMainContract},
    creatServiceContract: {screen: CreatServiceContract},
    createStageContract: {screen: CreateStageContract},
    createStraightContract: {screen: CreateStraightContract},
    createExtendContract: {screen: CreateExtendContract},
    contractTransitionPage: {screen: ContractTransitionPage},
    /* home enterprise */
    cityList: {screen: CityList},
    searchEnterprise: {screen: SearchEnterprise},
    searchStore: {screen: SearchStore},
    enterprise: {screen: Enterprise},
    replaceBankAccount: {screen: ReplaceBankAccount},
    createBankAccount: {screen: CreateBankAccount},
    /* home store */
    viewStoreApply: {screen: ViewStoreApply},
    draftStoreInfo: {screen: DraftStoreInfo},
    rejectedStoreInfo: {screen: RejectedStoreInfo},
    pendingStoreInfo: {screen: PendingStoreInfo},
    throughStoreInfo: {screen: ThroughStoreInfo},
    sendToMerchant: {screen: SendToMerchant},
    viewStoreInfo: {screen: ViewStoreInfo},
    createStore: {screen: CreateStore},
    basicStoreInfo: {screen: BasicStoreInfo},
    editContact: {screen: EditContact},
    storePhotoInfo: {screen: StorePhotoInfo},
    storeCourse: {screen: StoreCourse},
    listeningCourse: {screen: ListeningCourse},
    listenCourseEdit: {screen: ListenCourseEdit},
    storeCourseList: {screen: StoreCourseList},
    byStagesPackage: {screen: ByStagesPackage},
    byStagesPackageList: {screen: ByStagesPackageList},
    myStorePage: {screen: MyStorePage},
    createMyStore: {screen: CreateMyStore},
    myStoreViewInfo: {screen: MyStoreViewInfo},
    choiceColleague: {screen: ChoiceColleague},
    addActivity: {screen: AddActivity},
    visitWorkList: {screen: VisitWorkList},
    visitContactList: {screen: VisitContactList},
    mapPosition: {screen: MapPosition},
    storeEditMap: {screen: StoreEditMap},
    /* home records */
    upRecordList: {screen: UpRecordList},
    recordScreenPage: {screen: RecordScreenPage},
    /* home contacts */
    contactsList: {screen: ContactsList},
    contactsScreenPage: {screen: ContactsScreenPage},
    /* home refer order */
    referOrderList: {screen: ReferOrderList},
    showMap: {screen: ShowMap},
    orderScreenPage: {screen: OrderScreenPage},
    referOrderSearch: {screen: ReferOrderSearch},
    referOrderInfo: {screen: ReferOrderInfo},
    /* mine */
    mine: {screen: MineComponent},
    mineAbout: {screen: MineAbout},
    mineHistory: {screen: MineHistory},
    mineMsgList: {screen: MineMsgList},
}, {
    initialRouteName: 'Start',
    mode: 'modal',
    headerMode: 'none',
})

class AppWithNavigationState extends React.Component {

    constructor(props) {
        super(props)
        this.exit = false
        this.mixin = TimerMixin
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    onBackPress = () => {
        const {dispatch, nav} = this.props;
        console.log("nav = ", nav)
        // if (nav.index === 0) {
        if (nav.index === 0
            || nav.routes[nav.index].routeName === 'look'
            || nav.routes[nav.index].routeName === 'login') {
            if (this.exit) {
                return false
            } else {
                this.exit = true
                this.mixin.setTimeout(() => {
                    this.exit = false
                }, 3 * 1000)
                ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT)
                return true
            }
        } else {
            dispatch(NavigationActions.back());
            return true;
        }
    };

    render() {
        console.log("AppNavigator props = ", this.props)
        return (
            <AppNavigator navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.nav,
            })}/>
        )
    }
}

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    nav: state.nav,
})

export default connect(mapStateToProps)(AppWithNavigationState)    // 将AppNavigator连接到redux
