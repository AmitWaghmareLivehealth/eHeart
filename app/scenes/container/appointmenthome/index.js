import React, { Component } from 'react';

import {
  View,
  Text,
  PermissionsAndroid,
  ToastAndroid
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { Global, LocationManager} from '../../../utils'
import {Ripple} from '../../components'

export default class AppointmentHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
     latitude: null,
     longitude: null,
     error: null,
     locationName : {}
    };

    this.requestLocationPermission = this.requestLocationPermission.bind(this)
    this.updateLocation = this.updateLocation.bind(this)
  }

  componentDidMount(){
    this.requestLocationPermission()
  }

  updateLocation(locationName){
    this.setState({
      locationName: locationName
    })
    console.log('FINAL RESULT : ', locationName);
    ToastAndroid.show((locationName).toString(), ToastAndroid.SHORT);
  }

  // async requestLocationPermission() {
  //   try {
  //     var locationName = {}
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //     ).then((granted) => {
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         navigator.geolocation.getCurrentPosition(
  //           (position) => {
  //             this.setState({
  //               latitude: position.coords.latitude,
  //               longitude: position.coords.longitude,
  //               error: null,
  //             });
  //             ToastAndroid.show((position.coords.latitude).toString(), ToastAndroid.SHORT);
  //             ToastAndroid.show((position.coords.longitude).toString(), ToastAndroid.SHORT);
  //             LocationManager.getNameFromLocation(position.coords.latitude, position.coords.longitude, this.updateLocation)
  //           },
  //           (error) => this.setState({ error: error.message }),
  //           { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  //         );
  //       } else {
  //         console.log("Location permission denied")
  //       }
  //     }).catch((error) => {
  //       console.error(error);
  //     })
  //   } catch (err) {
  //     console.warn(err)
  //   }
  // }

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchId);
  }

  render() {
    return (
      <Ripple
        onPress = {() => {
          this.props.navigation.navigate(Routes.appointmentCategories, {

          })
        }} style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' , backgroundColor: 'white'}}>
        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' , backgroundColor: 'white'}}>
          <Text>Latitude: {this.state.latitude}</Text>
          <Text>Longitude: {this.state.longitude}</Text>
          {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
        </View>
      </Ripple>
    );
  }

}
