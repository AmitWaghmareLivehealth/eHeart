import React, { Component } from 'react'
import { Animated, View, Text, StyleSheet, Image, Modal, TouchableOpacity} from 'react-native'
import { URLs, Routes, Global, Color, UserDefaults, stringsUserDefaults, NetworkRequest, Images, CommonStyles} from '../../../utils'
import {Ripple} from '../../components'
import moment from 'moment'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {ProgressBar} from '../../components'
import TrackerAddition from '../../container/tracker.addition'

export default class DashboardTrackers  extends Component{
  constructor(props) {
    super(props)
    this.springValue = new Animated.Value(1)
    var trackerArray = []
    if(this.props.trackerArray){
      trackerArray = this.props.trackerArray
    }
    this.state={
      springVal: new Animated.Value(1),
      trackerArray: trackerArray,
      dialogShow: false,
      recentReportDate: '',
      dictionaryId: 0,
      unitArray:[],
      isMultiValue:0,
      indexArray:[],
      currentParameter: '',
      isEditFlag: 0,
      main_unit: ''
    }
    this.checkCondition = this.checkCondition.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.getUnitData = this.getUnitData.bind(this)
    this._render_row = this._render_row.bind(this)
    this.loadingManipulate = this.loadingManipulate.bind(this)
  }

 spring1 () {
  this.springValue.setValue(0.99)
  //this.setState({springVal:0.97})
  Animated.spring(
    this.state.springVal,
    {

      toValue: 0.97,
    //  springVal:0.97
    }
  ).start()
}

spring2 () {
  this.springValue.setValue(0.97)
  //this.setState({springVal: 0.99})
  Animated.spring(
    this.state.springVal,
    {
      toValue: 1,
      //springVal:1
    }
  ).start()
}

  closeDialog(){
    this.setState({
      dialogShow: false
    })
  }

  loadingManipulate(flag){
    this.setState({
      isLoading: flag
    })
  }

