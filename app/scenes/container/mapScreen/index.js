import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  PermissionsAndroid,
  Alert,
  ActivityIndicator
} from "react-native";
import RNGooglePlaces from "react-native-google-places";
import moment from "moment";
import {
  Routes,
  Color,
  Global,
  LocationManager,
  UserDefaults,
  stringsUserDefaults,
  URLs,
  Images,
  NetworkRequest
} from "../../../utils";
import { HeaderListExtraLarge, StateRepresentation } from "../../layouts";
import { Ripple, ProgressBar } from "../../components";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { setUnreadFlag, setDemographics } from "../../../redux/actions/index";
import { connect } from "react-redux";
import Geolocation from '@react-native-community/geolocation';

import PropTypes from 'prop-types';
var _ = require("lodash");
class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formattedAddress: "",
      locationName: {},
      // cityList: [{ name: "Darbhanga", isActive: 1 }],
      cityList: [],
      isLoading: false,
      isLoadingBig: false,
      inputAddress: "",
      vicinity: ""
    };

    this.requestLocationPermission = this.requestLocationPermission.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.openSearchModal = this.openSearchModal.bind(this);
    this.gotoAppointmentCategories = _.debounce(
      this.gotoAppointmentCategories.bind(this),
      200
    );
    this.loadingManipulate = this.loadingManipulate.bind(this);
    this.getCityList = this.getCityList.bind(this);
  }

  componentDidMount() {
    this.props.setDemographics({ screen: 0 });
    //  this.props.setUnreadFlag(0)

    //Comment starts here
    UserDefaults.get(stringsUserDefaults.city_list)
      .then(city_list => {
        if (city_list && city_list.length > 0) {
          this.setState({
            isLoadingBig: false,
            cityList: city_list
          });
          setTimeout(() => {
            this.requestLocationPermission();
          }, 50);
        } else {
          this.setState({
            isLoadingBig: false
          });
          this.getCityList();
        }
      })
      .catch(error => {
        console.error(error);
      });
    //Comment ends here
  }

  getCityList() {
    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let params = "token=" + token;
        var _this = this;
        NetworkRequest(_this, "POST", URLs.getAllCities, params)
          .then(result => {
            if (result.success) {
              if (result.response.code === 200) {
                if (result.response.cities.length > 0) {
                  this.setState({
                    cityList: result.response.cities
                  });

                  setTimeout(() => {
                    this.requestLocationPermission();
                  }, 25);

                  UserDefaults.set(
                    stringsUserDefaults.city_list,
                    result.response.cities
                  );
                } else {
                  this.setState({
                    isLoadingBig: false
                  });
                  this.setStateRep("There are no entries for your query");
                }
              } else if (result.response.code === 500) {
                this.setState({
                  isLoadingBig: false
                });
                this.setStateRep("Something went wrong");
              }
            } else {
              this.setState({
                isLoadingBig: false
              });
              this.setStateRep("Something went wrong");
            }
          })
          .catch(error => {
            this.setState({
              isLoadingBig: false
            });
            this.setStateRep("Something went wrong");
            console.error(error);
          });
      })
      .catch(error => {
        this.setState({
          isLoadingBig: false
        });
        console.error(error);
      });
  }

  loadingManipulate(flag) {
    this.setState({
      isLoading: flag
    });
  }

  openSearchModal() {
    RNGooglePlaces.openPlacePickerModal()
      .then(place => {
        console.log(place);

        if (place.address) {
          LocationManager.getNameFromLocation(
            place.latitude,
            place.longitude,
            this.updateLocation,
            place
          );
        } else if (place.latitude && place.longitude) {
          LocationManager.getNameFromLocation(
            place.latitude,
            place.longitude,
            this.updateLocation,
            place
          );
        }
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => {
        this.loadingManipulate(false);
        console.log(error.message);
      }); // error is a Javascript Error object
  }

  updateLocation(locationName) {
    var inputAddress = [];
    var address = "";
    var vicinity = "";
    try {
      inputAddress = locationName.formattedAddress.split(",");
      inputAddress.splice(inputAddress.length - 2);
      for (var i = 0; i < inputAddress.length; i++) {
        if (i != inputAddress.length - 1) {
          address += inputAddress[i] + ", ";
        } else {
          address += inputAddress[i];
        }
      }

      vicinity = inputAddress[inputAddress.length - 1].trim();
      //HERE
      console.log("Address", inputAddress);

      console.log("Formatted Address", locationName.formattedAddress);
    } catch (error) {
      console.error(error);
    }

    this.setState({
      locationName: locationName,
      formattedAddress: locationName.formattedAddress,
      inputAddress: address,
      isLoading: false,
      vicinity: vicinity
    });
    console.log("FINAL RESULT : ", locationName);
  }

  gotoAppointmentCategories() {
    var cityList = this.state.cityList;
    var isContain = false;
    if (this.state.locationName.city || this.state.vicinity) {
      if (Object.keys(this.state.locationName).length !== 0) {
        cityList.some(city => {
          if (
            (this.state.locationName.city || this.state.vicinity).indexOf(
              city.name
            ) !== -1 ||
            this.state.vicinity.indexOf(city.name) != -1
          ) {
            if (city.isActive === 1) {
              isContain = true;
              return true;
              // this.state.locationName.city = city.name
            }
          }
        });
      }

      if (Object.keys(this.state.locationName).length !== 0 && isContain) {
        // this.props.navigation.navigate(Routes.appointmentCategories, {
        //   locationName: this.state.locationName,
        //   formattedAddress: this.state.formattedAddress
        // });

        this.props.navigation.navigate(Routes.labsList, {
          locationName: this.state.locationName,
          formattedAddress: this.state.formattedAddress
        });
      } else {
        var title = "";
        var message = "";
        if (Object.keys(this.state.locationName).length === 0) {
          title = "Location";
          message = "Please enter a valid location";
        } else {
          title = "City not supported";
          message =
            "Chuck!! We are currently not operating in your location. We are expanding our operations and would notify you as soon we are there.";
        }
        Alert.alert(
          title,
          message,
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }
    } else {
      var title = "Selected city is invalid";
      var message = "Please select another location";
      Alert.alert(
        title,
        message,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      return;
    }
  }

  async requestLocationPermission() {
    try {
      if (Global.iOSPlatform) {
        Geolocation.getCurrentPosition(
          position => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              isLoadingBig: false,
              error: null
            });
            LocationManager.getNameFromLocation(
              position.coords.latitude,
              position.coords.longitude,
              this.updateLocation
            );
          },
          error => {
            this.setState({
              error: error.message,
              isLoadingBig: false
            });
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 }
        );
      } else {
        if (Global.osVersion) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          )
            .then(granted => {
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("FIRST", moment().milliseconds());
                Geolocation.getCurrentPosition(
                  position => {
                    console.log("LAST", moment().milliseconds());
                    this.setState({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                      isLoadingBig: false,
                      error: null
                    });
                    LocationManager.getNameFromLocation(
                      position.coords.latitude,
                      position.coords.longitude,
                      this.updateLocation
                    );
                  },
                  error => {
                    this.loadingManipulate(true);
                    this.openSearchModal();
                    this.setState({
                      error: error.message,
                      isLoadingBig: false
                    });
                  },
                  {
                    enableHighAccuracy: false,
                    timeout: 20000,
                    maximumAge: 60000
                  }
                );
              } else {
                this.setState({ isLoadingBig: false });
                console.log("Location permission denied");
              }
            })
            .catch(error => {
              this.setState({ isLoadingBig: false });
              console.error(error);
            });
        } else {
          Geolocation.getCurrentPosition(
            position => {
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                isLoadingBig: false,
                error: null
              });
              LocationManager.getNameFromLocation(
                position.coords.latitude,
                position.coords.longitude,
                this.updateLocation
              );
            },
            error =>
              this.setState({ error: error.message, isLoadingBig: false }),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
          );
        }
      }
    } catch (err) {
      this.setState({ isLoadingBig: false });
      console.warn(err);
    }
  }

  componentWillUnmount() {
    this.props.setDemographics({ screen: 1 });
    Geolocation.clearWatch(this.watchId);
  }

  render() {
    return (
      <View
        style={{
          padding: 16,
          backgroundColor: "white",
          flex: 1,
          marginTop: Global.isIphoneX ? 20 : 0
        }}
      >
        <HeaderListExtraLarge
          header={"Choose Location"}
          description="Please select your location where you wish your appointment or home collection to be done"
          style={{ flex: 0 }}
        ></HeaderListExtraLarge>

        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              flex: 1,
              fontSize: 18,
              color: Color._4A,
              paddingLeft: 24,
              marginBottom: -4,
              paddingTop: 12,
              fontWeight: "500"
            }}
          >
            Your Location
          </Text>
          <MaterialIcons
            name={"my-location"}
            size={24}
            style={{ color: Color.themeColor, marginRight: 16, marginTop: 8 }}
          />
        </View>

        <View style={{ flexDirection: "row" }}>
          <TextInput
            underlineColorAndroid ={'grey'}
            value={
              this.state.inputAddress
                ? this.state.inputAddress
                : this.state.formattedAddress
            }
            placeholder="Your current location."
            style={{
              height: 75,
              paddingLeft: 8,
              paddingRight: 16,
              marginLeft: 16,
              marginRight: 16,
              marginTop: 8,
              fontSize: 16,
              flex: 1
            }}
            multiline={true}
            editable={false}
            placeholderTextColor={"#ccc"}
            onChangeText={text => {
              this.setState({
                formattedAddress: text
              });
            }}
          />
          {/* {(this.state.isLoading) ? <ActivityIndicator style={{right: 32, bottom : 4}}/> : null} */}
        </View>

        <Ripple
          style={{ flexWrap: "wrap", padding: 12, marginRight: 16 }}
          onPress={() => {
            this.loadingManipulate(true);
            this.openSearchModal();
          }}
        >
          <Text style={{ color: Color.appointmentBlue, textAlign: "right" }}>
            Choose another location
          </Text>
        </Ripple>

        <Ripple
          style={{
            width: 60,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            borderRadius: 100,
            margin: 16,
            right: 24,
            bottom: 24,
            backgroundColor:
              this.state.isLoading || this.state.isLoadingBig
                ? Color._75
                : Color.appointmentBlue
          }}
          onPress={() => {
            if (!this.state.isLoading && !this.state.isLoadingBig) {
              this.gotoAppointmentCategories();
            }
          }}
        >
          <MaterialIcons
            name={"chevron-right"}
            size={28}
            style={[{ color: "white" }, this.props.iconStyle]}
          />
        </Ripple>

        {this.state.isLoadingBig ? <ProgressBar /> : null}
      </View>
    );
  }
}

function mapDispatchToActions(dispatch) {
  return {
    setDemographics: arr => dispatch(setDemographics(arr)),
    setUnreadFlag: num => dispatch(setUnreadFlag(num))
  };
}

const mapStateToProps = state => ({
  demographics: state.demographics
});

export default connect(
  mapStateToProps,
  mapDispatchToActions
)(MapScreen);
