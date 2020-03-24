import React, { Component } from 'react'
import { View, Text, processColor, ScrollView, Platform, Modal} from 'react-native'

import { URLs, Routes, Global, Color, UserDefaults, stringsUserDefaults, NetworkRequest } from '../../../utils'
import { LineChart } from 'react-native-charts-wrapper';
import moment from 'moment'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {ProgressBar , ModalBox} from '../../components'
import Ripple from '../../components/ripple'
import TrackerDetails from '../tracker.details'
import {setUnreadFlag, setDemographics} from '../../../redux/actions/index'
import { connect } from 'react-redux'

 class AutomatedTrackers extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dictionaryId : this.props.navigation.state.params.dictionaryId,
      name :  this.props.navigation.state.params.name,
      description :  this.props.navigation.state.params.description,
      userReportId :  this.props.navigation.state.params.userReportId,
      refreshComponent: this.props.navigation.state.params.refreshComponent,
      selected_ref: this.props.navigation.state.params.selected_ref,
      auto_tracker : this.props.navigation.state.params.item,
      gender: '',
      minVal : '',
      maxval: '',
      highlightedValue : '',
      highlightedUnit: '',
      highlightedDate : '',
      mainVal: '',
      mainDate: '',
      legend: {
        enabled: false
      },
      marker: {
        enabled: true,
        backgroundTint: processColor('black'),
        markerColor: processColor('#F0C0FF8C'),
        textColor: processColor('white'),
      },
      data: {},
      xAxis:{},
      yAxis:{},
      rightAxis : {},
      isTracked: 0,
      areResults: false,
      isLoading: false,
      swipeToClose: true,
      isOpen: false,
      label: '',
      isScrollable: false

    }
    this.getChart = this.getChart.bind(this)
    this.loadingManipulate = this.loadingManipulate.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.onClosingState = this.onClosingState.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.getBack = this.getBack.bind(this)
    this.setSwipe = this.setSwipe.bind(this)
    this.getSwipe = this.getSwipe.bind(this)
    this.setScroll = this.setScroll.bind(this)
    this.giveFeedback = this.giveFeedback.bind(this)
  }

  loadingManipulate(flag){
    this.setState({
      isLoading: flag
    })
  }

  componentWillMount(){
    this.props.setDemographics({show:1})
    this.props.setUnreadFlag(0)
  }

  componentDidMount(){
      this.getData()
  }

  async getData(){

    UserDefaults.get(stringsUserDefaults.userSex).then((userSex) => {
      this.setState({
        gender : userSex
      })
    }).catch((error) => {
      console.error(error);
    })

    this.getChart(this.state.auto_tracker)
  }

  async getChart(response){

    try {
      var graphData = [];
      var dataSets = [];
      var blankValueArray = [];
      var relatedValues = response.relatedValues
      var minVal = ''
      var maxVal = ''
      var mainVal = ''
      var mainDate = ''
      var highlightedValue = ''
      var highlightedUnit = ''
      var highlightedDate = ''
      var isTracked = 0
      var refVals = this.state.selected_ref

      if(this.state.gender === 'Male'){
        minVal = refVals.maleLowerBound
        maxVal = refVals.maleUpperBound
      } else {
        minVal = refVals.femaleLowerBound
        maxVal = refVals.femaleUpperBound
      }

      for(var i = 0 ; i < response.length ; i++){
        var value = response[i].value._source
        if(this.state.dictionaryId === response[i].value._source.dictionaryId){
          dataSets = response[i].dataSets.dataSets
          highlightedUnit = value.unit
          highlightedValue = value.value
          highlightedDate = value.reportDate
          break;
        }
      }

      isTracked = response.isTracked

      this.setState(
        //  reactAddonsUpdate(this.state,
        {
          data : {dataSets: dataSets},
          xAxis: {
              startAtZero: true,
              // valueFormatter: tickArray,
              position: "BOTTOM",
              textSize: 7,
              drawGridLines:false,
          },
          yAxis: {
              startAtZero: true,
              drawGridLines:false
          },
          rightAxis:{
            drawAxisLine:false,
            enabled:false,
            drawGridLines:false,
            drawLabels:false,
            position: 'LEFT'
          },
          minVal: minVal,
          maxVal : maxVal,
          mainVal : mainVal,
          mainData: mainDate,
          highlightedValue: highlightedValue,
          highlightedUnit: highlightedUnit,
          highlightedDate: highlightedDate,
          // isTracked: isTracked
        }
      // )
      )

      this.giveFeedback(response)
    } catch(error){
      console.error(error);
    }
  }

  async giveFeedback(response){
    response.forEach((val) => {
      try{
        if(isNaN(val.value._source.value)){
          this.feedBack(0,val.value._source.userReportId, '', val.value._source.value)
        }
      } catch(error){
        console.error(error);
      }
    })
  }

  handleSelect(event){
    let entry = event.nativeEvent
    if (entry == null) {

    } else {
      var value = Math.round(entry.y * 100) / 100
      if(!isNaN(value)){
        this.setState({
          highlightedValue: value
        })
      }
    }
  }

  async feedBack(upvote,userReportId,comment, value){

    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      let params = 'token=' + (token || '')
                 + '&dictionaryId=' + this.state.dictionaryId
                 + '&feedback=' + upvote
                 + '&comment=' + comment
                 + '&userReportId=' + userReportId

      var _this = this
      NetworkRequest(_this, 'POST', URLs.dictionaryFeedback,params).then(result => {
        if(result.success){
          if((result.response.code || 0) === 200){

          } else if((result.response.code || 0) === 500){

          }
        }
      }).catch((error) => {
        console.error(error);
      })

    }).catch((error) => {
      console.error(error);
    })
  }

  goToTrackerDetails(){
    var isTracked = this.state.isTracked

    this.setState({
      dictionaryId : this.state.dictionaryId,
      from_autoTracker: 1,
      refreshComponent: (isTracked === 1) ? this.state.refreshComponent : '',
      isOpen:true
    })
  }

  goToTrackerFeedback(){
    setTimeout(() => {this.props.navigation.navigate(Routes.trackerDetailsScreen, {
      dictionaryId : this.state.dictionaryId,
      from_autoTracker: 1
    })},50)
  }


  async startMonitoring(){
    if(this.state.isTracked === 0){
      UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
        let params = 'token=' + (token || '')
                   + '&dictionaryId=' + this.state.dictionaryId
                   + '&label=' + this.state.label

        var _this = this
        NetworkRequest(_this, 'POST', URLs.startMonitoringTrack,params).then(result => {
          if(result.success){
            if((result.response.code || 0) === 200){
              this.setState({
                isTracked: 1,
                isLoading: false
              })
              this.goToTrackerDetails()
            } else if((result.response.code || 0) === 500){
              this.loadingManipulate(false)
            } else {
              this.loadingManipulate(false)
            }
          } else {
            this.loadingManipulate(false)
          }
        }).catch((error) => {
          this.loadingManipulate(false)
          console.error(error);
        })

      }).catch((error) => {
        this.loadingManipulate(false)
        console.error(error);
      })
    } else {
      this.goToTrackerDetails()
    }
  }

  getGraph(){
    return(
      <View>
        <View style={{
          flex: 1,
          backgroundColor: '#FFFFFF'
        }}>
        <LineChart
          style={(Platform.OS === 'ios') ? {height:200, marginBottom: -11, marginLeft: -5, marginRight: -15} : {height:200, margin: -16}}
          data={this.state.data}
          description={{text: ''}}
          chartDescription={{text: ''}}
          legend={this.state.legend}
          marker={this.state.marker}
          xAxis={{drawAxisLine: false,drawLabels:false,drawGridLines:false,position:'BOTTOM',textSize: 0}}
          drawAxisLine={false}
          yAxis={{
            left:{enabled:false,drawGridLines:false,zeroLine:{enabled:false}},
            right:{enabled: false,zeroLine:{enabled:false}}
          }}
          drawGridBackground={false}
          borderColor={processColor('teal')}
          borderWidth={0}
          drawBorders={false}

          touchEnabled={true}
          dragEnabled={true}
          scaleEnabled={false}
          scaleXEnabled={false}
          scaleYEnabled={false}
          pinchZoom={true}
          doubleTapToZoomEnabled={true}

          dragDecelerationEnabled={true}
          dragDecelerationFrictionCoef={0.99}

          keepPositionOnRotation={false}
          onSelect={this.handleSelect.bind(this)}
        />
      </View>

      <LinearGradient colors={['#0082a362', '#ffffff']} style={{height:80}}/>
      </View>
    )
  }

  getBack(){
    this.props.navigation.goBack()
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
      isScrollable: false,
      swipeToClose: true
    })
  }

  getSwipe(){
    return this.state.swipeToClose
  }

  setSwipe(flag){
    this.setState({
      swipeToClose: flag
    })
  }

  setScroll(flag){
    this.setState({
      isScrollable: flag
    })
  }

  render(){
    return(
      <View style={{flex:1,backgroundColor: 'white'}}>
      <ScrollView
        bounces={false}>
          <Ripple
            onPress={() => {
              this.getBack()
            }}
            >
            <MaterialIcons
              name={'arrow-back'}
              size={32}
              style={{
                padding:17
              }}
            />
          </Ripple>
          {this.getGraph()}
          <View style={{paddingLeft:17,paddingRight:17}}>
            <View style={{flexDirection : 'row',marginTop:-8}}>
              <Text style={{ fontFamily: 'Arial' ,fontSize: 48, fontWeight:'800', color: Color.tracker_vals, backgroundColor:'transparent'}}>{this.state.highlightedValue}</Text>
              <View>
                <View style={{flex:1}}></View>
                <Text style={{ fontFamily: 'Arial' ,fontSize: 28,fontWeight:'100',paddingBottom:8, color: Color.tracker_vals}}> {this.state.highlightedUnit}</Text>
              </View>
            </View>
            <Text style={{ fontFamily: 'Arial' ,fontSize: 16,paddingLeft:8}}>{moment(this.state.highlightedDate).format('Do MMMM, YYYY')}</Text>
            <Text style={{ fontFamily: 'Arial' ,fontSize: 24,fontWeight: '800',paddingLeft: 4, paddingTop: 8,color: 'black'}}>{this.state.name}</Text>
            <Text style={{ fontFamily: 'Arial' ,paddingLeft: 4 ,paddingTop: 8, fontSize: 15,color: 'black'}}>Normal Range : {this.state.minVal} - {this.state.maxVal} {this.state.highlightedUnit}</Text>
          </View>

          {/* <View style={{flexDirection:'row',paddingTop:24 ,paddingBottom: 24}}>
            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{ fontFamily: 'Arial' ,fontSize: 32,color: Color.tracker_vals}}>{this.state.minVal}</Text>
                <Text style={{ fontFamily: 'Arial' ,color: Color.tracker_vals, paddingTop: 16}}> {this.state.highlightedUnit}</Text>
              </View>
              <Text style={{ fontFamily: 'Arial' ,color:Color.tracker_vals}}>LOWER BOUND</Text>
            </View>
            <View style={{width:0.5, backgroundColor: Color.tracker_vals,marginTop: 8,marginBottom : 8}}></View>
            <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{ fontFamily: 'Arial' ,fontSize: 32,color: Color.tracker_vals }}>{this.state.maxVal}</Text>
                <Text style={{ fontFamily: 'Arial' ,color: Color.tracker_vals, paddingTop: 16}}> {this.state.highlightedUnit}</Text>
              </View>
              <Text style={{ fontFamily: 'Arial' ,color:Color.tracker_vals}}>UPPER BOUND</Text>
            </View>
          </View> */}

          {
          (this.state.description)
          ?
          (
            <View
              style={{paddingLeft:24,paddingRight:24,paddingTop: 16,paddingBottom: 16}}>
              <Text style={{ fontFamily: 'Arial' ,fontSize: 16}}>{this.state.description}</Text>
            </View>
          )
          :
          (null)
          }

          {/* <View style={{flexDirection: 'row',alignItems:'center',borderWidth:0.5, borderRadius: 4,padding:8, marginLeft:32,marginRight:32,marginTop:16,marginBottom:16}}>
            <Ripple
              activeOpacity={0.4}
              style={{flex: 1}}
              onPress={() => {
                // this.feedBack(1)
              }}>
              <Text style={{ fontFamily: 'Arial' ,flex: 1,textAlign: 'center'}}>&#128078;</Text>
            </Ripple>

            <View style={{backgroundColor: Color._DF, height: 16, width: 0.5}}></View>

            <Ripple
              activeOpacity={0.4}
              style={{flex: 1}}
              onPress={() => {
                this.feedBack(1,this.state.userReportId, "" , this.state.mainDate)
              }}>
              <Text style={{ fontFamily: 'Arial' ,flex: 1,textAlign: 'center'}}>&#128077;</Text>
            </Ripple>
          </View> */}
          {(this.state.isLoading) ? (<ProgressBar/>) : (null)}
      </ScrollView>
      <Ripple
        onPress={() => {
          setTimeout(() => {
            if(this.state.isTracked === 0){
              this.loadingManipulate(true)
            }
            this.startMonitoring()
          },400)
        }}>
        <View style={{padding: 16,backgroundColor: Color.theme_dark_blue}}>
          <Text style={{ fontFamily: 'Arial' ,color: 'white', textAlign: 'center',fontSize:12,marginRight: 16}}>{(this.state.isTracked === 0) ? ('START MONITORING') : ('SHOW IN TRACKERS')}</Text>
        </View>
      </Ripple>

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
           style={[styles.modal, styles.modal1]}
           ref={"modal1"}
           swipeThreshold={200}
           swipeArea={Global.screenHeight}
           isOpen={this.state.isOpen}
           swipeToClose={this.state.swipeToClose}
           onClosed={this.onClose}
           position={'top'}
           keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
           onOpened={this.onOpen}
           onClosingState={this.onClosingState}
           setSwipe={this.setSwipe}
           getSwipe={this.getSwipe}
           coverScreen={true}
           isScrollable={this.state.isScrollable}>

           <TrackerDetails
             dictionaryId= {this.state.dictionaryId}
             refreshComponent={this.state.refreshComponent}
             from_autoTracker={this.state.from_autoTracker}
             closeModal={this.closeModal}
             setScroll={this.setScroll}
             getSwipe={this.getSwipe}
             setSwipe = {this.setSwipe}/>

        </ModalBox>
      // </Modal>
    ) : (null)}
    </View>
    )
  }


}


function mapDispatchToActions (dispatch) {
  return {
    
    setDemographics : arr => dispatch(setDemographics(arr)),
    setUnreadFlag: num => dispatch(setUnreadFlag(num)),

  }
}

const mapStateToProps = state => ({
  demographics: state.demographics,
})

export default connect(mapStateToProps, mapDispatchToActions)(AutomatedTrackers)

