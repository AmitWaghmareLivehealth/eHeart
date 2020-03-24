import React, {Component} from 'react';

import {
  View,
  Text,
  Alert,
  ToastAndroid,
  Modal,
  Keyboard,
  ScrollView,
  Animated,
  StyleSheet,
} from 'react-native';
import {HeaderListExtraLarge, StateRepresentation} from '../../layouts';
import {
  URLs,
  Routes,
  Color,
  Global,
  NetworkRequest,
  UserDefaults,
  stringsUserDefaults,
  stringRazorPay,
  CommonStyles,
} from '../../../utils';
import {ProgressBar, Ripple, ModalBox, ProgressCircle} from '../../components';
import CheckBox from 'react-native-check-box';

import RazorpayCheckout from 'react-native-razorpay';
import {NavigationActions} from 'react-navigation';
import moment from 'moment';
import Receipt from '../receipt';

import {connect} from 'react-redux';
export const HOME_COLLECTION_CHARGES = 100;

class AppointmentSummary extends Component {
  constructor(props) {
    super(props);
    this.springValue = new Animated.Value(0.9);
    this.state = {
      startTime: this.props.navigation.state.params.startTime,
      endTime: this.props.navigation.state.params.endTime,
      bookingDate: this.props.navigation.state.params.bookingDate,
      testList: {},
      totalAmount: 0,
      appointment_bundle: {},
      isLoading: false,
      email: '',
      contact: '',
      user_id: 0,
      userDetailsId_id: 0,
      isPayAtCenter: 0,
      uuid: '',
      dialogShow: false,
      receiptDialog: false,
      userName: '',
      showProgress: false,
      completionFlag: 0,
    };
    this.renderSummary = this.renderSummary.bind(this);
    this.getData = this.getData.bind(this);
    this.bookAppointment = this.bookAppointment.bind(this);
    this.paymentStatus = this.paymentStatus.bind(this);
    this.paymentCheck = this.paymentCheck.bind(this);
    this.guid = this.guid.bind(this);
    this.gotoReceiptScreen = this.gotoReceiptScreen.bind(this);

    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClosingState = this.onClosingState.bind(this);
    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.getOrderId = this.getOrderId.bind(this);
  }

  spring() {
    this.springValue.setValue(0.9);
    Animated.spring(this.springValue, {
      toValue: 1,
      friction: 2,
    }).start();
  }

  componentDidMount() {
    this.getData();
  }

  componentWillMount() {
    Keyboard.dismiss();
  }

  loadingManipulate(flag) {
    this.setState({
      isLoading: flag,
    });
  }

  gotoReceiptScreen() {
    this.setState({
      dialogShow: false,
      isLoading: false,
      receiptDialog: true,
    });
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({ routeName: 'receiptScreen'})
    //   ]
    // })
    //
    // this.props.navigation.dispatch(resetAction)
  }

  /**
   * flag is to determine the status of payment if success or failure
   */
  paymentStatus(flag, paymentId: String, order_id: String) {
    if (flag === 1) {
      this.state.appointment_bundle.isPayAtCenter = 0;
      this.state.appointment_bundle.paymentType = 3;
      this.state.appointment_bundle.paymentId = paymentId;
      this.bookAppointment(order_id);
    } else {
      this.state.appointment_bundle.isPayAtCenter = 1;
      this.state.appointment_bundle.paymentType = 0;
      this.state.appointment_bundle.paymentId = '';
      this.bookAppointment();
    }
  }

  getDummyTestInTransactions = () => {
    const transactions = Object.assign(
      {},
      this.state.appointment_bundle.transactions,
    );
    transactions.tests.push({dictionaryId: 662, testID: 2958841});
    // transactions.tests.push({dictionaryId: 1, testID: 7});
    return transactions;
  };

