import React, { Component } from 'react'
import { View, Text, TextInput, ScrollView, Picker, KeyboardAvoidingView , Keyboard} from 'react-native'

import moment from 'moment'
import { connect } from 'react-redux'
import { URLs, Global, Color, UserDefaults, stringsUserDefaults, NetworkRequest, CommonStyles , UnitManager} from '../../../utils'
import {ProgressBar} from '../../components'
import {Ripple} from '../../components'
import DatePicker from '../../components/datepicker'
import {Select, Option} from "react-native-chooser";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { setJson } from '../../../redux/actions/trackerjson'
import { setList } from '../../../redux/actions/pinnedtrackers'

class TrackerAddition extends Component {
  constructor(props) {
    super(props);
    if(this.props.unitArray){
      unitString =  this.props.unitArray[0]
    }
    multiValues ={}
    let filledKey = {}

    if(this.props.isEditFlag === 1){
      this.props.unitArray.forEach((val) => {
        filledKey[val] = 1
      })

    } else {
      if(this.props.unitArray){
        this.props.unitArray.forEach((val) => {
          filledKey[val] = 0
        })
      }
    }

    var selected_unit = ''
    var notes = ''
    var emptyKey = 1
    if(this.props.isEditFlag === 0){
      try {
        if(this.props.indexArray.length === this.props.unitArray.length){
          var indexArray = this.props.indexArray
          for(var i = 0; i < indexArray.length ; i++){
            if(indexArray[i] === 0){
              selected_unit = this.props.unitArray[i]
              break
            }
          }
        } else {
          selected_unit = this.props.unitArray[0]
        }
      } catch(error) {
        selected_unit = this.props.unitArray[0]
        console.error(error);
      }
    } else {
      selected_unit = this.props.dialogUnit
      if(this.props.dialogNotes){
        notes = this.props.dialogNotes
      }
      if(this.props.dialogValue){
        emptyKey = 0
      }
    }

    this.state={
      value : '',
      date: '',
      notes: notes,
      unitString : unitString,
      dictionaryId: this.props.dictionaryId,
      unitArray : this.props.unitArray,
      isMultiValue: this.props.isMultiValue,
      indexArray :  this.props.indexArray,
      // isMultiValue: 1,
      multiValues: multiValues,
      reportDate: '',
      notesChanged:false,
      filledKey: filledKey,
      emptyKey : emptyKey,
      getData: this.props.getData,
      closeDialog: this.props.closeDialog,
      dialogValue: this.props.dialogValue,
      dialogUnit: this.props.dialogUnit,
      dialogDate: this.props.dialogDate,
      dialogNotes: this.props.dialogNotes,
      dialogReportId:this.props.dialogReportId,
      isEditFlag : this.props.isEditFlag,
      currentParameter: this.props.currentParameter,
      selected_unit : selected_unit,
      isLoading: false,
      loadData: this.props.loadData,
      modal_visible: false,
      isAddClicked: false,
      label:'',
      fav_color : this.props.fav_color,
      main_unit : this.props.main_unit,
      recentReportDate: this.props.recentReportDate,
      isfav: this.props.isfav,
      selected_date : (this.props.isEditFlag === 1) ? (moment(this.props.dialogDate).format("YYYY/M/DD, h:mm:ss a")) : (moment().format('YYYY/M/DD, h:mm:ss a')),
    }

    if(this.state.isEditFlag === 1){
      if(this.state.isMultiValue === 1){
        valueArray = this.state.dialogValue.split('/')
        for(i = 0 ; i < valueArray.length ; i++){
          this.state.multiValues[this.state.unitArray[i]] = valueArray[i]
        }
      } else {
        this.state.multiValues[this.state.selected_unit] = String(this.state.dialogValue)
      }
    }

    this.addValue = this.addValue.bind(this)
    this.getMultipleViews = this.getMultipleViews.bind(this)
    this.afterDataSaved = this.afterDataSaved.bind(this)
    this._populateUnits = this._populateUnits.bind(this)
    this.loadingManipulate = this.loadingManipulate.bind(this)
    this.set_modal_visible = this.set_modal_visible.bind(this)
    this.set_selectedDate = this.set_selectedDate.bind(this)
    this.networkcall = this.networkcall.bind(this)
    this.setValues = this.setValues.bind(this)
    this.setReduxVals = this.setReduxVals.bind(this)
  }

