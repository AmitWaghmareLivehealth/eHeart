import React, { Component } from 'react'
import { View, Text, StyleSheet, Switch} from 'react-native'

import {Color,Globals, stringGCMCategories,UserDefaults, stringsUserDefaults} from '../../../utils'
import { HeaderListExtraLarge} from '../../layouts'
import CloseBar from '../../components/closebar'

export default class NotificationPreferences extends Component {
  constructor(props) {
    super(props)
    this.state={
      report_notification: false,
      promotion_notification: false,
      appointment_notification: false
    }
    this.onChangeValue = this.onChangeValue.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  componentDidMount(){
    this.getData()
  }

  getData(){

    UserDefaults.get(stringsUserDefaults.reportnotification_pref).then((reportnotification_pref) => {
      this.setState({
          report_notification : (reportnotification_pref || false),
      })
    }).catch((error) => {
      console.error(error);
    })

    UserDefaults.get(stringsUserDefaults.promotionalnotification_pref).then((promotionalnotification_pref) => {
      this.setState({
          promotion_notification : (promotionalnotification_pref || false),
      })
    }).catch((error) => {
      console.error(error);
    })

    UserDefaults.get(stringsUserDefaults.appointmentnotification_pref).then((appointmentnotification_pref) => {
      this.setState({
        appointment_notification : (appointmentnotification_pref || false)
      })
    }).catch((error) => {
      console.error(error);
    })
  }

  onChangeValue(value, category){
    UserDefaults.set(category, value)
  }

  goBack(){
    this.props.closeModal()
  }

  render(){

    return(
      <View style={{flex:1,backgroundColor:'white'}}>
        <CloseBar
          goBack={this.goBack}
          color={'black'}
        />

        <HeaderListExtraLarge
          header='Notifications'
          description='Notification preferences will avail you to monitor and handle the notifications inside the application'
          style={{flex:0,paddingTop:0}}
        ></HeaderListExtraLarge>
        <View style={styles.container}>

          <View style={styles.inner_container}>
            <Text style={styles.text_style}>Report Updates</Text>
            <Switch
              value={this.state.report_notification}
              onValueChange={(value) => {
                this.onChangeValue(value, stringsUserDefaults.reportnotification_pref)
                this.setState({
                  report_notification: value
                })
              }}>
            </Switch>
          </View>
          <View style={styles.separator_style}></View>

          <View style={styles.inner_container}>
            <Text style={styles.text_style}>Promotional Updates</Text>
            <Switch
              value={this.state.promotion_notification}
              onValueChange={(value) => {
              this.onChangeValue(value, stringsUserDefaults.promotionalnotification_pref)
              this.setState({
                promotion_notification: value
              })
            }}
            ></Switch>
          </View>
          <View style={styles.separator_style}></View>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection: 'column',
    padding:17,
    backgroundColor: 'white'
  },
  inner_container:{flexDirection: 'row', paddingTop:24,paddingBottom:24},
  text_style:{
    color: Color._36,
    flex:1,
    fontSize: 17
  },
  separator_style:{
    height: 0.5,
    backgroundColor: Color._DF
  }
})
