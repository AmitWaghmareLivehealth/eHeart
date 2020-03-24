
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet, processColor,  Modal, Alert, Image, LayoutAnimation, ScrollView } from 'react-native'

import moment from 'moment'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {BarChart, LineChart } from 'react-native-charts-wrapper';
import { URLs, Routes, Global, Color, UserDefaults, stringsUserDefaults, NetworkRequest, CommonStyles, Images} from '../../../utils'

import { HeaderListExtraLarge, StateRepresentation } from '../../layouts'
import TrackerAddition from '../tracker.addition'
import DialogHeader from '../../components/dialog.header'
import CloseBar from '../../components/closebar'
import {ProgressBar, ModalBox} from '../../components'
import {Ripple} from '../../components'
import ListHeader from '../../components/listheader'
import { setJson } from '../../../redux/actions/trackerjson'
import { setList } from '../../../redux/actions/pinnedtrackers'
import ListView from 'deprecated-react-native-listview';


const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
})


class TrackerDetails extends Component {

  constructor (props) {
    super(props)
    this.state = {
      map:{},
      graphdata: [],
      options: {},
      isGraphReady: false,
      dictionaryId: this.props.dictionaryId,
      indexArray: this.props.indexArray,
      tickvalues: [],
      filter_date_flag: 4, // for selected date filter,
      unitArray: [],
      trackervalArray: [], // for manipulation on the generated dictionary specific list
      selected_unit: '', //for selected Unit
      unit_selected_flag: false,
      isMultiValue: this.props.isMultiValue || 0,
      isAutomated: 0, // for checking if the value is automated or not
      data: {},
      tracker_multivalArray: [],
      legend: {
        enabled: false
      },
      marker: {
        enabled: true,
        backgroundTint: processColor('teal'),
	      markerColor: processColor('#4A4A4A8C'),
        textColor: processColor('white')
      },
      xAxis: '',
      yAxis: '',
      rightAxis: '',
      dataSource: ds.cloneWithRowsAndSections([]),
      dialogShow: false,
      dialogValue: '',
      dialogUnit: '',
      dialogDate: '',
      dialogReportName: '',
      dialogReportId: '',
      dialogAutomated: '',
      dialogNotes: '',
      isStateRepFlag: false,
      highlightedValue: '',
      highlightedUnit: '',
      highlightedDate: '',
      currentParameter: '',
      currentDescription: '',
      categoryName: '',
      dictionaryName: '',
      minVal: '',
      maxVal: '',
      accentColor: Color.tracker_vals,
      addDialog: false,
      infoDialog: false,
      isEditFlag: 0,
      from_autoTracker: this.props.from_autoTracker || 0,
      refreshComponent: this.props.refreshComponent || '',
      isLoading: false,
      fav_val: {},
      fav_color: 'white',
      isActionButtonVisible: true,
      isEmpty: true,
      swipeToClose: true,
      categoryTrackers: [],
      selected_refs: {},
      selected_type : false,
      gender: '',
      dictionaryArray : [],
      isSingleVal: false,
      isInitial: true,
      main_unit: '',
      valueType: 'M',
      pinnedTrackers : [],
      multiUnit: '',
      highlightedColor: Color.tracker_vals,
      listDialog: false,
      barArray : [677, 675, 946, 945]
    }

    // this.gotoTrackerAddition = this.gotoTrackerAddition.bind(this)
    this.getUnitData = this.getUnitData.bind(this)
    this._deleteEntry = this._deleteEntry.bind(this)
    this._graphDataGeneration = this._graphDataGeneration.bind(this)
    this._getReportDate = this._getReportDate.bind(this)
    this.setStateForGraph = this.setStateForGraph.bind(this)
    this.getUnitFilter = this.getUnitFilter.bind(this)
    this.checkCondition = this.checkCondition.bind(this)
    this._renderRow = this._renderRow.bind(this)
    this.renderSectionHeader = this.renderSectionHeader.bind(this)
    this.getData = this.getData.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.getBack = this.getBack.bind(this)
    this.loadingManipulate = this.loadingManipulate.bind(this)
    this.refreshPinnedTracker = this.refreshPinnedTracker.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.graphDataGen = this.graphDataGen.bind(this)
    this.onClosingState = this.onClosingState.bind(this)
    this.addRemovePinnedTracker = this.addRemovePinnedTracker.bind(this)
    this.getView = this.getView.bind(this)
    this.getChart = this.getChart.bind(this)
    this.goBack = this.goBack.bind(this)

  }

  loadingManipulate (flag){
    this.setState({
      isLoading: flag
    })
  }

  componentWillReceiveProps(){
    UserDefaults.get(stringsUserDefaults.pinnedTracker).then((pinnedTracker) => {
      if(pinnedTracker){
        UserDefaults.set(stringsUserDefaults.pinnedTracker, false)
        var pinnedTrackers = this.props.pinnedTrackers.pinnedTrackers
        this.setState({
          pinnedTrackers: pinnedTrackers
        })
      }
    }).catch((error) => {
      console.error(error);
    })
  }

  componentDidMount (){
    this.setState({
      pinnedTrackers: this.props.pinnedTrackers.pinnedTrackers
    })
    UserDefaults.get(stringsUserDefaults.userSex).then((userSex) => {
      this.setState({
        gender : userSex
      })
    }).catch((error) => {
      console.error(error);
    })

    UserDefaults.get(stringsUserDefaults.dictionaryArray).then((dictionaryArray) => {
      if(dictionaryArray){
        if(dictionaryArray.length > 0){
          var fav_color = 'white'
          if(dictionaryArray.includes(this.state.dictionaryId)){
            fav_color = Color.fav_color
          }
          this.setState({
            fav_color: fav_color,
            dictionaryArray : dictionaryArray
          })
        }
      }

    }).catch((error) => {
      console.error(error);
    })

      UserDefaults.get(stringsUserDefaults.pinnedTracker).then((pinnedTracker) => {
        if (pinnedTracker){
          var jsonArray = JSON.parse(pinnedTracker)
          var isPresent = false
          for (i = 0; i < jsonArray.length; i++){
            if (this.state.dictionaryId === jsonArray[i].dictionaryId){
              isPresent = true
              break;
            }
          }
          if (isPresent){
            this.setState({
              fav_color: Color.fav_color
            })
          }
        }
      }).catch((error) => {
        this.loadingManipulate(false)
        console.error(error);
      })

      if (this.state.from_autoTracker === 0){
        setTimeout(() => {
          this.loadingManipulate(true)
        },50)
        setTimeout(() => {
          UserDefaults.get(stringsUserDefaults.trackerJson).then((result) => {
            if (result){
              this._trackerDetails(result.response)
            } else {
              this.loadingManipulate(true)
              this.getData()
            }

          }).catch((error) => {
            this.loadingManipulate(false)
            console.error(error);
          })
        },700)
      } else {
        this.loadingManipulate(true)
        this.getData()
      }
  }

  async getData (flag){
    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      var params = 'token=' + token
      var _this = this
      NetworkRequest(_this, 'POST', URLs.getTrackerData, params).then(result => {
        if (result.success){
          if ((result.response.code || 0) === 200){
            console.log('GET DATA RESULT:', result)
            this.loadingManipulate(false)
            try {
              UserDefaults.set(stringsUserDefaults.trackerJson, result)
            } catch(error){ console.error(error); }
            if (this.state.from_autoTracker === 1 || flag === 1) {
              try {
                UserDefaults.set(stringsUserDefaults.isTrackerUpdated, true)
              } catch(error){
                console.error(error);
              }
              if(this.state.refreshComponent){
                this.state.refreshComponent()
                // this.refreshPinnedTracker()
              } else {
                try {
                  // this.refreshPinnedTracker()
                  this.props.setJson(result)
                  UserDefaults.set(stringsUserDefaults.reduxTracker, true)
                } catch(error){ console.error(error); }
              }
            }
            console.log('INSIDE GET DATA  ', result);
            this._trackerDetails(result.response, this.state.filter_date_flag)
          } else {
            this.loadingManipulate(false)
          }
        } else {
          this.loadingManipulate(false)
        }
      }).catch(error => {
        this.loadingManipulate(false)
        console.log('INSIDE LOG');
        console.error(error)
      })

    }).catch((error) => {
      console.log('INSIDE LOG');
      this.loadingManipulate(false)
      console.error(error);
    })

  }

