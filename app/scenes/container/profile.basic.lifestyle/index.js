import React, { Component } from 'react'
import { View, Text, Modal, TextInput, Picker ,ScrollView } from 'react-native'

import styles from './styles'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
import DialogHeader from '../../components/dialog.header'
// import ProgressBar from '../../components/progress.basic'

import { NetworkRequest, URLs, Color, Global, stringsSex, stringsDesignation, UserDefaults, stringsUserDefaults, LoginManager, CommonManager, CommonStyles, Routes } from '../../../utils'
import moment from 'moment'
import { HeaderListExtraLarge } from '../../layouts'
import { CloseBar } from '../../components'
import {ProgressBar, ModalBox} from '../../components'
import Ripple from '../../components/ripple'
import { isValidEmail } from '../../../utils/exts/strings'
import {Select, Option} from "react-native-chooser";
import DatePicker from '../../components/datepicker'
import Profile from '../profile.profile'
import PropTypes from 'prop-types';

export default class BasicProfileLifestyle extends Component {
  constructor(props){
    super(props)
    this.state= {
  
   }
  }



  render(){

  isDiabetic = ""
  if(this.props.state.diabeticIndex != undefined){
    if (this.props.state.diabeticIndex === ""){
      isDiabetic = ""
    }

    if (this.props.state.diabeticIndex === 0 ){
      isDiabetic = "No"

    }
    if (this.props.state.diabeticIndex === 1){
      isDiabetic = "Yes"
    }
  }
  
   
 
  isChronic = ""
  if(this.props.state.chronicIndex != undefined){
    if(this.props.state.chronicIndex === ""){
      isChronic = ""
    }

    if (this.props.state.chronicIndex === 0 ){
      isChronic = "No"

    }
    if (this.props.state.chronicIndex === 1){
      isChronic = "Yes"
    }
  }

  hasInsurance = ""
  if(this.props.state.insuranceIndex === ""){
    hasInsurance = ""
  }

  if(this.props.state.insuranceIndex === 0){
    hasInsurance = "No"
  }
  if(this.props.state.insuranceIndex === 1){
    hasInsurance = "Yes"
  }

    
    return(
      <View style = {{flex:1}}>
      <ScrollView style = {{flex:1}}>

      <Ripple

              onPress={() => {
                this.props.renderModal(14)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>Activeness Level</Text>
                  <Text style={styles.footerStyle}>
                  {(this.props.state.activenessLevel[0])? this.props.state.activenessLevel[0].value : ''}</Text>
              </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>
         

            <Ripple

              onPress={() => {
                this.props.renderModal(15)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>Stress Level</Text>
              <Text style={styles.footerStyle}>{(this.props.state.stressLevel[0])? this.props.state.stressLevel[0].value:''}</Text>
              </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>


            <Ripple

            onPress={() => {
              this.props.renderModal(16)
              }}
            >
            <View style={styles.innerContainerStyle}>
                <Text style={styles.headerStyle}>Insurance</Text>
                <Text style={styles.footerStyle}>
                {hasInsurance}</Text>
            </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>

            <Ripple
              onPress={() => {
                this.props.renderModal(6)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>Occupation</Text>
                  <Text style={styles.footerStyle}>{this.props.state.industryType}{this.props.state.occupation?' - '+this.props.state.occupation : (null)}</Text>
              </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>

            <Ripple style={styles.innerContainerStyle}
                    onPress={() => {
                    this.props.renderModal(7)
                    }}
            >
                <Text style={styles.headerStyle}>Diabetic</Text>
                <Text style={styles.footerStyle}>{isDiabetic}
                </Text>
            </Ripple>

            <View style={styles.separatorStyle}></View>

            <Ripple
              onPress={() => {
                this.props.renderModal(8)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>Chronic</Text>
                  <Text style={styles.footerStyle}>{isChronic}</Text>
              </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>

            <Ripple

              onPress={() => {
                this.props.renderModal(9)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>Smoker</Text>
                  <Text style={styles.footerStyle}>{this.props.state.isSmoker}</Text>
              </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>

            <Ripple

              onPress={() => {
                this.props.renderModal(10)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>Alcohol Consumption</Text>
                  <Text style={styles.footerStyle}>{this.props.state.consumesAlcohol}</Text>
              </View>
            </Ripple>

           
            <View style={styles.separatorStyle}></View>
            
            <Ripple

              onPress={() => {
                this.props.renderModal(11)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>Blood Group</Text>
                  <Text style={styles.footerStyle}>{this.props.state.bloodGroup}</Text>
              </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>

            <Ripple

              onPress={() => {
                this.props.renderModal(12)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>Height</Text>
                  <Text style={styles.footerStyle}>{this.props.state.heightInCm} cms </Text>
              </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>

            <Ripple

              onPress={() => {
                this.props.renderModal(12)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>Weight</Text>
                  <Text style={styles.footerStyle}> {this.props.state.weight} kg</Text>
              </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>
            

            <View style = {{height:50, flex:1}}/>
    </ScrollView>
      </View>    
    )

  }

}

BasicProfileLifestyle.propTypes = {
  var1: PropTypes.string
}

BasicProfileLifestyle.defaultProps = {
  var1: ''
}