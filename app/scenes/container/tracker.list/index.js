import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  processColor,
  Image,
  ToastAndroid,
  ScrollView,
  Platform,
  LayoutAnimation,
  Modal,
  Animated,
  RefreshControl
} from "react-native";
import ListView from 'deprecated-react-native-listview';
import NetInfo from "@react-native-community/netinfo";


import moment from "moment";

import HTMLView from "react-native-htmlview";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LineChart } from "react-native-charts-wrapper";
import { connect } from "react-redux";

import LinearGradient from "react-native-linear-gradient";

import SwipeInfoText from "../../components/swipeinfotext";
import {
  URLs,
  Routes,
  Global,
  Color,
  UserDefaults,
  stringsUserDefaults,
  NetworkRequest,
  CommonManager,
  CommonStyles
} from "../../../utils";
import { HeaderListExtraLarge, StateRepresentation } from "../../layouts";
import ListHeader from "../../components/listheader";
import { Ripple, ProgressBar, ModalBox } from "../../components";
import DatePicker from "../../components/datepicker";
import { getJson } from "../../../redux/actions/trackerjson";
import TrackerDetails from "../tracker.details";

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

class Trackers extends Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.springValue = new Animated.Value(1);
    this.state = {
      dataSource: ds.cloneWithRowsAndSections([]),
      dictionaryId: "",
      name: "",
      userReportId: 0,
      description: "",
      isStateRepFlag: false,
      isLoading: false,
      springVal: new Animated.Value(1),

      legend: {
        enabled: false
      },
      marker: {
        enabled: true,
        backgroundTint: processColor("black"),
        markerColor: processColor("#F0C0FF8C"),
        textColor: processColor("white")
      },
      data: {},
      xAxis: {},
      yAxis: {},
      rightAxis: {},
      tracker_pagerData: [],
      categoryId: "",
      categoryName: "",
      description: "",
      icon: "",
      isActionButtonVisible: true,
      trackerJson: this.props.trackerJson,
      swipeToClose: true,
      isOpen: false,
      isNoValAdded: false,
      isConnection: false,
      isScrollable: false,
      localKey: "",
      animSpeed: 8,
      refreshing: false,
      autoTrackerList: [],
      selected_automated_item: [],
      serializedReferences: [],
      selected_ref: {},
      noConn: false
    };
    var _ = require("lodash");

    // this.animatedValue = new Animated.Value(0.3)

    this._renderRowCondition = this._renderRowCondition.bind(this);
    this.goToTrackerCategories = this.goToTrackerCategories.bind(this);
    this.goToTrackerDetails = this.goToTrackerDetails.bind(this);

    this.gotoAutomatedTrackers = _.debounce(
      this.gotoAutomatedTrackers.bind(this),
      200
    );
    this.goToTrackerSubCat = this.goToTrackerSubCat.bind(this);
    this.refreshComponent = this.refreshComponent.bind(this);
    this._renderPage = this._renderPage.bind(this);
    this.loadingManipulate = this.loadingManipulate.bind(this);
    // this.processData  = this.processData.bind(this)
    this.getData = this.getData.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClosingState = this.onClosingState.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setSwipe = this.setSwipe.bind(this);
    this.getSwipe = this.getSwipe.bind(this);
    this.setScroll = this.setScroll.bind(this);
    // this.animate = this.animate.bind(this)
  }
  _onRefresh() {
    this.setState({ refreshing: true });
    this.getData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected
        ? this.setState({ isConnection: true })
        : this.setState({ isConnection: false });
    });

    setTimeout(() => {
      if (this.state.isConnection) {
        console.log("Connected");
        this.loadingManipulate(true);
        this.getData();

        //  this.setState({isStateRepFlag:false})
      } else {
        console.log("Not connected");
        this.setState({ isActionButtonVisible: false, noConn: true });
      }
    }, 500);
  }

  animate() {
    this.animatedValue.setValue(-1000);
    Animated.spring(this.animatedValue, {
      toValue: 1,
      speed: this.state.animSpeed,
      bounciness: -10,
      velocity: 10
    }).start();
  }

  spring1(rowId, secId) {
    this.springValue.setValue(0.99);
    this.setState({ localKey: (rowId + secId).toString() }, () => {
      setTimeout(() => {
        Animated.spring(this.state.springVal, {
          toValue: 0.97
        }).start();
      }, 150);
    });
  }

  spring2(rowId, secId) {
    this.springValue.setValue(0.98);
    this.setState({ localKey: (rowId + secId).toString() }, () => {
      setTimeout(() => {
        Animated.spring(this.state.springVal, {
          toValue: 1
        }).start();
      }, 150);
    });
  }

  loadingManipulate(flag) {
    this.setState({
      isLoading: flag
    });
  }

  refreshComponent() {
    UserDefaults.get(stringsUserDefaults.isTrackerUpdated)
      .then(isTrackerUpdated => {
        if (isTrackerUpdated) {
          UserDefaults.get(stringsUserDefaults.trackerJson)
            .then(result => {
              this.renderTrackerList(result.response);
              console.log("RESULT TRACKER_LIST: ", result.response);
            })
            .catch(error => {
              console.error(error);
            });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  async getData() {
    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let params = "token=" + token || "";
        var _this = this;
        NetworkRequest(_this, "POST", URLs.getTrackerData, params)
          .then(result => {
            if (result.success) {
              this.animate();
              if ((result.response.code || 0) === 200) {
                if (
                  result.response.trackedData &&
                  result.response.trackedData.length > 0
                ) {
                  UserDefaults.set(stringsUserDefaults.trackerJson, result);
                  this.renderTrackerList(result.response);
                  this.setState({
                    isLoading: false,
                    noConn: false
                  });
                } else {
                  this.setState({
                    isLoading: false,
                    noConn: false,
                    isStateRepFlag: true
                  });
                }
              } else if ((result.response.code || 0) === 500) {
                this.loadingManipulate(false);
                this.setState({ isStateRepFlag: true });
              } else {
                this.loadingManipulate(false);
                this.setState({ isStateRepFlag: true });
              }
            } else {
              this.loadingManipulate(false);
              this.setState({ isStateRepFlag: true });
            }
          })
          .catch(error => {
            this.setState({
              isLoading: false,
              isStateRepFlag: true
            });
            console.error(error);
          });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          isStateRepFlag: true
        });
        console.error(error);
      });
  }

  componentWillReceiveProps() {
    UserDefaults.get(stringsUserDefaults.reduxTracker)
      .then(reduxTracker => {
        if (reduxTracker) {
          this.loadingManipulate(false);
          var trackerJson = this.props.trackerJson;
          this.renderTrackerList(trackerJson.trackerJson.response);
          UserDefaults.set(stringsUserDefaults.reduxTracker, false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  async renderTrackerList(result: Array, isTrackerUpdated) {
    try {
      var trackerList = result.trackedData;
      var categoryMap = {};
      var dictionaryMap = {};
      var autoDictionaryMap = {};

      if (isTrackerUpdated) {
        UserDefaults.set(stringsUserDefaults.isTrackerUpdated, false);
      }

      trackerList
        .sort((a, b) => {
          return (
            new Date(a._source.reportDate) - new Date(b._source.reportDate)
          );
        })
        .reverse();

      trackerList.forEach(valInData => {
        try {
          if (valInData._source.value) {
            if (
              isNaN(valInData._source.value) &&
              valInData._source.value.indexOf("/") === -1
            ) {
              return;
            }
          }
        } catch (error) {
          console.error(error);
        }
        if (valInData._source.isTracked) {
          if (!(valInData._source.dictionaryCategoryId in categoryMap)) {
            var categoryTrackers = [];
            categoryTrackers.push(valInData);
            categoryMap[valInData._source.dictionaryCategoryId] = {
              value: categoryTrackers
            };
            dictionaryMap[valInData._source.dictionaryId] =
              valInData._source.dictionaryId;
          } else {
            if (!(valInData._source.dictionaryId in dictionaryMap)) {
              categoryMap[valInData._source.dictionaryCategoryId].value.push(
                valInData
              );
              dictionaryMap[valInData._source.dictionaryId] =
                valInData._source.dictionaryId;
            }
          }
        } else {
          if (!(valInData._source.dictionaryId in autoDictionaryMap)) {
            if (!isNaN(valInData._source.value)) {
              var graphdata = [];
              graphdata.push({
                y: Number(valInData._source.value)
              });
              autoDictionaryMap[valInData._source.dictionaryId] = {
                graphdata: graphdata,
                value: valInData
              };
            }
          } else {
            if (!isNaN(valInData._source.value)) {
              autoDictionaryMap[valInData._source.dictionaryId].graphdata.push({
                y: Number(valInData._source.value)
              });
            }
          }
        }
      });

      var autoTrackerList = [];
      for (keys in autoDictionaryMap) {
        let dataSets = [];
        dataSets.push({
          values: autoDictionaryMap[keys].graphdata,
          // values: [, , , , , , , , , , , , ,{x: 251, y: 100}, {y: 110}, {y: 105}, {y: 115}],
          label: "Company Dashed",
          config: {
            color: processColor(Color.can_tracked_card),
            drawFilled: true,
            fillColor: processColor(Color.can_tracked_card),
            fillAlpha: 99,
            lineWidth: 0.2,
            drawCubicIntensity: 0.2,
            circleRadius: 4,
            drawValues: false,
            drawCircles: false,
            mode: "CUBIC_BEZIER",
            drawCubicIntensity: 0.2,
            circleColor: processColor("#2D74A2"),
            drawCircleHole: false
          }
        });
        var isSingleVal = false;
        if (autoDictionaryMap[keys].graphdata.length === 1) {
          isSingleVal = true;
        }
        autoTrackerList.push({
          dataSets: { dataSets: dataSets },
          value: autoDictionaryMap[keys].value,
          isSingleVal: isSingleVal
        });
      }

      var serializedReferences = [];
      if (result.serializedReferences) {
        if (result.serializedReferences.length > 0) {
          serializedReferences = result.serializedReferences;
        }
      }

      var isStateRepFlag = false;
      if (
        Object.keys(categoryMap).length === 0 &&
        Object.keys(autoDictionaryMap).length === 0
      ) {
        isStateRepFlag = true;
      }

      this.setState({
        autoTrackerList: autoTrackerList,
        dataSource: ds.cloneWithRowsAndSections(categoryMap),
        isStateRepFlag: isStateRepFlag,
        serializedReferences: serializedReferences
      });
    } catch (error) {
      console.error(error);
    }
  }

  testGo() {}

  _renderPage() {
    var tracker_pagerData = this.state.autoTrackerList;
    var row = [];
    var count = 0;

    tracker_pagerData.forEach(item1 => {
      var item = item1.value._source;
      row.push(
        <Animated.View
          key={count + "_tracker"}
          style={[
            this.state.localKey === (count + "_tracker").toString()
              ? { transform: [{ scale: this.state.springVal }] }
              : { transform: [{ scale: 1 }] },
            {
              flexDirection: "row",
              marginLeft: 18,
              marginRight: 18,
              marginTop: 6,
              marginBottom: 16,
              borderRadius: 18,
              borderWidth: 0.1,
              borderColor: Color._DF,
              elevation: 2,
              flex: 1,
              width: Global.screenWidth - 34
            }
            // CommonStyles.commonShadow
          ]}
        >
          <Ripple
            rippleOpacity={0.2}
            onPressIn={this.spring1.bind(this, count, "_tracker")}
            onPressOut={this.spring2.bind(this, count, "_tracker")}
            onPress={() => {
              var serializedReferences = this.state.serializedReferences;
              var selected_ref = {};
              serializedReferences.forEach(values => {
                if (
                  values.dictionaryId === Number(item.dictionaryId) &&
                  values.index === 0
                ) {
                  selected_ref = values;
                }
              });
              this.setState({
                dictionaryId: item.dictionaryId,
                name: item.dictionaryName,
                description: item.dictionaryDescription,
                userReportId: item.userReportId,
                selected_ref: selected_ref,
                selected_automated_item: tracker_pagerData
              });
              this.gotoAutomatedTrackers();
            }}
            style={{ flex: 1 }}
          >
            <View
              style={{
                flexDirection: "column",
                flex: 1,
                paddingTop: 16,
                paddingBottom: 16
              }}
            >
              {item1.isSingleVal ? (
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Arial",
                      color: Color._54,
                      fontSize: 64,
                      paddingRight: 6,
                      paddingLeft: 16
                    }}
                  >
                    {item.value}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Arial",
                      color: Color._54,
                      fontSize: 42,
                      paddingRight: 16,
                      marginTop: 6
                    }}
                  >
                    {item.unit}
                  </Text>
                </View>
              ) : (
                <View>
                  <LineChart
                    style={
                      Global.iOSPlatform
                        ? {
                            height: 80,
                            marginRight: -15,
                            marginLeft: -5,
                            marginBottom: -11
                          }
                        : { height: 80, margin: -16 }
                    }
                    data={item1.dataSets}
                    description={{ text: "" }}
                    chartDescription={{ text: "" }}
                    legend={this.state.legend}
                    marker={this.state.marker}
                    xAxis={{
                      drawAxisLine: false,
                      drawLabels: false,
                      drawGridLines: false,
                      position: "BOTTOM",
                      textSize: 0
                    }}
                    drawAxisLine={false}
                    yAxis={{
                      left: {
                        enabled: false,
                        drawGridLines: false,
                        zeroLine: { enabled: false }
                      },
                      right: { enabled: false, zeroLine: { enabled: false } }
                    }}
                    drawGridBackground={false}
                    borderColor={processColor("teal")}
                    borderWidth={0}
                    drawBorders={false}
                    touchEnabled={true}
                    dragEnabled={true}
                    scaleEnabled={false}
                    scaleXEnabled={false}
                    scaleYEnabled={false}
                    pinchZoom={true}
                    doubleTapToZoomEnabled={true}
                    dragDecelerationEnabled={true}
                    dragDecelerationFrictionCoef={0.99}
                    keepPositionOnRotation={false}
                  />
                  <LinearGradient
                    colors={["#0082a360", "#ffffff"]}
                    style={{ height: 40, marginTop: 1 }}
                  ></LinearGradient>
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  flex: 1
                }}
              >
                <View
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ flex: 1 }}
                >
                  <Text
                    style={{
                      fontFamily: "Arial",
                      fontSize: 14,
                      fontWeight: "800",
                      color: Color.theme_blue,
                      paddingLeft: 20
                    }}
                  >
                    {item.dictionaryCategoryName
                      ? item.dictionaryCategoryName.toUpperCase()
                      : null}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                    style={[
                      CommonStyles.common_header,
                      { paddingLeft: 20, marginRight: 0 }
                    ]}
                  >
                    {item.dictionaryName}
                  </Text>
                  <Text style={[CommonStyles.listDate, { paddingLeft: 22 }]}>
                    {item.rep_val} Reports found
                  </Text>
                </View>
                {!item.isSingleVal ? (
                  <View
                    style={{
                      justifyContent: "flex-end",
                      flexDirection: "row",
                      alignItems: "center",
                      paddingTop: 6
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Arial",
                        color: Color._54,
                        fontSize: 24,
                        paddingRight: 6,
                        paddingLeft: 16
                      }}
                    >
                      {item.value}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Arial",
                        color: Color._54,
                        fontSize: 14,
                        paddingRight: 16,
                        alignItems: "flex-end",
                        marginBottom: -6
                      }}
                    >
                      {item.unit}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </Ripple>
        </Animated.View>
      );
      count++;
    });

    return (
      <ScrollView
        pagingEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {row}
      </ScrollView>
    );
  }

  _renderRowCondition(item, rowId, secId) {
    try {
      if (this.state.isNoValAdded) {
        return null;
      }

      if (item && item[0]._source.dictionaryCategoryId == 7) {
        for (i = 0; i < item.length; i++) {}
      }

      var row = [];
      var count = 0;
      var categoryId = "";
      var categoryName = "";
      var description = "";
      var icon = "";

      item.forEach(value => {
        count++;
        var val = value._source;
        if (count == item.length) {
          categoryId = val.dictionaryCategoryId;
          categoryName = val.dictionaryCategoryName;
          description = val.categoryDescription;
          icon = val.categoryIcon;
        }

        //   console.log('ACCENT COLOR: ', val.accentColor)

        row.push(
          <View key={count}>
            <Ripple
              rippleOpacity={0.4}
              onPressIn={this.spring1.bind(this, rowId, secId)}
              onPressOut={this.spring2.bind(this, rowId, secId)}
              onPress={() => {
                setTimeout(() => {
                  this.setState({
                    dictionaryId: val.dictionaryId,
                    isOpen: true
                  });
                }, 500);

                // this.goToTrackerDetails()
              }}
            >
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingLeft: 12,
                    paddingTop: 12,
                    paddingBottom: 12
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={CommonStyles.listHeaderTitle}
                      >
                        {" "}
                        {val.dictionaryName}
                      </Text>
                      <View
                        style={{
                          borderRadius: 60,
                          height: 12,
                          width: 12,
                          marginLeft: 6,
                          backgroundColor: val.accentColor
                            ? "#" + val.accentColor
                            : null
                        }}
                      ></View>
                    </View>

                    <Text style={CommonStyles.listDate}>
                      {" "}
                      {moment(val.reportDate).format("Do MMMM YYYY")}
                    </Text>
                  </View>

                  <View
                    style={[
                      CommonStyles.value_outer_container,
                      { paddingLeft: 16 }
                    ]}
                  >
                    <View
                      style={[
                        CommonStyles.value_container,
                        {
                          flexDirection:
                            val.value.indexOf("/") !== -1 ? "column" : "row"
                        }
                      ]}
                    >
                      <Text style={CommonStyles.valueStyle}> {val.value}</Text>
                      <Text
                        style={[
                          CommonStyles.unit_style,
                          { fontSize: val.value.indexOf("/") !== -1 ? 8 : 10 }
                        ]}
                      >
                        {val.unit}
                      </Text>
                    </View>
                  </View>

                  <MaterialIcons
                    name={"chevron-right"}
                    size={28}
                    style={{
                      color: Color._DF
                    }}
                  />
                </View>
                {count !== item.length ? (
                  <View
                    style={{ backgroundColor: Color._DF, height: 0.5 }}
                  ></View>
                ) : null}
              </View>
            </Ripple>
          </View>
        );
      });
      const anim = this.animatedValue.interpolate({
        inputRange: [0.5, 3],
        outputRange: [-100, 400]
      });
      return (
        <View
          style={{
            flex: 1
          }}
        >
          <Animated.View
            style={[
              this.state.localKey === (rowId + secId).toString()
                ? { transform: [{ scale: this.state.springVal }] }
                : { transform: [{ scale: 1 }] },
              {
                flex: 1,
                padding: 8,
                borderWidth: 0.2,
                marginTop: 10,
                elevation: 6,
                marginBottom: 10,
                borderRadius: 8,
                backgroundColor: "#ffffff",
                borderColor: Color._DF,
                marginLeft: 17,
                marginRight: 17,
                marginBottom: 24
              },
              CommonStyles.commonShadow
            ]}
            key={rowId + secId + "1"}
          >
            <View
              style={{ flexDirection: "row", padding: 8, alignItems: "center" }}
            >
              <Image
                source={{
                  uri: URLs.fileDownloadPath + item[0]._source.categoryIcon
                }}
                style={{ height: 35, width: 35 }}
              />
              <Text
                style={[CommonStyles.common_header, { paddingLeft: 12 }]}
                numberOfLines={1}
                ellipsizeMode={"tail"}
              >
                {item[0]._source.dictionaryCategoryName}
              </Text>
            </View>
            <View>{row}</View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 1 }}></View>
              <Ripple
                rippleOpacity={0.2}
                onPressIn={this.spring1.bind(this, rowId, secId)}
                onPressOut={this.spring2.bind(this, rowId, secId)}
                onPress={() => {
                  this.setState({
                    categoryId: categoryId,
                    categoryName: categoryName,
                    description: description,
                    icon: icon
                  });
                  this.goToTrackerSubCat();
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Arial",
                      textAlign: "right",
                      color: Color.theme_blue,
                      fontWeight: "800",
                      padding: 12
                    }}
                  >
                    ADD NEW
                  </Text>
                </View>
              </Ripple>
            </View>
          </Animated.View>
        </View>
      );
    } catch (error) {
      this.loadingManipulate(false);
      console.error(error);
    }
  }

  goToTrackerSubCat() {
    setTimeout(() => {
      this.props.navigation.navigate(Routes.trackerSubCategoryScreen, {
        categoryId: this.state.categoryId,
        categoryName: this.state.categoryName,
        description: this.state.description,
        icon: this.state.icon,
        refreshComponent: this.refreshComponent
      });
    }, 50);
  }

  goToTrackerCategories() {
    this.props.navigation.navigate(Routes.trackerCategoryScreen, {
      refreshComponent: this.refreshComponent
    });
  }

  goToTrackerDetails() {
    setTimeout(() => {
      this.props.navigation.navigate(Routes.trackerDetailsScreen, {
        dictionaryId: this.state.dictionaryId,
        refreshComponent: this.refreshComponent
      });
    }, 50);
  }

  gotoAutomatedTrackers() {
    setTimeout(() => {
      this.props.navigation.navigate(Routes.trackerAutomatedScreen, {
        dictionaryId: this.state.dictionaryId,
        name: this.state.name,
        description: this.state.description,
        userReportId: this.state.userReportId,
        refreshComponent: this.refreshComponent,
        selected_ref: this.state.selected_ref,
        item: this.state.selected_automated_item

        // sex1 = userDetails.getSex();
        //                               final Bundle bundle1 = new Bundle();
        //                               bundle1.putString("dictionaryId", String.valueOf(trackerArraylist.get(position).get(0).getDictionaryId()));
        //                               bundle1.putString("testDescription", trackerArraylist.get(position).get(0).getDescription());
        //                               bundle1.putInt("userReportId", trackerArraylist.get(position).get(0).getCanbeTrackedValueArrayList().get(0).getReportForId());
        //                               bundle1.putString("testName", trackerArraylist.get(position).get(0).getName());
        //                               bundle1.putString("gender", sex1);
        //                               bundle1.putString("reportDate", trackerArraylist.get(position).get(0).getReportDate());
        //
        //                               Float.parseFloat(trackerArraylist.get(position).get(0).getCanbeTrackedValueArrayList().get(0).getValue());
      });
    }, 50);
  }

  _onScroll = event => {
    // Simple fade-in / fade-out animation
    const CustomLayoutLinear = {
      duration: 100,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      }
    };
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction =
      currentOffset > 0 && currentOffset > this._listViewOffset ? "down" : "up";
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionButtonVisible = direction === "up";
    if (isActionButtonVisible !== this.state.isActionButtonVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear);
      this.setState({ isActionButtonVisible });
    }
    // Update your scroll position
    this._listViewOffset = currentOffset;
  };

  onClose() {
    this.closeModal();
    console.log("Modal just closed");
  }
  onOpen() {
    console.log("Modal just openned");
  }
  onClosingState(state) {
    console.log("the open/close of the swipeToClose just changed");
  }

  closeModal() {
    this.setState({
      isOpen: false,
      isScrollable: true,
      swipeToClose: true
    });
  }

  getSwipe() {
    return this.state.swipeToClose;
  }

  setSwipe(flag) {
    this.setState({
      swipeToClose: flag
    });
  }

  setScroll(flag) {
    this.setState({
      isScrollable: flag
    });
  }

  render() {
    var tracker_pagerData = this.state.autoTrackerList;
    const anim = this.animatedValue.interpolate({
      inputRange: [0.5, 3],
      outputRange: [-100, 400]
    });

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          top: Global.isIphoneX ? 30 : 0
        }}
      >
        <HeaderListExtraLarge
          header="Trackers"
          description=""
          style={{ flex: 0, paddingBottom: 0 }}
          headerStyle={{ backgroundColor: "white" }}
        />
        {!this.state.noConn ? (
          !this.state.isStateRepFlag ? (
            <Animated.View style={{ flex: 1, bottom: anim }}>
              <ListView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                  />
                }
                bounces={true}
                dataSource={this.state.dataSource}
                renderRow={this._renderRowCondition}
                removeClippedSubviews={false}
                onScroll={this._onScroll}
                renderHeader={(secDate, cat) => {
                  return (
                    <View key={cat}>
                      {tracker_pagerData.length > 0 ? (
                        <Animated.View
                          style={{ marginBottom: 8, bottom: anim }}
                        >
                          <Text style={CommonStyles.secondary_text_title}>
                            Recomended
                          </Text>
                          <Text style={CommonStyles.secondary_text_description}>
                            We pull out the most relevant trackers from your
                            medical records
                          </Text>
                          {tracker_pagerData.length > 1 ? (
                            <SwipeInfoText
                              text="trackable values"
                              style={{ justifyContent: "flex-start" }}
                            />
                          ) : null}
                          {this._renderPage()}
                        </Animated.View>
                      ) : null}
                    </View>
                  );
                }}
              />
            </Animated.View>
          ) : (
            <StateRepresentation
              image="search"
              description="No trackable values found"
            ></StateRepresentation>
          )
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          >
            <View style={{ paddingTop: 120 }} />
            <View>
              <StateRepresentation
                image="signal-wifi-off"
                description="No Internet Connection"
              ></StateRepresentation>
            </View>
          </ScrollView>
        )}

        {this.state.isActionButtonVisible ? (
          <Ripple
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              position: "absolute",
              bottom: Global.isIphoneX ? 40 : 16,
              right: 16,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() => {
              this.goToTrackerCategories();
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: Color.fab_color,
                position: "absolute",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <MaterialIcons
                name={"add"}
                size={28}
                style={{
                  color: "white"
                }}
              />
            </View>
          </Ripple>
        ) : null}
        {this.state.isLoading ? <ProgressBar /> : null}

        {this.state.isOpen ? (
          // <Modal
          //  animationType={'none'}
          //  transparent={true}
          //  visible={this.state.isOpen}
          //  onRequestClose = {() => {
          //    this.closeModal()
          //  }}
          //  >
          <ModalBox
            style={[styles.modal, styles.modal1]}
            ref={"modal1"}
            swipeThreshold={200}
            swipeArea={Global.screenHeight}
            isOpen={this.state.isOpen}
            swipeToClose={this.state.swipeToClose}
            onClosed={this.onClose}
            position={"top"}
            keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
            onOpened={this.onOpen}
            setSwipe={this.setSwipe}
            getSwipe={this.getSwipe}
            coverScreen={true}
            isScrollable={this.state.isScrollable}
            onClosingState={this.onClosingState}
          >
            <TrackerDetails
              dictionaryId={this.state.dictionaryId}
              refreshComponent={this.refreshComponent}
              closeModal={this.closeModal}
              setScroll={this.setScroll}
              getSwipe={this.getSwipe}
              setSwipe={this.setSwipe}
            />
          </ModalBox>
        ) : // </Modal>
        null}
      </View>
    );
  }
}

