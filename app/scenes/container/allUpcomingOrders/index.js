import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  Linking,
  Alert,
  Animated,
  TextInput,
  NetInfo
} from "react-native";
import moment from "moment";
import {
  Routes,
  Color,
  Global,
  URLs,
  NetworkRequest,
  UserDefaults,
  stringsUserDefaults,
  CommonStyles
} from "../../../utils";
import PropTypes from 'prop-types';
// import {Select, Option} from "react-native-chooser";
import styles from "./styles";
import { CloseBar, ModalBox, ModalDropdown, Separator } from "../../components";
import { ProgressBar, Ripple, SearchBox } from "../../components";
import { HeaderListExtraLarge, StateRepresentation } from "../../layouts";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ScrollableTabs, {
  ScrollableTabBar,
  ScrollableTabView
} from "../../components/tabbar.android.scrollable";

import AllHomeCollections from "../allHomeCollections/";
import AllAppointments from "../allAppointments/";
import DialogHeader from "../../components/dialog.header";

import { TabViewAnimated, TabBar, SceneMap } from "../../components/tabbar/";
import DatePicker from "../../components/datepicker";
import TimeSlots from "../time.slots/";
var _this = null;

const FirstRoute = () => (
  <View style={{ flex: 1 }}>
    <AllAppointments
      cancelAppointment={_this.cancelAppointment}
      rescheduleAppointment={_this.rescheduleAppointment}
      menu={_this.menuOptions}
    />
  </View>
);

const SecondRoute = () => (
  <View style={{ flex: 1 }}>
    <AllHomeCollections
      cancelHomecollection={_this.cancelAppointment}
      openTimeSlots={_this.OpenTimeSlots}
      menu={_this.menuOptions}
    />
  </View>
);

const StateRep = () => (
  <View style={{ flex: 1 }}>
    <StateRepresentation
      image="signal-wifi-off"
      description="No Internet connection"
    />
  </View>
);