  componentWillMount () {
    Keyboard.dismiss()
  }

  componentDidMount(){
    setTimeout(() => {
      if(this.state.isMultiValue !== 1){
        this.refs.valInput.focus();
      }
    },500)
  }

  set_modal_visible(flag){
    this.setState({
      modal_visible: flag
    })
  }

  set_selectedDate(selected_date){
    this.setState({
      selected_date:moment(selected_date).format("YYYY/M/DD, h:mm:ss a")
    })
  }

  async addValue(){
    try {
    let jsonArray = []
    multivalues = this.state.multiValues;
    var main_unit = this.state.main_unit


    if(this.state.isMultiValue === 1){
      var isEmpty_count = 0;
      for(key in this.state.filledKey){
        if(this.state.filledKey[key] === 0){
          isEmpty_count++
          this.setState({
            isAddClicked: true
          })
        }
      }

      if(isEmpty_count > 0){
        return;
      }
    } else {
      if(this.state.emptyKey === 1){
        this.setState({
          isAddClicked: true
        })
        return;
      }
    }

    var indexArray = this.props.indexArray
    var unitArray = this.props.unitArray
    var value = ''
    var unit = ''
    var count = 0

    for(key in multivalues){
      if(this.state.isMultiValue === 1){
        if(count === 0){
          value = value + multivalues[key] + '/'
          unit = unit + key + '/'
          count++
        } else {
          value += multivalues[key]
          unit = unit + key
        }
      } else {
        if(indexArray.length > 1){
          if(key === 'cm' || key === 'ft' || key === 'inches' || key === 'inch'){
            value = UnitManager.height(key, main_unit, multivalues[key])
            unit = main_unit
          } else if (key === 'kg' || key === 'grams' || key === 'lbs'){
            value = UnitManager.weight(key, main_unit, multivalues[key])
            unit = main_unit
          } else if (key === 'kms' || key === 'meters' || key === 'miles'){
            value = UnitManager.distance(key, main_unit, multivalues[key])
            unit = main_unit
          } else if (key === 'C' || key === 'F'){
            value = UnitManager.temperature(key, main_unit, multivalues[key])
            unit = main_unit
          } else if (Number(this.state.dictionaryId) === 958 || Number(this.state.dictionaryId) === 959  || Number(this.state.dictionaryId) === 960 ){
            value = UnitManager.mgdltommolGlucose(key, main_unit, multivalues[key])
            unit = main_unit
          } else if (Number(this.state.dictionaryId) === 952 || Number(this.state.dictionaryId) === 953  || Number(this.state.dictionaryId) === 955 ){
            value = UnitManager.mgdltommol(key, main_unit, multivalues[key])
            unit = main_unit
          } else if (Number(this.state.dictionaryId) === 954){
            value = UnitManager.mgdltommolSerum(key, main_unit, multivalues[key])
            unit = main_unit
          } else if (Number(this.state.dictionaryId) === 956){
            value = UnitManager.mgdltommolVLDL(key, main_unit, multivalues[key])
            unit = main_unit
          } else {
            value = multivalues[key]
            unit = key
          }
        } else {
          value = multivalues[key]
          unit = key
        }
      }
    }

    this.loadingManipulate(true)
    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      var params =  'token=' + token
                  +'&dictionaryId='+ this.state.dictionaryId
                  +'&value='+ value
                  +'&unit='+ unit
                  +'&reportDate='+ (moment(this.state.selected_date).utc().format(Global.LTHDateFormatMoment) + 'Z')
                  +'&label='+ this.state.label

      if (this.state.isEditFlag == 1) {
          params += '&userReportId=' + this.state.dialogReportId
      }

      console.log('PARAMS', params);
      var _this = this
      NetworkRequest(_this, 'POST',URLs.saveTrackerData,params).then(result => {
        if(result.success){
          if((result.response.code || '') === 200) {
            this.loadingManipulate(false)
            this.afterDataSaved(value, unit)
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

  } catch (error) {
    this.loadingManipulate(false)
    console.error(error);
  }

  }

  afterDataSaved(value , unit){
    // this.props.loadData(false)
    if(this.props.getData){
      this.props.loadData(true)
      setTimeout(() => {
        this.props.getData(1)
      },50)
      this.setReduxVals(value , unit)
    } else {
      this.props.loadData(true)
      this.networkcall(value, unit)
    }
    setTimeout(() => {
      this.props.closeDialog()
    }, 300)
    // this.props.navigation.goBack()
  }

  networkcall(value, unit){
    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      let params = 'token=' + token
      var _this = this
      NetworkRequest(_this, 'POST', URLs.getTrackerData, params).then(result => {
        if (result.success){
          if ((result.response.code || 0) === 200){
            // this.loadingManipulate(false)
            this.setValues(result.response, result, value , unit)
            setTimeout(() => {
              this.props.loadData(false)
            },200)
          } else {
            // this.loadingManipulate(false)
            this.props.loadData(false)
          }
        } else {
          // this.loadingManipulate(false)
          this.props.loadData(false)
        }
      }).catch(error => {
        // this.loadingManipulate(false)
        this.props.loadData(false)
        console.error(error)
      })

    }).catch((error) => {
      // this.loadingManipulate(false)
      this.props.loadData(false)
      console.error(error);
    })
  }

  setValues(response, result, value, unit) {
    try {
      UserDefaults.set(stringsUserDefaults.trackerJson, result)
      UserDefaults.set(stringsUserDefaults.isTrackerUpdated, true)
      UserDefaults.set(stringsUserDefaults.reduxTracker, true)
      this.props.setJson(result)
      this.setReduxVals(value, unit)
    } catch(error){
      console.error(error);
    }
  }

  setReduxVals(value, unit){
    if(this.state.isfav === 1){
      UserDefaults.set(stringsUserDefaults.pinnedTracker, true)
      if(moment(this.state.recentReportDate).isBefore(moment(this.state.selected_date))){
        var pinnedTrackers = this.props.pinnedTrackers.pinnedTrackers
        for(var i = 0 ; i < pinnedTrackers.length ; i++){
          if (this.state.dictionaryId == pinnedTrackers[i].dictionaryId){
            pinnedTrackers.splice(i, 1)
            pinnedTrackers.push({
              highlightedValue:String(value),
              highlightedUnit: unit,
              highlightedDate: moment(this.state.selected_date).utc().format(Global.LTHDateFormatMoment) + 'Z',
              currentParameter: this.state.currentParameter,
              icon: '',
              dictionaryId: this.state.dictionaryId
            })
            this.props.setList(pinnedTrackers)
            break
          }
        }
      }
    }
  }

  getMultipleViews(isMultiValue){
    var row = []
    var valueArray = []
    if(this.state.isEditFlag === 1){
      valueArray = this.state.dialogValue.split('/')
    }
    filledKey = this.state.filledKey
    unitArray = this.state.unitArray

    if(this.state.isEditFlag === 1 ){
      valueArray = this.state.dialogValue.split('/')
    }
    var count = 0
    this.state.unitArray.forEach(val =>{
      row.push(
        <View key= {val} style={{flexDirection: 'column'}}>
          <View key= {val} style={{flexDirection: 'row', height: 50}}>
            <TextInput style={{height: 50}}
              autoFocus={(this.state.isMultiValue === 1) ? false : true}
              keyboardType = 'numeric'
            value={(this.state.isEditFlag === 1) ? ((this.state.filledKey[val] === 1) ? this.state.multiValues[val] : valueArray[count]) : ((this.state.filledKey[val] === 1) ? (this.state.multiValues[val]):(''))}
            maxLength = {7} numberOfLines ={1} style={{flex:1}} onChangeText={(text) => {
                if(text === ''){
                  filledKey[val] = 0
                  this.setState({
                    filledKey: filledKey
                  })
                } else {
                  filledKey[val] = 1
                  this.setState({
                    filledKey: filledKey
                  })
                  this.state.multiValues[val] = text
                }
              }
            }
            ></TextInput>
             {/* {(this.state.emptyKey === 1) ? (<Text style={{ fontFamily: 'Arial' ,fontSize: 20, color: 'red', marginLeft: -8}}>* </Text>):(<Text/>)} */}
             {(this.state.isAddClicked) ? (this.state.filledKey[val] === 0) ? (<Text style={{ fontFamily: 'Arial' ,fontSize: 20}}>* </Text>):(<Text/>) : (null)}
            <TextInput style={{height: 50}} editable={false} style={{flex:1.5}} value={val}></TextInput>
          </View>
        </View>
      )
      count++
    })
    return (<View>{row}</View>)
  }

  _populateUnits(){
    var row = []
    this.state.unitArray.forEach((val) => {
      row.push(
        <Option  key = {val} value = {{name : {val}}}>{val}</Option>
      )
    })

    return(
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
        {(row.length > 1 )
        ?
        (<Select
          onSelect = {(text) => {
            this.setState({
              selected_unit: text.name.val
            })

            for(key in this.state.multiValues){
              var val = this.state.multiValues[key]
              delete this.state.multiValues[key]
              this.state.multiValues[text.name.val] = val
              break
            }
          }}
          defaultText  = {(this.state.isEditFlag === 1) ? (this.state.dialogUnit) : (this.state.selected_unit)}
          style={{ borderWidth: 1.0, borderColor: 'white', backgroundColor: 'white', width: 80 }}
          transparent
          optionListStyle = {{backgroundColor : "#FFFFFF",  borderWidth: Global.isIphoneX? 1 : 0.5, borderColor: Color._DF, width: 200, marginTop:16}}
            >{row}
          </Select>) : (<Text style={{ fontFamily: 'Arial' , borderWidth: 1.0, borderColor: 'white', backgroundColor: 'white', width: 80 }}>{this.state.unitArray[0]}</Text>)}
        {(this.state.unitArray.length > 1 ) ?
        (<MaterialIcons
          name={'expand-more'}
          size={20}
          style={{color: Color._4A, position: 'absolute'}}
        />) : (null)}
      </View>
          )
  }

  loadingManipulate(flag){
    this.setState({
      isLoading: flag
    })
  }

  render(){
    return(
        <View style={{flexDirection:'column', backgroundColor:'white', borderRadius: 6}}>
            <View style={{paddingLeft: 24, paddingRight: 24 ,paddingTop: 28, paddingBottom: 12}}>
              <Text style={{ fontFamily: 'Arial' ,fontSize: 24, color:'black', fontWeight: '700', paddingBottom: 4}}>Add Value</Text>
              <Text style={{ fontFamily: 'Arial' ,fontSize: 12, paddingBottom : 12}}>Record a new value {(this.state.currentParameter) ?  'for '  + this.state.currentParameter : ''}</Text>
            {
              (this.state.isMultiValue === 1) ? (<View>{this.getMultipleViews(1)}</View>) :
              (
                  <View key= {this.state.unitArray[0]} style={{flexDirection: 'column'}}>
                    <View key= {this.state.unitArray[0]} style={{flexDirection: 'row'}}>
                      <TextInput style={{height: 50}}
                      placeholder = 'Enter value'
                        ref='valInput'
                        value={(this.state.isEditFlag === 1) ? ((this.state.emptyKey === 0 ) ? (this.state.multiValues[this.state.selected_unit]) : String(this.state.dialogValue)) : ((this.state.emptyKey === 0 ) ? (this.state.multiValues[this.state.selected_unit]) : (''))}
                       keyboardType = 'numeric'  maxLength = {7} numberOfLines ={1} style={{flex:1}} onChangeText={(text) => {
                          if(text === ''){
                            this.setState({
                              emptyKey: 1
                            })
                          } else {
                            this.setState({
                              emptyKey: 0
                            })
                            this.state.multiValues[this.state.selected_unit] = text
                          }
                        }
                      }
                      ></TextInput>
                      {/* <TextInput style={{height: 50}} style={{flex:1}}>{(this.state.isEditFlag === 1) ? (this.state.dialogUnit) : (this.state.unitArray[0])}</TextInput> */}
                      {(this.state.isAddClicked) ? (this.state.emptyKey === 1) ? (<Text style={{ fontFamily: 'Arial' ,fontSize: 20, color: Color._4A, paddingLeft: -8}}>* </Text>):(<Text/>) : (null)}
                      {(this.state.unitArray.length > 0) ? this._populateUnits() : (null)}
                    </View>
                </View>
              )
            }

              <Ripple
                onPress={() => {
                  this.set_modal_visible(true)
                }}
                style={{paddingBottom: 16}}>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingTop : 8, marginTop: 8, marginBottom: 8, marginRight: 8}}>
                  <Text
                    style={{color: Color.theme_blue, borderRadius: 4, flex: 1, fontSize: 16}}
                    >{moment(this.state.selected_date).format('Do MMM, YYYY')}</Text>
                    <Text style={{ fontFamily: 'Arial' ,color: Color._9F, fontSize: 14, fontWeight: '800'}}>EDIT</Text>
                </View>

              </Ripple>

                <TextInput
                  value={(this.state.isEditFlag === 1) ? ((this.state.notesChanged) ? (this.state.notes) : (this.state.dialogNotes)) : (this.state.notes)}
                  placeholder="Enter notes (optional)"
                  style={{height: 50}}
                  onChangeText={(text) => {
                    if(text === ''){
                      this.setState({
                        notes: text,
                        notesChanged: false
                      })
                    } else {
                      this.setState({
                        notes: text,
                        notesChanged: true
                      })
                    }
                  }}></TextInput>

            </View>

              <View style={{flexDirection: 'row', paddingRight: 16}}>

                <Ripple
                  onPress={() => {
                    setTimeout(() => {
                      this.props.closeDialog()
                    }, 50)
                  }}>
                  <Text style={[CommonStyles.button_style,{padding: 16, marginLeft: 16, marginBottom: 12}]}>CLOSE</Text>
                </Ripple>

                <Text style={{ fontFamily: 'Arial' ,flex:1}}></Text>

                <Ripple

                  onPress={() => {
                    this.addValue()
                  }}>
                  <Text style={[CommonStyles.button_style ,{padding: 16, color: Color.theme_blue, marginBottom: 12}]}>{(this.state.isEditFlag === 1) ? ('UPDATE') : ('ADD')}</Text>
                </Ripple>
                {(this.state.isLoading) ? (<ProgressBar/>) : (null)}
                {(this.state.modal_visible) ? (<DatePicker
                                                dialog_visible={this.set_modal_visible}
                                                setTime={this.set_selectedDate}/>) : (null)}
              </View>
        </View>
    )
  }
}

  function mapDispatchToActions (dispatch) {
    return {
        setJson: json => dispatch(setJson(json)),
        setList: list => dispatch(setList(list))
        // setUpdated: flag => dispatch(setUpdated(flag)),
    }
  }

  const mapStateToProps = state => ({
    trackerJson: state.trackerJson,
    pinnedTrackers: state.pinnedTrackers
    // trackerUpdated: state.trackerUpdated,
  })

  export default connect(mapStateToProps, mapDispatchToActions)(TrackerAddition)


  
