import React, { Component } from 'react'
import { View, Text, Modal, Alert } from 'react-native'
import moment from 'moment'
import PropTypes from 'prop-types'
import Picker from 'react-native-wheel-picker'
var PickerItem = Picker.Item;
import {Ripple} from '../../components'
import {Global, Color, CommonStyles} from '../../../utils'
import DialogHeader from '../../components/dialog.header'


export default class DatePicker extends Component {

  static propTypes = {
    isSkipButtonVisible: PropTypes.bool
  }

  static defaultProps = {
    isSkipButtonVisible: true
  }


  constructor(props) {
    super(props);

    var yearList = this.datesFunction("years", "YYYY", 100)
    var monthList = this.datesFunction("months", "MMMM", 12)
    var dayList = this.datesFunction("days", "DD", moment().daysInMonth())

    this.state={


      selectedYear: 99,
      selectedMonth: moment().format("M") - 1,
      selectedDay: moment().format("DD") - 1,
      selected_year: moment().format('YYYY'),
      selected_month: moment().format('MM'),
      selected_day: moment().format('DD'),
      yearList: yearList,
      monthList: monthList,
      dayList: dayList,
      openYear: false,
      dialog_visible: this.props.dialog_visible,
      setTime: this.props.setTime,
      setValue:this.props.setValue,
      single_picker:this.props.singlePicker,
      type:this.props.type,
      pickerHeader: this.props.pickerHeader,
      pickerData: this.props.pickerData,
      selectedBloodgroup:'A+',
      selectedIndustry:'',
    }
    this.datesFunction = this.datesFunction.bind(this)
    this.onPickerSelect = this.onPickerSelect.bind(this)
  }

// not_initial_flag for marking non initial calls
  datesFunction(param, type, count, not_initial_flag, index ,flag){
    var list = []

    for(i = count-1 ; i >= 0 ; i--){
      var startdate = ''
      if(param === "months"){
        startdate = moment().month("December");
      } else if(param === "days"){
        if(not_initial_flag){
          var yearList = this.state.yearList
          var monthList = this.state.monthList
          var dayList = this.state.dayList
          var selected_year = yearList[this.state.selectedYear]
          var selected_month = moment().month(monthList[this.state.selectedMonth]).format("M")
          var selected_day = dayList[this.state.selectedDay]

          if(flag === 1){
            selected_year = yearList[index]
          } else if(flag === 2){
            selected_month = moment().month(monthList[index]).format("M")
          } else if(flag === 3){
            selected_day = dayList[index]
          }
          console.log('SELECTED YEAR', selected_year);
          console.log('SELECTED MONTH', selected_month);
          startdate = moment([selected_year, (selected_month - 1)]).endOf('month');
        } else {
          startdate = moment([moment().format('YYYY'), (moment().format('M')-1)]).endOf('month');
        }
        console.log('DAY',startdate);
      } else {
        startdate = moment();
      }
      startdate = startdate.subtract(i, param);
      startdate = startdate.format(type);
      list.push(startdate)
    }

    if(not_initial_flag){
      if(flag === 1){
        this.setState({
          dayList: list,
          selectedYear: index
        })
      } else if(flag === 2){
        this.setState({
          dayList: list,
          selectedMonth: index
        })
      } else if(flag === 3){
        this.setState({
          dayList: list,
          selectedDay: index
        })
      }
    }
    return list;
  }

  // if flag: 1 : For year
  // if flag: 2 : For month
  // if flag: 3 : For day
  // if flag: 4 : For Industry
  // if flag: 5 : For BloodGroup

