import React, {Component} from 'react';
import {
  View,
  Text,
  Platform,
  Linking,
  TextInput,
  PermissionsAndroid,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import moment from 'moment';
import {
  Routes,
  Color,
  Global,
  UserDefaults,
  stringsUserDefaults,
  URLs,
  Images,
  NetworkRequest,
  CommonStyles,
} from '../../../utils';
import {HeaderListExtraLarge, StateRepresentation} from '../../layouts';
import {Ripple, ProgressBar, ListHeader} from '../../components';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {setUnreadFlag, setDemographics} from '../../../redux/actions/index';
import {connect} from 'react-redux';
var categories = require('./categories.json');

var _ = require('lodash');

var appointment_bundle = {
  latlng: '',
  city: '',
  isHomecollection: 0,
  labTestListId: 0,
  isPayAtCenter: 0,
  isStarredLab: 0,
  paymentType: 0,
  couponCode: '',
  amountPaid: '',
  comments: '',
  totalAmount: '',
  transactions: '',
  bookingDate: '',
  token: '',
  startDate: '',
  endDate: '',
  paymentId: '',
  address: '',
  zipCode: '',
  labName: '',
};

class LabScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labId: this.props.navigation.state.params.labId,
      appointment_bundle: appointment_bundle,
      // labId: 437,
      todaysTime: 0,
      locationName: this.props.navigation.state.params.locationName,
      formattedAddress: this.props.navigation.state.params.formattedAddress,
      selectedLab: this.props.navigation.state.params.lab,
    };
  }

  gotoAppointmentCategories = () => {
    var latlng =
      this.state.locationName.latitiude +
      ', ' +
      this.state.locationName.longitude;

    var locationName = this.state.locationName;
    var latlng = locationName.latitude + ',' + locationName.longitude;
    var city = this.state.locationName.city;
    var zipCode = locationName.postalCode;
    var labTestListId = Global.labId;
    this.state.appointment_bundle.latlng = latlng;
    this.state.appointment_bundle.city = city;
    this.state.appointment_bundle.zipCode = zipCode;
    this.state.labTestListId = labTestListId;
    UserDefaults.set(
      stringsUserDefaults.appointment_bundle,
      this.state.appointment_bundle,
    );

    this.props.navigation.navigate(Routes.testScreen, {
      categoryId: 13,
      categoryName: 'Tests',
      description: 'Know more about how can you monitor your overall health.',
      icon: 'trackercategories/overallhealth.png',
      categoryList: categories,
      location: this.state.locationName,
      latlng: latlng,
      city: city,
      labId:this.state.labId,
      cartData: {},
      cartCount: 0,
    });
  };

  renderLabTimings = () => {
    const {selectedLab} = this.state;

    let timings = JSON.parse(selectedLab.labTimings);
    let labTimings = timings.timings;
    let weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    let n = -1;

    return labTimings.map((ins, i) => {
      n++;

      let from = this.convertTo12(ins.from.slice(0, -3));
      let to = this.convertTo12(ins.to.slice(0, -3));

      return (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            flex: 0,
            flexWrap: 'wrap',
            paddingHorizontal: 16,
            paddingVertical: 4,
            width: Global.screenWidth,
          }}>
          <Text>{weekday[n]} </Text>
          <Text>
            {from} - {to}
          </Text>
        </View>
      );
    });
  };

  checkIsOpen = (startTime, endTime) => {
    let currentDate = new Date();

    let startDate = new Date(currentDate.getTime());
    startDate.setHours(startTime.split(':')[0]);
    startDate.setMinutes(startTime.split(':')[1]);
    startDate.setSeconds(startTime.split(':')[2]);

    let endDate = new Date(currentDate.getTime());
    endDate.setHours(endTime.split(':')[0]);
    endDate.setMinutes(endTime.split(':')[1]);
    endDate.setSeconds(endTime.split(':')[2]);

    let valid = startDate < currentDate && endDate > currentDate;

    return valid;
  };

  convertTo12 = time => {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? ' AM' : ' PM';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join('');
  };

  checkLabAvailability = labTimings => {
    let weekends = [0, 6];
    let same_time_array = [];

    let timings = JSON.parse(labTimings);
    let labtimes = timings.timings;

    // labtimes.every(labtimes[0]);

    labtimes.map(ins => {
      labtimes;
    });
  };

  afterUpdate = response => {
    console.log('Reponse', response.labObj);

    let labs = response.labObj;
    let labTimings = labs.labTimings;

    let timings = JSON.parse(labTimings);
    labTimings = timings.timings;

    let todaysDay = moment().format('dddd');
    let weekday = [
      {day: 'Sunday', index: 0},
      {day: 'Monday', index: 1},
      {day: 'Tuesday', index: 2},
      {day: 'Wednesday', index: 2},
      {day: 'Thursday', index: 2},
      {day: 'Friday', index: 2},
      {day: 'Saturday', index: 2},
    ];
    let i = 0;
    weekday.map(ins => {
      if (todaysDay == ins.day) {
        i = ins.index;
      }
    });

    let isOpen = this.checkIsOpen(labTimings[i].from, labTimings[i].to);

    let from = this.convertTo12(labTimings[i].from.slice(0, -3));
    let to = this.convertTo12(labTimings[i].to.slice(0, -3));

    let todaysTime = `${from} to ${to}`;

    this.setState(
      {
        labObj: labs,
        labName: labs.labName,
        labTimings: labs.labTimings,
        labContact: labs.labContact,
        labAddress: labs.labAddress,
        location: labs.location,
        isOpen: isOpen,
        todaysTime: todaysTime,
      },
      () => {
        this.checkLabAvailability(this.state.labTimings);
      },
    );
  };

  render() {
    const {selectedLab} = this.state;
    return (
      <View
        style={{
          padding: 16,
          backgroundColor: 'white',
          flex: 1,
          height: '100%',
          marginTop: Global.isIphoneX ? 20 : 0,
        }}>
        <Text
          style={[
            CommonStyles.textHeader2,
            {
              alignSelf: 'center',
              color: Color.themeColor,
              paddingTop: 20,
              fontSize: 26,
            },
          ]}>
          {selectedLab.labName}
        </Text>

        <View
          style={{alignContent: 'center', alignSelf: 'center'}}>
          <Text style={[CommonStyles.textDescription2]}>
            {selectedLab.labAddress}
          </Text>
          <Text style={[CommonStyles.textDescription2, {marginTop: 10}]}>
            Email:{selectedLab.labEmail}
          </Text>

          <Text style={[CommonStyles.textDescription2]}>
            www.aspiradiagnostics.com/
          </Text>

          <Text style={[CommonStyles.textDescription2]}>
            Tel.:{selectedLab.labContact}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingVertical: 16,
            }}></View>
        </View>
        <ListHeader headerText={'TIMINGS'} />

        {selectedLab.labTimings != '' ? this.renderLabTimings() : null}

        <View style={{minHeight: 150}}></View>

        <Ripple
          style={{
            padding: 16,
            backgroundColor: Color.themeColor,
            position: 'absolute',
            width: Global.screenWidth,
            bottom: 0,
          }}
          onPress={this.gotoAppointmentCategories}>
          <View>
            <Text
              style={{
                fontFamily: 'Arial',
                color: 'white',
                textAlign: 'center',
                fontSize: 16,
              }}>
              Proceed
            </Text>
          </View>
        </Ripple>
        {this.state.isLoading ? <ProgressBar /> : null}
      </View>
    );
  }
}

function mapDispatchToActions(dispatch) {
  return {
    setDemographics: arr => dispatch(setDemographics(arr)),
    setUnreadFlag: num => dispatch(setUnreadFlag(num)),
  };
}

const mapStateToProps = state => ({
  demographics: state.demographics,
});

export default connect(mapStateToProps, mapDispatchToActions)(LabScreen);

const styles = StyleSheet.create({
  textHeader: {
    flexGrow: 2,
    textAlignVertical: 'bottom',
    fontSize: 32,
    color: 'black',
    fontWeight: '700',
  },
  textDesc: {
    flexGrow: 2,
    paddingTop: 10,
    fontSize: 15,
    color: '#4a4a4a',
    fontWeight: '400',
  },
});