export default class AllUpcomingOrders extends Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.state = {
      isLoading: false,
      rejectedNote: "",
      index: 0,
      apptId: 0,
      referenceId: 0,
      bundle: [],
      isVisible: false,
      isAppeared: true,
      isReady: false,
      isHomeCollection: false,
      openTimeSlot: false,
      openDateModal: false,
      isRescheduleAppointment: false,
      menuModal: false,
      isChanged: false,
      isConnection: false,
      selected_date: moment(),
      routes: [
        { key: "1", title: "Appointments" },
        { key: "2", title: "Home Collections" }
      ]
    };

    _this = this;

    this.cancelAppointment = this.cancelAppointment.bind(this);
    this.OpenTimeSlots = this.OpenTimeSlots.bind(this);
    this.goback = this.goback.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClosingState = this.onClosingState.bind(this);
    this.submitCancelAppointment = this.submitCancelAppointment.bind(this);
    this.submitCancelHomeCollection = this.submitCancelHomeCollection.bind(
      this
    );
    this.closeTimeModal = this.closeTimeModal.bind(this);
    this.rescheduleAppointment = this.rescheduleAppointment.bind(this);
    this.renderDateModal = this.renderDateModal.bind(this);
    this.confirmRescheduleAppointment = this.confirmRescheduleAppointment.bind(
      this
    );
    this.loadingManipulate = this.loadingManipulate.bind(this);
    this.menuOptions = this.menuOptions.bind(this);
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => (
    <TabBar indicatorStyle={styles.indicatorStyle} {...props} />
  );

  _renderScene = SceneMap({
    "1": FirstRoute,
    "2": SecondRoute
  });

  componentWillMount() {
    //const { params } = this.props.navigation.state;
    this.props.type ? this.setState({ index: 1 }) : this.setState({ index: 0 });
    //  this.setState({index:params.num})
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isReady: true
      });
    }, 500);
  }

  loadingManipulate(flag) {
    this.setState({
      isLoading: flag
    });
  }

  goback() {
    // this.props.navigation.goBack()
    this.props.closeModal();
  }

  onClose() {
    this.setState({
      menuModal: false,
      cancelDialog: false,
      openTimeSlot: false,
      openDateModal: false,
      rejectedNote: ""
    });
    console.log("Modal just closed");
  }
  onOpen() {
    console.log("Modal just openned");
  }
  onClosingState(state) {
    console.log("the open/close of the swipeToClose just changed");
  }

  _onRequestChangeTab(ind) {
    console.log("REQUESTED");
    this.setState({
      index: ind
    });
  }

  closeTimeModal() {
    this.setState({ openTimeSlot: false, isAppeared: false });

    setTimeout(() => {
      this.setState({ isAppeared: true });
    }, 100);
  }

  menuOptions(id, flag, bundle) {
    if (flag === 1) {
      this.setState({
        menuModal: true,
        apptId: id,
        isHomeCollection: false
      });
    } else if (flag === 2) {
      this.setState({
        menuModal: true,
        referenceId: id,
        isHomeCollection: true,
        bundle: bundle
      });
    }
  }

  cancelAppointment() {
    //id, flag

    this.setState({
      menuModal: false,
      cancelDialog: true
    });
    // if(flag===1){
    //         this.setState({
    //           cancelDialog:true,
    //           apptId:id,
    //           isHomeCollection:false,
    //           menuModal:false
    //         })
    //       }else if(flag===2){
    //         this.setState({
    //           cancelDialog:true,
    //           referenceId:id,
    //           isHomeCollection: true,
    //           menuModal:false
    //         })
    //       }
  }

  submitCancelAppointment() {
    var appoinId = this.state.apptId;
    var note = this.state.rejectedNote;

    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let params =
          "token=" +
          (token || "") +
          "&appointmentId=" +
          (this.state.apptId || "") +
          "&rejectedNote=" +
          (this.state.rejectedNote || "");
        var _this = this;
        NetworkRequest(_this, "POST", URLs.rejectAppointment, params)
          .then(result => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                this.loadingManipulate(false);
                setTimeout(() => {
                  Alert.alert(
                    "Appointment",
                    "Appointment cancelled sucessfully",
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          this.setState({
                            isAppeared: false,
                            cancelDialog: false,
                            isLoading: true,
                            rejectedNote: "",
                            isChanged: true
                          });

                          setTimeout(() => {
                            this.setState({
                              isAppeared: true,
                              isLoading: false
                            });
                          }, 200);
                        }
                      }
                    ],
                    { cancelable: false }
                  );

                  if (this.props.getData) {
                    this.props.getData();
                  }
                }, 200);
              } else if ((result.response.code || 0) === 500) {
                console.log("FAILURE");

                Alert.alert("Appointment", "Could not cancel appointment", [
                  {
                    text: "OK",
                    onPress: () => {
                      this.setState({ isLoading: false });
                    }
                  }
                ]);
              } else {
                this.loadingManipulate(false);
              }
            }
          })
          .catch(error => {
            this.setState({ isLoading: false });
            console.error(error);
          });
      })
      .catch(error => {
        this.setState({ isLoading: false });
        console.error(error);
      });
  }

  submitCancelHomeCollection() {
    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let params =
          "token=" +
          (token || "") +
          "&referenceId=" +
          (this.state.referenceId || "") +
          "&changeType=" +
          (3 || "") +
          "&rejectComment=" +
          (this.state.rejectedNote || "");

        var _this = this;
        NetworkRequest(_this, "POST", URLs.updateHomecollection, params)
          .then(result => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                Alert.alert(
                  "Homecollection",
                  "Order cancelled sucessfully",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        this.setState({
                          isAppeared: false,
                          cancelDialog: false,
                          isLoading: true,
                          rejectedNote: "",
                          isChanged: true
                        });

                        setTimeout(() => {
                          this.setState({ isAppeared: true, isLoading: false });
                        }, 200);
                      }
                    }
                  ],
                  { cancelable: false }
                );

                if (this.props.getData) {
                  this.props.getData();
                }
              } else if ((result.response.code || 0) === 500) {
                console.log("FAILURE");

                Alert.alert(
                  "Homecollection",
                  "Could not cancel home collection",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        this.setState({
                          isLoading: false
                        });
                      }
                    }
                  ]
                );
              } else {
                this.loadingManipulate(false);
              }
            }
          })
          .catch(error => {
            this.setState({ isLoading: false });
            console.error(error);
          });
      })
      .catch(error => {
        this.setState({ isLoading: false });
        console.error(error);
      });
  }

  OpenTimeSlots() {
    this.setState({
      openTimeSlot: true,
      menuModal: false
      //  referenceId:referenceId,
      // bundle:bundle
    });
  }

  rescheduleAppointment() {
    //appId
    console.log("RESCHEDULE", this.state.apptId);
    this.setState({
      menuModal: false,
      openDateModal: true,
      // apptId:appId,
      cancelDialog: true
    });
  }

  confirmRescheduleAppointment() {
    var bookingDate = String(
      moment(this.state.selected_date)
        .utc()
        .format(Global.LTHDateFormatMoment) + "Z"
    );

    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let params =
          "token=" +
          (token || "") +
          "&appointmentId=" +
          (this.state.apptId || "") +
          "&userAppointmentDate=" +
          (bookingDate || "");
        var _this = this;
        NetworkRequest(_this, "POST", URLs.rescheduleAppointment, params)
          .then(result => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                this.loadingManipulate(false);
                setTimeout(() => {
                  Alert.alert(
                    "Appointment",
                    "Appointment updated sucessfully",
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          this.setState({
                            isAppeared: false,
                            cancelDialog: false,
                            isLoading: true,
                            isChanged: true
                          });

                          setTimeout(() => {
                            this.setState({
                              isAppeared: true,
                              isLoading: false
                            });
                          }, 200);
                        }
                      }
                    ],
                    { cancelable: false }
                  );
                }, 200);

                if (this.props.getData) {
                  this.props.getData();
                }
              } else if ((result.response.code || 0) === 500) {
                console.log("FAILURE");
                Alert.alert(
                  "Appointment",
                  "Could not reschedule appointment",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        this.setState({ isLoading: false });
                      }
                    }
                  ],
                  { cancelable: false }
                );
              } else {
                this.loadingManipulate(false);
              }
            }
          })
          .catch(error => {
            this.setState({ isLoading: false });
            console.error(error);
          });
      })
      .catch(error => {
        this.setState({ isLoading: false });
        console.error(error);
      });
  }

  renderDateModal() {
    return (
      <View
        style={{
          marginTop: 10,
          paddingTop: 20,
          paddingBottom: 24,
          flexDirection: "column",
          margin: 20,
          backgroundColor: "#ffffff",
          borderRadius: 6,
          borderWidth: 0.5,
          borderColor: Color._DF
        }}
      >
        <DialogHeader
          style={{
            paddingLeft: 20,
            paddingTop: 8,
            paddingBottom: 0,
            fontSize: 20
          }}
          title={"Reschedule Appointment"}
          secondaryTitle={"Confirm a new date for your appointment"}
        />
        {this.getDateSlots2()}

        <View style={{ flexDirection: "row" }}>
          <Ripple
            style={{
              padding: 14,
              bottom: -12,
              left: 18,
              borderRadius: 6,
              color: "black"
            }}
            onPress={() => {
              this.onClose();
            }}
          >
            <View>
              <Text
                style={{
                  color: "grey",
                  fontWeight: "500",
                  fontFamily: "Arial",
                  textAlign: "center",
                  fontSize: 12,
                  fontSize: 14
                }}
              >
                DISMISS
              </Text>
            </View>
          </Ripple>

          <View style={{ flex: 1 }} />

          <Ripple
            style={{ padding: 14, bottom: -12, right: 18, borderRadius: 6 }}
            onPress={() => {
              this.loadingManipulate(true);
              this.confirmRescheduleAppointment();
            }}
          >
            <View>
              <Text
                style={{
                  fontWeight: "500",
                  color: Color.theme_blue,
                  fontFamily: "Arial",
                  textAlign: "center",
                  fontSize: 12,
                  fontSize: 14
                }}
              >
                CONFIRM
              </Text>
            </View>
          </Ripple>
        </View>
      </View>
    );
  }

  getDateSlots2() {
    var dateList = [0, 1, 2];
    var dateList1 = [3, 4, 5];
    var dateList2 = [6, 7, 8];
    var row = [];
    var row1 = [];
    var row2 = [];

    dateList.forEach(val => {
      row.push(
        <Ripple
          style={{
            justifyContent: "center",
            backgroundColor:
              moment()
                .add(val, "days")
                .format("DD MMM") === this.state.selected_date.format("DD MMM")
                ? Color.appointmentBlue
                : "white",
            flexDirection: "row",
            height: 40,
            width: 80,
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
            marginRight: val === 6 ? 36 : 6
          }}
          onPress={() => {
            this.setState({
              selected_date: moment().add(val, "days")
            });
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{
                color:
                  moment()
                    .add(val, "days")
                    .format("DD MMM") !==
                  this.state.selected_date.format("DD MMM")
                    ? Color.appointmentBlue
                    : "white",
                textAlign: "center"
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
    dateList1.forEach(val => {
      row1.push(
        <Ripple
          style={{
            justifyContent: "center",
            backgroundColor:
              moment()
                .add(val, "days")
                .format("DD MMM") === this.state.selected_date.format("DD MMM")
                ? Color.appointmentBlue
                : "white",
            flexDirection: "row",
            height: 40,
            width: 80,
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
            marginRight: val === 6 ? 36 : 6
          }}
          onPress={() => {
            this.setState({
              selected_date: moment().add(val, "days")
            });
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{
                textAlign: "center",
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
    dateList2.forEach(val => {
      row2.push(
        <Ripple
          style={{
            justifyContent: "center",
            backgroundColor:
              moment()
                .add(val, "days")
                .format("DD MMM") === this.state.selected_date.format("DD MMM")
                ? Color.appointmentBlue
                : "white",
            flexDirection: "row",
            height: 40,
            width: 80,
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
            marginRight: 6
          }}
          onPress={() => {
            this.setState({
              selected_date: moment().add(val, "days")
            });
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{
                textAlign: "center",
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
        style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16 }}
        vertical={true}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        <View style={{ justifyContent: "center", flexDirection: "row" }}>
          {row}
        </View>
        <View style={{ justifyContent: "center", flexDirection: "row" }}>
          {row1}
        </View>
        <View style={{ justifyContent: "center", flexDirection: "row" }}>
          {row2}
        </View>
      </ScrollView>
    );
  }

  render() {
    // if(this.state.rejectedNote.length>5){
    //   this.setState({
    //     isVisible:true
    //   })
    // }

    // const { params } = this.props.navigation.state;

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <CloseBar goBack={this.goback.bind(this)} color={"black"} />
        <HeaderListExtraLarge
          header="Upcoming orders"
          description="List of all booked upcoming orders"
          style={{ flex: 0, paddingTop: 0 }}
        />

        {this.state.isAppeared && this.state.isReady ? (
          <TabViewAnimated
            style={styles.container}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderHeader={this._renderHeader}
            onIndexChange={this._handleIndexChange}
            onRequestChangeTab={ind => {
              this._onRequestChangeTab(ind);
            }}
          />
        ) : null}

        {this.state.cancelDialog ? (
          <ModalBox
            style={{
              justifyContent: "center",
              borderRadius: 6,
              backgroundColor: " rgba(0, 0, 0, 0)"
            }}
            ref={"modal1"}
            swipeThreshold={200}
            isOpen={true}
            swipeToClose={this.state.swipeToClose}
            onClosed={this.onClose}
            position={"top"}
            backdrop={true}
            keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
            onOpened={this.onOpen}
            onClosingState={this.onClosingState}
          >
            {!this.state.openDateModal ? (
              <View
                style={{
                  paddingTop: 10,
                  flexDirection: "column",
                  margin: 40,
                  backgroundColor: "#ffffff",
                  borderRadius: 6,
                  borderWidth: 0.5,
                  borderColor: Color._DF
                }}
              >
                <DialogHeader
                  style={styles.dialog_styles}
                  title={
                    !this.state.isHomeCollection
                      ? "Cancel Appointment"
                      : "Cancel Home Collection"
                  }
                  secondaryTitle={
                    "Your" +
                    (!this.state.isHomeCollection
                      ? " Appointment "
                      : " Home collection ") +
                    "will be cancelled"
                  }
                />

                <View
                  style={{
                    paddingLeft: 20,
                    paddingBottom: 6,
                    paddingRight: 20,
                    paddingTop: 12
                  }}
                >
                  {/* <Text style={{fontFamily: 'Arial'}}>Comments</Text> */}

                  <TextInput
                    style={{ height: 40, fontSize: 16 }}
                    placeholder="Enter your comments"
                    placeholderTextColor={"#ccc"}
                    onChangeText={text => {
                      this.setState({ rejectedNote: text });
                    }}
                    multiline={true}
                  />

                  <View style={{ flexDirection: "row", paddingBottom: 10 }}>
                    <Text
                      onPress={() => {
                        this.onClose();
                      }}
                      style={[
                        CommonStyles.button_style,
                        { paddingTop: 20, paddingRight: 12 }
                      ]}
                    >
                      CLOSE
                    </Text>
                    <View style={{ flex: 1 }}></View>

                    {this.state.rejectedNote.length >= 5 ? (
                      <Ripple
                        onPress={() => {
                          this.loadingManipulate(true);
                          !this.state.isHomeCollection
                            ? this.submitCancelAppointment()
                            : this.submitCancelHomeCollection();
                        }}
                      >
                        <Text
                          style={[
                            CommonStyles.button_style,
                            {
                              paddingTop: 20,
                              paddingBottom: 10,
                              color: Color.redExit
                            }
                          ]}
                        >
                          YES, CANCEL
                        </Text>
                      </Ripple>
                    ) : (
                      <Text
                        style={[
                          CommonStyles.button_style,
                          { paddingTop: 20, paddingBottom: 10, color: "#ccc" }
                        ]}
                      >
                        YES, CANCEL
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              this.renderDateModal()
            )}
          </ModalBox>
        ) : null}

        {this.state.openTimeSlot ? (
          <ModalBox
            style={{
              justifyContent: "center",
              borderRadius: 6,
              backgroundColor: " rgba(0, 0, 0, 0)"
            }}
            ref={"modal1"}
            swipeThreshold={200}
            isOpen={this.state.openTimeSlot}
            swipeToClose={this.state.swipeToClose}
            onClosed={this.onClose}
            position={"top"}
            backdrop={true}
            keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
            onOpened={this.onOpen}
            onClosingState={this.onClosingState}
          >
            <TimeSlots
              isReschedule={true}
              referenceId={this.state.referenceId}
              closeTimeModal={this.closeTimeModal}
              bundle={this.state.bundle}
            />
          </ModalBox>
        ) : null}

        {this.state.menuModal ? (
          <ModalBox
            style={{
              justifyContent: "center",
              borderRadius: 6,
              backgroundColor: " rgba(0, 0, 0, 0)"
            }}
            ref={"modal1"}
            swipeThreshold={200}
            isOpen={true}
            swipeToClose={this.state.swipeToClose}
            onClosed={this.onClose}
            position={"top"}
            backdrop={true}
            keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
            onOpened={this.onOpen}
            onClosingState={this.onClosingState}
          >
            <View
              style={{
                paddingTop: 10,
                paddingBottom: 6,
                flexDirection: "column",
                margin: 40,
                backgroundColor: "#ffffff",
                borderRadius: 6,
                borderWidth: 0.5,
                borderColor: Color._DF
              }}
            >
              <DialogHeader
                style={{
                  paddingLeft: 26,
                  paddingTop: 10,

                  fontSize: 20
                }}
                title={"Choose"}
              />
              <Ripple
                rippleOpacity={0.2}
                style={{ padding: 8 }}
                onPress={() => {
                  this.state.isHomeCollection
                    ? this.OpenTimeSlots()
                    : this.rescheduleAppointment();
                }}
              >
                <Text
                  style={{
                    paddingLeft: 18,
                    fontFamily: "Arial",
                    fontSize: 18,
                    paddingBottom: 0
                  }}
                >
                  {"Reschedule"}
                </Text>
              </Ripple>
              <Separator
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  marginRight: 24,
                  marginLeft: 24
                }}
              />
              <Ripple
                rippleOpacity={0.2}
                style={{ padding: 8 }}
                onPress={() => {
                  this.cancelAppointment();
                }}
              >
                <Text
                  style={{
                    paddingBottom: 10,
                    paddingLeft: 18,
                    fontFamily: "Arial",
                    fontSize: 18
                  }}
                >
                  {this.state.isHomeCollection
                    ? "Cancel Home collection"
                    : "Cancel Appointment"}
                </Text>
              </Ripple>

              <View style={{ flexDirection: "row", paddingBottom: 10 }}>
                <View style={{ flex: 1 }} />
                <Text
                  onPress={() => {
                    this.onClose();
                  }}
                  style={[CommonStyles.button_style, { paddingRight: 26 }]}
                >
                  CLOSE
                </Text>
              </View>
            </View>
          </ModalBox>
        ) : null}

        {/* {
                this.state.openDateModal ?
                <ModalBox
                    style={{justifyContent: 'center', borderRadius: 6,backgroundColor: ' rgba(0, 0, 0, 0)'}}
                    ref={"modal1"}
                    swipeThreshold={200}
                    isOpen={this.state.openDateModal}
                    swipeToClose={this.state.swipeToClose}
                    onClosed={this.onClose}
                    position={'top'}
                    backdrop={true}
                    keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
                    onOpened={this.onOpen}
                    onClosingState={this.onClosingState}>

                  <TimeSlots
                    isReschedule = {true}
                    isAppointment = {true}
                    referenceId = {this.state.apptId}
                    closeTimeModal = {this.closeTimeModal}
                  />
                </ModalBox>
                :

                (null)
              }  */}

        {/* {(this.state.isLoading) ? (<ProgressBar/>) : (null)} */}
      </View>
    );
  }
}

AllUpcomingOrders.propTypes = {
  var1: PropTypes.string
};

AllUpcomingOrders.defaultProps = {
  var1: ""
};
