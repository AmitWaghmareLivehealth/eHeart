import React, { Component } from "react";
import PropTypes from 'prop-types';

import {
  View,
  Text,
  ScrollView,
  TextInput,
  ToastAndroid,
  KeyboardAvoidingView,
  Alert,
  StyleSheet
  // Keyboard
} from "react-native";
import { HeaderListExtraLarge, StateRepresentation } from "../../layouts";
import {
  CloseBar,
  ProgressBar,
  Ripple,
  ModalBox,
  ProgressCircle
} from "../../components";
import RNGooglePlaces from "react-native-google-places";
import {
  URLs,
  Routes,
  Color,
  Global,
  NetworkRequest,
  UserDefaults,
  stringsUserDefaults,
  CommonStyles
} from "../../../utils";
import moment from "moment";
var _ = require("lodash");

export default class TimeSlots extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_date: moment(),
      location: this.props.navigation
        ? this.props.navigation.state.params.location
        : "",
      formattedAddress: this.props.navigation
        ? this.props.navigation.state.params.location.formattedAddress
        : "",

      sub_address: "",
      slot_array: [],
      comments: "",
      isBuilding: false,
      appointment_bundle: {},
      isLoading: false
    };

    this.getDateSlots = this.getDateSlots.bind(this);
    this.getTimeSlots = this.getTimeSlots.bind(this);
    this.gotoAppointmentSummary = _.debounce(
      this.gotoAppointmentSummary.bind(this),
      200
    );
    this.getData = this.getData.bind(this);
    this.openSearchModal = this.openSearchModal.bind(this);
    this.rescheduleAppointment = this.rescheduleAppointment.bind(this);
    this.loadingManipulate = this.loadingManipulate.bind(this);
  }

  spring() {
    this.springValue.setValue(0.9);
    //this.setState({springVal:0.97})
    Animated.spring(this.springValue, {
      toValue: 1,
      friction: 2
    }).start();
  }

  componentDidMount() {
    this.getData();
  }

  openSearchModal() {
    RNGooglePlaces.openPlacePickerModal()
      .then(place => {
        console.log(place);
        this.state.appointment_bundle.address = place;
        this.setState({
          formattedAddress: places
        });
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => {
        console.log(error.message);
      }); // error is a Javascript Error object
  }

  loadingManipulate(flag) {
    this.setState({
      isLoading: flag
    });
  }

  getData() {
    UserDefaults.get(stringsUserDefaults.appointment_bundle)
      .then(appointment_bundle => {
        if (appointment_bundle) {
          this.setState({
            appointment_bundle: appointment_bundle
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  gotoAppointmentSummary() {
    var slot_array = this.state.slot_array;

    if (!this.props.isReschedule) {
      if (
        (this.state.appointment_bundle.isHomecollection === 1 &&
          slot_array.length < 2) ||
        !this.state.formattedAddress
      ) {
        // Works on both iOS and Android
        var msg = "ac";
        var title = "ac";

        if (
          this.state.appointment_bundle.isHomecollection === 1 &&
          slot_array.length < 2
        ) {
          msg = "Please select two time slots";
          title = "Time slots";
        } else {
          if (!this.state.formattedAddress) {
            msg = "Please enter a valid address";
            title = "Address";
          } else if (this.state.appointment_bundle.isHomecollection === 1) {
            if (!this.state.sub_address) {
              msg =
                "The building name and Flat no. is necessary information for home collection.";
              title = "Address";
            }
          }
        }

        Alert.alert(
          title,
          msg,
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: true }
        );
        return;
      }
    }
    //(slot_array.length < 2)

    if (!this.props.isReschedule) {
      if (
        this.state.appointment_bundle.isHomecollection === 1 &&
        !this.state.sub_address
      ) {
        this.setState({
          isBuilding: true
        });
        try {
          this.refs.sub_address_ref.focus();
        } catch (e) {}
        return;
      }
    }
    var selected_date = this.state.selected_date.format("DD MMM");
    var startTime = moment(selected_date + ", " + slot_array[0], "DD MMM h a");
    var endTime = moment(
      selected_date + ", " + slot_array[slot_array.length - 1],
      "DD MMM h a"
    );
    if (slot_array[0] === slot_array[slot_array.length - 1]) {
      endTime = moment(
        moment(selected_date + ", " + slot_array[0], "DD MMM h a").add(
          1,
          "hour"
        )
      );
    }

    if (moment(endTime, "h a").isBefore(moment(startTime))) {
      var tempTime = endTime;
      endTime = startTime;
      startTime = tempTime;
    }

    var bookingDate = String(
      moment(this.state.selected_date)
        .utc()
        .format(Global.LTHDateFormatMoment) + "Z"
    );

    if (this.state.appointment_bundle.isHomecollection === 1) {
      this.state.appointment_bundle.startDate = String(
        moment(startTime)
          .utc()
          .format(Global.LTHDateFormatMoment) + "Z"
      );
      this.state.appointment_bundle.endDate = String(
        moment(endTime)
          .utc()
          .format(Global.LTHDateFormatMoment) + "Z"
      );
    } else {
      console.log("BOOKING DATE : ", bookingDate);
      this.state.appointment_bundle.bookingDate = bookingDate;
    }

    this.state.appointment_bundle.address =
      this.state.sub_address + ", " + this.state.formattedAddress;
    this.state.appointment_bundle.comments = this.state.comments;
    UserDefaults.set(
      stringsUserDefaults.appointment_bundle,
      this.state.appointment_bundle
    );

    if (this.props.isReschedule) {
      if (slot_array.length < 2) {
        Alert.alert("Time slots", "Please select two time slots");
      } else {
        console.log(
          "Check",
          moment(this.props.bundle.startTime).format("Do MMM")
        );
        dateSelected = this.state.selected_date.format("Do MMM");
        var testBookingDate = String(
          moment(this.props.bundle.startTime).format("Do MMM")
        );

        console.log(
          testBookingDate,
          moment(this.props.bundle.startTime).format("Do MMM")
        );
        if (testBookingDate === dateSelected) {
          resText = "Are you sure you want to reschedule your booking?";
          // moment(this.props.bundle.startTime).format('hh a')+' to '+moment(this.props.bundle.endTime).format('hh a')+' with '
          // +moment(startTime).format('hh a')+' to '+
          // moment(endTime).format('hh a')
        } else {
          resText =
            "Are you sure you want to reschedule current booking for " +
            moment(this.props.bundle.startTime).format("Do MMMM") +
            " with " +
            this.state.selected_date.format("Do MMMM");
        }

        Alert.alert(
          "Reschedule Homecollection",
          resText,
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            {
              text: "OK",
              onPress: () => {
                this.rescheduleAppointment(
                  String(
                    moment(startTime)
                      .utc()
                      .format(Global.LTHDateFormatMoment) + "Z"
                  ),
                  String(
                    moment(endTime)
                      .utc()
                      .format(Global.LTHDateFormatMoment) + "Z"
                  )
                );
              }
            }
          ],
          { cancelable: false }
        );
      }
    } else {
      this.props.navigation.navigate(Routes.appointmentSummary, {
        startTime: startTime,
        endTime: endTime,
        bookingDate: bookingDate,
        appointment_address:
          this.state.sub_address + this.state.formattedAddress
      });
    }
  }

  getDateSlots() {
    var dateList = [0, 1, 2, 3, 4, 5, 6];
    if (this.state.appointment_bundle.isHomecollection !== 1) {
      dateList = [0, 1, 2, 3, 4, 5, 6];
    }
    var row = [];

    dateList.forEach(val => {
      row.push(
        <Ripple
          style={{
            backgroundColor:
              moment()
                .add(val, "days")
                .format("DD MMM") === this.state.selected_date.format("DD MMM")
                ? Color.appointmentBlue
                : "white",
            flexDirection: "row",
            borderRadius: 60,
            borderColor: Color.appointmentBlue,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 6,
            paddingBottom: 6,
            borderWidth: 1,
            marginLeft: 6,
            marginTop: 8,
            marginBottom: 8,
            flex: 1,
            marginRight:
              val ===
              (this.state.appointment_bundle.isHomecollection !== 1 ? 7 : 6)
                ? 36
                : 6
          }}
          onPress={() => {
            this.setState({
              selected_date: moment().add(val, "days")
            });
          }}
        >
          <View>
            <Text
              style={{
                color:
                  moment()
                    .add(val, "days")
                    .format("DD MMM") !==
                  this.state.selected_date.format("DD MMM")
                    ? Color.appointmentBlue
                    : "white"
              }}
            >
              {String(
                moment()
                  .add(val, "days")
                  .format("DD MMM")
              )}
            </Text>
          </View>
        </Ripple>
      );
    });
    return (
      <ScrollView
        style={{ paddingLeft: 16, paddingRight: 16 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {row}
      </ScrollView>
    );
  }

  //   getDateSlots2(){
  //     var dateList = [0,1,2];
  //     var dateList1 = [3,4,5];
  //     var dateList2 = [6,7,8];
  //     var row = []
  //     var row1 = []
  //     var row2 = []

  //     dateList.forEach((val) => {
  //       row.push(
  //         <Ripple
  //           style={{backgroundColor: (moment().add(val, 'days').format('DD MMM') === this.state.selected_date.format('DD MMM')) ? Color.appointmentBlue : 'white', flexDirection: 'row', height:80,
  //           width:80, borderRadius : 60, borderColor: Color.appointmentBlue, paddingLeft: 12 , paddingRight: 12, paddingTop: 6, paddingBottom: 6, borderWidth : 1, marginLeft:6, marginTop: 8, marginBottom: 8,  marginRight: (val === 6) ? 36 : 6}}
  //           onPress={() => {
  //             this.setState({
  //               selected_date: moment().add(val, 'days')
  //             })
  //           }}
  //         >
  //           <View style = {{justifyContent:'center'}}>
  //             <Text style={{color: (moment().add(val, 'days').format('DD MMM') !== this.state.selected_date.format('DD MMM')) ? Color.appointmentBlue : 'white'}}>{String(moment().add(val, 'days').format('DD MMM'))}</Text>
  //           </View>
  //         </Ripple>
  //       )
  //       }
  //     )
  //     dateList1.forEach((val) => {
  //       row1.push(
  //         <Ripple
  //           style={{backgroundColor: (moment().add(val, 'days').format('DD MMM') === this.state.selected_date.format('DD MMM')) ? Color.appointmentBlue : 'white', flexDirection: 'row', height:80,
  //           width:80, borderRadius : 60, borderColor: Color.appointmentBlue, paddingLeft: 12 , paddingRight: 12, paddingTop: 6, paddingBottom: 6, borderWidth : 1, marginLeft:6, marginTop: 8, marginBottom: 8,  marginRight: (val === 6) ? 36 : 6}}
  //           onPress={() => {
  //             this.setState({
  //               selected_date: moment().add(val, 'days')
  //             })
  //           }}
  //         >
  //           <View style = {{justifyContent:'center'}}>
  //             <Text style={{color: (moment().add(val, 'days').format('DD MMM') !== this.state.selected_date.format('DD MMM')) ? Color.appointmentBlue : 'white'}}>{String(moment().add(val, 'days').format('DD MMM'))}</Text>
  //           </View>
  //         </Ripple>
  //       )
  //       }
  //     )
  //     dateList2.forEach((val) => {
  //       row2.push(
  //         <Ripple
  //           style={{backgroundColor: (moment().add(val, 'days').format('DD MMM') === this.state.selected_date.format('DD MMM')) ? Color.appointmentBlue : 'white', flexDirection: 'row', height:80,
  //           width:80, borderRadius : 60, borderColor: Color.appointmentBlue, paddingLeft: 12 , paddingRight: 12, paddingTop: 6, paddingBottom: 6, borderWidth : 1, marginLeft:6, marginTop: 8, marginBottom: 8,  marginRight: 6}}
  //           onPress={() => {
  //             this.setState({
  //               selected_date: moment().add(val, 'days')
  //             })
  //           }}
  //         >
  //           <View style = {{justifyContent:'center'}}>
  //             <Text style={{textAlign:'center',color: (moment().add(val, 'days').format('DD MMM') !== this.state.selected_date.format('DD MMM')) ? Color.appointmentBlue : 'white'}}>{String(moment().add(val, 'days').format('DD MMM'))}</Text>
  //           </View>
  //         </Ripple>
  //       )
  //       }
  //     )
  //     return(<ScrollView style={{paddingLeft: 16, paddingRight: 16, paddingTop:16}} vertical={true} showsHorizontalScrollIndicator={false}>
  //       <View style={{justifyContent:'center', flexDirection:'row'}}>{row}</View>
  //       <View style={{justifyContent:'center',  flexDirection:'row'}}>{row1}</View>
  //       <View style={{justifyContent:'center',  flexDirection:'row'}}>{row2}</View>
  //       </ScrollView>)
  // }

  getTimeSlots() {
    var row = [];
    var hor_row = [];
    var innerRow = [];
    var count = 0;
    var slot_array = this.state.slot_array;
    let weekend = false;

    let todaysDay = moment().format("dddd");

    let selectedDay = this.state.selected_date.day();

    if (selectedDay == 0) {
      weekend = true;
    }

    let weeks = [
      { day: "Sunday", index: 0 },
      { day: "Monday", index: 1 },
      { day: "Tuesday", index: 2 },
      { day: "Wednesday", index: 3 },
      { day: "Thursday", index: 4 },
      { day: "Friday", index: 5 },
      { day: "Saturday", index: 6 }
    ];
    var k = 0;
    weeks.map(ins => {
      if (todaysDay == ins.day) {
        k = ins.index;
      }
    });

    // Alert.alert("sss", k.toString());

    let endTime = 5;
    if (k == 0) {
      endTime = 1;
    }

    for (var i = 0; i < 12; i++) {
      if (weekend) {
        var startTime = moment("7 am", "h a");
        endTime = 1;
      } else {
        var startTime = moment("7 am", "h a");
      }

      hor_row.push(startTime.add(i, "hour").format("h a"));
    }

    hor_row.forEach(item => {
      innerRow.push(
        <Ripple
          key={count}
          style={{
            paddingTop: 30,
            paddingBottom: 30,
            flex: 1,
            borderWidth: Global.iOSPlatform ? StyleSheet.hairlineWidth : 0.2,
            borderColor: Color._DF,
            backgroundColor:
              this.state.selected_date.format("DD MMM") ===
              moment().format("DD MMM")
                ? !moment(item, "h a").isBefore(moment()) &&
                  !moment(item, "h a").isAfter(moment(`${endTime}pm`, "h a"))
                  ? this.state.slot_array.indexOf(item) !== -1
                    ? Color.appointmentBlue
                    : "white"
                  : "#f4f4f4"
                : !moment(item, "h a").isAfter(moment(`${endTime}pm`, "h a"))
                ? this.state.slot_array.indexOf(item) !== -1
                  ? Color.appointmentBlue
                  : "white"
                : "#f4f4f4"
          }}
          onPress={() => {
            if (
              (moment(item, "h a").isBefore(moment()) &&
                this.state.selected_date.format("DD MMM") ===
                  moment().format("DD MMM")) ||
              (moment(item, "h a").isAfter(moment(`${endTime}pm`, "h a")) &&
                this.state.selected_date.format("DD MMM"))
            ) {
            } else {
              var slot_array = this.state.slot_array;
              if (slot_array.length === 1) {
                if (item === slot_array[0]) {
                  slot_array.push(item);
                } else {
                  for (var i = 1; i < 12; i++) {
                    var startTime = moment(slot_array[0], "h a");
                    var addedTime = moment();
                    if (
                      moment(item, "h a").isBefore(moment(slot_array[0], "h a"))
                    ) {
                      addedTime = startTime.subtract(i, "hour").format("h a");
                    } else {
                      addedTime = startTime.add(i, "hour").format("h a");
                    }
                    slot_array.push(addedTime);
                    if (addedTime === item) {
                      break;
                    }
                  }
                }
              } else if (slot_array.length > 1) {
                slot_array = [];
                slot_array.push(item);
              } else if (slot_array.length === 0) {
                slot_array.push(item);
              }

              this.setState({
                slot_array: slot_array
              });
            }
          }}
        >
          <Text
            style={{
              color:
                this.state.selected_date.format("DD MMM") ===
                moment().format("DD MMM")
                  ? !moment(item, "h a").isBefore(moment()) &&
                    !moment(item, "h a").isAfter(moment(`${endTime}pm`, "h a"))
                    ? this.state.slot_array.indexOf(item) === -1
                      ? Color.appointmentBlue
                      : "white"
                    : "#8c8c8c"
                  : !moment(item, "h a").isAfter(moment(`${endTime}pm`, "h a"))
                  ? this.state.slot_array.indexOf(item) === -1
                    ? Color.appointmentBlue
                    : "white"
                  : "#8c8c8c",

              textAlign: "center",
              fontSize: 18
            }}
          >
            {item}
          </Text>
        </Ripple>
      );
      count++;
      if (count % 4 === 0) {
        row.push(<View style={{ flexDirection: "row" }}>{innerRow}</View>);
        innerRow = [];
      }
    });

    return <View style={{ marginTop: 16, marginBottom: 16 }}>{row}</View>;
  }

  rescheduleAppointment(startTime, endTime) {
    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let params =
          "token=" +
          (token || "") +
          "&referenceId=" +
          (this.props.referenceId || "") +
          "&changeType=" +
          (2 || "") +
          "&startTime=" +
          (startTime || "") +
          "&endTime=" +
          (endTime || "");
        var _this = this;
        NetworkRequest(_this, "POST", URLs.updateHomecollection, params)
          .then(result => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                this.loadingManipulate(false);
                // this.setState({isAppeared:false, cancelDialog:false, isLoading:true, openTimeSlot:false})

                Alert.alert("Homecollection", "Booking updated sucessfully");
                this.props.closeTimeModal();
              } else if ((result.response.code || 0) === 500) {
                console.log("FAILURE");
                Alert.alert("Homecollection", "Could not update booking");
                //  this.setState({isStateRepFlag:true})
                //  this.loadingManipulate(false)
              } else {
                //   this.loadingManipulate(false)
              }
            }
          })
          .catch(error => {
            Alert.alert("Homecollection", "Could not update booking");

            //  this.loadingManipulate(false)
            // this.setState({isStateRepFlag:true})
            console.error(error);
          });
      })
      .catch(error => {
        Alert.alert("Homecollection", "Could not update booking");

        // this.loadingManipulate(false)
        // this.setState({isStateRepFlag:true})
        console.error(error);
      });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          marginTop: Global.isIphoneX ? 30 : 0
        }}
      >
        {this.props.isReschedule ? (
          <CloseBar
            goBack={this.props.closeTimeModal}
            color={"black"}
            style={{ paddingBottom: 0 }}
          />
        ) : null}
        <ScrollView>
          <HeaderListExtraLarge
            header={
              !this.props.isReschedule
                ? "Booking Details"
                : "Reschedule booking"
            }
            description="Confirm the dates & timings for home visit with your location"
            style={{ flex: 0, paddingTop: this.props.isReschedule ? 6 : 40 }}
          ></HeaderListExtraLarge>

          {this.getDateSlots()}
          {this.state.appointment_bundle.isHomecollection === 1 ||
          this.props.isReschedule
            ? this.getTimeSlots()
            : null}
          {!this.props.isReschedule ? (
            <View>
              <Text
                style={{
                  fontSize: 18,
                  color: Color._4A,
                  paddingLeft: 24,
                  marginBottom: -4,
                  paddingTop: 24,
                  fontWeight: "500"
                }}
              >
                Your Address
              </Text>
              <View>
                <TextInput
                underlineColorAndroid ={'grey'}
                  value={this.state.sub_address}
                  ref="sub_address_ref"
                  placeholder="Building name & flat no."
                  style={{
                    height: 50,
                    paddingLeft: 8,
                    paddingRight: 16,
                    marginLeft: 16,
                    marginRight: 16,
                    marginTop: 16,
                    fontSize: 16
                  }}
                  multiline={true}
                  placeholderTextColor={"#ccc"}
                  onChangeText={text => {
                    var isBuilding = false;
                    if (
                      !text &
                      (this.state.appointment_bundle.isHomecollection === 1)
                    ) {
                      isBuilding = true;
                    }
                    this.setState({
                      sub_address: text,
                      isBuilding: isBuilding
                    });
                  }}
                />

                {Global.iOSPlatform ? (
                  <View
                    style={{
                      height: 0.5,
                      marginLeft: 18,
                      marginRight: 18,
                      marginTop: -12,
                      marginBottom: 16,
                      backgroundColor: "#DFDFDF"
                    }}
                  />
                ) : null}

                {this.state.isBuilding ? (
                  <Text
                    style={{
                      marginLeft: 16,
                      marginBottom: 8,
                      fontFamily: "Arial",
                      color: "red",
                      fontSize: 12
                    }}
                  >
                    *This field is necessary for home collection{" "}
                  </Text>
                ) : null}
              </View>

              <View>
                <TextInput
                underlineColorAndroid ={'grey'}
                  value={this.state.formattedAddress}
                  placeholder="Your Address"
                  style={{
                    height: 75,
                    paddingLeft: 8,
                    paddingRight: 16,
                    marginLeft: 16,
                    marginRight: 16,
                    fontSize: 16
                  }}
                  multiline={true}
                  placeholderTextColor={"#ccc"}
                  editable={false}
                  onChangeText={text => {
                    this.setState({
                      formattedAddress: text
                    });
                  }}
                />
                {Global.iOSPlatform ? (
                  <View
                    style={{
                      height: 0.5,
                      marginLeft: 16,
                      marginRight: 16,
                      marginTop: -12,
                      backgroundColor: "#DFDFDF"
                    }}
                  />
                ) : null}
              </View>

              <Text
                style={{
                  fontSize: 18,
                  color: Color._4A,
                  paddingLeft: 24,
                  marginBottom: -4,
                  paddingTop: 24,
                  fontWeight: "500"
                }}
              >
                Your Comments
              </Text>
              <View>
                <TextInput
                underlineColorAndroid ={'grey'}
                  placeholder="Comments (optional)"
                  style={{
                    height: 50,
                    paddingLeft: 8,
                    paddingRight: 16,
                    marginLeft: 16,
                    marginRight: 16,
                    marginTop: 24,
                    fontSize: 16
                  }}
                  placeholderTextColor={"#ccc"}
                  multiline={true}
                  onChangeText={text => {
                    this.setState({
                      comments: text
                    });
                  }}
                />
                {Global.iOSPlatform ? (
                  <View
                    style={{
                      height: 0.5,
                      marginLeft: 16,
                      marginRight: 16,
                      marginTop: -12,
                      backgroundColor: "#DFDFDF"
                    }}
                  />
                ) : null}
              </View>
            </View>
          ) : null}
          <View style={{ height: 64 }} />
        </ScrollView>

        <Ripple
          style={{
            padding: 16,
            backgroundColor: Color.appointmentBlue,
            width: Global.screenWidth,
            bottom: Global.isIphoneX ? 10 : 0
          }}
          onPress={() => {
            this.gotoAppointmentSummary();
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Arial",
                color: "white",
                textAlign: "center",
                fontSize: 12,
                fontSize: 14
              }}
            >
              CONFIRM
            </Text>
          </View>
        </Ripple>

        {this.state.isLoading ? <ProgressBar /> : null}
      </View>
    );
  }
}