  bookAppointment(order_id) {
    //  this.setState({showProgress:true})
    currentDate =
      this.state.appointment_bundle.isHomecollection === 0 &&
      moment(this.state.appointment_bundle.bookingDate)
        .utc()
        .format('DDMM') ==
        moment()
          .utc()
          .format('DDMM')
        ? moment()
            .endOf('day')
            .utc()
            .format('YYYY-MM-DDThh:mm:ss') + 'Z'
        : this.state.appointment_bundle.bookingDate;
    //    setTimeout(()=>{this.setState({completionFlag:1})}, 2000)

    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let totalAmt =
          this.state.appointment_bundle.isHomecollection === 1
            ? this.state.appointment_bundle.totalAmount +
              HOME_COLLECTION_CHARGES
            : this.state.appointment_bundle.totalAmount;

        var params =
          'token=' +
          token +
          '&latlng=' +
          this.state.appointment_bundle.latlng +
          '&isHomecollection=' +
          this.state.appointment_bundle.isHomecollection +
          '&labTestListId=' +
          JSON.stringify(Global.labId) +
          '&isPayAtCenter=' +
          this.state.appointment_bundle.isPayAtCenter +
          '&isStarredLab=' +
          this.state.appointment_bundle.isStarredLab +
          '&paymentType=' +
          this.state.appointment_bundle.paymentType +
          '&couponCode=' +
          this.state.appointment_bundle.couponCode +
          '&amountPaid=' +
          this.state.appointment_bundle.amountPaid +
          '&totalAmount=' +
          totalAmt +
          '&comments=' +
          this.state.appointment_bundle.comments +
          '&transactions=' +
          JSON.stringify(this.getDummyTestInTransactions()) +
          '&bookingDate=' +
          currentDate +
          '&startDate=' +
          this.state.appointment_bundle.startDate +
          '&endDate=' +
          this.state.appointment_bundle.endDate +
          '&address=' +
          this.state.appointment_bundle.address +
          '&paymentId=' +
          this.state.appointment_bundle.paymentId +
          '&city=' +
          this.state.appointment_bundle.city +
          '&order_id=' +
          order_id +
          '&zipCode=' +
          (this.state.appointment_bundle.zipCode || 0);

        var _this = this;

        NetworkRequest(_this, 'POST', URLs.bookings, params)
          .then(result => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                if (this.state.appointment_bundle.isPayAtCenter === 1) {
                  // this.loadingManipulate(false)

                  //this.setState({showProgress:true,completionFlag: 1})

                  //    UserDefaults.set(stringsUserDefaults.appointment_bundle, {})
                  //  UserDefaults.set(stringsUserDefaults.addedTest, {})

                  // setTimeout(() => {
                  //           const resetAction = NavigationActions.reset({
                  //             index: 0,
                  //             actions: [
                  //               NavigationActions.navigate({ routeName: 'homeScreen'})
                  //             ]
                  //           })

                  //           this.props.navigation.dispatch(resetAction)

                  //         },3000)

                  var title = '';
                  var message = '';
                  if (this.state.appointment_bundle.isHomecollection === 0) {
                    title = 'Appointment Confirmed';
                    message = 'Your appointment has been booked successfully.';
                  } else {
                    title = 'Home Collection Confirmed';
                    message =
                      'Your home collection has been booked successfully.';
                  }

                  Alert.alert(
                    title,
                    message,
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          UserDefaults.set(
                            stringsUserDefaults.appointment_bundle,
                            {},
                          );
                          UserDefaults.set(stringsUserDefaults.addedTest, {});

                          setTimeout(() => {
                            const resetAction = NavigationActions.reset({
                              index: 0,
                              actions: [
                                NavigationActions.navigate({
                                  routeName: 'homeScreen',
                                }),
                              ],
                            });

                            this.props.navigation.dispatch(resetAction);
                          }, 50);
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                } else {
                  this.gotoReceiptScreen();
                }
              } else {
                this.loadingManipulate(false);
              }
            } else {
              this.loadingManipulate(false);

              setTimeout(() => {
                Alert.alert('Something went wrong', 'Please try again later');
              }, 300);
            }
          })
          .catch(error => {
            this.loadingManipulate(false);
            console.error(error);
          });
      })
      .catch(error => {
        this.loadingManipulate(false);
        console.error(error);
      });
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    );
  }

  getData() {
    UserDefaults.get(stringsUserDefaults.appointment_bundle)
      .then(appointment_bundle => {
        if (appointment_bundle) {
          this.setState({
            appointment_bundle: appointment_bundle,
          });
          console.log('APPOINTMENT BUNDLE', appointment_bundle);
        }
      })
      .catch(error => {
        console.error(error);
      });

    UserDefaults.get(stringsUserDefaults.addedTest)
      .then(addedTest => {
        if (addedTest) {
          this.setState({
            testList: addedTest,
          });
          return;
        }
      })
      .catch(error => {
        console.error(error);
      });

    UserDefaults.get(stringsUserDefaults.user)
      .then(user => {
        if (user) {
          this.setState({
            email: user.user.email || '',
            contact: user.contact || '',
            user_id: user.user.id || 0,
            userDetailsId_id: user.id || 0,
            userName: user.fullName || '',
          });
        }
      })
      .catch(error => {
        console.error(error);
      });

    var uuid = this.guid();
    this.setState({
      uuid: uuid,
    });
  }

  async paymentCheck(isComplete, isFailed) {
    var timeStamp = moment().format(Global.LTHDateFormatMoment) + 'Z';
    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let params =
          'token=' +
          (token || '') +
          '&id=' +
          (this.state.uuid || '') +
          '&user_id=' +
          (this.state.user_id || '') +
          '&userDetailsId_id=' +
          (this.state.userDetailsId_id || '') +
          '&amount=' +
          (this.state.appointment_bundle.amountPaid + HOME_COLLECTION_CHARGES ||
            0) +
          '&labId=' +
          0 +
          '&labName=' +
          '' +
          '&source=' +
          (Global.iOSPlatform ? 'iOS' : 'Android') +
          '&isReport=' +
          0 +
          '&isAppointment=' +
          (this.state.appointment_bundle.isHomecollection === 1 ? 0 : 1) +
          '&isHomeCollection=' +
          this.state.appointment_bundle.isHomecollection +
          '&isComplete=' +
          isComplete +
          '&isFailed=' +
          isFailed +
          '&activityDate=' +
          (timeStamp || '');

        var _this = this;
        NetworkRequest(_this, 'POST', URLs.trackPayments, params)
          .then(result => {})
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }

  renderSummary() {
    var row = [];
    var amount = 0;
    var count = 0;
    var testList = this.state.testList['data'];

    if (testList === undefined) {
      return null;
    }

    testList.forEach(val => {
      amount += Number(val.item.testAmount);
      count += 1;
      row.push(
        <View>
          <View style={{flexDirection: 'row', padding: 16}}>
            <Text style={{paddingRight: 6, fontSize: 16}}>{count}.</Text>
            <Text style={{flex: 1, fontSize: 16}}>{val.item.testName}</Text>
            <Text style={{paddingLeft: 12, fontSize: 16}}>
              {this.props.currency.currency} {val.item.testAmount}
            </Text>
          </View>
          <View style={{height: 0.5, backgroundColor: Color._DF}} />
        </View>,
      );
    });

    this.state.appointment_bundle.amountPaid = amount;
    this.state.appointment_bundle.totalAmount =
      this.state.appointment_bundle.isHomecollection === 1
        ? (amount = amount + HOME_COLLECTION_CHARGES)
        : amount;

    return (
      <View style={{paddingLeft: 16, paddingRight: 16}}>
        <Text style={{textAlign: 'center', padding: 20, fontSize: 18}}>
          ORDER DETAILS
        </Text>
        {row}

        {this.state.appointment_bundle.isHomecollection === 1 ? (
          <View style={{padding: 16, flexDirection: 'row'}}>
            <Text
              style={{
                flex: 1,
                fontSize: 16,
                fontWeight: '100',
                color: Color.grey,
              }}>
              Sample Collection at Home
            </Text>

            <Text style={{fontSize: 16, fontWeight: '100', color: Color.grey}}>
              {this.props.currency.currency} {HOME_COLLECTION_CHARGES}{' '}
            </Text>
          </View>
        ) : null}

        <View style={{padding: 16, flexDirection: 'row'}}>
          <Text
            style={{
              flex: 1,
              fontSize: 18,
              fontWeight: '500',
              color: Color._4A,
            }}>
            Total Amount
          </Text>

          <Text style={{fontSize: 18, fontWeight: '500', color: Color._4A}}>
            {this.props.currency.currency} {amount}{' '}
          </Text>
        </View>
      </View>
    );
  }

  onClose() {
    this.setState({
      receiptDialog: false,
    });
    console.log('Modal just closed');
  }

  onOpen() {
    console.log('Modal just openned');
  }

  onClosingState(state) {
    console.log('the open/close of the swipeToClose just changed');
  }

  onCloseDialog() {
    this.setState({
      isOpen: false,
      receiptDialog: false,
    });

    UserDefaults.set(stringsUserDefaults.appointment_bundle, {});

    setTimeout(() => {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'homeScreen'})],
      });

      this.props.navigation.dispatch(resetAction);
    }, 50);
  }

  openRazorPay(order_id) {
    var timeStamp = moment().format(Global.LTHDateFormatMoment) + 'Z';
    const amountPaid = this.state.appointment_bundle.amountPaid
      ? this.state.appointment_bundle.amountPaid + HOME_COLLECTION_CHARGES
      : HOME_COLLECTION_CHARGES;

    var options = {
      description: '',
      image: URLs.getLivehealthLogo,
      currency: 'INR',
      order_id: order_id,
      key: stringRazorPay.razorpayKey,
      //  key: 'rzp_test_MdhWQeMJTkdfz0',
      amount: amountPaid * 100 + '',
      name: 'Livehealth',
      notes: {
        isProvider: '0',
        id: this.state.uuid || '',
        user_id: this.state.user_id || '',
        userDetailsId_id: this.state.userDetailsId_id || '',
        amount: amountPaid,
        labId: 0,
        labName: '',
        source: Global.iOSPlatform ? 'iOS' : 'Android',
        isReport: 0,
        isAppointment:
          this.state.appointment_bundle.isHomecollection === 1 ? 0 : 1,
        isHomeCollection: this.state.appointment_bundle.isHomecollection,
        isComplete: 0,
        isFailed: 0,
        activityDate: timeStamp || '',
      },
      prefill: {
        email: this.state.email,
        contact: this.state.contact + '',
      },
      theme: {color: Color.themeColor},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        this.loadingManipulate(true);
        this.paymentStatus(
          1,
          Global.iOSPlatform
            ? data.razorpay_payment_id
            : data.details.razorpay_payment_id,
          order_id,
        );
        this.paymentCheck(1, 0, amountPaid, 0, '');
        // alert(`Success: ${data.details.razorpay_payment_id}`);
      })
      .catch(error => {
        // handle failure
        var message = '';
        if (this.state.appointment_bundle.isHomecollection === 1) {
          message = 'Your payment has failed. Please try again later';
        } else {
          message = 'Your payment has failed. Please try again later';
        }
        this.setState({
          dialogShow: true,
        });
        console.log('OPTIONS', options);
        this.paymentCheck(0, 1, amountPaid, 0, '');

        Alert.alert(
          'Payment Failure',
          message,
          [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      });
  }

  getOrderId() {
    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let params =
          'token=' +
          (token || '') +
          '&isReport=' +
          0 +
          '&amount=' +
          (this.state.appointment_bundle.amountPaid
            ? this.state.appointment_bundle.amountPaid + HOME_COLLECTION_CHARGES
            : HOME_COLLECTION_CHARGES) +
          '&billId=' +
          '';

        var _this = this;
        NetworkRequest(_this, 'POST', URLs.createNewOrder, params)
          .then(result => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                this.loadingManipulate(false);
                setTimeout(() => {
                  this.openRazorPay(result.response.order_id);
                }, 50);
              } else {
                this.loadingManipulate(false);
                this.paymentCheck(0, 1);
              }
            } else {
              this.loadingManipulate(false);
              this.paymentCheck(0, 1);
            }
          })
          .catch(error => {
            this.loadingManipulate(false);
            console.error(error);
          });
      })
      .catch(error => {
        this.loadingManipulate(false);
        console.error(error);
      });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          marginTop: Global.isIphoneX ? 30 : 0,
        }}>
        <ScrollView>
          <HeaderListExtraLarge
            header="Payment"
            description="Confirm & pay for the tests"
            style={{flex: 0}}></HeaderListExtraLarge>
          <Text
            style={{
              paddingTop: 12,
              paddingBottom: 16,
              lineHeight: 30,
              textAlign: 'center',
              justifyContent: 'center',
              backgroundColor: Color.appointmentBlue,
              fontSize: 17,
              color: 'white',
            }}>
            {this.state.appointment_bundle.isHomecollection === 0
              ? 'Appointment on ' +
                moment(this.state.bookingDate).format('dddd - Do MMM, YYYY')
              : 'Home visit on ' +
                moment(this.state.startTime).format('dddd') +
                '\n' +
                moment(this.state.startTime).format('Do MMMM YYYY') +
                ' from ' +
                moment(this.state.startTime).format('h a') +
                ' - ' +
                moment(this.state.endTime).format('h a')}
          </Text>

          <View style={{backgroundColor: Color._DF, height: 0.5}} />

          {this.state.testList !== {} ? this.renderSummary() : null}

          <CheckBox
            style={{
              padding: 12,
              marginLeft: 16,
              marginRight: 16,
              marginTop: 8,
              marginBottom: 8,
              borderWidth: Global.isIphoneX ? 1 : StyleSheet.hairlineWidth,
              borderColor: Color._DF,
            }}
            ref={check_1 => {
              this.check_1 = check_1;
            }}
            onClick={() => {
              if (this.check_1.state.isChecked) {
                this.state.appointment_bundle.isPayAtCenter = 0;
                this.setState({
                  isPayAtCenter: 0,
                });
              } else {
                this.state.appointment_bundle.isPayAtCenter = 1;
                this.setState({
                  isPayAtCenter: 1,
                });
              }
            }}
            isChecked={false}
            rightText={'Cash Payment'}
          />
          <View style={{height: 64}}></View>
        </ScrollView>

        <Ripple
          style={{
            padding: 16,
            backgroundColor: Color.themeColor,
            position: 'absolute',
            width: Global.screenWidth,
            bottom: Global.isIphoneX ? 10 : 0,
          }}
          onPress={() => {
            if (this.state.appointment_bundle.isPayAtCenter === 1) {
              this.loadingManipulate(true);
              this.bookAppointment();
            } else {
              this.paymentCheck(
                0,
                0,
                this.state.appointment_bundle.amountPaid,
                0,
                '',
              );
              this.loadingManipulate(true);
              this.getOrderId();
            }
          }}>
          <View>
            {this.state.isPayAtCenter === 1 ? (
              <Text
                style={{
                  fontFamily: 'Arial',
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 16,
                }}>
                {this.state.appointment_bundle.isHomecollection === 1
                  ? 'BOOK HOME COLLECTION'
                  : 'BOOK APPOINTMENT'}
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: 'Arial',
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 16,
                }}>
                PAY ONLINE {this.props.currency.currency}{' '}
                {this.state.appointment_bundle.isHomecollection === 1
                  ? this.state.appointment_bundle.amountPaid + 50
                  : this.state.appointment_bundle.amountPaid}
              </Text>
            )}
          </View>
        </Ripple>
        {this.state.isLoading ? <ProgressBar /> : null}
        {this.state.receiptDialog ? (
          <ModalBox
            style={{
              justifyContent: 'center',
              borderRadius: 6,
              backgroundColor: ' rgba(0, 0, 0, 0)',
            }}
            ref={'modal1'}
            swipeThreshold={200}
            isOpen={true}
            swipeToClose={true}
            onClosed={this.onCloseDialog}
            position={'top'}
            backdrop={true}
            backButtonClose={true}
            keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
            onOpened={this.onOpen}
            onClosingState={this.onClosingState}>
            <Receipt
              appointment_bundle={this.state.appointment_bundle}
              userName={this.state.userName}
              onCloseDialog={this.onCloseDialog}
            />
          </ModalBox>
        ) : null}
        {/*
{this.state.showProgress ? (
       <ModalBox
       style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 6,backgroundColor: ' rgba(0, 0, 0, 0)'}}
       isOpen = {true}
       position={'center'}
       swipeToClose={false}
       transparent = {true}
       backdrop={true}
       visible={this.state.showProgress}
       animationType={'slide'}
       backButtonClose={true}
       >

     

       <Animated.View style = {[{transform: [{scale: this.springValue}],backgroundColor:'#ffff', height:180, width:200, paddingVertical:30, borderRadius:5 }, CommonStyles.commonShadow]}>
          <ProgressCircle
           style = {{alignSelf:'center', justifyContent:'center'}}
           seconds={1}
           flag = {this.state.completionFlag}
           radius={50}
           borderWidth={3}
           color="#ccc"
           bgColor="#fff"
           shadowColor = {Color.themeColor}
           textStyle={{ fontSize: 20 }}
           onTimeElapsed={this.spring()}
           />
       </Animated.View>
        
       </ModalBox>
        ):(null)}

      */}
      </View>
    );
  }
}

// function mapDispatchToActions (dispatch) {
//   return {
//     getList: () => dispatch(getList()),
//     setList: list => dispatch(setList(list)),
//     onClickInc: () => {dispatch(incrementAC())},
//     onClickDec: () => {dispatch(decrementAC())},
//     setUnreadFlag: num => dispatch(setUnreadFlag(num)),
//     setDemographics: arr => dispatch(setDemographics(arr)),
//     setCurrency: str => dispatch(setCurrency(str))
//   }
// }

const mapStateToProps = state => ({
  currency: state.currency,
});

export default connect(mapStateToProps)(AppointmentSummary);
