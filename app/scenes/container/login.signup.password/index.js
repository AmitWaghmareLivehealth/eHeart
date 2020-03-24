import React, { Component } from 'react'
import { View } from 'react-native'

import { Button, TextField, ErrorText } from '../../components'
import { NavigationActions } from 'react-navigation'
import { Routes, stringsAlert, LoginManager, CommonManager, Color } from '../../../utils'
import { HeaderGetStartedSuperLarge } from '../../../scenes/layouts'
import styles from '../login.signup.name/styles'
import PropTypes from 'prop-types';

export default class LoginSignupPasswordScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pass: '',
      pass2: '',
      invalidMessageVisible: false,
      passDontMatch: false
    }
    this.goToDashboard = this.goToDashboard.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this._signup = this._signup.bind(this)
    this._resetPass = this._resetPass.bind(this)
  }

  onChangeText (pass, isPassOne) {
    let pass1 = isPassOne ? pass : this.state.pass
    let pass2 = isPassOne ? this.state.pass2 : pass

    let cond1 = (pass1 === pass2)
    let cond2 = (pass1.length > 7) && (pass2.length > 7)

    this.setState({ pass: pass1, pass2: pass2, invalidMessageVisible: (cond2 && !cond1), passDontMatch: !cond2, btnSignUpEnabled: (cond1 && cond2) })
  }

  _signup () {
    let pass1 = this.state.pass
    let pass2 = this.state.pass2

    let cond1 = (pass1 === pass2)
    let cond2 = (pass1.length > 7) && (pass2.length > 7)

    if (cond1 && cond2) {
      var params = {
        pass: this.state.pass,
        sex: this.props.navigation.state.params.sex,
        bdate: this.props.navigation.state.params.bdate,
        email: this.props.navigation.state.params.email,
        name: this.props.navigation.state.params.name,
        mobile: this.props.navigation.state.params.mobile,
        countryCode: this.props.navigation.state.params.countryCode || 91,
        age: this.props.navigation.state.params.age || 0,
        designation: this.props.navigation.state.params.designation || ''
      }

      var _this = this
      LoginManager.signup(params, _this)
      .then((result) => {
        if (result.success) {
          this.goToDashboard({
            designation: params.designation,
            name: params.name
          })
        }
      }).catch(CommonManager.handleError)
    } else {
      this.setState({ invalidMessageVisible: true, passDontMatch: !cond1 && cond2 })
    }
  }

  _resetPass () {
    var params = {
      pass: this.state.pass,
      otp: this.props.navigation.state.params.otp,
      mobile: this.props.navigation.state.params.mobile,
      countryCode: this.props.navigation.state.params.countryCode
    }

    var _this = this
    LoginManager.resetForgotPass(params, _this)
    .then((result) => {
      if (result.success) {
        this.goToDashboard()
      }
    }).catch(CommonManager.handleError)
  }

  _changeTempPass () {
    var params = {
      newPass: this.state.pass
    }

    var _this = this
    LoginManager.changeTempPass(params, false, _this)
    .then((result) => {
      if (result.success) {
        this.goToDashboard()
      }
    }).catch(CommonManager.handleError)
  }

  goToDashboard (params) {
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
    // this.props.navigation.navigate(Routes.tabbarNav, params)
  }

  render () {
    var isFromForgotPass = false // this.props.navigation.state.params.isFromForgotPass || false
    var isFromChangeTempPass = false // this.props.navigation.state.params.isFromChangeTempPass || false

    return (
      <View style={styles.containerMain} >
        <View style={{ flex: 0, flexGrow: 2 }}>
          <HeaderGetStartedSuperLarge
            header={(isFromForgotPass || isFromChangeTempPass) ? 'New Password' : 'Password'}
            description={(isFromChangeTempPass) ? 'Set new' : 'Enter' + ' password with at least eight(8) characters'}
          />
          <TextField
            secureTextEntry
            value={this.state.name}
            height={50}
            placeholder='Enter password'
            onChangeText={(value) => this.onChangeText(value, true)}
            onSubmitEditing={this.goToEmail}
            style={{ marginBottom: 5 }}
          />
          <TextField
            focusOnComponentMount={false}
            secureTextEntry
            value={this.state.name}
            height={50}
            placeholder='Confirm password'
            onChangeText={(value) => this.onChangeText(value, false)}
            onSubmitEditing={this.goToEmail}
            style={{ marginBottom: 5 }}
          />
          <ErrorText
            message={this.state.passDontMatch
            ? stringsAlert.invalidPasswordLength.message : stringsAlert.invalidPasswordMismatch.message
            }
            nonErrorColor={this.state.passDontMatch ? Color._A2GrayCountryCode : 'white'}
            invalidMessageVisible={this.state.invalidMessageVisible}
          />
        </View>
        <View style={styles.containerSub2}>
          <Button
            style={styles.btnProceed}
            onPress={isFromForgotPass ? this._resetPass : isFromChangeTempPass ? this._signup : this._signup}
            title={isFromForgotPass ? 'Reset Password' : isFromChangeTempPass ? 'Set New Password' : 'Sign Up'}
            isDisabled={!this.state.btnSignUpEnabled}
        />
        </View>
      </View>
    )
  }
}

LoginSignupPasswordScreen.propTypes = {
  mobile: PropTypes.string,
  countryCode: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  sex: PropTypes.string,
  bdate: PropTypes.string,
  age: PropTypes.string,
  designation: PropTypes.string,
  otp: PropTypes.number,
  isFromForgotPass: PropTypes.bool,
  navigation: PropTypes.object
}

LoginSignupPasswordScreen.defaultProps = {
  mobile: '',
  countryCode: '',
  name: '',
  email: '',
  sex: '',
  bdate: '',
  age: '',
  designation: '',
  otp: 0,
  isFromForgotPass: false
}