/**
* flag is for the understanding of the selected time slot
*
**/
  async graphDataGen(result: Array, flag){
    
    try {
      var trackerList = result.trackedData
      var serializedReferences = result.serializedReferences
      var selected_refs = {}
      var selected_type = false
      var categoryTrackers = []
      var graphdata = []
      var graphPopulation = []
      var timeMap = {}
      var yearMap = {}
      var formatter = ''
      var formatter_1 = ''
      var iterations = 0
      var iter = 0
      var dataSets = []
      var xArray = []
      var timeArray = []
      var blankArray = []
      var isMultiValue = 0
      var minVal = ''
      var maxVal = ''
      var isSingleVal = false

      trackerList.sort((a, b) =>{
        return new Date(a._source.reportDate) - new Date(b._source.reportDate)
      }).reverse()

      if(flag === 4){
        iter = 12
        formatter = 'MMM YYYY'
        formatter_1 = 'MMM'
        timeArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      } else if(flag === 3){
        formatter = 'MMM YYYY'
        formatter_1 = 'D MMM YYYY'
      } else if (flag === 2 || flag === 1){
        formatter = 'ddd D MMM YYYY'
        formatter_1 = 'ddd D MMM YYYY'
      }

      trackerList.forEach((valInData) => {
        if(Number(valInData._source.dictionaryId) === Number(this.state.dictionaryId)){
          categoryTrackers.push(valInData)

          if(!(moment(valInData._source.reportDate).format(formatter) in timeMap)){
            if(valInData._source.value){
              if (!isNaN(valInData._source.value)){
                graphdata.push({
                  y: Number(valInData._source.value),
                  reportDate : moment(valInData._source.reportDate).format(formatter_1)
                })
              } else if(valInData._source.value.indexOf('/') !== -1){
                var value = valInData._source.value
                graphdata.push({
                  y: valInData._source.value,
                  unit : valInData._source.unit,
                  reportDate : moment(valInData._source.reportDate)
                })
                isMultiValue = 1
              }

              if(flag === 4){
                if(!(moment(valInData._source.reportDate).format('YYYY') in yearMap)){
                  iterations += iter;
                  yearMap[moment(valInData._source.reportDate).format('YYYY')] = valInData
                }
              }
              timeMap[moment(valInData._source.reportDate).format(formatter)] = valInData
            }
          } else {
            if(flag !== 4){
              if(valInData._source.value){
                if (!isNaN(valInData._source.value)){
                  graphdata.push({
                    y: Number(valInData._source.value),
                    reportDate : moment(valInData._source.reportDate).format(formatter_1)
                  })
                } else if(valInData._source.value.indexOf('/') !== -1){
                  var value = valInData._source.value
                  graphdata.push({
                    y: valInData._source.value,
                    unit : valInData._source.unit,
                    reportDate : moment(valInData._source.reportDate)
                  })
                }
              }
            }
          }
        }
      })

      serializedReferences.forEach((val) => {
        if(val.dictionaryId === this.state.dictionaryId){
          selected_refs = val
          if(this.state.gender === 'Male'){
            minVal = val.maleLowerBound
            maxVal = val.maleUpperBound
          } else {
            minVal = val.femaleLowerBound
            maxVal = val.femaleUpperBound
          }

          if(!isNaN(minVal) && !isNaN(maxVal)){
            selected_type = true
          }
        }
      })

      if(isMultiValue === 1){
        var co_val;
        var iter = 0;
        var count_iter = 0
        var count = 0
        var multidata = {}
        var colors = [Color.tracker_secondary_vals, Color.tracker_vals]

        for (iter = 0; iter < graphdata.length; iter++){
          var val = graphdata[iter]
          var value = val.y.split('/')
          var unit =  val.unit.split('/')
            while(count_iter < 2){
              if (!(moment(val.reportDate).format('YYYY-MM-DD') + '@' + unit[count_iter] in multidata)){
                if (value[count_iter] !== '' &  value[count_iter] !== '-'){
                    var multi_graphdata = []
                    multi_graphdata.push({ x: count, y: Number(value[count_iter]), reportDate: moment(val.reportDate).toISOString() })
                    multidata[moment(val.reportDate).format('YYYY-MM-DD') + '@' + unit[count_iter]] = {
                      values: multi_graphdata,
                      count: count,
                      label: 'Company Dashed',
                      config: {
                        color: processColor(colors[count_iter]),
                        drawFilled: true,
                        reportDate: moment(val.reportDate).format('YYYY-MM-DD'),
                        fillColor: processColor(colors[count_iter]),
                        fillAlpha: 50,
                        lineWidth: 2.5,
                        drawCubicIntensity: 0.2,
                        circleRadius: 5,
                        drawCircles: true,
                        circleColor: processColor(colors[count_iter]),
                        drawCircleHole: true
                      }
                    }
                  }
              } else {
                if (value[count_iter] !== '' &  value[count_iter] !== '-'){
                    var date_key = moment(val.reportDate).format('YYYY-MM-DD')
                    var _key = date_key + '@' + unit[count_iter]
                      multidata[_key].values.push({ x: multidata[_key].count, y: Number(value[count_iter]) , reportDate: moment(val.reportDate).toISOString() })
                }
              }
              count_iter++;
            }
            count += 1;
            count_iter = 0
          }

      var blankValueArray = [{y: 0}]
      // for (iter = 10; iter > 0; iter--){
      //     blankValueArray.push(null)
      // }

      blankValueArray.push({y: 0})

    if (Object.keys(multidata).length === 0){
      if (flag !== 4){
          isEmptyDataFlag = true
        } else {
          this.setState({
            isStateRepFlag: true
          })
          this.checkCondition(0)
          return
        }
    }

  dataSets.push({
    values: blankValueArray,
    label: 'Company X',
    config: {
      lineWidth: 0,
      drawCircles: false,
      drawValues : false,
      highlightColor: processColor(Color.graphBackground),
      color: processColor(Color.graphBackground),
      drawFilled: false,
      fillAlpha: 50,
      drawHighlightIndicators: false,
      valueFormatter: ''
    }
  })

  var count = 0

  for (keys in multidata){
    if (multidata[keys].values.length > 2){
        var valueArray = []
        multidata[keys].values.sort((a, b) =>{
          return a.y - b.y
        })
        valueArray.push(multidata[keys].values[0])
        valueArray.push(multidata[keys].values[multidata[keys].values.length - 1])
        multidata[keys].values = valueArray
    }
    dataSets.push(multidata[keys])
    if(count === 0){
      if(flag === 2){
        xArray.push(moment(multidata[keys].config.reportDate).format('ddd'))
      } else if (flag === 1){
        xArray.push(moment(multidata[keys].config.reportDate).format('DD MMM'))
      } else if(flag === 3){
        xArray.push(moment(multidata[keys].config.reportDate).format(formatter_1))
      } else {
        xArray.push(multidata[keys].config.reportDate)
      }
      count++
    } else {
      count = 0
    }
  }

} else {
    if(flag !== 4){
      timeArray = [];
      iterations = 0
      if(categoryTrackers.length > 1){
//something new trial
        timeArray = []
        var year = moment(categoryTrackers[categoryTrackers.length - 1]._source.reportDate).format('YYYY')
        var month = moment(categoryTrackers[categoryTrackers.length - 1]._source.reportDate).format('M')

        var end_year = moment(categoryTrackers[0]._source.reportDate).format('YYYY')
        var end_month = moment(categoryTrackers[0]._source.reportDate).format('M')

        startDate = moment([year, month - 1]);
        var end_startDate = moment([end_year, end_month - 1]);
        endDate = moment(end_startDate).endOf('month');

        timeArray.push(moment(startDate).format(formatter_1))
        while(startDate.add(1, 'days').diff(endDate) < 0) {
          timeArray.push(moment(startDate.clone().toDate()).format(formatter_1));
        }
      } else if(categoryTrackers.length === 1){
        isSingleVal = true
        // var year = moment(categoryTrackers[0]._source.reportDate).format('YYYY')
        // var month = moment(categoryTrackers[0]._source.reportDate).format('M')
        // var startDate = ''
        // var endDate = ''
        // if(flag === 3){
        //   startDate = moment([year, month - 1]);
        //   endDate = moment(startDate).endOf('month');
        // } else if(flag === 2){
        //   startDate = moment(categoryTrackers[0]._source.reportDate).isoWeekday(1)
        //   endDate =  moment(categoryTrackers[0]._source.reportDate).isoWeekday(8)
        // } else if(flag === 1){
        //   startDate = moment(categoryTrackers[0]._source.reportDate).subtract(4,'d')
        //   endDate = moment(categoryTrackers[0]._source.reportDate).add(3,'d')
        // }
        //
        // timeArray.push(moment(startDate.clone().toDate()).format(formatter_1));
        // while(startDate.add(1, 'days').diff(endDate) < 0) {
        //   timeArray.push(moment(startDate.clone().toDate()).format(formatter_1));
        // }
      }

      console.log('DATE FOR THE MONTH', timeArray);

      timeArray.reverse()
      iterations = timeArray.length

    }

    if(categoryTrackers.length === 1){
      isSingleVal = true
    }

    var count = 0
    var timeCount = -1
    var xpoints = 0
    var xArray = []
    for(var i = 0 ; i < iterations ; i++){
      if(flag === 4){
        if(timeCount < iter - 1){
          timeCount++
        } else {
          timeCount = 0
        }
      } else {
        timeCount ++;
      }
      if(graphdata[count]){
        if(graphdata[count].reportDate === timeArray[timeCount]){
          graphPopulation.push({
            x: xpoints,
            y: graphdata[count].y
          })
          count++
        } else {
          graphPopulation.push(null)
        }
      } else {
        graphPopulation.push(null)
      }

      xpoints++
      blankArray.push({y:0})
      if(flag === 2){
        xArray.push(moment(timeArray[timeCount]).format('ddd'))
      } else if (flag === 1){
        xArray.push(moment(timeArray[timeCount]).format('DD MMM'))
      } else if(flag === 3){
        xArray.push(moment(timeArray[timeCount]).format(formatter_1))
      } else {
        xArray.push(timeArray[timeCount])
      }
    }

    dataSets.push({
      values: blankArray,
      label: 'Company X',
      config: {
        lineWidth: 0,
        drawCircles: false,
        drawValues : false,
        highlightColor: processColor(Color.graphBackground),
        color: processColor(Color.graphBackground),
        drawFilled: false,
        fillAlpha: 50,
        drawHighlightIndicators: false,
        valueFormatter: ''
      }
    })

    dataSets.push({
      values: graphPopulation,
      // values: [, , , , , , , , , , , , ,{x: 251, y: 100}, {y: 110}, {y: 105}, {y: 115}],
      label: 'Company Dashed',
      config: {
        color: processColor(this.state.accentColor),
        drawFilled: true,
        fillColor: processColor(this.state.accentColor),
        fillAlpha: 50,
        lineWidth: 2.5,
        drawCubicIntensity: 0.2,
        circleRadius: 5,
        drawCircles: true,
        drawHighlightIndicators: false,
        circleColor: processColor(this.state.accentColor),
        drawCircleHole: true
      }
    })
  }

    var lastTracker = ''
    var highlightedValue = ''
    var highlightedUnit = ''
    var highlightedDate = ''
    var currentParameter = ''
    var accentColor = ''
    var icon = ''
    var currentDescription = ''
    var categoryName = ''

    if(categoryTrackers.length > 0){
      lastTracker =  categoryTrackers[0]._source
      highlightedValue = lastTracker.value;
      highlightedUnit = lastTracker.unit;
      highlightedDate = lastTracker.reportDate;
      currentParameter = lastTracker.dictionaryName;
      accentColor = lastTracker.accentColor;
      icon = lastTracker.categoryIcon;
      currentDescription = lastTracker.dictionaryDescription;
      categoryName = lastTracker.dictionaryCategoryName
    }

    var category = {
      graphDataSection: [''],
      tracker_multivalArray: categoryTrackers
    }

    var dictionaryId = this.state.dictionaryId

    this.setState(
      //  reactAddonsUpdate(this.state,
      {
        trackervalArray: result,
        data: (isMultiValue !== 1) ? (categoryTrackers.length > 1) ? {dataSets: dataSets} : {} : {dataSets: dataSets},
        isEmpty: (categoryTrackers.length > 0) ? false : true,
        isSingleVal: isSingleVal,
        selected_refs: selected_refs,
        selected_type: selected_type,
        xAxis: {
          startAtZero: true,
          valueFormatter: (this.state.filter_date_flag && xArray),
          position: 'BOTTOM',
          textSize: 7,
          drawGridLines: false
        },
          yAxis: {
          startAtZero: true,
          drawGridLines: false
        },
          rightAxis: {
          drawAxisLine: false,
          enabled: false,
          drawGridLines: false,
          drawLabels: false,
          position: 'LEFT'
        },
          isGraphReady: true,
          graphdata: graphdata,
          // tickvalues: tickArray,
          isStateRepFlag: (categoryTrackers.length > 0) ? false : true,
          isLoading: false,
          highlightedValue: highlightedValue,
          highlightedUnit: highlightedUnit,
          highlightedDate: highlightedDate,
          currentParameter: currentParameter,
          currentDescription: currentDescription,
          categoryName: categoryName,
          accentColor: (accentColor) ? '#' + accentColor : Color.tracker_vals,
          categoryTrackers: categoryTrackers,
          isMultiValue: isMultiValue,
          minVal: minVal,
          maxVal: maxVal,
          dataSource: ds.cloneWithRowsAndSections(category)
        }
    // )
    )
    } catch (error) {
      console.error(error);
    }
  }


  async _trackerDetails (result: Array){
    try {
      var trackervalArray = []
      var tracker_multivalArray = [];
      var trackerDateMap = {};
      var unitArray = []
      var isMultiValue = 0;
      var isAutomated = 0;
      var timeMap = {}
      var serializedReferences = result.serializedReferences
      var minVal = ''
      var maxVal = ''
      var main_unit = ''
      var isSingleVal = false
      var selected_refs = {}
      var selected_type = false

      console.log('DATA', result.trackedData)
      result.trackedData.sort((a, b) =>{
        return new Date(b._source.reportDate) - new Date(a._source.reportDate)
      })

      result.trackedData.forEach((valInData) => {
       try {
         if(valInData._source.value){
           if (isNaN(valInData._source.value) && (valInData._source.value.indexOf('/') === -1)) {
             return;
           }
         }
       } catch(error) {
         console.error(error);
       }

       if(Number(valInData._source.dictionaryId) === Number(this.state.dictionaryId)){
         if(valInData._source.value){
           if(valInData._source.value.indexOf('/') !== -1){
             trackervalArray.push(valInData)
             isMultiValue = 1
           } else if(!(moment(valInData._source.reportDate).format('DD MMM YYYY') in timeMap)){
             trackervalArray.push(valInData)
             timeMap[moment(valInData._source.reportDate).format('DD MMM YYYY')] = valInData
           }
           tracker_multivalArray.push(valInData)
         }
       }
     })

      serializedReferences.forEach((val) => {
        if(val.dictionaryId === Number(this.state.dictionaryId) && val.index === 0){
          selected_refs = val
          if(this.state.gender === 'Male'){
            minVal = val.maleLowerBound
            maxVal = val.maleUpperBound
          } else {
            minVal = val.femaleLowerBound
            maxVal = val.femaleUpperBound
          }
          if(val.index === 0){
            main_unit = val.unit
          }
          if(!isNaN(minVal) && !isNaN(maxVal)){
            selected_type = true
          }
        }
      })

      var highlightedValue = '';
      var highlightedUnit = '';
      var highlightedDate = '';
      var currentParameter = '';
      var accentColor = '';
      var icon = '';
      var currentDescription = '';

  this.convertTrackerArrayToMap(tracker_multivalArray)


      if( trackervalArray.length > 0){

        sum = 0
        tracker_multivalArray.forEach((item)=>{
          sum+= Number(item._source.value)
        })



        lastTracker =  tracker_multivalArray[0]._source

        datesArray = this.state.map

       keys = Object.keys(this.state.map)

      sum2 = 0
      datesArray[keys[0]].forEach((item)=>{
         sum2 += Number(item._source.value)
       })


        highlightedValue =
        trackervalArray.length > 0 && tracker_multivalArray[0]._source.dictionaryCategoryId==7 ?sum2:
        tracker_multivalArray.length > 0 && tracker_multivalArray[0]._source.dictionaryCategoryId==7?
        sum
        :lastTracker.value;

        highlightedUnit = lastTracker.unit;
        highlightedDate = lastTracker.reportDate;
        currentParameter = lastTracker.dictionaryName;
        accentColor = lastTracker.accentColor;
        icon = lastTracker.categoryIcon;
        currentDescription = lastTracker.dictionaryDescription;
        categoryName = lastTracker.dictionaryCategoryName
      }

      // trackervalArray.reverse()
      tracker_multivalArray.reverse()
      var dictionaryId = this.state.dictionaryId


      this.setState({
        categoryId: (tracker_multivalArray[0])? tracker_multivalArray[0]._source.dictionaryCategoryId:'',
        trackervalArray: trackervalArray,
        unitArray: unitArray,
        isMultiValue: isMultiValue,
        tracker_multivalArray: tracker_multivalArray,
        isAutomated: isAutomated,
        highlightedValue: highlightedValue,
        highlightedUnit: highlightedUnit,
        highlightedDate: highlightedDate,
        currentParameter: currentParameter,
        currentDescription: currentDescription,
        selected_refs:selected_refs,
        selected_type: selected_type,
        minVal: minVal,
        maxVal: maxVal,
        main_unit: main_unit,
        accentColor: accentColor ? '#' + accentColor : Color.tracker_vals,
        fav_val: {
          accentColor: accentColor ? '#' + accentColor : Color.tracker_vals,
          highlightedValue: highlightedValue,
          highlightedUnit: highlightedUnit,
          highlightedDate: highlightedDate,
          currentParameter: currentParameter,
          icon: icon,
          dictionaryId: dictionaryId
        },
        dataSource: ds.cloneWithRowsAndSections(this.state.map)
      })

      this._graphDataGeneration(trackervalArray, this.state.filter_date_flag, this.state.selected_unit);
      console.log('INSIDE TRACKER DETAILS', this.state.trackervalArray );
    } catch (error) {
      console.error(error);
    }
  }

  convertTrackerArrayToMap(arr){


    var map = {}
    var tracker_multivarArray = arr

    tracker_multivarArray.forEach((item)=>{
      if(!map[moment(item._source.reportDate).format('YYYY-MM-DD')]){
        map[moment(item._source.reportDate).format('YYYY-MM-DD')] = []
      }

    map[moment(item._source.reportDate).format('YYYY-MM-DD')].splice(0,0,item)
    });

 // keys = Object.keys(map)

 //   for ( i = 0; i < keys.length; i++ ){

    //  console.log('Here 4', map[keys[i]][1])

    //   for (j = 0; j < map[keys[i]].length; j++){

    //      console.log('HERE 5', map[keys[i]][j])
    //   }
   //  }



   this.setState({
       map:map,

   })

 //   console.log('HERE 3', map)

   // console.log('Here 4', Object.keys(map))

    // tempArray = Object.keys(map)
    // for (i = 0; i< tempArray.length; i++){
    //   console.log('HERE MAP', map[tempArray[i]])

    //   if (map[tempArray[i]].length > 1){

    //    // for(j=0; )
    //    console.log('DATA', map[tempArray[i]][0]._source.value+' '+map[tempArray[i]][1]._source.value)

    //   }
    //   else{
    //     console.log('DATA2', map[tempArray[i]][0]._source.value)
    //   }

    // }
   }





  async _graphDataGeneration (trackervalArray : Array, flag, selected_unit){
    
    
    try {
      let graphdata = []
      let graphMap = {}
      let tickArray = []
      let dateArray = []
      let multidata = {}
      let dataSets = []
      let isEmptyDataFlag = false
      let i = 0
      let isEmpty = false
      let todaysDate = moment();
      var isSingleVal = false
      var valueType = 'M'
      // if(flag !== 4){
      //   trackervalArray.reverse()
      // }

// calculate the days based on flag
      var days = 1000;
      if (flag === 1){
        days = 7
      } else if (flag === 3) {
        days = 30
      } else if (flag === 2){
        var date = moment();
        days = date.day() + 1;
      }

  if (this.state.isMultiValue === 0){



 if (this.state.categoryId === 7 && trackervalArray.length!=1){
          tempVal = 0
          tempDate = ''

          loop1: for(i = 0; i < this.state.tracker_multivalArray.length; i++ ){

              arr = this.state.tracker_multivalArray[i]._source
              let sum = Number(this.state.tracker_multivalArray[i]._source.value)

            loop2: for(j = i+1; j < this.state.tracker_multivalArray.length; j ++){

                arr2 = this.state.tracker_multivalArray[j]._source

                if(moment(arr.reportDate).format('YYYY-MM-DD') == moment(arr2.reportDate).format('YYYY-MM-DD'))
                {
                  console.log('MATCHED')
                  sum += Number(this.state.tracker_multivalArray[j]._source.value)


              if(j === this.state.tracker_multivalArray.length - 1){
              console.log('BREAKING WHEN SUM is',  (moment(arr.reportDate).format('YYYY-MM-DD')))

                var oDate = moment(arr.reportDate);
                  var diffDays = todaysDate.diff(oDate, 'days');
                  if (diffDays  < days & arr.value !== '' & arr.value !== '-'){
                    graphdata.push({
                        y: sum
                    })
                    graphMap[moment(arr.reportDate).format('YYYY-MM-DD')] = sum
                  }

                break loop1
              }
            }
                else{
                  i = j-1
                  console.log('sum 2',sum)
                  console.log('Sum 2 data: ', moment(arr.reportDate).format('DD, MM'))

                  var oDate = moment(arr.reportDate);
                  var diffDays = todaysDate.diff(oDate, 'days');
                  if (diffDays  < days & arr.value !== '' & arr.value !== '-'){
                    graphdata.push({
                        y: sum
                    })
                    graphMap[moment(arr.reportDate).format('YYYY-MM-DD')] = sum
                }

                  break loop2;

                }
              }
            if (j === this.state.tracker_multivalArray.length -1 ){


              var oDate = moment(arr2.reportDate);
              var diffDays = todaysDate.diff(oDate, 'days');
              if (diffDays  < days & arr2.value !== '' & arr2.value !== '-'){
                graphdata.push({
                    y: arr2.value
                })
                graphMap[moment(arr2.reportDate).format('YYYY-MM-DD')] = arr2.value
            }
            }

          }

  }
  else{
    trackervalArray.reverse()
        trackervalArray.forEach(value => {
          var val = value._source
          if (val !== undefined) {
            var oDate = moment(val.reportDate);
            var diffDays = todaysDate.diff(oDate, 'days');
            if (diffDays  < days & val.value !== '' & val.value !== '-'){
                graphdata.push({
                    y: Number(val.value)
                })
                graphMap[moment(val.reportDate).format('YYYY-MM-DD')] = Number(val.value)
            }
          }
        })
  }
    var blankValueArray = [{y: 0}]
    var graphdata1 = []
    var iter = 0;
    if (flag === 3 || flag === 1 || flag === 2){
      //  if(flag !== 1){
        var todays_date_1 = moment();
        var before_date_1 = todays_date_1.subtract(days, 'days')
        tickArray.push(moment(before_date_1).format('Do MMM'))
        //  }

        for (iter = days - 1; iter >= 0; iter--){
          var todays_date = moment();
          var before_date = todays_date.subtract(iter, 'days')
          if (moment(before_date).format('YYYY-MM-DD') in graphMap){
            graphdata1.push({
              x: days - iter,
              y: Number(graphMap[moment(before_date).format('YYYY-MM-DD')]),
              reportDate: moment(before_date).toISOString()
            })
          }
          tickArray.push(moment(before_date).format('Do MMM'))
          blankValueArray.push({y: 0})
        }

    if (flag === 1){

    } else {
      blankValueArray.push({y: 0})
    }
  } else {
      if (Object.keys(graphMap).length === 1){
        graphdata1.push(null)
        for (i = 0; i < graphdata.length ; i++){
            graphdata1.push(graphdata[i])
          }
        graphdata1.push(null)

        let val = moment(Object.keys(graphMap)[0]).format('Do MMM')
        var before_date = moment(moment(Object.keys(graphMap)[0]).subtract(1, 'days')).format('Do MMM')
        var after_date = moment(moment(Object.keys(graphMap)[0]).add(1, 'days')).format('Do MMM')
        tickArray.push(before_date)
        tickArray.push(val)
        tickArray.push(after_date)
        blankValueArray.push(null)
        blankValueArray.push(null)
        blankValueArray.push({y: 0})
      } else {
        var count = 0;
        blankValueArray.push(null)

        for(keys in graphMap){
          graphdata1.push({
            x: count,
            y: Number(graphMap[keys]),
            reportDate: moment(keys).toISOString()
          })
          tickArray.push(moment(keys).format('Do MMM'))
          if(Object.keys(graphMap).length < 4){
             blankValueArray.push({y: 0})
          }
          count++;
        }
        // graphdata1 = graphdata
      }
      // graphdata1.push(null)
      // blankValueArray.push(null)
      // for(i =0 ; i < graphdata.length ;i++){
      //   graphdata1.push(graphdata[i])
      //   blankValueArray.push(null)
      // }
      // blankValueArray.push({y : 0})
    }

    if(graphdata1.length === 0){
      isEmpty = true
    }

    dataSets.push({
      values: blankValueArray,
      label: 'Company X',
      config: {
        lineWidth: 0,
        drawCircles: false,
        drawValues : false,
        highlightColor: processColor(Color.graphBackground),
        color: processColor(Color.graphBackground),
        drawFilled: false,
        fillAlpha: 50,
        drawHighlightIndicators: false,
        valueFormatter: ''
      }
    })

    dataSets.push({
      values: graphdata1,
      // values: [, , , , , , , , , , , , ,{x: 251, y: 100}, {y: 110}, {y: 105}, {y: 115}],
      label: 'Company Dashed',
      config: {
        color: processColor(this.state.accentColor),
        drawFilled: true,
        fillColor: processColor(this.state.accentColor),
        fillAlpha: 50,
        lineWidth: 2.5,
        drawCubicIntensity: 0.2,
        circleRadius: 5,
        drawCircles: true,
        drawHighlightIndicators: false,
        circleColor: processColor(this.state.accentColor),
        drawCircleHole: true
      }
    })

    if (Object.keys(graphMap).length === 0){
      if (flag !== 4){
        isEmptyDataFlag = true
      } else {
        this.setState({
          isStateRepFlag: true
        })
        this.checkCondition(0)
        return
      }
    }

      } else {
        var count = 0;
        var colors = [Color.tracker_secondary_vals, Color.tracker_vals]
      tickArray.push('')
    trackervalArray.forEach(value => {
      var val = value._source
      if (val !== undefined) {
  // calculate the difference between 2 dates
        oDate = moment(val.reportDate);
        var diffDays = todaysDate.diff(oDate, 'days');
        if (diffDays <= days){
            var co_val;
            var iter = 0;
            var value = val.value.split('/')
            var unit = val.unit.split('/')
            for (iter = 0; iter < value.length; iter++){
                if (!(moment(val.reportDate).format('YYYY-MM-DD') + '@' + unit[iter] in multidata)){
                  if (value[iter] !== '' &  value[iter] !== '-'){
                      var multi_graphdata = []
                      if(iter === 0){
                        count += 1;
                      }
                      if (flag === 4){
                        multi_graphdata.push({ x: count, y: Number(value[iter]), reportDate: moment(val.reportDate).toISOString(), count: count , iter : iter })
                      } else {
                        multi_graphdata.push({ x: days - diffDays, y: Number(value[iter]), reportDate: moment(val.reportDate).toISOString(), count: count , iter : iter })
                      }
                      multidata[moment(val.reportDate).format('YYYY-MM-DD') + '@' + unit[iter]] = {
                        values: multi_graphdata,
                        count: count,
                        label: 'Company Dashed',
                        config: {
                          color: processColor(colors[iter]),
                          drawFilled: true,
                          drawValues : false,
                          reportDate: moment(val.reportDate).format('YYYY-MM-DD'),
                          fillColor: processColor(colors[iter]),
                          fillAlpha: 50,
                          lineWidth: 2.5,
                          drawCubicIntensity: 0.2,
                          circleRadius: 5,
                          drawCircles: true,
                          circleColor: processColor(colors[iter]),
                          drawCircleHole: true
                        }
                      }

                      if (flag === 4 && iter === 0){
                        tickArray.push(this._getReportDate(val.reportDate))
                      }
                    }
                } else {
                  if (value[iter] !== '' &  value[iter] !== '-'){
                      var date_key = moment(val.reportDate).format('YYYY-MM-DD')
                      var _key = date_key + '@' + unit[iter]

                      if (flag === 4){
                        multidata[_key].values.push({ x: multidata[_key].count, y: Number(value[iter]) , reportDate: moment(val.reportDate).toISOString(), count: count , iter : iter})
                      } else {
                        multidata[_key].values.push({ x: days - diffDays, y: Number(value[iter]), reportDate: moment(val.reportDate).toISOString(), count: count , iter : iter})
                      }

                    }
                }
              }
        }

        }
    })

    var blankValueArray = [{y: 0}]
    if (flag === 1 || flag === 3 || flag === 2){
      for (iter = days; iter > 0; iter--){
          blankValueArray.push(null)

          var todays_date = moment();
          before_date = todays_date.subtract(iter, 'days')
          tickArray.push(this._getReportDate(before_date))
      }
    }

    blankValueArray.push({y: 0})

    if (Object.keys(multidata).length === 0){
      if (flag !== 4){
        isEmptyDataFlag = true
      } else {
        this.setState({
          isStateRepFlag: true
        })
        this.checkCondition(0)
        return
      }
    }

    dataSets.push({
      values: blankValueArray,
      label: 'Company X',
      config: {
          lineWidth: 0,
          drawCircles: false,
          drawValues : false,
          highlightColor: processColor(Color.graphBackground),
          color: processColor(Color.graphBackground),
          drawFilled: false,
          fillAlpha: 50,
          drawHighlightIndicators: false,
          valueFormatter: ''
        }
    })

    for (keys in multidata){
      if (multidata[keys].values.length > 2){
          var valueArray = []
          multidata[keys].values.sort((a, b) =>{
            return a.y - b.y
          })
          valueArray.push(multidata[keys].values[0])
          valueArray.push(multidata[keys].values[multidata[keys].values.length - 1])
          multidata[keys].values = valueArray
        }
      dataSets.push(multidata[keys])
    }

      }

      if(trackervalArray.length === 1){
        if(trackervalArray[0]._source.userReportId){
          valueType = 'A'
        }
        isSingleVal = true
      }

      var trackerData_list = {
        graphDataSection: [''],
        tracker_multivalArray: this.state.tracker_multivalArray
      }

      this.setState(
      //  reactAddonsUpdate(this.state,
      {
        data: (isEmptyDataFlag) ? {} : ((trackervalArray.length > 1) ? {dataSets: dataSets} : {}),
        isEmpty: isEmpty,
        isSingleVal: isSingleVal,
        valueType: valueType,
        xAxis: {
          startAtZero: true,
          valueFormatter: tickArray,
          position: 'BOTTOM',
          textSize: 7,
          drawGridLines: false,
          granularityEnabled: true,
          granularity: 1,
        },
          yAxis: {
          startAtZero: true,
          drawGridLines: false
        },
          rightAxis: {
          drawAxisLine: false,
          enabled: false,
          drawGridLines: false,
          drawLabels: false,
          position: 'LEFT'
        },
          isGraphReady: true,
          graphdata: graphdata,
          tickvalues: tickArray,
          isStateRepFlag: false,
          isLoading: false
        }
    // )
    )
    } catch (error){
      console.error(error);
    }
    console.log('INSIDE GRAPH DATA GENERATION', this.state.tracker_multivalArray );
  }

  _getReportDate (param_date){
    try {
      var dateFormat = 'YYYY-MM-DDTHH:mm:ssZ'
      var dateFormatDisplay = 'Do MMM'
      var reportDate = moment(param_date, dateFormat).format(dateFormatDisplay)
      return reportDate
    } catch (error) {
      console.error(error)
    }
  }

  setStateForGraph (flag){
    // this._graphDataGeneration(this.state.trackervalArray, flag, this.state.selected_unit)
    this._graphDataGeneration(this.state.trackervalArray, flag)
    this.setState({
      filter_date_flag: flag
    })
  }

  getUnitFilter (){
    var row = []
    {
      this.state.unitArray.forEach(val => {
        row.push(
            <View  key={val}  style={{paddingTop: 8, paddingBottom: 8, flex: 1}}>
              <Text style={{ fontFamily: 'Arial' ,textAlign: 'center', paddingTop: 12, paddingBottom: 12}}
                onPress={() => {
                  this.setState({
                    selected_unit: val,
                    unit_selected_flag: true
                  })
                  this._graphDataGeneration(this.state.trackervalArray, this.state.filter_date_flag, val)
                }}>{val}
              </Text>
              {(this.state.selected_unit === val) ? (<View style={[styles.filter_seleted_style_1, {backgroundColor: this.state.accentColor}]}></View>) : (<View key={val} style={styles.filter_unseleted_style_1}></View>)}
            </View>
          )
      })
    }
    return (<View style ={{flexDirection: 'row'}}>{row}</View>)
  }

  async getUnitData (isEditFlag){
    // var param = 'token=f55f01a6-20f9-11e7-bf08-0a2ce1603801 &dictionaryId='+ this.state.dictionaryId

    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      var params = 'token=' + token
                  + ' &dictionaryId=' + this.state.dictionaryId
      var _this = this
      NetworkRequest(_this, 'POST', URLs.getManualTrackerSubCategories, params).then(result => {
        if (result.success){
          if ((result.response.code || '') === 200) {
            this.loadingManipulate(false)
            if (result.response.dictionaryList.length > 0){
              var unitArray = []
              var indexArray = []
              var main_unit = ''
              result.response.dictionaryList[0].referenceDict.forEach(val => {
                  unitArray.push(val.unit)
                  indexArray.push(val.index)
                  if(val.index === 0){
                      main_unit = val.unit
                  }
                })

              if (result.response.dictionaryList[0].testDict){
                  this.setState({
                  addDialog: true,
                  listDialog: false,
                  dialogShow: true,
                  infoDialog: false,
                  unitArray: unitArray,
                  indexArray: indexArray,
                  isEditFlag: isEditFlag,
                  main_unit: main_unit,
                  isMultiValue: result.response.dictionaryList[0].testDict.isMultiValue
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

  }

  checkCondition (isEditFlag){
    if (this.state.unitArray.length > 0){
      if (this.state.indexArray !== undefined){
        if (this.state.indexArray.length){
          this.setState({
            addDialog: true,
            listDialog: false,
            dialogShow: true,
            infoDialog: false,
            isEditFlag: isEditFlag
          })
          // this.gotoTrackerAddition(this.state.unitArray, this.state.indexArray,isEditFlag)
        } else {
          this.loadingManipulate(true)
          this.getUnitData(isEditFlag)
        }
      } else {
        this.loadingManipulate(true)
        this.getUnitData(isEditFlag)
      }
    } else {
      this.loadingManipulate(true)
      this.getUnitData(isEditFlag)
    }
  }

  // gotoTrackerAddition(unitArray : Array,indexArray : Array, isEditFlag ){
  // let dataSent = {}
  // if( isEditFlag === 1 ){
  //   dataSent = {
  //     dialogValue: this.state.dialogValue,
  //      dialogUnit: this.state.dialogUnit,
  //      dialogDate: this.state.dialogDate,
  //      dialogNotes: this.state.dialogNotes,
  //      dialogReportId:this.state.dialogReportId
  //   }
  // } else {
  //   isEditFlag = 0
  //   dataSent = {}
  // }
  //   setTimeout(() => {
  //     this.props.navigation.navigate(Routes.trackerAddScreen, {
  //       unitArray: unitArray,
  //       dictionaryId : this.state.dictionaryId,
  //       isMultiValue : this.state.isMultiValue,
  //       renewData : this.getData,
  //       dataSent: dataSent,
  //       isEditFlag : isEditFlag,
  //       indexArray : indexArray
  //     })
  //   },300)
  // }

  getBack (){
    // this.props.navigation.goBack()
    this.props.closeModal()
  }

  handleSelect (event){
    var entry = event.nativeEvent
    var value = ''
    var unit = ''
    var color = Color.tracker_vals
    if (entry){
      if(Object.keys(entry).length > 0){
        try {
          if(this.state.isMultiValue === 1){
            try {
              console.log('Entry', entry);
              var valueArray = this.state.trackervalArray[entry.data.count]._source.value.split('/')
              value = Math.round(entry.y * 100) / 100
              var unitArray = this.state.trackervalArray[entry.data.count]._source.unit.split('/')
              unit = unitArray[entry.data.iter]
              if(entry.data.iter === 0){
                color = Color.tracker_secondary_vals
              }
            } catch(error){
              unit = this.state.highlightedUnit
              console.error(error);
            }
          } else {
            value = Math.round(entry.y * 100) / 100
            unit = this.state.highlightedUnit
          }

          if ((!isNaN(value) && this.state.isMultiValue !== 1) || this.state.isMultiValue === 1 && value){
            if (value !== 0){
              if(entry.data.reportDate){
                this.setState({
                  highlightedValue: value,
                  multiUnit: unit,
                  highlightedColor: color,
                  highlightedDate: entry.data.reportDate,
                })
              } else {
                this.setState({
                  highlightedValue: value,
                  multiUnit: unit,
                  highlightedColor: color,
                  highlightedUnit: unit,
                })
              }
            }
          }
        } catch(error){
          console.error(error);
        }
      }
    }
  }

  async refreshPinnedTracker(){
    UserDefaults.get(stringsUserDefaults.pinnedTracker).then((pinnedTracker) => {
      var jsonArray = []
      if (pinnedTracker){
        jsonArray = JSON.parse(pinnedTracker)
        if (this.state.fav_color === Color.fav_color){
          for (i = 0; i < jsonArray.length; i++){
            if (this.state.dictionaryId === jsonArray[i].dictionaryId){
              jsonArray.splice(i, 1)
              jsonArray.push(this.state.fav_val)
              break
            }
          }
        }
      }
      this.props.setList(JSON.stringify(jsonArray))
      this.loadingManipulate(false)
      try {
        UserDefaults.set(stringsUserDefaults.pinnedTracker, true)
      } catch(error){console.log(error)}
    }).catch((error) => {
      this.loadingManipulate(false)
      console.error(error);
    })
  }

  async addRemovePinnedTracker (flag) {

      UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
        var params = 'token=' + token
                    + '&dictionaryId=' + this.state.dictionaryId
                    + '&favFlag=' + flag
        var _this = this
        NetworkRequest(_this, 'POST', URLs.addRemoveFavoriteTracker, params).then(result => {
          if (result.success){
            if ((result.response.code || 0) === 200){
              var color = 'white'
              if(flag === 1){
                color = Color.fav_color
              }
              this.setState({
                fav_color: color,
                isLoading: false
              })
              UserDefaults.set(stringsUserDefaults.pinnedTracker, true)

              var pinnedTrackers = this.state.pinnedTrackers
              if(flag === 0){
                for(var i = 0 ; i < pinnedTrackers.length ; i++){
                  if (this.state.dictionaryId == pinnedTrackers[i].dictionaryId){
                    pinnedTrackers.splice(i, 1)
                    this.props.setList(pinnedTrackers)
                    break
                  }
                }
              } else {
                var trackervalArray = this.state.trackervalArray
                trackervalArray.reverse()
                if(pinnedTrackers !== "[]"){
                  pinnedTrackers.push({
                    highlightedValue:String(trackervalArray[0]._source.value),
                    highlightedUnit: trackervalArray[0]._source.unit,
                    highlightedDate: moment(trackervalArray[0]._source.reportDate).utc().format(Global.LTHDateFormatMoment) + 'Z',
                    currentParameter: this.state.currentParameter,
                    icon: '',
                    dictionaryId: this.state.dictionaryId
                  })
                  this.props.setList(pinnedTrackers)
                }
              }

              // this.props.setList(result.success)

              var count = 0
              var dictionaryArray = this.state.dictionaryArray
              dictionaryArray.forEach((valInData) => {
                if(valInData === this.state.dictionaryId){
                  dictionaryArray.splice(count, 1)
                }
                count++
              })
              UserDefaults.set(stringsUserDefaults.dictionaryArray, dictionaryArray)
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
  }

  getView(value , unit, date){
    return(
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={styles.stats_value}>{value}</Text>
          <View>
            <View style={{flex: 1}}></View>
            <Text style={styles.stats_unit}>{unit}</Text>
          </View>
        </View>
        <Text style={styles.stats_date}>{(moment(date).isValid()) ? ('Your value on' + moment(date).format('Do MMMM YYYY')) : (date)}</Text>
      </View>
    )
  }

  _renderRow (item1, secId, rowId){
    console.log('ITEM', item1);
    var value = ''
    var unit = ''
    var autoManIndicator = ''
    var item = item1._source
    var value = []
    if(this.state.isMultiValue === 1){
      value = item.value.split('/')
    }

    return (
      <View>

        {/* <Text>{item.value}</Text> */}
           {
          (this.state.isMultiValue === 1) ?
                                        (<View style={{flex: 1}}>
                                            {(item.value !== undefined & item.value !== null)
                                               ?
                                               (<Ripple
                                                    timeout={400}
                                                    onPress={() => {
                                                      this.setState({
                                                        dialogShow: true,
                                                        addDialog: false,
                                                        listDialog: false,
                                                        infoDialog: true,
                                                        dialogValue: item.value,
                                                        dialogUnit: item.unit,
                                                        dialogDate: item.reportDate,
                                                        dialogReportName: item.dictionaryName,
                                                        dialogReportId: item1._id,
                                                        // dialogAutomated: item.autotrackedFlag,
                                                        // dialogNotes: item.autotrackedFlag === 0 ? item.value.report.tags : ''
                                                      })
                                                    }}>
                                                   <View style={{flexDirection: 'column', flex: 1}}>
                                                    <View style={{flexDirection: 'row', flex: 1, padding: 16}}>
                                                      <Text style={{height : 28, width : 28, borderRadius: 60, backgroundColor: Color.tracker_vals, color: 'white', paddingBottom: 2, fontSize: 12, textAlign:'center', paddingTop: 5, marginTop: 4, marginRight: 6}}>{item.userReportId ? 'A' : 'M'}</Text>
                                                      <View style={{flex : 1}}>
                                                        <Text style={{ fontFamily: 'Arial', fontSize: 16, color: '#515151'}}> {item.value}</Text>
                                                        <Text style={{ fontFamily: 'Arial', fontSize: 9, paddingLeft: 6, color: '#515151'}}>{item.unit}</Text>
                                                      </View>
                                                    </View>
                                                    <View style={{height: 0.5, backgroundColor: '#DFDFDF'}}></View>
                                                  </View>
                                              </Ripple>
                                              )
                                               :
                                               (<Text style={{fontFamily: 'Arial'}}></Text>)}
                                            </View>
                                        )
                                        :
                                        (
                                          <View style={{flex: 1}}>
                                          {(item.value !== undefined & item.value !== null)
                                             ?
                                             (
                                              <Ripple
                                              timeout={400}
                                               onPress={() => {
                                                 this.setState({
                                                   dialogShow: true,
                                                   addDialog:false,
                                                   listDialog: false,
                                                   infoDialog: true,
                                                   dialogValue: item.value,
                                                   dialogUnit: item.unit,
                                                   dialogDate: item.reportDate,
                                                   dialogReportId: item1._id,
                                                   dialogReportName: item.dictionaryName,
                                                  //  dialogAutomated: item.autotrackedFlag,
                                                  //  dialogNotes: item.autotrackedFlag === 0 ? item.tags : ''
                                                 })
                                               }}>
                                                 <View style={{flexDirection: 'column', flex: 1}}>
                                                  <View style={{flexDirection: 'row', flex: 1, padding: 16}}>
                                                    <View style={{flexDirection: 'row', flex: 1}}>
                                                    <View style = {{
                                                      backgroundColor:Color.tracker_vals,
                                                      borderRadius: 35/2,
                                                      height : 35, width : 35,
                                                    }}>
                                                      <Text
                                                      overflow="hidden"
                                                      style={{
                                                        backgroundColor:'rgba(0,0,0,0)',
                                                        overflow:'hidden',
                                                           color: 'white',  paddingBottom: 2, fontSize: 12, textAlign:'center', paddingTop: 9}}>{item.userReportId ? 'A' : 'M'}</Text>
                                                        </View>
                                                      <Text style={{ fontFamily: 'Arial', paddingLeft: 8, fontSize: 15, paddingTop: 7, color: '#515151'}}> {item.value} {item.unit}</Text>
                                                    </View>
                                                   {/* <Text style={{ fontFamily: 'Arial', paddingRight: 8, fontSize: 12, paddingTop: 8}}>{moment(item.reportDate).format('Do MMM, YYYY')}</Text> */}
                                                  </View>
                                                  <View style={{height: 0.5, backgroundColor: '#DFDFDF'}}></View>
                                                </View>
                                              </Ripple>
                                            )
                                             :
                                          (<Text style={{fontFamily: 'Arial'}}></Text>)}
                                        </View>
                                       )

         }
       </View>

    )
  }


  renderSectionHeader(sectionData, item){
  

    return(
    <View style = {{backgroundColor:Color._EEGrayTableHeader}}>
    <Text  style={{ fontFamily: 'Arial', fontSize: 15, color: Color._4A, padding: 16,}}>{moment(item).format('Do MMMM YYYY')}</Text>
    </View>
  )

  }

  _deleteEntry (){
    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      var params = 'token=' + token
                  + '&trackerId=' + this.state.dialogReportId
      var _this = this
      NetworkRequest(_this, 'POST', URLs.deleteTracker, params).then(result => {
        if (result.success){
          if ((result.response.code || 0) === 200){
            this.setState({
              dialogShow: false,
              infoDialog: false,
              addDialog: false,
              listDialog: false,
              filter_date_flag: 4
            })
            // ToastAndroid.show('Entry deleted successfully !', ToastAndroid.SHORT);
            setTimeout(() => {
              this.getData(1)
            },50)
            // this.loadingManipulate(false)
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
  }

  closeDialog (){
    this.setState({
      dialogShow: false,
      infoDialog: false,
      listDialog: false,
      addDialog: false
    })
  }

  _onScroll = (event) => {
    // Simple fade-in / fade-out animation
    const CustomLayoutLinear = {
      duration: 100,
      create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
    }
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    var currentOffset = event.nativeEvent.contentOffset.y
    if(currentOffset < 5){
      this.props.setSwipe(true)
    }
    //  else {
    //   this.props.setSwipe(false)
    // }
    const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
      ? 'down'
      : 'up'
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionButtonVisible = direction === 'up'
    if (isActionButtonVisible !== this.state.isActionButtonVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear)
      this.setState({ isActionButtonVisible })
    }

  //  if(this.state.isInitial) {
  //    if(currentOffset === 5){
  //      this.setState({
  //        isActionButtonVisible : true,
  //        isInitial: false
  //      })
  //    }
  //   }
    // Update your scroll position
    this._listViewOffset = currentOffset
  }

  onClose() {
    this.closeDialog()
    console.log('Modal just closed');
  }
  onOpen() {
    console.log('Modal just openned');
  }
  onClosingState(state) {
     console.log('the open/close of the swipeToClose just changed');
  }

  getChart(){
    return(
        (this.state.isGraphReady) ?
                                  (<ScrollView
                                    ref="scrollView"
                                    bounces = {false}
                                    style={{flex: 1}}
                                    onScroll={this._onScroll}
                                    onContentSizeChange={(w, h) => {
                                      if (h > Global.screenHeight) {
                                        if(this.props.getSwipe){
                                          if(this.props.getSwipe()){
                                            this.props.setSwipe(false)
                                            this.setState({
                                              isVisible: true,
                                            })
                                            this.props.setScroll(true)
                                            this.refs.scrollView.scrollTo({x: 0, y: 6, animated: true});
                                            this.refs.scrollView.scrollTo({x: 0, y: 4, animated: true});
                                          }
                                        }
                                      }
                                    }}
                                    >
                                    <View style={{backgroundColor: this.state.accentColor, paddingBottom: 48}}>
                                      <CloseBar
                                        goBack={this.getBack}
                                        color={'white'}
                                        actionArray={[
                                          {
                                            name: (this.state.fav_color !== Color.fav_color) ? ('star-border') : ('star'),
                                            color: 'white',
                                            onPress: () =>{
                                              this.loadingManipulate(true)
                                              var flag = 0
                                              if(this.state.fav_color !== Color.fav_color){
                                                flag = 1
                                              }
                                              this.addRemovePinnedTracker(flag)
                                            }
                                          }
                                        ]}/>
                                      <Text style={{ fontFamily: 'Arial' ,fontSize: 32, fontWeight: 'bold', color: 'white', padding: 17, paddingRight: 17}}>{this.state.currentParameter}</Text>
                                    </View>
                                    <View style={[{height: (this.state.isMultiValue === 1) ?  (this.state.isSingleVal) ? 150 : 300 : (this.state.isSingleVal) ? 128 : 250, 
                                    flex: 1, marginLeft: 17, marginRight: 17,
                                       marginBottom: 16, marginTop: -32, padding: 14, backgroundColor: 'white', borderRadius: 4, elevation: 2, borderColor: '#dfdfdf', borderWidth: 0.5}, CommonStyles.commonShadow]}>
                                      {(!this.state.isSingleVal)
                                      ?
                                      (  <View>
                                          <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={styles.filter_style} onPress={() => this.setStateForGraph(1)}>7 Days</Text>
                                            <Text style={styles.filter_style} onPress={() => this.setStateForGraph(2)}>Week</Text>
                                            <Text style={styles.filter_style} onPress={() => this.setStateForGraph(3)}>30 Days</Text>
                                            <Text style={styles.filter_style} onPress={() => this.setStateForGraph(4)}>All</Text>
                                          </View>
                                          <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'center'}}>
                                            {(this.state.filter_date_flag === 1) ? (<View style={[styles.filter_seleted_style, { backgroundColor: this.state.accentColor} ]}/>) : (<View style={styles.filter_unseleted_style}/>)}
                                            {(this.state.filter_date_flag === 2) ? (<View style={[styles.filter_seleted_style, { backgroundColor: this.state.accentColor} ]}/>) : (<View style={styles.filter_unseleted_style}/>)}
                                            {(this.state.filter_date_flag === 3) ? (<View style={[styles.filter_seleted_style, { backgroundColor: this.state.accentColor} ]}/>) : (<View style={styles.filter_unseleted_style}/>)}
                                            {(this.state.filter_date_flag === 4) ? (<View style={[styles.filter_seleted_style, { backgroundColor: this.state.accentColor} ]}/>) : (<View style={styles.filter_unseleted_style}/>)}
                                          </View>
                                        </View>) : (null)}
                                        <View style={{
                                          flex: 1,
                                          backgroundColor: '#FFFFFF'
                                        }}>
                                       {(this.state.isEmpty)
                                       ?
                                       (
                                         <View style={{flex: 1, justifyContent: 'center'}}>
                                           <Text style={{textAlign: 'center', color: Color.starYellow}}>No chart data available</Text>
                                         </View>
                                        )
                                        :
                                       (
                                         (this.state.isSingleVal)
                                         ?
                                         (
                                           <View style={{height : this.state.isMultiValue === 1 ? 150 : 128, flexDirection: 'row'}}>
                                             <View style={{flex: 1}}>
                                               <View style={{flexDirection: 'row', alignItems: this.state.isMultiValue !== 1 ?  'center' : 'flex-start',}}>
                                                 <Text style={{
                                                   fontFamily: 'Arial' ,color: Color._4A, fontSize: 42, paddingRight: 6, paddingLeft: 8, paddingTop:10}}>{this.state.highlightedValue}</Text>
                                                 <Text style={{ fontFamily: 'Arial' ,color: Color._4A, fontSize: 24, paddingRight: 16, paddingLeft: 2, paddingTop: 18}}>{(this.state.dictionaryId == 948) ? 'mmhg': this.state.highlightedUnit}</Text>
                                               </View>
                                               {this.state.isMultiValue === 1 && this.state.dictionaryId == 948 && <Text style={{ fontFamily: 'Arial' ,color: Color._4A, fontSize: (this.state.isMultiValue === 1) ? 12 : 28
                                                  , paddingRight: 16, paddingLeft: (this.state.isMultiValue === 1) ? 18 : 2 , paddingTop: this.state.isMultiValue === 1 ? 0 : 16
                                                  }}>{'Systolic (High)/Diastolic (Low)'}</Text>}
                                               <Text style={{paddingRight: 12, marginTop: 4, color: Color._4A, fontSize: 16, paddingLeft: 16}}>{moment(this.state.highlightedDate).format('Do MMM YYYY')}</Text>
                                             </View>
                                             <Text
                                             overflow = "hidden" 
                                             style={{
                                               overflow:'hidden',
                                               height : 35, width : 35, borderRadius: 35/2, borderWidth:0,borderColor:'#ccc', backgroundColor: this.state.accentColor, color: 'white', marginTop: 32, paddingBottom: 2, fontSize: 12, textAlign:'center', paddingTop: 9, marginRight: 16}}>{this.state.valueType}</Text>
                                           </View>

                                        )
                                       :(this.state.categoryId === 7)?
                                       (
                                         <BarChart
                                         style={{flex: 1}}
                                         data={this.state.data}
                                         description={{text: ''}}
                                         chartDescription={{text: ''}}
                                         legend={this.state.legend}
                                         marker={this.state.marker}
                                         xAxis={this.state.xAxis}
                                         axisRight={{enable: false, drawGridLines: false}}
                                         yAxis={{startAtZero: true, drawGridLines: false, position: 'INSIDE_CHART'}}
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
                                         doubleTapToZoomEnabled={false}
                                        //  zoom={{scaleX: 1, scaleY: 1, xValue: 9999, yValue: 1, axisDependency: 'RIGHT'}}
                                         dragDecelerationEnabled={true}
                                         dragDecelerationFrictionCoef={0.99}

                                         keepPositionOnRotation={false}
                                         onSelect={this.handleSelect.bind(this)}
                                       />
                                     ):
                                     (
                                      <LineChart
                                      style={{flex: 1}}
                                      data={this.state.data}
                                      description={{text: ''}}
                                      chartDescription={{text: ''}}
                                      legend={this.state.legend}
                                      marker={this.state.marker}
                                      xAxis={this.state.xAxis}
                                      axisRight={{enable: false, drawGridLines: false}}
                                      yAxis={{startAtZero: true, drawGridLines: false, position: 'INSIDE_CHART'}}
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
                                      doubleTapToZoomEnabled={false}
                                     //  zoom={{scaleX: 1, scaleY: 1, xValue: 9999, yValue: 1, axisDependency: 'RIGHT'}}
                                      dragDecelerationEnabled={true}
                                      dragDecelerationFrictionCoef={0.99}

                                      keepPositionOnRotation={false}
                                      onSelect={this.handleSelect.bind(this)}
                                    />
                                  )
                                     )}
                                       </View>
                                       {
                                        (this.state.isMultiValue === 1 && !this.state.isSingleVal)
                                         ?
                                        (
                                          <View style={{flexDirection: 'row', paddingLeft: 16, paddingTop: 8, paddingBottom: 8}}>
                                            <View style={{backgroundColor: Color.tracker_secondary_vals, height: 12, width: 12, marginTop: 4, marginLeft: 8, justifyContent: 'center'}}></View>
                                            <Text style={{ fontFamily: 'Arial' ,textAlign: 'center', marginBottom: 4, paddingLeft: 8, fontSize: 12}}>Systolic</Text>
                                            <View style={{backgroundColor: this.state.accentColor, height: 12, width: 12, justifyContent: 'center', marginTop: 4, marginLeft: 8}}></View>
                                            <Text style={{ fontFamily: 'Arial' ,textAlign: 'center', marginBottom: 4, paddingLeft: 8, fontSize: 12}}>Diastolic</Text>
                                          </View>
                                        )
                                        :
                                        (null)
                                      }
                                    </View>
                                    {/* {(this.state.isMultiValue === 0 & this.state.isAutomated === 0)? ((this.state.unitArray.length > 0 ) ? <View>{this.getUnitFilter()}</View>: null) : (null)} */}
                                    <View style={{paddingBottom: 20}}>
                                      <View style={{flexDirection: 'column'}}>
                                        <View style={{flexDirection: 'row'}}>
                                          {!this.state.isSingleVal && !this.state.selected_type && <Text style={{ fontFamily: 'Arial' ,color: this.state.highlightedColor, fontSize: 28, paddingLeft: 14}}>{this.state.highlightedValue}</Text>}
                                          {!this.state.isSingleVal && !this.state.selected_type && <Text style={{ fontFamily: 'Arial' ,color: this.state.highlightedColor, fontSize: 20, paddingTop: 8,
                                           paddingLeft:4}}>{this.state.dictionaryId == '948' ? 'mmhg' : this.state.highlightedUnit}</Text>}
                                        </View>
                                        {!this.state.isSingleVal && !this.state.selected_type && this.state.dictionaryId == '948' &&
                                          <View style={{flexDirection: 'row'}}>
                                            <Text style={{ fontFamily: 'Arial' ,color: this.state.highlightedColor, fontSize: this.state.isMultiValue === 1 ? 16 : 28,
                                            paddingLeft: this.state.isMultiValue === 1 ? 18 : 4}}>{this.state.multiUnit}</Text>
                                          </View>
                                        }
                                        {!this.state.isSingleVal && !this.state.selected_type && <Text style={{ fontFamily: 'Arial' ,fontSize: 16, paddingLeft: 16, paddingTop: 4}}>{moment(this.state.highlightedDate).format('Do MMM, YYYY')}</Text>}
                                      </View>
                                      {
                                        (!this.state.isSingleVal && this.state.selected_type)
                                        ?
                                        <View>
                                          <Text style={styles.stats_header}>Current Stats</Text>
                                            {this.getView(this.state.highlightedValue, this.state.highlightedUnit, this.state.highlightedDate)}
                                            <View style={{backgroundColor: Color._4A, height : 0.2, margin: 16, marginLeft: 84, marginRight : 84}}></View>
                                            <View style={{flexDirection: 'row'}}>
                                              {this.getView(this.state.minVal, this.state.highlightedUnit, 'Lower Bound')}
                                              <View style={{backgroundColor: Color._4A, width : 0.4}}></View>
                                              {this.getView(this.state.maxVal, this.state.highlightedUnit, 'Upper Bound')}
                                            </View>
                                        </View>
                                        :null
                                      }
                                      {this.state.currentDescription ? <Text style={[styles.stats_header, {paddingTop: 16}]}>Description</Text> :  null}
                                      <Text style={{paddingLeft: 16, paddingTop: 8, paddingRight: 16, paddingBottom: 6}}>{this.state.currentDescription}</Text>
                                      <View style={{flexDirection: 'row'}}>
                                          <Ripple
                                            onPress={() => {
                                              this.setState({
                                                dialogShow: true,
                                                listDialog: true,
                                                infoDialog: false,
                                                addDialog: false
                                              })
                                            }}
                                          >
                                          <View style={{marginLeft: 4, padding: 12, elevation: 6}}>
                                            <Text style={{fontSize: 16, color: Color.theme_blue}}>View all the recorded values </Text>
                                          </View>
                                        </Ripple>
                                          <View style={{flex: 1}}></View>
                                       </View>
                                    </View>
                                    {/* <ListHeader headerText= {'YOUR RECORDED VALUES'}/> */}
                                  </ScrollView>) : null
    )
  }

  goBack(){
    this.closeDialog()
  }

  _renderSections(sectionData, category){
    console.log('CAT:', category)
    return(
      <ListHeader headerText= {category}/>
    )
  }

  render (){

    return (
      <View style={{flexDirection: 'column', flex: 1, backgroundColor: 'white'}}>

        {
          (this.state.isStateRepFlag) ?
          (
            <StateRepresentation
            image='search'
            description= 'No recently tracked values'></StateRepresentation>
          )
          :
          (
            this.getChart()
          )
        }

        {this.state.isActionButtonVisible ?
        (<Ripple
          activeOpacity={0.7}
           style={{
             width: 60,
             height: 60,
             borderRadius: 30,
             position: 'absolute',
             bottom: Global.isIphoneX ? 32 : 16,
             right: 16,
             alignItems: 'center',
             justifyContent: 'center'
           }}
          onPress={() => {
            this.checkCondition(0)
          }}>
         <View style={{
           width: 60,
           height: 60,
           borderRadius: 30,
           backgroundColor:  this.state.accentColor,
           position: 'absolute',
           alignItems: 'center',
           justifyContent: 'center'
         }}>
           <MaterialIcons
             name={'add'}
             size={28}
             style={{
               color: 'white'
             }}
           />
         </View>
       </Ripple>) : (null) }

       {(this.state.dialogShow)
       ?
        (<ModalBox
           style={{ justifyContent: 'center', borderRadius: 6, backgroundColor: 'rgba(0,0,0,0)', position: 'absolute'}}
           ref={"modal1"}
           swipeThreshold={200}
           swipeArea= {Global.screenHeight}
           isOpen={this.state.dialogShow}
           swipeToClose={this.state.dialogShow}
           onClosed={this.onClose}
           position={'top'}
           backdrop={true}
           keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
           onOpened={this.onOpen}
           onClosingState={this.onClosingState}>
        {
          (this.state.addDialog)
          ?
          (
            <View style={{backgroundColor: '#ffffff', borderRadius: 6, margin: 40}}>
              <TrackerAddition
                dictionaryId = {this.state.dictionaryId}
                unitArray = {this.state.unitArray}
                isMultiValue = {this.state.isMultiValue}
                indexArray = {this.state.indexArray}
                getData = {this.getData}
                isfav = {this.state.fav_color === Color.fav_color ? 1 : 0}
                pinnedTrackers= {this.state.pinnedTrackers}
                loadData={this.loadingManipulate}
                recentReportDate={this.state.trackervalArray ? this.state.trackervalArray.length > 0 ? this.state.trackervalArray[this.state.trackervalArray.length - 1]._source.reportDate : '' : ''}
                currentParameter = {this.state.currentParameter}
                closeDialog = {this.closeDialog}
                dialogValue = {this.state.dialogValue}
                dialogUnit = {this.state.dialogUnit}
                dialogDate = {this.state.dialogDate}
                dialogNotes = {this.state.dialogNotes}
                dialogReportId = {this.state.dialogReportId}
                isEditFlag = {this.state.isEditFlag}
                main_unit = {this.state.main_unit}
                fav_color={this.state.fav_color}
                ></TrackerAddition>
            </View>
          ) :
          ((this.state.infoDialog)
            ?
            (<View style={{flexDirection: 'column', backgroundColor: '#ffffff', borderRadius: 6, padding: 24, margin: 40}}>
              <DialogHeader
              title={this.state.currentParameter}
              secondaryTitle={'Recorded Value'}/>
              <View>
                <View style={{paddingTop: 8, paddingBottom: 8}}>
                  <View style={{paddingTop: 8, paddingBottom: 8}}>
                    <Text style={{ fontFamily: 'Arial' ,fontSize: 16, color: Color.theme_blue}}>{this.state.dialogValue} {this.state.dialogUnit}</Text>
                    <Text style={{ fontFamily: 'Arial' ,fontSize: 12, paddingTop: 4}}>Value</Text>
                  </View>
                  <View style={{paddingTop: 8, paddingBottom: 8}}>
                    <Text style={{ fontFamily: 'Arial' ,fontSize: 16, color: '#212121'}}>{moment(this.state.dialogDate).format('Do MMM, YYYY')}</Text>
                    <Text style={{ fontFamily: 'Arial' ,fontSize: 12, paddingTop: 4}}>Date</Text>
                  </View>
                  <View style={{paddingTop: 8, paddingBottom: 8}}>
                    <Text style={{ fontFamily: 'Arial' ,fontSize: 16, color: '#212121'}}>{moment(this.state.dialogDate).format('hh:mm a')}</Text>
                    <Text style={{ fontFamily: 'Arial' ,fontSize: 12, paddingTop: 4}}>Time</Text>
                  </View>

                  {(this.state.dialogAutomated === 0) ? (
                    (this.state.dialogNotes) ?
                      (<View style={{paddingTop: 8, paddingBottom: 8}}>
                        <Text style={{ fontFamily: 'Arial' ,fontSize: 16, color: '#212121', paddingRight: 16}} numberOfLines={2}>{this.state.dialogNotes}</Text>
                        <Text style={{ fontFamily: 'Arial' ,fontSize: 12, paddingTop: 4}}>Notes</Text>
                      </View>) : (null)
                    )
                    :
                    (null)
                  }
                </View>

                <View style={{flexDirection: 'row'}}>

                  <Ripple
                    onPress={() => {
                      this.setState({
                        dialogShow: false,
                        infoDialog: false,
                        addDialog: false,
                        listDialog: false,
                      })
                    }}
                    >
                    <Text style={[CommonStyles.button_style, { paddingTop: 12, paddingBottom: 12, fontSize: 12}]}>CANCEL</Text>
                  </Ripple>

                  <Ripple

                    onPress={() => {
                      var message = ''
                      var title = ''
                      var reply_yes = ''
                      var reply_no = ''
                      message = 'Are you sure you want to delete this entry?'
                      title = 'Delete Entry?'
                      reply_yes = 'Ok'
                      reply_no = 'Cancel'
                      Alert.alert(
                           title,
                           message,
                        [
                            {text: reply_no, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: reply_yes, onPress: () => {
                              this.setState({
                                dialogShow: false,
                                infoDialog: false,
                                listDialog: false,
                                addDialog: false,
                                isLoading: true
                              })
                              setTimeout(() => {
                                this._deleteEntry()
                              }, 50)
                            }}
                        ],
                          { cancelable: true }
                        )
                    }}>
                    <Text
                      style={[CommonStyles.button_style, {
                        justifyContent: 'center',
                        paddingTop: 12,
                        paddingLeft:12,
                        paddingBottom: 12,
                        alignItems: 'center',
                        fontSize: 12
                      }]}
                    >DELETE</Text>
                  </Ripple>
                  <View style={{flex:1}}>
                  </View>

                  {(this.state.dialogAutomated === 1) ? (
                    null
                    )
                    :
                    (
                    <View
                      style={{paddingTop: 12, paddingBottom: 12, paddingLeft: 12}}></View>
                    )
                  }

                </View>

              </View>
            </View>)
            : (this.state.listDialog) ? (
              <ListView
                bounces={false}
                style={{flex: 1,flexDirection: 'column', backgroundColor: 'white'}}
                dataSource={this.state.dataSource}
                renderSectionHeader={this.renderSectionHeader}
                renderHeader={() => {
                  return(
                    <View>
                      <CloseBar
                        goBack={this.goBack}
                        color={'black'}
                        style={{flex: 0}}
                      />
                      <HeaderListExtraLarge
                         header={this.state.tracker_multivalArray ? this.state.tracker_multivalArray[0]._source.dictionaryName : 'List of values'}
                         description='Your previously recorded values'
                         style={{flex: 0, paddingBottom: 12, paddingTop: 0}}
                         headerStyle={{ backgroundColor: 'white' }}
                       />
                    </View>
                  )
                }}
                renderRow={(item, secId, rowId) => this._renderRow(item, secId, rowId)}
              //  renderSectionHeader={(sectionData, category) =>
                 // this._renderSections(sectionData, category)}
              />
           )
            : (null)
          )
      }
    </ModalBox>) : (null)}
      {(this.state.isLoading) ? (<ProgressBar/>) : (null)}
      </View>
    )
  }
}

function mapDispatchToActions (dispatch) {
  return {
    setJson: json => dispatch(setJson(json)),
    setList: list => dispatch(setList(list))
  }
}

const mapStateToProps = state => ({
  trackerJson: state.trackerJson,
  pinnedTrackers: state.pinnedTrackers
})

export default connect(mapStateToProps, mapDispatchToActions)(TrackerDetails)

const styles = StyleSheet.create({
  filter_style: {
    flex: 1,
    textAlign: 'center',
    paddingTop: 12,
    paddingBottom: 12
  },
  filter_unseleted_style_1: {
    backgroundColor: Color.white,
    height: 3,
    marginLeft: 12,
    marginRight: 12
  },
  filter_seleted_style_1: {
    backgroundColor: Color.tracker_vals,
    height: 3,
    marginLeft: 28,
    marginRight: 28
  },

  filter_unseleted_style: {
    flex: 1,
    backgroundColor: Color.white,
    height: 3,
    marginLeft: 12,
    marginRight: 12
  },
  filter_seleted_style: {
    backgroundColor: Color.tracker_vals,
    flex: 1,
    height: 3,
    marginLeft: 12,
    marginRight: 12
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  chart: {
    flex: 1
  },
  stats_header: {
   fontFamily: 'Arial',
   fontSize: 16,
   paddingLeft: 16,
   paddingTop: 16,
   fontWeight: '600',
   color: Color._4A
  },
  stats_value: {
   fontFamily: 'Arial',
   color: Color._4A,
   fontSize: 30
 },
  stats_unit:{
   fontFamily: 'Arial',
   paddingBottom: 4,
   paddingLeft: 4,
   fontSize: 14,
   color: Color._4A
 },
  stats_date:{
    fontFamily: 'Arial',
    textAlign: 'center',
    fontSize: 10,
    color: Color._4A
 }
});
