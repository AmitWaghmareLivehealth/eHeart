import React, { Component } from 'react'
import { View } from 'react-native'

import { TextField, Button, ErrorText } from '../../components'

import { Routes, stringsAlert } from '../../../utils'
import { HeaderGetStartedSuperLarge } from  '../../../scenes/layouts'
import { isValidEmail } from '../../../utils/exts/strings'
import styles from '../login.signup.name/styles'
import PropTypes from 'prop-types';

export default class LoginSignupEmailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      invalidMessageVisible: false
    }
    this.goToBDate = this.goToBDate.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
  }

  onChangeText (text) {
    this.setState({ email: text, invalidMessageVisible: false })
  }

  goToBDate () {
    if (isValidEmail(this.state.email)) {
      var params = {
        email: this.state.email,
        name: this.props.navigation.state.params.name,
        mobile: this.props.navigation.state.params.mobile,
        countryCode: this.props.navigation.state.params.countryCode
      }
      this.props.navigation.navigate(Routes.loginSignupBDateScreen, params)
    } else {
      this.setState({ invalidMessageVisible: true })
    }
  }

  render () {
    return (
      <View style={styles.containerMain} >
        <View style={{ flex: 0, flexGrow: 2 }}>
          <HeaderGetStartedSuperLarge
            header={'Enter Email'}
            description={'We will send you, your payment receipts here'}
          />
          <TextField
            focusOnComponentMount
            style={styles.textPass}
            value={this.state.email}
            height={50}
            placeholder='Enter email Id'
            onChangeText={this.onChangeText}
            onSubmitEditing={this.goToBDate}
            keyboardType='email-address'
            autoCapitalize='none'
          />
          <ErrorText
            message={stringsAlert.invalidEmail.message}
            invalidMessageVisible={this.state.invalidMessageVisible}
          />
        </View>
        <View style={styles.containerSub2}>
          <Button
            style={styles.btnProceed}
            onPress={this.goToBDate}
            title='Proceed'
          />
        </View>
      </View>
    )
  }
}

LoginSignupEmailScreen.propTypes = {
  mobile: PropTypes.string,
  countryCode: PropTypes.string,
  name: PropTypes.string,
  navigation: PropTypes.object
}

LoginSignupEmailScreen.defaultProps = {
  mobile: '',
  countryCode: '',
  name: ''
}
