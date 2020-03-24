import React, { Component } from 'react'
import { View, Text, Modal, TextInput, Picker ,ScrollView } from 'react-native'

import styles from './styles'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
import DialogHeader from '../../components/dialog.header'
// import ProgressBar from '../../components/progress.basic'

import { NetworkRequest, URLs, Color, Global, stringsSex, stringsDesignation, UserDefaults, stringsUserDefaults, LoginManager, CommonManager, CommonStyles, Routes } from '../../../utils'
import moment from 'moment'
import { HeaderListExtraLarge } from '../../layouts'
import {ProgressBar, ModalBox, CloseBar} from '../../components'
import Ripple from '../../components/ripple'
import { isValidEmail } from '../../../utils/exts/strings'
import {Select, Option} from "react-native-chooser";
import DatePicker from '../../components/datepicker'
import Profile from '../profile.profile'
import PropTypes from 'prop-types';

export default class BasicProfilePersonal extends Component {
  constructor(props){
    super(props)
    this.state= {
      flag: 0,
      modal_visible_new: false,
      designation: stringsDesignation.Mr,
      user: this.props.user || '',
      userName: this.props.userName,
      userName_edit: '',
      email: '',
      email_edit: '',
      gender: '',
      dob: '',
      city: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      contact: '',
      profilepic: '',
      oldPassword_error: '',
      image: '',
      newPassword_error: '',
      confirmPassword_error: '',
      tempPassword: 0,
      changesMade : 0,
      renewData: this.props.renewData,
      genderArray: [
        { label: stringsSex.Male, value: 0 },
        { label: stringsSex.Female, value: 1 },
        { label: stringsSex.Other, value: 2 }
      ],
      isLoading : false,
      date_visible: false,
      bloodgroup:'add',
  
    }
 //   this._renderModal = this._renderModal.bind(this)
  //  this.updateProfile = this.updateProfile.bind(this)
 //   this.goback = this.goback.bind(this)
 //   this.loadingManipulate = this.loadingManipulate.bind(this)
 //   this.set_modal_visible = this.set_modal_visible.bind(this)
  //  this.set_selectedDate = this.set_selectedDate.bind(this)
  //  this.onClose = this.onClose.bind(this)
  //  this.onOpen = this.onOpen.bind(this)
  //  this.onClosingState = this.onClosingState.bind(this)
  //  this.updateBloodgroup = this.updateBloodgroup.bind(this)
  }
  
//this._renderModal(2)
  render(){

    return(
      <View style = {{flex:1}}>
      <ScrollView style = {{flex:1}}>

    <Ripple
              onPress={() => {
               this.props.renderModal(1)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>Name</Text>
                  <Text style={styles.footerStyle}>{this.props.state.userName}</Text>
              </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>

            <View style={styles.innerContainerStyle}>
                <Text style={styles.headerStyle}>Contact</Text>
                <Text style={{paddingLeft: 8, color: Color._54}}>{this.props.state.contact}</Text>
            </View>

            <View style={styles.separatorStyle}></View>

            <Ripple

              onPress={() => {
                this.props.renderModal(2)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>Email</Text>
                  <Text style={styles.footerStyle}>{this.props.state.email}</Text>
              </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>

            <Ripple

              onPress={() => {
               this.props.renderModal(3)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>Password</Text>
                  <Text style={styles.footerStyle}>************</Text>
              </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>

            <Ripple

              onPress={() => {
               this.props.renderModal(4)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>DOB</Text>
                  <Text style={styles.footerStyle}>{this.props.state.dob}</Text>
              </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>

            <Ripple

              onPress={() => {
                this.props.renderModal(5)
                }}
              >
              <View style={styles.innerContainerStyle}>
                  <Text style={styles.headerStyle}>Gender</Text>
                  <Text style={styles.footerStyle}>{this.props.state.gender}</Text>
              </View>
            </Ripple>

            <View style={styles.separatorStyle}></View>

            <View style = {{height:50, flex:1}}/>
    </ScrollView>
      </View>  
    )

  }

}

BasicProfilePersonal.propTypes = {
  var1: PropTypes.string
}

BasicProfilePersonal.defaultProps = {
  var1: ''
}