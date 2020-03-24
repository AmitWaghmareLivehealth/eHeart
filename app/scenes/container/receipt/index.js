import React, {
  Component,
} from 'react';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { NavigationActions } from 'react-navigation'
import { Color, Global} from '../../../utils'
import { ProgressBar, Ripple } from '../../components'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import { connect } from 'react-redux'
class Receipt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date:'',
      userName: '',
      amount:0,
      appointment_bundle: this.props.appointment_bundle,
      appointment_date: moment().format('Do MMMM, YYYY'),
      appointment_time: moment().format('h:mm a'),
      isHomeCollection: this.props.appointment_bundle.isHomecollection,
      userName : this.props.userName,
      amount: this.props.appointment_bundle.amountPaid
    };
  }

  render() {
    return (
      <View style={{backgroundColor: 'white', margin: 20, borderRadius: 6, padding: 24}}>
      <View>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Text style={{fontSize: 22, color: 'black'}}>Thank you!</Text>
            <Text style={{fontSize: 16}}>Your transaction was successful</Text>
          </View>

          <View style={{flex: 1}}/>

          <MaterialIcons
            name={'check'}
            size={28}
            style={{ color: Color.themeColor , padding: 8}}
          />
        </View>

        <View style={{backgroundColor: Color._DF, height: 0.5, marginTop: 16}}/>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={styles.style_header}>DATE</Text>
            <Text style={styles.style_desc}>{this.state.appointment_date}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={[styles.style_header,{textAlign:'right'}]}>TIME</Text>
            <Text style={[styles.style_desc,{textAlign: 'right'}]}>{this.state.appointment_time}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.style_header}>FROM</Text>
          <Text style={styles.style_desc}>{this.state.userName}</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={styles.style_header}>AMOUNT</Text>
            <Text style={[styles.style_desc, {fontSize: 24, fontWeight: '400'}]}>{this.props.currency.currency} {this.state.amount}</Text>
          </View>

          <View style={{justifyContent: 'center', marginTop: 40}}>
            <View style={{borderRadius: 6, borderWidth: 0.5, borderColor: Color.themeColor, paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4}}>
              <Text style={{color: Color.themeColor}}>{this.state.isHomeCollection === 1 ? 'Home Collection Booked' : 'Appointment Booked'}</Text>
            </View>
          </View>
        </View>
      </View>
      <Ripple
        style={{paddingTop: 48}}
        onPress={() => {
          this.props.onCloseDialog()
        }}
        >
        <View style={{alignItems: 'center'}}>
          <View style={{backgroundColor:'#ccc', height: 50, width : 50, borderRadius: 60}}></View>
          <MaterialIcons
            name={'close'}
            size={30}
            style={{ color: 'white', marginTop: 10, backgroundColor: '#ccc' , position : 'absolute'}}
          />
        </View>
      </Ripple>
    </View>
    );
  }

}

const styles = StyleSheet.create({

  style_header: {
    fontSize: 14,
    fontWeight: '500',
    color : '#ccc',
    paddingTop: 16
  },

  style_desc: {
    fontSize: 18,
    fontWeight: '400',
    paddingTop: 4,
    color: Color._4A
  }
})


const mapStateToProps = state => ({
  currency: state.currency
})

export default connect(mapStateToProps)(Receipt)
