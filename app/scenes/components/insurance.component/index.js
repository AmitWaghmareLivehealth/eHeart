import React, { Component} from 'react';

import { BackHandler, View, Text, TextInput, PermissionsAndroid, Alert, ActivityIndicator, StyleSheet, Slider, Image, Animated, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Routes, Color, Global, LocationManager, UserDefaults, stringsUserDefaults , URLs, Images, NetworkRequest} from '../../../utils'
import {SliderCustom, Indicator, ProgressBar, SearchBox, ModalBox, CloseBarAnimated,Segmented,} from '../../components'
//import Ripple from '../../components'
import { NavigationActions } from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import CheckBox from 'react-native-check-box'
import { HeaderListExtraLarge, StateRepresentation } from '../../layouts'

import PropTypes from 'prop-types';
import ListView from 'deprecated-react-native-listview';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var insurer = require('./insurers.json')
var cc = insurer.sort(function (_a, _b) {
  let aName = _a.name.trim().replace('+', '')
  let bName = _b.name.trim().replace('+', '')
  return (aName > bName) ? 1 : (bName > aName ? -1 : 0)
})


export default class InsuranceModal extends Component{

    constructor(props) {
      super(props);

      this.state = {
      isSearchedFlag : 0,
      dataSource: cc,
      dataSource2: [{"name":""}],
      insurer: '',
      searchedText:''
    }

    this._renderRow = this._renderRow.bind(this)
    this.customInsuranceName = this.customInsuranceName.bind(this)
  }

  searchInsurers(text){
    if(text){
      var tempArr = []
      cc.forEach(function(element) {
        console.log(element.name+":"+text)
        if (element.name.toLowerCase().includes(text.toLowerCase())){
          tempArr.push(element)
        }
      }, this);
      console.log(tempArr)

      if(tempArr.length>0){
        this.setState({
        searchedText:text,
        dataSource2 : ds.cloneWithRows(tempArr),
        isSearchedFlag : 1,
        isStateRepFlag: false
      })

    }else{
      this.setState({
        searchedText:text,
        dataSource2 : ds.cloneWithRows([]),
        isSearchedFlag : 1,
        isStateRepFlag: true
      })

      }


    } else {
      this.setState({
        searchedText:text,
        dataSource2 : ds.cloneWithRows([]),
        isSearchedFlag : 0,
        isStateRepFlag: false
      })
    }
  }

  customInsuranceName(){
  this.props.setInsuranceName(this.state.searchedText)
   this.props.closeModal()
  }

  selectedCell (cellData) {


   this.props.setInsuranceName(cellData.name)
   this.props.closeModal()
    // this.setState({insurer:cellData.name, show_modal:false})
     // Alert.alert('Selected', cellData.name)
    }

    _renderRow(item,secId,rowId){
      var finalElement = this.state.isSearchedFlag === 0
        ? (<View style = {{height:0}}/>
        ) : (

          <TouchableHighlight
                  onPress = {()=> this.selectedCell(item)}
                  underlayColor = '#aaaaaa'>
                  <View style={{flex: 1,flexDirection: 'row', height: 40, marginLeft: 16, marginRight: 16, alignItems: 'center', paddingTop:16,paddingBottom:16,}}>
                    <Text style={{ fontFamily: 'Arial' ,flex: 1}}>{item.name}</Text>
                    <View style={{position: 'absolute', left: -16, right: -16, bottom: 0, height: 0.7, backgroundColor: 'lightgrey'}}/>
                  </View>
                </TouchableHighlight>
        )

      return finalElement
    }


    render(){
      return(
      <View style = {{flex:1, backgroundColor:'white'}}>
      <HeaderListExtraLarge
     header={'Insurers'}
     description='Select your Insurance Carrier'
     style={{flex: 0}}
    ></HeaderListExtraLarge>

    <View style={{flex:1,}}>
    <View>
    <TextInput
    style={{marginLeft : 16, marginRight: 16, marginBottom: 0, height: 50,  marginTop: 0}}
    onChangeText={(text) => this.searchInsurers(text)}
    placeholder = 'Select Insurer'/>
   {(this.state.isSearchedFlag)?
   <TouchableOpacity onPress = {this.customInsuranceName}>
    <Text style ={{ marginLeft:16, color:Color.appointmentBlue, fontWeight:'bold'}}>Add {this.state.searchedText}</Text>
   </TouchableOpacity>
:(null)}
</View>

    { this.state.isSearchedFlag === 1
    ? <View>
    {
    (this.state.isStateRepFlag)
    ?
    (

     <StateRepresentation
     image='search'
     description= 'Could not find any insurance provider'></StateRepresentation>
    )
    :
    (
     <ListView
       bounces={false}
       enableEmptySections
       dataSource={this.state.dataSource2}
       renderRow={(item,secId,rowId) => this._renderRow(item,secId,rowId)}></ListView>
    )

    }
    </View> :
    <ListView
    bounces={false}
    style={{
     flex: 1, flexGrow: 1 }}
    dataSource = {ds.cloneWithRows(this.state.dataSource)}
    renderRow = {(rowData) => {
     return (
       <TouchableHighlight
         onPress = {()=> this.selectedCell(rowData)}
         underlayColor = '#aaaaaa'>
         <View style={{flex: 1,flexDirection: 'row', height: 40, marginLeft: 16, marginRight: 16, alignItems: 'center'}}>
           <Text style={{ fontFamily: 'Arial' ,flex: 1}}>{rowData.name}</Text>

           <View style={{position: 'absolute', left: -16, right: -16, bottom: 0, height: 0.7, backgroundColor: 'lightgrey'}}/>
         </View>
       </TouchableHighlight>
     )
    }}
    enableEmptySections = {true}>
    </ListView>
    }

    {
    (this.state.isStateRepFlag)
    ?
    (

     <StateRepresentation
     image='search'
     description= 'Could not find any insurance provider'></StateRepresentation>
    )
    :
    (null)
  }
    </View>
      </View>

  )
    }

}
