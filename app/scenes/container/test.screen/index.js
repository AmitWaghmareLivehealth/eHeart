import React, {Component} from 'react';

import {
  View,
  Text,
  Modal,
  Alert,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  FlatList,
  CheckBox,
} from 'react-native';
import {connect} from 'react-redux';
import {HeaderListExtraLarge, StateRepresentation} from '../../layouts';
// import CheckBox from 'react-native-check-box';

import {
  ProgressBar,
  Ripple,
  SearchBox,
  ModalBox,
  CloseBarAnimated,
} from '../../components';
import {
  URLs,
  Routes,
  Images,
  Color,
  Global,
  NetworkRequest,
  UserDefaults,
  stringsUserDefaults,
  CommonStyles,
} from '../../../utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
var _ = require('lodash');
import ListView from 'deprecated-react-native-listview';
import RoundBatch from './RoundBatch';
import {HOME_COLLECTION_CHARGES} from '../appointmentSummary';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class TestScreen extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      labId: this.props.navigation.state.params.labId,
      isHomecollection: 0,
      categoryId: this.props.navigation.state.params.categoryId,
      categoryName: this.props.navigation.state.params.categoryName,
      description: this.props.navigation.state.params.description,
      categoryList: this.props.navigation.state.params.categoryList,
      icon: this.props.navigation.state.params.icon,
      location: this.props.navigation.state.params.location,
      dataSource: ds.cloneWithRows([]),
      isLoading: false,
      testList: [],
      latlng: this.props.navigation.state.params.latlng,
      city: this.props.navigation.state.params.city,
      testMap: {}, // for reducing the api call instead load tests name locally
      addedItemCount: 0,
      isStateRepFlag: false,
      cartData: this.props.navigation.state.params.cartData, // for mainting the data in the cart
      cartCount: Object.keys(this.props.navigation.state.params.cartData)
        .length,
      swipeToClose: true,
      clearSearch: false,
      isOpen: false,
      editCart: false,
      isScrollable: false,
      appointment_bundle: {transactions: {tests: []}},
      animatedScrollOffsetY: 0,
      currentTest: {}, // for selecting and checking which of the test id is selected for adding and removing tests
    };

    this.getData = this.getData.bind(this);
    this.loadingManipulate = this.loadingManipulate.bind(this);
    this.searchTest = this.searchTest.bind(this);
    this.afterClear = this.afterClear.bind(this);
    this.renderCategories = this.renderCategories.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClosingState = this.onClosingState.bind(this);
    this.renderCart = this.renderCart.bind(this);
    this.gotoTimeSlots = _.debounce(this.gotoTimeSlots.bind(this), 200);
    this.getSwipe = this.getSwipe.bind(this);
    this.setSwipe = this.setSwipe.bind(this);
    this.setScroll = this.setScroll.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this.editCurrentCart = this.editCurrentCart.bind(this);
    this.getAppointmentBundle = this.getAppointmentBundle.bind(this);
    this._renderAnimatedCloseBar = this._renderAnimatedCloseBar.bind(this);
  }

  componentDidMount() {
    console.log(this.state.cartData);
    cnt = 0;
    var cartData = this.state.cartData;
    for (val in cartData) {
      cartData[val].forEach(innerVal => {
        cnt++;
      });
    }
    this.setState({cartCount: cnt});

    this.getAppointmentBundle();
  }

  getAppointmentBundle() {
    UserDefaults.get(stringsUserDefaults.appointment_bundle)
      .then(appointment_bundle => {
        if (appointment_bundle) {
          console.log('Appointment Bundle', appointment_bundle);
          this.setState(
            {
              appointment_bundle: appointment_bundle,
            },
            () => {
              // this.state.appointment_bundle.isHomecollection = 1;
            },
          );

          this.loadingManipulate(true);
          this.getData();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  loadingManipulate(flag) {
    this.setState({
      isLoading: flag,
    });
  }

  editCurrentCart() {
    return (
      <View style={{backgroundColor: 'white', borderRadius: 6}}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 8,
            alignItems: 'center',
            marginTop: 24,
            justifyContent: 'center',
            marginBottom: 8,
            flexDirection: 'row',
          }}>
          <Ripple
            onPress={() => {
              if (
                this.state.cartData[this.state.currentTest.testID].length > 0
              ) {
                this.state.cartData[this.state.currentTest.testID].splice(0, 1);
                var count_total = this.state.cartCount;
                count_total -= 1;
                this.setState({
                  cartCount: count_total,
                });
              }
              
            }}>
            <MaterialIcons
              name={'remove-circle-outline'}
              size={28}
              style={{color: '#000000', padding: 8}}
            />
          </Ripple>
          <View style={{paddingLeft: 8, paddingRight: 8, flex: 1}}>
            <Text style={{fontSize: 20, color: 'black', fontWeight: '600'}}>
              {this.state.currentTest.testName}
            </Text>
            <Text style={{fontSize: 16, paddingTop: 4, color: Color._4A}}>
              Quantity:{' '}
              {this.state.cartData[this.state.currentTest.testID].length} Nos
            </Text>
          </View>
          <Ripple
            onPress={() => {
              this.state.cartData[this.state.currentTest.testID].push(
                this.state.currentTest,
              );
              var count_total = this.state.cartCount;
              count_total += 1;
              this.setState({
                cartCount: count_total,
              });
            }}>
            <MaterialIcons
              name={'add-circle-outline'}
              size={28}
              style={{color: '#000000', padding: 8}}
            />
          </Ripple>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}} />

          <Ripple
            onPress={() => {
              this.closeDialog();
            }}
            style={{marginBottom: 12, marginRight: 24}}>
            <Text
              style={{
                padding: 8,
                color: Color.appointmentBlue,
                textAlign: 'right',
                fontWeight: '500',
              }}>
              CLOSE
            </Text>
          </Ripple>
        </View>
      </View>
    );
  }

  gotoTimeSlots() {
    var primaryJson = {};
    var transactions = {};
    var testArray = [];
    var testArray_new = [];
    var cartData = this.state.cartData;
    for (val in cartData) {
      cartData[val].forEach(innerVal => {
        testArray.push({
          testId: innerVal.testID,
          item: innerVal,
        });

        try {
          testArray_new.push({
            dictionaryId: innerVal.dictionaryId,
            testID: innerVal.testID,
          });
        } catch (error) {
          console.error(error);
        }
      });
    }

    if (testArray.length === 0) {
      Alert.alert(
        'Empty Cart',
        'Please enter some tests in your cart',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: true},
      );
      return;
    }
    primaryJson['data'] = testArray;
    transactions['tests'] = testArray_new;
    console.log(primaryJson);
    UserDefaults.set(stringsUserDefaults.addedTest, primaryJson);
    this.state.appointment_bundle.transactions = transactions;
    this.state.appointment_bundle.isHomecollection = this.state.isHomecollection;
    UserDefaults.set(
      stringsUserDefaults.appointment_bundle,
      this.state.appointment_bundle,
    );

    setTimeout(() => {
      this.props.navigation.navigate(Routes.timeSlots, {
        location: this.state.location,
      });
    }, 50);
  }

  renderCart() {
    var row = [];
    var cartData = this.state.cartData;
    var amount = 0;
    for (val in cartData) {
      cartData[val].forEach(innerVal => {
        amount += Number(innerVal.testAmount);
        row.push(
          <View style={{padding: 16, flexDirection: 'row'}}>
            <Text style={{flex: 1}}>{innerVal.testName}</Text>
            <Text>
              {this.props.currency.currency} {innerVal.testAmount}
            </Text>
          </View>,
        );
      });
    }
    return (
      <ScrollView
        bounce={false}
        ref="scrollView"
        onScroll={this.onScroll}
        onContentSizeChange={(w, h) => {
          if (h > Global.screenHeight) {
            if (this.getSwipe()) {
              this.setSwipe(false);
              this.setState({
                isVisible: true,
              });
              this.setScroll(true);
              this.refs.scrollView.scrollTo({x: 0, y: 5, animated: true});
            }
          }
        }}>
        <View
          style={{
            padding: 18,
            backgroundColor: Color.appointmentBlue,
            alignItems: 'center',
            borderTopLeftRadius: 6,
            display: 'flex',
            borderTopRightRadius: 6,
            flexDirection: 'row',
          }}>
          <View style={{flex: 1}}>
            <Text style={{color: 'white', fontSize: 18}}>Your order items</Text>
          </View>
          <View>
            <Ripple
              onPress={() => {
                this.setState({
                  isOpen: false,
                });
              }}>
              <MaterialIcons
                name={'close'}
                size={24}
                style={{color: '#FFFFFF'}}
              />
            </Ripple>
          </View>
        </View>

        {row}
        <View
          style={{
            marginLeft: 12,
            marginRight: 12,
            height: 0.5,
            backgroundColor: Color._DF,
            marginTop: 8,
            marginBottom: 8,
          }}></View>
        <View style={{padding: 16, flexDirection: 'row', marginBottom: 8}}>
          <Text
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: '500',
              color: Color._4A,
            }}>
            Total Amount
          </Text>
          <Text style={{fontSize: 16, fontWeight: '500', color: Color._4A}}>
            {this.props.currency.currency} {amount}{' '}
          </Text>
        </View>
      </ScrollView>
    );
  }

  async getData() {
    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let params =
          'token=' +
          (token || '') +
          '&categoryId=' +
          (this.state.categoryId || 0) +
          '&labId=' +
          this.state.labId +
          '&isStarredLab=' +
          (this.state.appointment_bundle.isStarredLab || 0);

        var _this = this;
        NetworkRequest(_this, 'POST', URLs.getTests, params)
          .then(result => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                var isStateRepFlag = false;
                if (result.response.data.length === 0) {
                  isStateRepFlag = true;
                }

                const allTests = result.response.data;
                this.setState({
                  // isStateRepFlag: isStateRepFlag,
                  dataSource: ds.cloneWithRows(allTests),
                  testList: allTests,
                  originalTestList: allTests,
                  isLoading: false,
                });

                if (!(this.state.categoryId in this.state.testMap)) {
                  this.state.testMap[this.state.categoryId] =
                    result.response.data;
                }
                console.log('SUCCESS');
              } else if ((result.response.code || 0) === 500) {
                console.log('FAILURE');
                this.loadingManipulate(false);
              } else {
                this.loadingManipulate(false);
              }
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

  searchTest(query: String) {
    const searchTests = this.state.originalTestList.filter(
      test =>
        test.testName.toLowerCase().indexOf(
          query
            .toLowerCase()
            .trim()
            .replace(/,/g, ''),
        ) !== -1,
    );
    this.setState({testList: searchTests});
  }

  afterClear() {
    this.setState({
      testList: this.state.originalTestList,
      clearSearch: false,
    });
  }

  renderCategories() {
    var categoryList = this.state.categoryList;
    var row = [];

    categoryList.forEach(val => {
      row.push(
        <Ripple
          style={{
            backgroundColor:
              val.id === this.state.categoryId
                ? Color.appointmentBlue
                : 'white',
            flexDirection: 'row',
            borderRadius: 60,
            borderColor: Color.appointmentBlue,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 6,
            paddingBottom: 6,
            borderWidth: 1,
            marginLeft: 6,
            marginRight: row.length === categoryList.length - 1 ? 36 : 6,
            marginTop: 8,
            marginBottom: 8,
            flex: 1,
          }}
          onPress={() => {
            this.setState({
              clearSearch: true,
              categoryId: val.id,
              categoryName: val.categoryName,
              testList: this.state.originalTestList,
            });
          }}>
          <View>
            <Text
              style={{
                color:
                  val.id !== this.state.categoryId
                    ? Color.appointmentBlue
                    : 'white',
              }}>
              {val.categoryName}
            </Text>
          </View>
        </Ripple>,
      );
    });
    return (
      <ScrollView
        style={{paddingLeft: 16, paddingRight: 16}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {row}
      </ScrollView>
    );
  }

  onClose() {
    this.closeDialog();
    console.log('Modal just closed');
  }
  onOpen() {
    console.log('Modal just openned');
  }
  onClosingState(state) {
    console.log('the open/close of the swipeToClose just changed');
  }

  closeDialog() {
    this.setState({
      isOpen: false,
      isScrollable: false,
      swipeToClose: true,
      editCart: false,
      currentTest: {},
    });
  }

  _renderRow({item, rowId}) {
    return (
      <Ripple
        key={rowId + '@'}
        onPress={() => {
          var cartData = this.state.cartData;
          var cartCount = this.state.cartCount;
          var editCart = false;
          var isOpen = false;

          if (!(item.testID in cartData) || cartData[item.testID]==0 ) {
            var array = [];
            array.push(item);
            cartData[item.testID] = array;
            cartCount += 1;
          } else {
            // if(cartData[item.testID].length > 1){
            (editCart = true), (isOpen = true);
            // } else {
            //   cartData[item.testID].push(item)
            //   cartCount += 1
            // }
          }
          this.setState({
            cartData: cartData,
            cartCount: cartCount,
            editCart: editCart,
            isOpen: isOpen,
            currentTest: item,
            dataSource: ds.cloneWithRows(this.state.testList),
          });
        }}>
        <View style={{flexDirection: 'row', padding: 16}}>
          <View style={{flex: 1}}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'Arial',
                  color: Color._4A,
                  flex: 2,
                  paddingLeft: 12,
                  paddingBottom: 8,
                }}>
                {item.testName}
              </Text>
              {item.isProfile ? (
                <RoundBatch txt="P" backgroundColor="green" />
              ) : (
                <View></View>
              )}
            </View>
            <Text style={{fontFamily: 'Arial', paddingLeft: 12}}>
              {this.props.currency.currency} {item.testAmount}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <RoundBatch
              backgroundColor={
                this.state.cartData[item.testID]
                  ? this.state.cartData[item.testID].length > 0
                    ? '#3a8EDD'
                    : '#ccc'
                  : '#ccc'
              }
              txt={
                this.state.cartData[item.testID]
                  ? this.state.cartData[item.testID].length
                  : 0
              }
            />
            <Text
              style={{
                fontWeight: '600',
                color: Color.appointmentBlue,
                fontSize: 16,
                alignSelf: 'center',
                paddingRight: 8,
              }}>
              {this.state.cartData[item.testID]
                ? this.state.cartData[item.testID].length > 0
                  ? 'EDIT '
                  : 'ADD  '
                : 'ADD '}
            </Text>
          </View>
        </View>
        <View style={{height: 0.6, backgroundColor: '#DFDFDF'}}></View>
      </Ripple>
    );
  }

  setSwipe(flag) {
    this.setState({
      swipeToClose: flag,
    });
  }

  getSwipe() {
    return this.state.swipeToClose;
  }

  setScroll(flag) {
    this.setState({
      isScrollable: flag,
    });
  }

  onScroll(event) {
    if (event.nativeEvent.contentOffset.y < 50) {
      console.log('set swipe TRUE onScroll');
      this.setSwipe(true);
      this.setState({
        animatedScrollOffsetY: event.nativeEvent.contentOffset.y,
      });
    }
  }

  _renderAnimatedCloseBar() {
    var actionArray = [];
    actionArray.push({
      name: 'file-download',
      size: 28,
      onPress: () => {
        this._downloadPDF();
      },
    });
    var val = ((this.state.animatedScrollOffsetY - 100) / 100) * 7;

    return (
      <Animated.View
        style={[
          CommonStyles.commonShadow,
          {
            backgroundColor: '#fff',
            width: Global.screenWidth,
            height: 70,
            position: 'absolute',
            opacity: val,
            justifyContent: 'center',
            top: Global.isIphoneX ? 28 : 0,
          },
        ]}>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            padding: 8,
            marginTop: 16,
            fontWeight: 'bold',
            marginLeft: 14,
          }}>
          {this.state.categoryName}
        </Text>

        <View style={{flexDirection: 'row', position: 'absolute'}}>
          <View style={{flex: 1}}></View>
          <TouchableOpacity
            activeOpacity={0.1}
            onPress={() => {
              if (this.state.cartCount > 0) {
                this.setState({
                  isOpen: true,
                });
              }
            }}>
            <View style={{marginTop: Global.iOSPlatform ? 0 : 0}}>
              <MaterialIcons
                name={'shopping-cart'}
                size={28}
                style={{color: '#4A4A4A', marginTop: 24, marginRight: 16}}
              />
              {this.state.cartCount > 0 ? (
                <View
                  style={{
                    borderRadius: 50,
                    backgroundColor: '#3a8EDD',
                    height: 20,
                    width: 20,
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 12,
                    marginTop: 12,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 10,
                      textAlign: 'center',
                    }}>
                    {this.state.cartCount}
                  </Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  _onScroll(event) {
    // if (event.nativeEvent.contentOffset.y < 50) {
    //   this.setState({});
    // }
    // this.setState({animatedScrollOffsetY: event.nativeEvent.contentOffset.y});
  }
  render() {
    const {testList, categoryId} = this.state;

    return (
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          marginTop: Global.isIphoneX ? 15 : 0,
        }}>
        <ScrollView
          ref="scrollView"
          scrollEventThrottle={20}
          onScroll={this._onScroll}>
          <View>
            <HeaderListExtraLarge
              header={this.state.categoryName}
              description="Select tests that you wish to perform"
              style={{flex: 0}}></HeaderListExtraLarge>

            <View style={{flexDirection: 'row', position: 'absolute'}}>
              <View style={{flex: 1}}></View>
              <TouchableOpacity
                activeOpacity={0.1}
                onPress={() => {
                  if (this.state.cartCount > 0) {
                    this.setState({
                      isOpen: true,
                    });
                  }
                }}>
                <View style={{marginTop: Global.iOSPlatform ? 12 : 0}}>
                  <MaterialIcons
                    name={'shopping-cart'}
                    size={34}
                    style={{color: '#4A4A4A', marginTop: 24, marginRight: 16}}
                  />
                  {this.state.cartCount > 0 ? (
                    <View
                      style={{
                        borderRadius: 60,
                        backgroundColor: '#3a8EDD',
                        height: 24,
                        width: 24,
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 12,
                        marginTop: 12,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 11,
                          textAlign: 'center',
                        }}>
                        {this.state.cartCount}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            </View>
            <Ripple
              rippleOpacity={0}
              rippleDuration={0}
              onPress={() =>
                this.setState({
                  isHomecollection: this.state.isHomecollection === 1 ? 0 : 1,
                })
              }
              style={{flexDirection: 'row', justifyContent: 'center'}}>
              <CheckBox
                style={{
                  padding: 12,
                  marginLeft: 16,
                  marginRight: 16,
                  marginTop: 0,
                  marginBottom: 4,
                  borderWidth: Global.isIphoneX ? 1 : StyleSheet.hairlineWidth,
                  borderColor: Color._DF,
                }}
                value={this.state.isHomecollection === 1}
              />

              <Text
                style={{
                  right: 10,
                  fontSize: 16,
                  alignSelf: 'center',
                  marginBottom: 4,
                }}>
                Book Sample Collection at Home {this.props.currency.currency}{' '}
                {HOME_COLLECTION_CHARGES}
              </Text>
            </Ripple>
            {this.renderCategories()}

            <View style={{height: 160}}></View>
          </View>
        </ScrollView>

        <SearchBox
          clearSearch={this.state.clearSearch}
          inputRef={this.myRef}
          search={this.searchTest}
          afterClear={this.afterClear}
        />
        {testList ? (
          <FlatList
            data={
              categoryId == 12
                ? testList.filter(test => test.isProfile)
                : testList.filter(test => !test.isProfile)
            }
            renderItem={this._renderRow}
            initialNumToRender={5}
            windowSize={10}
            maxToRenderPerBatch={10}
          />
        ) : (
          <View></View>
        )}

        <Ripple
          style={{
            padding: 16,
            backgroundColor: Color.appointmentBlue,
            position: 'absolute',
            width: Global.screenWidth,
            bottom: Global.isIphoneX ? 10 : 0,
          }}
          onPress={() => {
            this.gotoTimeSlots();
          }}>
          <View>
            <Text
              style={{
                fontFamily: 'Arial',
                color: 'white',
                textAlign: 'center',
                fontSize: 14,
              }}>
              PROCEED
            </Text>
          </View>
        </Ripple>
        {this.state.isLoading ? <ProgressBar /> : null}
        {this.state.isOpen ? (
          <ModalBox
            style={{
              justifyContent: 'center',
              borderRadius: 6,
              backgroundColor: 'rgba(0,0,0,0)',
            }}
            ref={'modal1'}
            swipeThreshold={200}
            isOpen={this.state.isOpen}
            swipeToClose={this.state.swipeToClose}
            onClosed={this.onClose}
            position={'top'}
            backdrop={true}
            keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
            onOpened={this.onOpen}
            backdropPressToClose={false}
            coverScreen={true}
            swipeArea={Global.screenHeight}
            onClosingState={this.onClosingState}
            setSwipe={this.setSwipe}
            getSwipe={this.getSwipe}
            isScrollable={this.state.isScrollable}>
            {!this.state.editCart ? (
              <View
                style={{
                  backgroundColor: 'white',
                  // flexWrap: 'wrap',
                  borderRadius: 6,
                  marginLeft: Global.iOSPlatform ? 20 : 40,
                  marginRight: Global.iOSPlatform ? 20 : 40,
                  marginTop: 40,
                  marginBottom: 40,
                }}>
                {this.renderCart()}
              </View>
            ) : (
              <View>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 6,
                    margin: Global.iOSPlatform ? 20 : 40,
                  }}>
                  {this.editCurrentCart()}
                </View>
              </View>
            )}
          </ModalBox>
        ) : null}

        {this._renderAnimatedCloseBar()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  currency: state.currency,
});

export default connect(mapStateToProps)(TestScreen);
