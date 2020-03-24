
import React, { Component } from 'react'
import {  View, Text, ScrollView, RefreshControl, Modal, Image,TouchableOpacity, Animated } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Select, Option } from 'react-native-chooser'
import moment from 'moment'
import _ from 'underscore'
import { connect } from 'react-redux'
import { Separator, Ripple, ButtonTextOnly, ProgressBar, ModalBox} from '../../components'
import { Global, ReportManager, Routes, UserDefaults, stringsUserDefaults, CommonManager, Color, CommonStyles, AlertManager, stringsAlertReports, Images } from '../../../utils'

import { HeaderListExtraLarge, ModalNormal, StateRepresentation } from '../../layouts'
import ScrollableTabs, { ScrollableTabBar } from '../../components/tabbar.android.scrollable'
import styles from './styles'
import ReportView from '../report.view'
import ReportUpload from '../report.upload'
import ReportUploadView from '../report.upload.view'

import {setUnreadFlag} from '../../../redux/actions/index'
import PropTypes from 'prop-types';
import ListView from 'deprecated-react-native-listview';
import NetInfo from "@react-native-community/netinfo";


const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
})


var count = 0;
 class ReportList extends Component {
  constructor (props) {
    super(props)
     this.animatedValue = new Animated.Value(0)
     this.animateText = new Animated.Value(15)

     const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);

    this.state = {
      scrollAnim,
      offsetAnim,

      scrollY: new Animated.Value(0),
      list: [],
      dataSource: ds.cloneWithRowsAndSections([]),
      dataSourceArray: [],
      selectedItem: undefined,
      isLoading: true,
      tabState: {
        index: 0,
        routes: [ ]
      },
      userName: '',
      activeUserSection: '',
      selectedSectionId: '',
      isReportSecDetailsDialogVisible: false,
      mergeInfo: {
        labName: '',
        reportOwner: '',
        isSelfOwnedReports: '',
        regDate: '',
        userAge: '',
        userGender: '',
        userDetailsIdForSection: '',
        viewAllReportVisible: false,
        separateReportVisible: false,
        mergeReportVisible: false
      },
      isMergeReportDialogVisible: false,
      selectedFromRoute: {},
      selectedToRoute: {},
      scrollContentHeight: 0,
      scrollContentHeight2: 0,
      scrollContentHeight3: 0,
      isTabNeeded: false,
      isFirstAndOnlyUserIndirect: false,
      upload_newreportModal: false,
      upload_reportviewModal: false,
      reportModal: false,
      swipeToClose: true,
      isOpen: false,
      selectedSectionArray : [],
      selectedItemModal: undefined,
      isConnection: false,
      isStateRepFlag:false,
      popupIsOpen: false,
      swipeArea: 1,
      isScrollable: false,
      refreshing:false,
      showDesc:true,
      opacity:14,
      unreadCnt: 0,
    }

    this._renderRows = this._renderRows.bind(this)
    this._renderTabScene = this._renderTabScene.bind(this)
    this.goToReportView = this.goToReportView.bind(this)
    this.onMergeCancel = this.onMergeCancel.bind(this)
    this._renderSections = this._renderSections.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.mergeReport = this.mergeReport.bind(this)
    this.setNewDataSource = this.setNewDataSource.bind(this)
    this.refreshReportList = this.refreshReportList.bind(this)
    this.setReportReadCount = this.setReportReadCount.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.onClosingState = this.onClosingState.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.setSwipe = this.setSwipe.bind(this)
    this.getSwipe = this.getSwipe.bind(this)
    this.setSwipeArea = this.setSwipeArea.bind(this)
    this.setScroll = this.setScroll.bind(this)
    this.getData = this.getData.bind(this)
    this.detachReport = this.detachReport.bind(this)
    this.checkConnection = this.checkConnection.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  componentDidMount () {

this.getUserName()
this.checkConnection()
 
  }

  async checkConnection(){
  NetInfo.isConnected.fetch().then(isConnected => {
    (isConnected ?
      this.setState({isConnection: true})
      :
    this.setState({isConnection: false}))
  });

  setTimeout(()=>{
    if(this.state.isConnection){
        this.getData()
        this.setState({ isPreLoading:true, isStateRepFlag:false})
              }
    else{
      console.log('Not connected')
      this.setState({isPreLoading:false,isStateRepFlag:true})
    }
    }, 500);
    
}

  _onRefresh() {
    this.setState({refreshing: true});
    this.checkConnection().then(() => {
      this.setState({refreshing: false});
    });
  }

  animate() {
  this.animatedValue.setValue(-100)
  Animated.spring(
    this.animatedValue,
    {
      toValue: 1,
      speed:8,
      bounciness:-10,
      velocity:0
    }
  ).start()
}


  async getUserName () {
    this.setState({
      isPreLoading:true
    })
    UserDefaults.get(stringsUserDefaults.userName)
    .then((name) => {
      if (name) {
        this.setState({ userName: name })
      }
    }).catch(CommonManager.handleError)
  }

  async getData () {
    this.setState({isPreLoading: true, isStateRepFlag:false})
    var _this = this
    ReportManager.getReports(_this)
      .then((result) => {
        if (result.success) {

          this.animate();

          setTimeout(()=>{
          this.setNewDataSource(result.response.allReportSortedCatMap, result.response.activeUserSection)
        }, 50);
        }
      }).catch(error => {
        console.log(error)
        this.setState({isPreLoading: false})
      })
  }

  refreshReportList () {
    this.getData()
  }

  setNewDataSource (allReportSortedCatMap, activeUserSection) {
    var allKeys = Object.keys(allReportSortedCatMap)
    var isTabNeeded = false
    var isFirstAndOnlyUserIndirect = false
    var firstUserId = '-1'
    if (allKeys.length === 1) {
      let firstSection = allReportSortedCatMap[allKeys[0]]
      var allKeysSection = Object.keys(firstSection)
      if (allKeysSection.length > 0) {
        var firstKey = allKeysSection[0]
        let keyArray = firstKey.split(Global.splitter)
        if (keyArray.length > 2 && keyArray[2] === '1') {
          isFirstAndOnlyUserIndirect = true
        }
      }
    } else if (allKeys.length > 1) {
      isTabNeeded = true
      _.each(allReportSortedCatMap, function (value, key) {
        _.each(value, function (value, key) {
          let keyArray = key.split(Global.splitter)
          if (keyArray[2] === '0' && firstUserId === '-1' && keyArray[1] !== 'Uploaded Report') {
            firstUserId = keyArray[4]
          }
        })
      })
    }
    var routes = []
    allKeys.forEach((key) => {
      var neededKey = key.split(Global.splitter)[0]
      if (neededKey.length > 1 && Object.keys(allReportSortedCatMap[key]).length > 0) {
        if (firstUserId === key.split(Global.splitter)[1]) {
          routes.splice(0, 0, { key: key, title: neededKey.toTitleCase() })
        } else {
          routes.push({ key: key, title: neededKey.toTitleCase() })
        }
      }
    })
    var tabState = {
      index: 0,
      routes: routes
    }
    /* eslint-disable */
    /* eslint-enable */
    this.setState({
      dataSourceArray: allReportSortedCatMap,
      isLoading: false,
      isPreLoading: false,
      isTabNeeded: isTabNeeded,
      isFirstAndOnlyUserIndirect: isFirstAndOnlyUserIndirect,
      tabState: tabState,
      activeUserSection: activeUserSection
    })
  }

  async mergeReport () {
    this.setState({isLoading: true})
    let selectedToRoute = this.state.selectedToRoute.key ? this.state.selectedToRoute.key : this.state.activeUserSection
    let selectedReportSection = Object.keys(this.state.dataSourceArray[selectedToRoute])[0] || ''
    var selectedSectionArrayPrimary = selectedReportSection.split(Global.splitter)
    var primaryUserDetailsId = selectedSectionArrayPrimary[selectedSectionArrayPrimary.length - 1]

    var selectedSectionArraySec = this.state.selectedSectionId.split(Global.splitter)
    var secondaryUserDetailsId = selectedSectionArraySec[selectedSectionArraySec.length - 1]

    if (!['', 0, '0'].includes(primaryUserDetailsId) && !['', 0, '0'].includes(secondaryUserDetailsId)) {
      var _this = this
      ReportManager.mergeReport(primaryUserDetailsId, secondaryUserDetailsId, _this)
      .then((result) => {
        if (result.success) {
          this.setState({isLoading: false})
          AlertManager.AlertGeneric('Success', 'The reports has been merged successfully.')
        }
      }).catch(error => CommonManager.handleError(error, (function () {
        this.setState({ isLoading: false })
      }).bind(this)))
    }
  }

  async detachReport () {
    this.setState({isLoading: true})
    let sectionArray = this.state.dataSourceArray[this.state.activeUserSection][this.state.selectedSectionId]
    if (sectionArray.length > 0) {
      var selectedItem = sectionArray[0]
      if (((selectedItem.billId || {}).id || 0) > 0) {
        var _this = this
        ReportManager.detachReport(selectedItem.billId.id, _this)
        .then((result) => {
          if (result.success) {
            var newUserDetailsId = result.response.newChildId
            var selectedSectionArraySec = this.state.selectedSectionId.split(Global.splitter)
            var newSectionId = this.state.selectedSectionId.replace(selectedSectionArraySec[selectedSectionArraySec.length - 1], newUserDetailsId + '')
            var newSectionArray = []
            sectionArray.map((element, index) => {
              var newElement = element
              if (!newElement.userDetailsId) {
                newElement.userDetailsId = { }
              }
              newElement.userDetailsId.id = newUserDetailsId
              newSectionArray.push(newElement)
            })

            var newDataSourceArray = this.state.dataSourceArray
            delete newDataSourceArray[this.state.activeUserSection][this.state.selectedSectionId]
            if (!newDataSourceArray[selectedItem.fullName + Global.splitter + newUserDetailsId]) {
              newDataSourceArray[selectedItem.fullName] = { }
            }
            newDataSourceArray[selectedItem.fullName][newSectionId] = sectionArray
            this.setState({ isLoading: false, selectedSectionId: '' })
            this.setNewDataSource(newDataSourceArray, this.state.activeUserSection)
            AlertManager.AlertGenericWithTimeout({
              header: 'Success',
              message: 'The reports of ' + selectedItem.fullName + ' are separated successfully.'
            })
          }
        }).catch(error => CommonManager.handleError(error, (() => {
          this.setState({isLoading: false})
        }).bind(this)))
      }
    }
  }

  _renderRows (item, secId, rowId) {
    
    return (
      <Ripple
        activeOpacity={0.4}
        onPress={() => {
          this.setState({ selectedItem: item, selectedSectionId: secId })
          this.goToReportView(false)
        }}
        key={rowId + secId}
        style={{ backgroundColor: 'white' }}
      >
        <View style={[styles.containerRowMain]}>
          <Text style={[CommonStyles.textDescription2, styles.textReportName]}>{item.reportName || item.title || ''}</Text>
          {
            ((item.uploadDate || '').length > 3 || (parseInt(item.isFileInputReport, 10) || 0) === 1) &&
              <MaterialIcons
                name={'attachment'}
                size={16}
                style={styles.iconAttachment}
              />
          }
          {
            (item.isRead) <= 0 &&
            <MaterialIcons
              name={'brightness-1'}
              size={12}
              style={styles.iconIsRead}
            /> 
          }
        </View>
        <Separator style={{ marginLeft: 24, marginRight: 24 }} />
      </Ripple>
    )
  }

  goToReportView (navigateToReportUpload = false, isComingFromFab) {
    this.setState({isNavigating: true})
    setTimeout((() => {
      var selectedItem = this.state.selectedItem || {}
      this.setState({ isReportSecDetailsDialogVisible: false })
      if (((selectedItem.uploadDate || '').length > 0) || navigateToReportUpload) {
        // this.setState({isNavigating: false})
        if (navigateToReportUpload) {
          // this.props.navigation.navigate(Routes.reportUploadScreen, {
          //   refreshReportList: this.refreshReportList
          // })

          this.setState({
            isOpen: true,
            upload_newreportModal: true,
            upload_reportviewModal: false,
            reportModal: false,
            isNavigating: false,
          })
        } else {
          // this.props.navigation.navigate(Routes.reportUploadViewScreen,
          //   {
          //     reportListObject: selectedItem,
          //     isViewOnly: true
          //   }
          // )
          this.setState({
            isOpen: true,
            upload_newreportModal: false,
            upload_reportviewModal: true,
            reportModal: false,
            isNavigating: false,
          })
        }
      } else {
        let sectionArray = this.state.dataSourceArray[this.state.activeUserSection][this.state.selectedSectionId]
        if ((selectedItem === {} || isComingFromFab) && sectionArray.length > 0) {
          selectedItem = sectionArray[0]
        }
        // this.setState({isNavigating: false})
        // this.props.navigation.navigate(Routes.reportViewScreen,
        //   {
        //     reportListObject: selectedItem,
        //     reportSectionObject: sectionArray,
        //     userName: this.state.activeUserSection.split(Global.splitter)[0],
        //     setReportReadCount: this.setReportReadCount
        //   }
        // )

        this.setState({
          // popupIsOpen: true,
          // movie,
          isOpen: true,
          upload_newreportModal: false,
          upload_reportviewModal: false,
          reportModal: true,
          isNavigating: false,
          selectedSectionArray : sectionArray,
          selectedItemModal: selectedItem
        });
        // this.setState({
        //   isOpen: true,
        //   upload_newreportModal: false,
        //   upload_reportviewModal: false,
        //   reportModal: true,
        //   isNavigating: false,
        //   selectedSectionArray : sectionArray,
        //   selectedItemModal: selectedItem
        // })
      }
    }).bind(this), 50)
  }

  async setReportReadCount (reportId) {
    _.each(this.state.dataSourceArray, function (value, key) {
      _.each(value, function (value, key) {
        value.forEach(function (element) {
          if (reportId === element.userReportId) {
            if(element.isRead==0){
              unreadCnt = this.props.unread.flag
              unreadCnt--
              element.isRead += 1
              this.props.dispatch(setUnreadFlag(unreadCnt))
              

            }else{
              unreadCnt = this.state.unreadCnt
            element.isRead += 1
          }
          }
        }.bind(this))
      }.bind(this))
    }.bind(this))
    this.setState({ dataSourceArray: this.state.dataSourceArray })
  }

  _renderSections (sectionData, category) {
    var regDate = moment(((sectionData[0].userDetailsId || {}).user || {}).date_joined || '', Global.LTHDateFormatMoment + 'Z').format(Global.dateFormatDisplay) || ''
    var years = moment().diff(moment((sectionData[0].userDetailsId || {}).dateOfBirth || '', 'YYYY-MM-DD'), 'years', false) || 0

    let splitArray = category.split(Global.splitter)
    var date = (splitArray[0] || '')
    var labName = (splitArray[1] || '')
    var isIndirect = splitArray[2]
    var reportOwner = (splitArray[3] || '')
    var userDetailsIdForSection = splitArray[4]
    var isSelfOwnedReports = (reportOwner !== this.state.activeUserSection.split(Global.splitter)[0])

    var viewAllReportVisible = sectionData.length > 1
    var firstReportBillId = (sectionData[0].billId || {}).id > 0
    var separateReportVisible = (firstReportBillId > 0)
    var mergeReportVisible = false // (userDetailsIdForSection.length > 0 && this.state.tabState.routes.length > 1)

    var selfOwnedReports = (() => {
      if (isSelfOwnedReports || this.state.isFirstAndOnlyUserIndirect) {
        return (
          <View style={{ flex: 1, flexDirection: 'row', marginTop: 0, alignItems: 'center' }}>
            <Text style={styles.textIndirectHeader}>{reportOwner}</Text>
            <Text style={{ fontFamily: 'Arial' , padding: 3, backgroundColor: Color._9F, borderRadius: 3, fontSize: 10, overflow: 'hidden', color: 'white', paddingLeft: 12, paddingRight: 12 }}>ALTERNATE</Text>
            {(viewAllReportVisible || separateReportVisible || (!this.state.isFirstAndOnlyUserIndirect && !viewAllReportVisible))
            ? <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <MaterialIcons.Button
                name={'info-outline'}
                size={24}
                backgroundColor={'transparent'}
                color={Color._9F}
                underlayColor='#F5F5F5'
                style={{ padding: 7, paddingRight: 0, marginRight: -4 }}
                onPress={() => this.setState({
                  isReportSecDetailsDialogVisible: true,
                  mergeInfo: {
                    userAge: (years > 0) ? String(years) : '',
                    labName,
                    reportOwner,
                    regDate,
                    isSelfOwnedReports,
                    userDetailsIdForSection,
                    viewAllReportVisible,
                    separateReportVisible,
                    mergeReportVisible
                  },
                  selectedSectionId: category
                })}
              />
            </View> : <View style={{ height: 36, width: 5 }} />
            }
          </View>
        )
      } else {
        return null
      }
    }).bind(this)
    return (
      <View style={styles.containerDateAndLabNameHeader}>
        <Text style={[CommonStyles.textHeader3, styles.textDateAndLabNameHeader]}>{labName}</Text>
        <Text style={[CommonStyles.textDescription3, styles.textDateAndLabNameHeader]}>{date}</Text>
        {selfOwnedReports()}
      </View>
    )
  }

  _renderHeader () {
    var containerStyle = [{ flex: 0, backgroundColor: 'white' }]
    return <View style={{ backgroundColor: 'white', }}>
      <HeaderListExtraLarge
        header='Medical Reports'
        description={'Medical records from your recent visit will appear here'}
        style={containerStyle}
        headerStyle={{ backgroundColor: 'white' }}
      >
        {/* <MaterialIcons.Button
          name={'file-upload'}
          size={30}
          backgroundColor={'transparent'}
          color={'black'}
          onPress={() => {
            this.selectedItem = undefined
            this.goToReportView(true)
          }}
          underlayColor='#F5F5F5'
          style={{ marginLeft: 5, marginRight: -10, paddingTop: 5, paddingRight: 0 }}
        /> */}
        <TouchableOpacity
          activeOpacity={0.4}
          style = {{paddingBottom:16}}
          onPress={() => {
            this.selectedItem = undefined
            this.goToReportView(true)
          }}>
            <Image
               source={Images.imageUpload}
               style={{height:25,width:25, tintColor : '#565656', marginTop: 12}}/>
        </TouchableOpacity>
      </HeaderListExtraLarge>
      {(!this.state.isTabNeeded) && <Separator style={{ height: 1 }}/>}
    </View>
  }

//   _renderHeader(){
  
// const HEADER_MAX_HEIGHT = this.state.isTabNeeded ? 110 : 120;
// const HEADER_MIN_HEIGHT = 70;
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

//   const headerHeight = this.state.scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE],
//     outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
//     extrapolate: 'clamp',
//   });




//     return(
//       <Animated.View style = {{backgroundColor:'white', paddingRight: 18, paddingLeft: 18, paddingTop: Global.iOSPlatform ? 18: 28, paddingBottom:this.state.isTabNeeded ? 0 : 10, height:headerHeight}}>

//        <View style = {{flexDirection:'row',}}>
//         <Text style = {{fontSize:32, flexGrow: 2,textAlignVertical: 'bottom',color: 'black', fontWeight: '700', opacity:0.9}}>Medical Reports</Text>

//         <TouchableOpacity
//           activeOpacity={0.4}
//           onPress={() => {
//             this.selectedItem = undefined
//             this.goToReportView(true)
//           }}>
//             <Image
//                source={Images.imageUpload}
//                style={{height:25,width:25, tintColor : '#565656', marginTop: 12}}/>
//         </TouchableOpacity>   
//        </View>  
//      {/* {this.state.showDesc ?  */}
//         {/* <Animated.View style= {{backgroundColor:'red'}}> */}
//         <Animated.Text style = {{flexGrow: 0, paddingTop: 10, fontSize: 14, color: '#4a4a4a', fontWeight: '400'}}>Medical records from your recent visit will appear here</Animated.Text>
//         {/* </Animated.View>   */}
//      {/* :(null) } */}

//       </Animated.View>
//     )
//   }

  onScroll(event){


  const scrollY = event.nativeEvent.contentOffset.y;
  if (scrollY >= 0) {
    let newOpacity = 14 - (scrollY / 10.0);
   // if (newOpacity < 0) newOpacity = 0;
    this.setState({
      opacity: newOpacity,
     // imageScale: 1.0
    });
  } else {
  //  let newScale = 1.0 + 0.4*(-scrollY / 200.0);
  //  if (newScale > 1.4) newScale = 1.4;
    this.setState({
      opacity: 14,
      //imageScale: newScale
    });
  }


  if (scrollY > 5){
      this.setState({
        showDesc:false
      })
  }

  if (scrollY < 5){
    this.setState({
      showDesc:true
    })
}

  }

  _renderTabScene ({ route }) {
    var key = (route.key || this.state.userName)
    var dataSource = (this.state.dataSourceArray[key] || [])

    return(
    <ListView
    ref = "scrollView"
    scrollEventThrottle={20}
    // onScroll = {this.onScroll}   

     onScroll={Animated.event(
      [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
    )}

     refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      ref='reportList'
      key={route.key}
      tabLabel={route.title}
      enableEmptySections
      bounces={true}
      automaticallyAdjustContentInsets={false}
      stickySectionHeadersEnabled={false}
      initialListSize={14}
      pageSize={14}
      removeClippedSubviews={false}
      onContentSizeChange={(w, h) => {
        console.log(key, h)
        var height = Global.screenHeight
        if (h > Global.screenHeight) {
          height = h
        }
        console.log(key, height)
        this.setState({ scrollContentHeight2: height })
      }}
      dataSource={ds.cloneWithRowsAndSections(dataSource)}
      style={{ flex: 1, width: Global.screenWidth, height: this.state.scrollContentHeight2, backgroundColor: Color._EEGrayTableHeader}}
      renderRow={this._renderRows}
      renderSectionHeader={(sectionData, category) =>
          this._renderSections(sectionData, category)
      }
      renderFooter={() => <View style={{ backgroundColor: Color._EEGrayTableHeader, height: 30, flex: 1 }} />}
    />
    );
  }

  setSwipe(flag){
    this.setState({
      swipeToClose: flag
    })
  }
  setSwipeArea(isTopFlag){
    if(isTopFlag){
      this.setState({
        swipeArea: Global.screenHeight
      })
    } else {
      this.setState({
        swipeArea: 1
      })
    }
  }

  getSwipe(){
    return this.state.swipeToClose
  }

  _renderModal () {
    var mergeInfo = this.state.mergeInfo
    var validDate = (mergeInfo.regDate || '').length > 0 && (!(mergeInfo.regDate || '').toUpperCase().includes('INVALID'))

    var genderAndAgeString = function () {
      var validAge = parseInt(mergeInfo.userAge, 10) > 0
      var validGender = (mergeInfo.userGender || '').length > 0

      if (validAge && validGender) {
        return '( ' + mergeInfo.userGender + ' - ' + mergeInfo.userAge + ' )'
      } else if (validAge) {
        return '( ' + mergeInfo.userAge + ' )'
      } else if (validGender) {
        return '( ' + mergeInfo.userGender + ' )'
      } else {
        return ''
      }
    }

    return (
      // <ModalNormal
      //   isFlexibleModalContentHeight={false}
      //   visible={this.state.isReportSecDetailsDialogVisible}
      //   onRequestClose={() => {
      //     this.setState({ isReportSecDetailsDialogVisible: false })
      //   }}
      //   fabBottomHeight={90}
      // >
        <ModalBox
           style={{justifyContent: 'center', borderRadius: 6, backgroundColor: ' rgba(0, 0, 0, 0)'}}
           ref={"modal1"}
           swipeThreshold={200}
           swipeArea={Global.screenHeight}
           isOpen={this.state.isReportSecDetailsDialogVisible}
           swipeToClose={this.state.swipeToClose}
           onClosed={this.onClose}
           position={'center'}
           keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
           onOpened={this.onOpen}
           onClosingState={this.onClosingState}>

          <View style={{ borderRadius: 8, backgroundColor: 'white', marginLeft: 24, marginRight: 24, padding: 8}}>
            <View style={{ backgroundColor: 'white', borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', margin: 24, marginBottom: 8}}>
                <Text style={[CommonStyles.textHeader4, styles.title_style, { marginRight: 12 }]}>{mergeInfo.reportOwner}</Text>

                {
                  genderAndAgeString().length > 0 && <Text style={[CommonStyles.textDescription1, { marginBottom: 7, marginRight: 12 }]}>{genderAndAgeString()}</Text>
                }

                <Text style={{ fontFamily: 'Arial' , padding: 3, backgroundColor: Color._9F, borderRadius: 3, fontSize: 10, overflow: 'hidden', color: 'white', paddingLeft: 12, paddingRight: 12, marginBottom: 7 }}>ALTERNATE</Text>
              </View>
              {(mergeInfo.labName || '').length > 0 &&
              <Text style={[CommonStyles.textDescription3, styles.secondary_title_style]}
                numberOfLines={2} ellipsizeMode={'tail'}
              >Registered at {mergeInfo.labName}</Text>}
              {validDate &&
              <Text style={[CommonStyles.textDescription3, styles.secondary_title_style, { marginTop: -5 }]}>{mergeInfo.regDate}</Text>}
            </View>

          <View style={{ backgroundColor: 'white', marginLeft: 24, marginRight: 24}}>
            {/*<Separator />*/}
            { mergeInfo.viewAllReportVisible &&
              <View>
                <ButtonTextOnly
                  title={'View Related Reports'}
                  titleStyle={[CommonStyles.textHeader3, { fontSize: 18, fontWeight: '400' }]}
                  style={{ height: 60, paddingTop: 15, paddingBottom: 15 }}
                  onPress={() => {
                    this.goToReportView(false, true)

                    // setTimeout((() => {
                    //   var selectedItem = this.state.selectedItem || {}
                    //   this.setState({ isReportSecDetailsDialogVisible: false })
                    //   if (((selectedItem.uploadDate || '').length > 0) || navigateToReportUpload) {
                    //     this.setState({isNavigating: false})
                    //     if (navigateToReportUpload) {
                    //       this.props.navigation.navigate(Routes.reportUploadScreen, {
                    //         refreshReportList: this.refreshReportList
                    //       })
                    //     } else {
                    //       this.props.navigation.navigate(Routes.reportUploadViewScreen,
                    //         {
                    //           reportListObject: selectedItem,
                    //           isViewOnly: true
                    //         }
                    //       )
                    //     }
                    //   } else {
                    //     let sectionArray = this.state.dataSourceArray[this.state.activeUserSection][this.state.selectedSectionId]
                    //     if ((selectedItem === {} || isComingFromFab) && sectionArray.length > 0) {
                    //       selectedItem = sectionArray[0]
                    //     }
                    //     this.setState({isNavigating: false})
                    //     this.props.navigation.navigate(Routes.reportViewScreen,
                    //       {
                    //         reportListObject: selectedItem,
                    //         reportSectionObject: sectionArray,
                    //         userName: this.state.activeUserSection.split(Global.splitter)[0],
                    //         setReportReadCount: this.setReportReadCount
                    //       }
                    //     )
                    //   }
                    // }).bind(this), 50)

                  }}
                />
                <Separator style={{ marginLeft: 24, marginRight: 24 }} />
              </View>
            }
            { mergeInfo.mergeReportVisible &&
              <View>
                <ButtonTextOnly
                  title={'Merge Reports'}
                  titleStyle={[CommonStyles.textHeader3, { fontSize: 18, fontWeight: '400',  color: Color.theme_blue }]}
                  style={{ height: 50, paddingTop: 15, paddingBottom: 7 }}
                  color={Color.theme_blue}
                  onPress={() => {
                    this.setState({
                      isMergeReportDialogVisible: true,
                      isReportSecDetailsDialogVisible: false
                    })
                  }}
                />
                <Text style={[CommonStyles.textDescription4, { marginLeft: 24, marginRight: 24, marginTop: 0, marginBottom: 15 }]}>Incase of duplicate users, use this option to merge reports from one user to another.</Text>
                <Separator style={{ marginLeft: 24, marginRight: 24 }} />
              </View>
            }
            { mergeInfo.separateReportVisible && !this.state.isFirstAndOnlyUserIndirect &&
              <View>
                <ButtonTextOnly
                  title={'Separate Reports'}
                  titleStyle={[CommonStyles.textHeader3, { fontSize: 18, fontWeight: '400', color: Color.theme_blue }]}
                  style={{ height: 50, paddingTop: 15, paddingBottom: 7 }}
                  color={Color.theme_blue}
                  onPress={() => {
                    this.setState({
                      isReportSecDetailsDialogVisible: false
                    })

                    AlertManager.AlertGenericWithTimeout(
                      stringsAlertReports.confirmSeparation,
                      [
                        { text: 'Yes', onPress: () => this.detachReport() },
                        { text: 'Cancel', onPress: () => {} }
                      ]
                    )
                  }}
                />
                <Text style={[CommonStyles.textDescription4, { marginTop: 0, marginBottom: 15 }]}>Incase of report of family members, use this option to separate reports.</Text>
                {/*<Separator />*/}
              </View>
            }
            <ButtonTextOnly
              title={'CLOSE'}
              style={{ flex: 0, backgroundColor: 'white', height: 56, paddingTop: 10, paddingBottom: 18, paddingRight: 24 }}
              titleStyle={[CommonStyles.button_style, { textAlign: 'left' } ]}
              onPress={this.closeModal}
            />
          </View>
          </View>
      </ModalBox>
      // </ModalNormal>
    )
  }

  _renderModalMerge () {
    var { selectedFromRoute, selectedToRoute } = this.state
    return (
      <ModalNormal
        visible={this.state.isMergeReportDialogVisible}
        onRequestClose={this.onMergeCancel}
        actionList={[
          { title: 'Merge',
            color: Color.theme_blue,
            onPress: this.mergeReport,
            enabled: (selectedToRoute !== undefined)
          },
          { title: 'Cancel',
            onPress: this.onMergeCancel,
            enable: true
          }
        ]}
      >
        <View>
          <View style={{ margin: 24, marginBottom: 14 }}>
            <Text style={[CommonStyles.textHeader4, styles.title_style]}>Merge Reports</Text>
            <Text style={[CommonStyles.textDescription3, { color: '#000', marginTop: 10 }]}>Incase of duplicate users, use this option to merge reports from one user to another.</Text>
          </View>
          <Separator />
          <View style={{ marginLeft: 24, marginRight: 24, marginTop: 10, marginBottom: 15 }}>
          <Text style={{ fontFamily: 'Arial' , padding: 5 }}>From</Text>
          <Text style={{ fontFamily: 'Arial' , padding: 5, fontWeight: '700' }}>{this.state.mergeInfo.reportOwner}</Text>
          {/*{this.state.tabState.routes && this._renderSelect('from', selectedToRoute)}*/}
          <View style={{ height: 17 }} />
          {this.state.tabState.routes && this._renderSelect('to', selectedFromRoute)}
          </View>
          <Separator />
        </View>
      </ModalNormal>
    )
  }

  _renderSelect (mergeOption, selectedRoute) {
    var newRoutes = this.state.tabState.routes
    newRoutes = newRoutes.filter((element) => {
      if (element.key !== this.state.activeUserSection) {
        return true
      }
      return false
    })
    return (
      <View>
        <Text style={{ fontFamily: 'Arial' , padding: 5 }}>{mergeOption.toTitleCase()}</Text>
        <Select
          onSelect={(element) => this.onSelect(mergeOption, element)}
          defaultText='Select Name'
          style={{ borderWidth: 1.0, borderColor: Color._EEGrayTableHeader, backgroundColor: 'white' }}
          textStyle={{ padding: 3 }}
          transparent
          optionListStyle={{ backgroundColor: 'white', height: 150 }}
        >
          {
            newRoutes.map(function (element, index) {
              return <Option
                value={element}
                key={element.key}
                selected={(element === selectedRoute)}
                style={{ padding: 10 }}
                selectedStyle={{ padding: 10, backgroundColor: '#ccc' }}
                >{element.title}</Option>
            })
          }
        </Select>
      </View>
    )
  }

  onSelect (option, element) {
    console.log('From -> ', this.state.selectedFromRoute, this.state.selectedToRoute)
    switch (option) {
      case 'from': this.setState({ selectedFromRoute: element })
        break
      case 'to': this.setState({ selectedToRoute: element })
        break
      default: break
    }
  }

  onMergeCancel () {
    this.setState({ isMergeReportDialogVisible: false, selectedFromRoute: undefined, selectedToRoute: undefined })
  }

  onClose() {

    this.closeModal()
    console.log('Modal just closed');
  }
  onOpen() {
    console.log('Modal just openned');
  }
  onClosingState(state) {
     console.log('the open/close of the swipeToClose just changed');
  }

  closeModal(){

    this.setState({
      isOpen: false,
      isReportSecDetailsDialogVisible: false,
      isScrollable: false,
      swipeToClose: true
    })
  }

  setScroll(flag){
    this.setState({
      isScrollable: flag
    })
  }


  render () {

    
    var allTabsArray = ((this.state.tabState || {}).routes || [])
    var reportPresent = allTabsArray.length > 0

     const anim = this.animatedValue.interpolate({
                 inputRange: [0.5, 3],
                 outputRange: [-100, 400]});

    return <View style={{ flex: 1, backgroundColor: 'white', top:Global.isIphoneX ? 30: 0}}>
      { !this.state.isStateRepFlag
      ? !this.state.isPreLoading
      ? reportPresent
      ? <View style={{ flex: 1, height: this.state.scrollContentHeight, backgroundColor: Color._EEGrayTableHeader }}
        bounces={false}
        onContentSizeChange={(w, h) => {
          var height = Global.screenHeight
          if (h > Global.screenHeight) {
            height = h
          }
          this.setState({ scrollContentHeight: height })
        }}
      >
        {!this.state.isLoading && reportPresent && this._renderHeader()}
        {
          !this.state.isLoading &&
          this.state.isTabNeeded
          ?<Animated.View style={{flex: 1, bottom:anim}}>
           <ScrollableTabs
            renderTabBar={() => <ScrollableTabBar
              activeTextColor='#000'
              inactiveTextColor='#000'
              tabStyle={[{ backgroundColor: 'white' }]}
              underlineStyle={{ backgroundColor: Color.greenBright }}
            />}
            ref={(tabView) => {
              this.tabView = tabView
            }}
            onChangeTab={((page) => {
              this.setState({
                tabState: {
                  index: page.i,
                  routes: this.state.tabState.routes
                },
                activeUserSection: this.state.tabState.routes[page.i].key
              })
            }).bind(this)}
            style={{ backgroundColor: 'white' }}
          >
          {
            allTabsArray.length > 0 && allTabsArray.map((element) => {
              return this._renderTabScene({ route: element })
            })
          }
          </ScrollableTabs>
</Animated.View>
        :
        <Animated.View style={{flex: 1, bottom:anim}}>
       { this._renderTabScene({ route: { key: this.state.activeUserSection } })}
        </Animated.View>

        }
        {this.state.isReportSecDetailsDialogVisible && this._renderModal()}
        {this.state.isMergeReportDialogVisible && this._renderModalMerge()}
        {this.state.isNavigating && <ProgressBar />}
      </View>
       :
       <View style={{ flex: 1 }}>
        {this._renderHeader() }
      <ScrollView
      style= {{flex: 1}}
           refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
       
       <View style={{paddingTop : 110}}/>
        <View>
        <StateRepresentation
         image='description'
          description='No reports are present'
        />
        </View>    
     
      </ScrollView>
              
          </View>

     //  <View style={{ flex: 1 }}>
      //   {this._renderHeader()}
      //   <StateRepresentation
      //     image='description'
      //     description='No reports are present'
      //   />
      // </View>
      : <View>
        {this._renderHeader()}
        {this.state.isLoading && <ProgressBar />}
      </View>

      :    <View style={{ flex: 1 }}>
        {this._renderHeader() }
      <ScrollView
      style= {{flex: 1}}
           refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
       
       <View style={{paddingTop : 100}}/>
        <View>
          <StateRepresentation
          image='signal-wifi-off'
          description='No Internet Connection'></StateRepresentation>
        </View>    
     
      </ScrollView>
              {/* <View style = {{flex:0, alignContent : 'center',                             alignItems:'center', marginBottom: 30}}>
                <Ripple onPress = {this.onRefresh.bind(this)}>
                  <Text style = {{fontWeight:'bold', color: Color.theme_blue}}>Refresh</Text>
                </Ripple>
              </View> */}
          </View>

      }

      {(this.state.isOpen)
        ?
      (
        // <Modal
        //  animationType={'none'}
        //  transparent={true}
        //  visible={this.state.isOpen}
        //  onRequestClose = {() => {
        //    this.closeModal()
        //  }}
        //  >
           <ModalBox
             style={{position: 'absolute'}}
             ref={"modal1"}
             swipeThreshold={200}
             swipeArea={Global.screenHeight}
             isOpen={this.state.isOpen}
             swipeToClose={this.state.swipeToClose}
             onClosed={this.onClose}
             position={'top'}
             keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
             onOpened={this.onOpen}
             coverScreen={true}
             onClosingState={this.onClosingState}
             setSwipe={this.setSwipe}
             getSwipe={this.getSwipe}
             isScrollable={this.state.isScrollable}>

           {(this.state.upload_newreportModal)
           ?(<ReportUpload
              refreshReportList={this.refreshReportList}
              closeModal={this.closeModal}/>)
              :
              (this.state.reportModal)
               ? (<ReportView
                   navigation = {this.props.navigation}
                   reportListObject={this.state.selectedItemModal}
                   reportSectionObject={this.state.selectedSectionArray}
                   userName={this.state.activeUserSection.split(Global.splitter)[0]}
                   setReportReadCount={this.setReportReadCount}
                   closeModal={this.closeModal}
                   setSwipe={this.setSwipe}
                   getSwipe={this.getSwipe}
                   setScroll={this.setScroll}
                   setSwipeArea={this.setSwipeArea}/>)
                    :
                    (this.state.upload_reportviewModal
                      ? <ReportUploadView
                          reportListObject={this.state.selectedItem}
                          isViewOnly= {true}
                          closeModal={this.closeModal}/> : null)}

            </ModalBox>
      //  </Modal>
    ) : (null)}

    
    </View>
  }
}

ReportList.propTypes = {
  name: PropTypes.string,
  index: PropTypes.number,
  list: PropTypes.array,
  setIndex: PropTypes.func,
  navigation: PropTypes.object
}




const mapStateToProps = state => ({
  unread: state.unread
})
export default connect(mapStateToProps)(ReportList)