  async getUnitData(isEditFlag){
    // var param = 'token=f55f01a6-20f9-11e7-bf08-0a2ce1603801 &dictionaryId='+ this.state.dictionaryId
    try{
      UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
        let params = 'token=' + token
                    +' &dictionaryId=' + this.state.dictionaryId
        var _this = this
        NetworkRequest(_this, 'POST',URLs.getManualTrackerSubCategories,params).then(result => {
          if(result.success){
            if((result.response.code || '') === 200) {
                this.loadingManipulate(false)
                if(result.response.dictionaryList.length > 0){
                let unitArray = []
                let indexArray = []
                var main_unit = ''
                result.response.dictionaryList[0].referenceDict.forEach(val => {
                  unitArray.push(val.unit)
                  indexArray.push(val.index)
                  if(val.index === 0){
                      main_unit = val.unit
                  }
                })

                if(result.response.dictionaryList[0].testDict){
                  this.setState({
                    dialogShow: true,
                    unitArray : unitArray,
                    indexArray: indexArray,
                    isEditFlag : isEditFlag,
                    main_unit : main_unit,
                    isMultiValue : result.response.dictionaryList[0].testDict.isMultiValue
                  })
                  // this.gotoTrackerAddition(unitArray,indexArray,isEditFlag)
                }
              }
            } else {
              this.loadingManipulate(false)
            }
          } else {
            this.loadingManipulate(false)
          }
        }).catch(error => {
          this.loadingManipulate(false)
          console.error(error);
        })

      }).catch((error) => {
        this.loadingManipulate(false)
        console.error(error);
      })
    } catch(error){
      console.error(error);
    }
  }

  checkCondition(isEditFlag){
    this.loadingManipulate(true)
    this.getUnitData(isEditFlag)
  }

  _render_row(){
    var row = []
    var trackerArray = this.props.trackerArray
    var count = trackerArray.length
    trackerArray.forEach((val) => {
      row.push(
                <View  style={{flex : 1}}
                  key={count+'@'}
                  >
                  <View
                    style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Ripple
                      rippleOpacity = {0.2}
                      onPressIn = {this.spring1.bind(this)}
                      onPressOut = {this.spring2.bind(this)}


                       onPress={() => {
                          this.setState({
                            dictionaryId: val.dictionaryId,
                          })

                          if(this.props.goSecondaryAction){
                            this.props.goSecondaryAction(val.dictionaryId)
                          }

                        }}
                        style={{flex: 1, padding:8}}
                        >
                      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                          <View style={{flex: 1}}>
                            <Text numberOfLines={1} style={CommonStyles.listHeaderTitle}>{val.currentParameter}</Text>
                            <Text style={CommonStyles.listDate}>on {moment(val.highlightedDate).format('Do MMM, YYYY')}</Text>
                          </View>

                        <View style={[CommonStyles.value_outer_container, {padding:8}]}>
                            <View style={[CommonStyles.value_container,{paddingLeft: 8, paddingRight: 4, flexDirection:(val.highlightedValue.indexOf('/') !== -1) ? 'column' : 'row'}]}>
                              <Text style={CommonStyles.valueStyle}>{val.highlightedValue}</Text>
                              <Text style={[CommonStyles.unit_style, {fontSize: (val.highlightedValue.indexOf('/') !== -1) ? 8 : 10} ]}>{val.highlightedUnit}</Text>
                            </View>
                        </View>
                        </View>
                        </Ripple>
                      {(count !== 1) ? (<View style={{backgroundColor: Color._DF, height: 0.5}}></View>) : (null)}
                    </View>
                      <Ripple
                        rippleOpacity = {0.2}
                        onPressIn = {this.spring1.bind(this)}
                        onPressOut = {this.spring2.bind(this)}
                        key={count}
                        onPress={() =>
                          {

                            this.setState({
                              dictionaryId: val.dictionaryId,
                              recentReportDate : val.highlightedDate,
                              currentParameter : val.currentParameter
                           })
                           this.checkCondition(0)
                          }
                        }
                        style={{justifyContent: 'center'}}
                      >
                      <View style={{paddingBottom: 8, marginRight: -4}}>
                        <Image source={Images.imagePlus} style={{height:34,width:34}}/>
                      </View>

                    </Ripple>
                  </View>
              </View>
      )
      count -= 1
      // if(count >= 2){
      //   break;
      // }
    })
    return(<View style={{borderRadius: 6, paddingLeft:12, paddingRight: 12, paddingBottom:4}}>
      {row}
      {(this.props.goAction) ?
      (<View style={{flexDirection: 'row'}}>
        <View style={{flex: 1}}></View>
        <Ripple
              rippleOpacity = {0.2}
             onPressIn = {this.spring1.bind(this)}
             onPressOut = {this.spring2.bind(this)}

        onPress={() => {
            this.props.goAction()
        }}>
        <Text style={{ fontFamily: 'Arial' ,paddingBottom: 12, paddingRight:16, paddingTop:8,textAlign: 'right', fontWeight: '500', color: Color.theme_blue, fontSize: 13, marginLeft:40}}>RECORD NEW</Text>
      </Ripple>
      </View>
        )
      : (<View style={{padding: 12}}></View>)}
    </View>)
  }

  render(){
    var trackerArray = []
    trackerArray = this.props.trackerArray
    return(
      (trackerArray.length > 0)
      ?
      (
      <Animated.View style={[{marginTop: 8,marginBottom: 8, backgroundColor: 'white', marginLeft: 17, marginRight: 17 ,elevation: 6, borderRadius:8, transform:[{scale: this.state.springVal}]}, CommonStyles.commonShadow]}>
        <View style = {{flexDirection:'row', alignItems: 'center',paddingLeft : 16,paddingTop:16}}>
          {/* <Image source={Images.imageChemistry} style={{height:35,width:35}}/> */}
          <MaterialIcons
            name={'star'}
            size={35}
            style={{
              color: Color.starYellow
            }}
          />
          <Text style={[CommonStyles.common_header, {paddingLeft: 12}]} >Health Trackers</Text>
        </View>
        {this._render_row()}
        <Modal
           animationType={'none'}
           transparent={true}
           visible={this.state.dialogShow}
           onRequestClose = {() => {
             this.setState({
               dialogShow : false,
               addDialog: false
             })
           }}
        >
          {(this.state.dialogShow === true) ? (
                                            <View style={{flex:1,flexDirection: 'row',alignItems:'center', justifyContent:'center' ,  backgroundColor: '#00000080'}}>
                                                  <View style={{flex:1 ,flexDirection:'column', margin: 30, backgroundColor: '#ffffff', borderRadius: 6}}>
                                                    <TrackerAddition
                                                      dictionaryId = {this.state.dictionaryId}
                                                      unitArray = {this.state.unitArray}
                                                      isMultiValue = {this.state.isMultiValue}
                                                      recentReportDate={this.state.recentReportDate}
                                                      indexArray = {this.state.indexArray}
                                                      loadData={this.loadingManipulate}
                                                      currentParameter = {this.state.currentParameter}
                                                      closeDialog = {this.closeDialog}
                                                      isEditFlag = {this.state.isEditFlag}
                                                      fav_color={Color.fav_color}
                                                      isfav = {1}
                                                      pinnedTrackers= {this.state.pinnedTrackers}
                                                      main_unit = {this.state.main_unit}
                                                      ></TrackerAddition>
                                                    </View>
                                              </View>
                                            ) :
                                            (null)
          }
        </Modal>
        {(this.state.isLoading) ? (<ProgressBar/>) : (null)}
      </Animated.View>) : (null)
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:8,
    borderWidth: 1,
    marginLeft:17,
    marginRight:17,
    marginTop:8 ,
    marginBottom: 8,
    borderRadius: 4 ,
    borderColor: Color._DF
  },

  text_style : {
    color: '#212121',
    fontSize: 14,
    paddingLeft:4
  },
  date_style : {
    paddingLeft:4,
    paddingBottom:6,
    fontSize: 14,
  },

  value_style_small : {
    fontSize: 24,
    color : Color.tracker_vals,
    fontWeight: '400'
  },

  unit_style:{
    color: Color.tracker_vals,
    fontSize: 14,
    paddingBottom:2,
    paddingLeft:4
  }
});