function mapDispatchToActions(dispatch) {
  return {
    getJson: () => dispatch(getJson())
  };
}

const mapStateToProps = state => ({
  trackerJson: state.trackerJson
});

export default connect(
  mapStateToProps,
  mapDispatchToActions
)(Trackers);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    borderWidth: 0.2,
    marginTop: 10,
    elevation: 6,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderColor: Color._DF,
    marginLeft: 17,
    marginRight: 17,
    marginBottom: 24
  },

  text_style: {
    color: Color._36,
    fontSize: 16,
    paddingLeft: 4
  },
  date_style: {
    paddingLeft: 4,
    paddingBottom: 6,
    color: Color._72
  },

  value_style_small: {
    fontSize: 24,
    color: Color._54,
    fontWeight: "400"
  },

  value_style: {
    fontSize: 24,
    color: Color._54,
    fontWeight: "400"
  },

  separator_style: {
    color: "#4a4a4a",
    marginTop: 8,
    paddingLeft: 23,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 8,
    backgroundColor: "#EEEEEE"
  },

  can_text_style: {
    flex: 1,
    height: 50,
    flexDirection: "row",
    paddingTop: 16,
    paddingLeft: 16,
    paddingBottom: 16
  },

  unit_style: {
    color: Color.tracker_vals
  }
});

const styles1 = StyleSheet.create({
  a: {
    fontWeight: "300",
    color: "#FF3366" // make links coloured pink
  }
});