  onPickerSelect(index, flag) {



    var yearList = this.state.yearList
    var monthList = this.state.monthList
    var dayList = this.state.dayList
    var selected_year = yearList[this.state.selectedYear]
    var selected_month = moment().month(monthList[this.state.selectedMonth]).format("M")
    var selected_day = dayList[this.state.selectedDay]
    var param = ''
    if(flag === 1){
      selected_year = yearList[index]
      param = "years"
    } else if(flag === 2){
      selected_month = moment().month(monthList[index]).format("M")
      param = "months"
    } else if(flag === 3){
      selected_day = dayList[index]
      param = "days"
    }

    else if( flag === 4 ){
    if (this.state.type==1){
      if (index != 0){

      selectedIndustry = this.state.pickerData[index]
      this.state.setValue(selectedIndustry, 1)
    }

      this.setState({
       selectedIndustry:index
      })

     }
     else if (this.state.type==2){
      if (index != 0){
        selectedBloodgroup = this.state.pickerData[index]

        this.state.setValue(selectedBloodgroup, 2)
      }
        this.setState({
        selectedBloodgroup:index
      })

     }
    }

    // else if ( flag === 5){
    //   selectedBloodgroup = this.state.pickerData[index]

    //   this.state.setValue(selectedBloodgroup)

    //   this.setState({
    //     selectedBloodgroup:index
    //   })
    // }



    if(flag !== 3){
      var days_in_month = moment(selected_year + '-'  + selected_month , "YYYY-MM").daysInMonth()
      this.datesFunction("days", "DD", days_in_month, true, index, flag)
    } else {
      this.setState({
        selectedDay: index
      })
    }

  }


