import React, { Component } from 'react';
import { Alert, View, Text, TextInput, Image, Animated, Keyboard, KeyboardAvoidingView } from 'react-native';
import styles, { imageHeight, imageWidth, imageHeightSmall } from './styles';
import { connect } from 'react-redux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import {Ripple} from '../../components'
import { TextFieldNumber, Button, Separator, ErrorText, ProgressBar } from '../../components'
import { HeaderGetStartedSuperLarge } from '../../layouts'
import { Routes, stringsAlert, LoginManager, Images, CommonStyles, Global, Color } from '../../../utils'
import {setUnreadFlag, setDemographics} from '../../../redux/actions/index'
import DeviceInfo from 'react-native-device-info';
import PropTypes from 'prop-types';
import NetInfo from "@react-native-community/netinfo";


var countryCode = require('./../../../utils/json.sources/CountryCodes.json')
var cc = countryCode.sort(function (_a, _b) {
  let aName = _a.name.trim().replace('+', '')
  let bName = _b.name.trim().replace('+', '')
  return (aName > bName) ? 1 : (bName > aName ? -1 : 0)
})

 class LoginScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contryName: 'India',
      code: '+91',
      mobileNumber: '',
      isDisabled:false,
      isLoading:false
    }
    this.imageHeight = new Animated.Value(imageHeight);

    this.verifyMobileNumber = this.verifyMobileNumber.bind(this)
    this.selectCountryCodes = this.selectCountryCodes.bind(this)
    this.countryCodeChange = this.countryCodeChange.bind(this)
    this.checkInternet = this.checkInternet.bind(this)
    this.getCountryCode = this.getCountryCode.bind(this)
  }

  componentWillMount () {
    this.props.setDemographics({show:1})
    this.props.setUnreadFlag(0)
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  getCountryCode(deviceCountry){

    let code = '+91'
    cc = countryCode.filter(function (obj){ if (obj.countryCode == deviceCountry){ return obj} })

    if(cc.length > 0){
      code = cc[0].code
    }
    return code
  }

  componentWillUnmount () {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  componentDidMount () {
    

    // const deviceCountry = DeviceInfo.getDeviceCountry();  
  //  const loc =  DeviceInfo.getDeviceLocale
   


  //   CarrierInfo.isoCountryCode()
  // .then((result) => {
  // code = this.getCountryCode(result.toUpperCase());

  // this.setState({ 
  //   mobileNumber: '',
  //   code: code
  // })

  // });
 
  
  }

  countryCodeChange (conName, conCode) {
    this.setState({
      contryName: conName,
      code: conCode
    })
  }

  checkInternet(){
    NetInfo.isConnected.fetch().then(isConnected => {
      (isConnected ? this.verifyMobileNumber() : 
       Alert.alert('No Internet', 'There is no internet connection')
      )
    });
  }

   getMoviesFromApiAsync =()=> {
    return fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('REPSONE',  JSON.stringify(responseJson))
        return responseJson.movies;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  verifyMobileNumber () {

    this.setState({isDisabled:true, isLoading:true})
    this.refs.btnLogin.isLoading = true
    var mobileNumber = this.state.mobileNumber.trim()
    if (mobileNumber.length > 6) {
      let countrycode = this.state.code.trim().replace(/\D/g, '')
      LoginManager.requestOTPToVerifyMobile(this.state.mobileNumber.trim(), countrycode)
      .then((result) => {
        this.refs.btnLogin.isLoading = false
        var params = {
          mobile: mobileNumber,
          countryCode: countrycode,
          isUserExist: true,
          isFromLogin: true,
          isFromForgotPass: false,
          invalidMessageVisible: false
        }
        console.log('====================================');
        console.log(result);
        console.log('====================================');
        if (result.success) {
          this.setState({isDisabled:false, isLoading:false})
          // Default code=200 = Login Success
          if (result.response.code === 404) {
            params.isUserExist = false
            // Number does not exist, new signup
          }
          // params.isUserExist = false // Test
          this.goToVerifyOTP(params)
        }
        else{

          this.setState({isLoading:false})

          Alert.alert(
            'Something went wrong',
            this.state.mobileNumber.trim()+' : '+countrycode+'Please try again later'+JSON.stringify(result),
            [
              {text: 'ok', onPress: () => this.setState({isDisabled:false, isLoading:false})},
            ],
            { cancelable: false }
          )

        //   setTimeout(()=>{
        //   this.setState({isDisabled:false, isLoading:false})
        // }, 500)

        }
      }) // then
    } else {
      this.setState({ invalidMessageVisible: true, isDisabled:false, isLoading:false })
    }
  }

  goToVerifyOTP (params) {
    this.props.navigation.navigate(
      Routes.loginVerifyOTPScreen,
      params
      // NavigationActions.navigate(Routes.tabbarNav, { ...params })
    )
  }

  goToChangeTempPass (params) {
    this.props.navigation.navigate(
      Routes.loginSignupPasswordScreen,
      params
      // NavigationActions.navigate(Routes.tabbarNav, { ...params })
    )
  }

  selectCountryCodes () {
    const { navigate } = this.props.navigation
    navigate(Routes.loginCountryCodeScreen, {
      countryCodeChange: this.countryCodeChange,
      contryName: this.state.contryName,
      code: this.state.code
    })
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: imageHeightSmall
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: imageHeight
    }).start();
  };

  render () {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding">
          <Animated.Image
          source={Images.imageLivehealthLogoWithTag} style={[styles.logo, { height: this.imageHeight }]} />
          <HeaderGetStartedSuperLarge
            header='Get Started'
            description='Enter your number to get started'
            headerStyle={{ textAlign: 'center' }}
            descriptionStyle={{ textAlign: 'center' }}
            style={{ alignItems: 'center', paddingTop: 0, paddingBottom: 0, marginTop: 60 }}
          />
          <View style={[styles.textFieldContainer]}>
            <Text style={[CommonStyles.textHeader3, { marginRight: 7 }]}>{this.state.code}</Text>
            <TextFieldNumber
              focusOnComponentMount={false}
              placeholder='Registered mobile number'
              value={this.state.mobileNumber}
              onChangeText={textMobile => this.setState({mobileNumber: textMobile, invalidMessageVisible: false})}
              keyboardType='numeric'
              returnKeyType='go'
              height={50}
              style={{ flex: 0.75, marginTop: 1 }}
              onSubmitEditing={this.checkInternet}
            />
            <MaterialIcons
              name={'error-outline'}
              backgroundColor={'#FFFFFFFF'}
              color={this.state.invalidMessageVisible ? Color.redExit : 'white'}
              underlayColor='#FFF'
              size={20}
              style={{
                padding: 5,
                alignItems: 'flex-end'
              }}
            />
          </View>
          <Separator style={{ height: 1, width: Global.screenWidth * 0.9, alignSelf: 'center' }} />
          <Ripple
            onPress={this.selectCountryCodes}
            activeOpacity={1.0}
            style={{ width: Global.screenWidth * 0.8, alignSelf: 'center', marginTop: 5,padding:8 }}
          >
            <Text style={[CommonStyles.textSecAction, styles.textChangeCountryCode]}>
              Change country code
            </Text>
          </Ripple>
          <ErrorText
            message={stringsAlert.mobileLength.message}
            invalidMessageVisible={this.state.invalidMessageVisible}
          />
          <Button
            isDisabled = {this.state.isDisabled}
            ref='btnLogin'
            onPress={
              ()=>{this.verifyMobileNumber()}
              // this.checkInternet
            }
            title='Proceed'
            style={[styles.btnProceed, { alignSelf: 'center' }]}
          />
      {(this.state.isLoading) ? (<ProgressBar/>) : (null)}

      </KeyboardAvoidingView>

      
    );
  }
};

/*
import React, { Component } from 'react'
import {
  Text,
  Image,
  View,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native'

export default class LoginScreen extends Component {


  render () {
    return (
      <View style={styles.container} behavior='padding'>
        <Image
          style={[styles.imageContainer, { width: imageWidth, height: imageHeight }]}
          source={Images.imageLivehealthLogoWithTag} />
        <KeyboardAvoidingView style={styles.buttonContainer} behavior='padding'>



        </KeyboardAvoidingView>
      </View>
    )
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.object
}

LoginScreen.defaultProps = { }
*/

function mapDispatchToActions (dispatch) {
  return {
    
    setDemographics : arr => dispatch(setDemographics(arr)),
    setUnreadFlag: num => dispatch(setUnreadFlag(num)),

  }
}

const mapStateToProps = state => ({
  demographics: state.demographics,
})

export default connect(mapStateToProps, mapDispatchToActions)(LoginScreen)
