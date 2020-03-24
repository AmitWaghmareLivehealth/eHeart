import React, { Component } from 'react'
import { View, Keyboard } from 'react-native'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
import moment from 'moment'

import { TextField, Button, ErrorText } from '../../components'

import { Global, Color, Routes, stringsAlert, stringsSex, stringsDesignation } from '../../../utils'

import { HeaderGetStartedSuperLarge } from '../../../scenes/layouts'
import styles from '../login.signup.name/styles'
import {Ripple} from '../../components'
import DatePicker from '../../components/datepicker'
import PropTypes from 'prop-types';

const radioProps = [
  { label: stringsSex.Male, value: 0 },
  { label: stringsSex.Female, value: 1 },
  { label: stringsSex.Other, value: 2 }
]
export default class LoginSignupBDayScreen extends Component {

  constructor (props) {
    super(props)
    this.state = {
      sex: '',
      bdate: '',
      bdateDisplayFormat: undefined,
      age: 0,
      invalidMessageVisible: false,
      date_visible: false,
    }
    this.goToPass = this.goToPass.bind(this)
    this.onChangeDate = this.onChangeDate.bind(this)
    this.onChangeDate1 = this.onChangeDate1.bind(this)
    this.onChangeSex = this.onChangeSex.bind(this)
    this.set_modal_visible = this.set_modal_visible.bind(this)
  }

  componentWillMount () {
    Keyboard.dismiss()
  }

  set_modal_visible(flag){
    this.setState({
      date_visible: flag
    })
  }

  componentDidMount () {
    let newdate = moment().subtract(20, 'years')
    this.onChangeDate(newdate)
  }

  onChangeSex (value) {
    var gender = radioProps.find(function (element) {
      if (element.value === value) {
        return element.label
      }
    })
    this.setState({ sex: gender.label, invalidMessageVisible: false })
  }

  onChangeDate1 (bdateInDateFormat) {
    let date = moment(bdateInDateFormat).format('YYYY-MM-DDT00:00:00') + 'Z'
    let bdateDisplayFormat = moment(bdateInDateFormat).format(Global.dateFormatDisplay)
    var years = moment().diff(moment(bdateInDateFormat), 'years', false)
    this.setState({ bdate: date, age: years, bdateDisplayFormat: bdateDisplayFormat, invalidMessageVisible: false })
  }

  onChangeDate (bdateInDateFormat) {
    let date = bdateInDateFormat.format('YYYY-MM-DDT00:00:00') + 'Z'
    let bdateDisplayFormat = bdateInDateFormat.format(Global.dateFormatDisplay)
    var years = moment().diff(bdateInDateFormat, 'years', false)
    this.setState({ bdate: date, age: years, bdateDisplayFormat: bdateDisplayFormat, invalidMessageVisible: false })
  }

  goToPass () {
    if ((this.state.bdate || '').length > 4 && (this.state.sex || '').length > 0) {
      var params = {
        sex: this.state.sex,
        bdate: this.state.bdate,
        age: this.state.age,
        designation: this.getDesignation(),
        email: this.props.navigation.state.params.email,
        name: this.props.navigation.state.params.name,
        mobile: this.props.navigation.state.params.mobile,
        countryCode: this.props.navigation.state.params.countryCode
      }
      this.props.navigation.navigate(Routes.loginSignupPasswordScreen, params)
    } else {
      this.setState({ invalidMessageVisible: true })
    }
  }

  getDesignation () {
    if (this.state.age < 5) {
      if (this.state.sex === stringsSex.Female) {
        return stringsDesignation.Baby
      } else {
        return stringsDesignation.Master
      }
    } else {
      if (this.state.sex === stringsSex.Female) {
        return stringsDesignation.Ms
      } else {
        return stringsDesignation.Mr
      }
    }
  }

  render () {
    var allButton = radioProps.map((obj, index) => {
      return <RadioButton labelHorizontal key={index} >
        <RadioButtonInput
          obj={obj}
          index={index}
          isSelected={this.state.sex === (radioProps[index].label)}
          onPress={this.onChangeSex}
          borderWidth={2}
          buttonInnerColor={Color.themeColor}
          buttonOuterColor={Color.themeColor}
          buttonSize={12}
          buttonOuterSize={22}
          buttonStyle={{}}
          buttonWrapStyle={{marginLeft: 24, marginRight: 0}}
        />
        <RadioButtonLabel
          obj={obj}
          index={index}
          labelHorizontal
          onPress={this.onChangeSex}
          labelStyle={{fontSize: 14, color: 'black', marginLeft: 0, paddingLeft: 7}}
          labelWrapStyle={{}}
        />
      </RadioButton>
    })

    return (
      <View style={styles.containerMain} >
        <View style={{ flex: 0, flexGrow: 2 }}>
          <HeaderGetStartedSuperLarge
            header='Birthdate'
            style={{ paddingBottom: 10 }}
          />
          <Ripple
            activeOpacity={1.0}
            onPress={() => {
              this.set_modal_visible(true)
            }}>
            <TextField
              focusOnComponentMount={false}
              value={this.state.bdateDisplayFormat}
              height={50}
              placeholder='Select your birthdate'
              editable={false}
            />
          </Ripple>
          <HeaderGetStartedSuperLarge
            header={'Sex'}
            style={{ paddingTop: 27 }}
          />
          <RadioForm animation formHorizontal style={{ marginLeft: 12 }}>
            {allButton}
          </RadioForm>
          <ErrorText
            message={stringsAlert.invalidSexAndBdate.message}
            invalidMessageVisible={this.state.invalidMessageVisible}
            style={{ marginBottom: 10, marginTop: 10 }}
          />
        </View>
        <View style={styles.containerSub2}>
          <Button
            style={styles.btnProceed}
            onPress={this.goToPass}
            title='Proceed'
            isDisabled={((this.state.bdate || '').length <= 4 && (this.state.sex || '').length <= 0)}
          />
        </View>
        {(this.state.date_visible) ? (<DatePicker
          dialog_visible={this.set_modal_visible}
          setTime={this.onChangeDate1} />) : (null)}
      </View>
    )
  }
}

LoginSignupBDayScreen.propTypes = {
  mobile: PropTypes.string,
  countryCode: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  navigation: PropTypes.object
}

LoginSignupBDayScreen.defaultProps = {
  mobile: '',
  countryCode: '',
  name: '',
  email: ''
}