  render(){
    return(
      <Modal
         animationType={'none'}
         transparent={true}
         visible={true}
         onRequestClose = {() => {
           this.state.dialog_visible(false)
         }}
         >

      <View style={{flex: 1,backgroundColor: '#00000080', justifyContent: 'center'}}>

   {!this.props.singlePicker ?(

          (this.state.openYear)
        ?
        (
          <View
            style={[{height: Global.screenHeight * 0.47 ,borderRadius: 6, elevation: 6,backgroundColor: 'white', margin:35 }, CommonStyles.commonShadow]}>
            <Picker
              style={{flex: 1}}
              selectedValue={this.state.selectedYear}
              itemStyle={{color: Color.datePicker, fontSize:24 ,fontWeight: '800',paddingTop:16,paddingBottom:16}}
              onValueChange={(index) => this.onPickerSelect(index,1)}
              >
                  {this.state.yearList.map((value, i) => (
                    <PickerItem label={value} value={i} key={value} onValueChange={(value) => this.setState({ selected_year: value })
                    }></PickerItem>
                  ))}
            </Picker>

            <View style={{backgroundColor: Color._DF, height: 0.5, marginRight:16, marginLeft:16}}></View>

            <View style={{flexDirection: 'row'}}>
              <Ripple
                style={{padding: 16, flex: 1}}
                onPress={() => this.setState({ openYear: false })}
              >
                <Text style={{ fontFamily: 'Arial' ,textAlign: 'right',paddingRight: 16, fontSize: 15, color: Color.datePicker}}>OK</Text>
              </Ripple>
            </View>
          </View>
        )
        :
        (
          <View
            style={[{height: Global.screenHeight * 0.6 ,borderRadius: 6, elevation: 6,backgroundColor: 'white', margin:35}, CommonStyles.commonShadow]}>
            <Ripple
              onPress={() => this.setState({ openYear: true })
              }>
              <Text style={{ fontFamily: 'Arial' ,fontSize: 32, fontWeight: '800' , color: Color.datePicker, textAlign: 'center', padding: 16 }}>{this.state.yearList[this.state.selectedYear]}</Text>
            </Ripple>

            <View style={{backgroundColor: Color._DF, height: 0.5, marginRight:16, marginLeft:16}}></View>

            <View
              style={{flex: 2.5, flexDirection: 'row'}}>
              <Picker
                style={{flex: 1}}
                selectedValue={this.state.selectedDay}
                itemStyle={{color: Color.datePicker, fontSize:24 ,fontWeight: '800',paddingTop:16,paddingBottom:16}}
                onValueChange={(index) => this.onPickerSelect(index, 3)}
                >
                {this.state.dayList.map((value, i) => (
                  <PickerItem label={value} value={i} key={value} onValueChange={(value) => this.setState({ selected_day: value })
                  } />
                ))}
              </Picker>

              <Picker
                style={{flex: 2}}
                selectedValue={this.state.selectedMonth}
                itemStyle={{color: Color.datePicker, fontSize:22,paddingTop: 16, paddingBottom: 16, alignItems: 'flex-start', justifyContent: 'flex-start', textAlign: 'left'}}
                onValueChange={(index) => this.onPickerSelect(index, 2)}
                >
                {this.state.monthList.map((value, i) => (
                  <PickerItem label={value} value={i} key={value} onValueChange={(value) => this.setState({ selected_month: value })
                  }/>
                ))}
              </Picker>
            </View>

            <View style={{backgroundColor: Color._DF, height: 0.5, marginRight:16, marginLeft:16}}></View>

            <View style={{flexDirection: 'row',paddingTop:4,paddingBottom:4}}>
              {this.props.isSkipButtonVisible && <Ripple
                style={{padding:16, flex: 1}}
                onPress={() => {
                  this.state.dialog_visible(false)
                }}>
                <Text style={[{ fontFamily: 'Arial' ,textAlign: 'center', fontSize: 15}, CommonStyles.button_style]}>SKIP</Text>
              </Ripple>
              }

              <Ripple
                style={{padding:16, flex: 1}}
                onPress={() => {
                  var date = this.state.yearList[this.state.selectedYear] +'/' +  (this.state.selectedMonth + 1)  +'/' +  (this.state.selectedDay + 1)
                  var check = moment(date).isAfter(moment());
                  if(!check){
                    this.state.setTime(date)
                    this.state.dialog_visible(false)
                  } else {
                    Alert.alert(
                         'Invalid Date',
                         'Please select a date which is not greater than today',
                        [
                          {text: 'Ok', onPress: () => {}}
                        ],
                        { cancelable: true }
                      )
                  }
                }}>
                <Text style={[{ fontFamily: 'Arial' ,textAlign: 'center', fontSize: 15, color: Color.datePicker}, CommonStyles.button_style]}>CONFIRM</Text>
              </Ripple>

            </View>
          </View>
        )
      ):
      //CUSTOM PICKER
      <View
      style={[{height: Global.screenHeight * 0.47 ,borderRadius: 6, elevation: 6,backgroundColor: 'white', margin:35 }, CommonStyles.commonShadow]}>
      <DialogHeader
          style={{paddingLeft:20, paddingTop:10}}
          title={this.state.pickerHeader}/>

      <Picker
                style={{flex: 1}}
                selectedValue={(this.state.type==1)?this.state.selectedIndustry: this.state.selectedBloodgroup}
                itemStyle={{color: Color.datePicker, fontSize:22,paddingTop: 16, paddingBottom: 16, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}
               onValueChange={(index) => this.onPickerSelect(index, 4)}
               >


           {this.state.pickerData.map((item, index) => {
             return (<PickerItem label={item} value={index} key={index}/>)
                            })}

             {/* <PickerItem
             label = {'Test'}
             value = {1}
             key = {1}
             />
             <PickerItem
             label = {'Test2'}
             value = {1}
             /> */}


              </Picker>


              <View style={{flexDirection: 'row'}}>
              <Ripple
                style={{padding: 16, flex: 1}}
                onPress={() => {
                  this.state.dialog_visible(false)
                }}
              >
                <Text style={{ fontWeight:'500', fontFamily: 'Arial' ,textAlign: 'right',paddingRight: 16, fontSize: 15, color: Color.appointmentBlue}}>CONFIRM</Text>
              </Ripple>
            </View>

      </View>
      }
    </View>
    </Modal>
    )
  }

}
