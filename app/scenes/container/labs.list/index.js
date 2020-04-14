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
  FlatList,
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
import LabCard from '../../components/labcard';

import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {setUnreadFlag, setDemographics} from '../../../redux/actions/index';
import {connect} from 'react-redux';

var _ = require('lodash');

class LabsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      location: '',
      labs: [],
      // locationName: "",
      // formattedAddress: ""
      locationName: this.props.navigation.state.params.locationName,
      formattedAddress: this.props.navigation.state.params.formattedAddress,
    };
  }

  fakeApi = () => {
    this.loadingManipulate(true);

    var params =
      'area=' +
      'Darbhanga, Darbhanga, Bihar, India' +
      '&developerId=' +
      Global.developerId +
      '&homecollectionFlag=' +
      0 +
      '&city=' +
      'Darbhanga' +
      '&latitude=' +
      '26.1542045' +
      '&longitude=' +
      '85.8918454' +
      '&query=' +
      '' +
      '&token=' +
      '770617a9-df7f-11e9-96a4-0a236e1c7df0';

    var _this = this;

    NetworkRequest(_this, 'POST', URLs.searchCenterTestsSpecialityURL, params)
      .then((result) => {
        if (result.success) {
          if ((result.response.code || 0) === 200) {
            this.loadingManipulate(false);
            this.setState({labs: result.response.labs});
            console.log('Result', result.response);
          } else {
            this.loadingManipulate(false);
          }
        } else {
          this.loadingManipulate(false);
        }
      })
      .catch((error) => {
        this.loadingManipulate(false);
        console.error(error);
      });
  };

  componentDidMount() {
    // this.fakeApi();

    console.log(
      'location - ' + this.state.locationName,
      'formatted - ' + this.state.formattedAddress,
    );

    this.loadingManipulate(true);
    UserDefaults.get(stringsUserDefaults.userToken)
      .then((token) => {
        var _this = this;
        var params =
          'area=' +
          this.state.formattedAddress +
          '&developerId=' +
          Global.developerId +
          '&homecollectionFlag=' +
          0 +
          '&city=' +
          this.state.locationName.city +
          '&latitude=' +
          this.state.locationName.latitude +
          '&longitude=' +
          this.state.locationName.longitude +
          '&query=' +
          '' +
          '&token=' +
          token;

        NetworkRequest(
          _this,
          'POST',
          URLs.searchCenterTestsSpecialityURL,
          params,
        )
          .then((result) => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                this.loadingManipulate(false);
                this.setState({labs: result.response.labs});

                if (result.response.labs.length == 1) {
                  this.props.navigation.navigate(Routes.labScreen, {
                    labId: result.response.labs[0].labId,
                    locationName: this.state.locationName,
                    formattedAddress: this.state.formattedAddress,
                    lab:result.response.labs[0],
                  });
                }
              } else {
                this.loadingManipulate(false);
              }
            } else {
              this.loadingManipulate(false);
            }
          })
          .catch((error) => {
            this.loadingManipulate(false);
            console.error(error);
          });
      })
      .catch((error) => {
        this.loadingManipulate(false);
        console.error(error);
      });
  }

  loadingManipulate = (flag) => {
    this.setState({
      isLoading: flag,
    });
  };

  gotoLabScreen = (labId, lab) => {
    this.props.navigation.navigate(Routes.labScreen, {
      labId: labId,
      lab: lab,
      locationName: this.state.locationName,
      formattedAddress: this.state.formattedAddress,
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

  convertTo12 = (time) => {
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

  renderLabs = ({item}) => {
    if (item.labTimings) {
      let timings = JSON.parse(item.labTimings);

      let labTimings = timings.timings;
      let weekday = [
        {day: 'Sunday', index: 0},
        {day: 'Monday', index: 1},
        {day: 'Tuesday', index: 2},
        {day: 'Wednesday', index: 2},
        {day: 'Thursday', index: 2},
        {day: 'Friday', index: 2},
        {day: 'Saturday', index: 2},
      ];

      let todaysDay = moment().format('dddd');

      let i = 0;
      weekday.map((ins) => {
        if (todaysDay == ins.day) {
          i = ins.index;
        }
      });
      if (labTimings[i]) {
        let bool = this.checkIsOpen(labTimings[i].from, labTimings[i].to);

        let from = this.convertTo12(labTimings[i].from.slice(0, -3));
        let to = this.convertTo12(labTimings[i].to.slice(0, -3));

        let str = `${from} to ${to}`;

        return (
          <LabCard
            onPressAction={() => this.gotoLabScreen(item.labId, item)}
            headerText={item.labName}
            subheaderText={item.labAddress}
            actualType={str}
            isOpen={bool}
            textType1={item.distance}
            textType2={item.travelTime}
          />
        );
      }
    }
    return <View></View>;
  };

  render() {
    return (
      <View
        style={{
          paddingTop: 16,

          backgroundColor: 'white',
          flex: 1,
          marginTop: Global.isIphoneX ? 20 : 0,
        }}>
        <HeaderListExtraLarge
          header="Our Centres"
          description=""
          style={{flex: 0}}></HeaderListExtraLarge>

        {this.state.labs.length > 0 ? (
          <FlatList
            extraData={this.state}
            data={this.state.labs}
            renderItem={this.renderLabs}></FlatList>
        ) : this.state.isLoading ? null : (
          <StateRepresentation
            image="search"
            description="Could not find any labs in this locality"
          />
        )}

        {this.state.isLoading ? <ProgressBar /> : null}
      </View>
    );
  }
}

function mapDispatchToActions(dispatch) {
  return {
    setDemographics: (arr) => dispatch(setDemographics(arr)),
    setUnreadFlag: (num) => dispatch(setUnreadFlag(num)),
  };
}

const mapStateToProps = (state) => ({
  demographics: state.demographics,
});

export default connect(mapStateToProps, mapDispatchToActions)(LabsList);

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
