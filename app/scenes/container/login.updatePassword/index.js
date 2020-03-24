import React, { Component } from 'react'
import {
  Text,
  Image,
  View,
  Linking,
  WebView,
  TextInput,
  Alert
} from 'react-native'

import { NavigationActions } from 'react-navigation'

import {NetworkRequest, Global, Routes, Images, CommonManager,UserDefaults, stringsUserDefaults, URLs } from '../../../utils'
import { Button, ErrorText } from '../../components'
import { HeaderGetStartedSuperLarge } from '../../layouts'
import styles from './styles'

export default class UpdatePassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newPassword:'',
      confirmPassword:'',
      errorMessage:'',
      params: this.props.params,
      errorVisible:false
    }
   this.updatePassword = this.updatePassword.bind(this)
   this.validate = this.validate.bind(this)
  }

  validate(){

    if(this.state.newPassword.length < 8 || this.state.confirmPassword.length < 8){
      errorMsg = '*Password length must be atleast 8 characters'
    }

   else if (this.state.newPassword != this.state.confirmPassword){
      errorMsg = '*Passwords do not match'
    }

    else if (this.state.newPassword == this.state.confirmPassword){
     errorMsg='' 
     this.updatePassword()
    }

    this.setState({
      errorMessage:errorMsg,
      errorVisible:true
    })

  }

 updatePassword(){

  UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
    let params = 'userToken=' + (token || '')
    +'&new=' + (this.state.confirmPassword || '')
    +'&isOTP='+1


  NetworkRequest(this, 'POST', URLs.updatePasswordApp,params).then(result => {
      if(result.success){

        if((result.response.code || 0) === 200){

          const resetAction = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({
                routeName: Routes.tabbarNav
              })
            ]
          })
          this.props.navigation.dispatch(resetAction)

        } else {
         
          Alert.alert(
            'Failed',
            'Please try again',
            [
              {text: 'OK', onPress: () => {


              }},
            ]
          )

        } 
      }
    }).catch((error) => {
      
      console.error(error);
    })

  }).catch((error) => {


    console.error(error);
  })

 }


 
  render () {
   

    return (
      <View style={styles.container}>
        <HeaderGetStartedSuperLarge
            header={'Update Password'}
           //description={'set your password'}
            descriptionStyle={ { width: Global.screenWidth - 34 }}
          />
        <View style = {{  flexDirection:'column', paddingLeft:20, marginTop:0}}>
          <Text style={{fontFamily: 'Arial', color:'grey', paddingTop:20}}>New Password</Text>
            <TextInput
              secureTextEntry={true}
              onChangeText={(text) => {
                this.setState({
                  newPassword: text,
                  errorVisible:false
                })
                }}
                style={{height: 40, width:Global.screenWidth-50, marginTop:10}}
                />
                {(Global.iOSPlatform) ? (<View style={{height: 0.5, marginLeft: 0, marginRight: 20, marginTop: -8, marginBottom: 16,  backgroundColor: '#DFDFDF'}}/>) : (null)}
             </View>         

         <View style = {{  flexDirection:'column', paddingLeft:20, paddingRight:20,marginTop:10}}>
          <Text style={{fontFamily: 'Arial', color:'grey'}}>Confirm Password</Text>
            <TextInput
              secureTextEntry={true}
              onChangeText={(text) => {
                this.setState({
                  confirmPassword: text,
                  errorVisible:false
                })
                }}
                style={{height: 40, width:Global.screenWidth-50,marginTop:10}}
                />
                {(Global.iOSPlatform) ? (<View style={{height: 0.5, marginLeft: 0, marginRight: 20, marginTop: -8, marginBottom: 10,  backgroundColor: '#DFDFDF'}}/>) : (null)}
             </View>          

            <ErrorText
                style = {{alignSelf:'flex-start', textAlign:'left',  paddingLeft:25, marginTop:10}}
                message={this.state.errorMessage}
                invalidMessageVisible={this.state.errorVisible}
              />

                  

             <Button
          isDisabled = {this.state.isDisabled}
            onPress={this.validate}
            title={'Proceed'}
            style={styles.btnProceed}
          /> 

      </View>
    )
  }
}
