import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  BackHandler
} from "react-native";
import { ModalBox } from "../../components";
import { Color, Global } from "../../../utils";
import { HeaderListExtraLarge } from "../../layouts";
import Ripple from "../../components/ripple";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { setUnreadFlag, setDemographics } from "../../../redux/actions/index";

import { connect } from "react-redux";

const paths = [
  // { src: require("../../../assets/common/bindu_1.jpeg") },
  // { src: require("../../../assets/common/bindu_2.jpeg") },
  // { src: require("../../../assets/common/bindu_3.jpeg") },
  { src: require("../../../assets/common/bindu_4.jpeg") },
  { src: require("../../../assets/common/bindu_5.jpeg") },
  { src: require("../../../assets/common/bindu_6.jpeg") }
];

BackHandler.addEventListener("hardwareBackPress", function() {
  // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
  // Typically you would use the navigator here to go to the last state.

  // if (!this.onMainScreen()) {
    // this.goBack();
    // return true;
  // }
  // return f;
});

class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      currentImage: "",
      imageModal: false
    };
  }

  loadingManipulate(flag) {
    this.setState({
      isLoading: flag
    });
  }

  showImage = src => {
    this.setState({ imageModal: true, currentImage: src });
  };

  onClose = () => {
    this.setState({
      imageModal: false
    });
    console.log("Modal just closed");
  };
  onOpen = () => {
    console.log("Modal just openned");
  };
  onClosingState = state => {
    console.log("the open/close of the swipeToClose just changed");
  };

  componentDidMount() {
    console.log("PROPS", this.props);
    this.props.setDemographics({ screen: 0 });
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackPress
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
    this.props.setDemographics({ screen: 1 });
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <TouchableOpacity
            activeOpacity={0.4}
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={{
              paddingLeft: 18,
              paddingTop: Global.iOSPlatform ? 38 : 18,
              paddingBottom: -16
            }}
          >
            <MaterialIcons
              name={"close"}
              size={28}
              style={{
                color: "black",
                marginLeft: -6,
                marginBottom: 6
              }}
            />
          </TouchableOpacity>
          <HeaderListExtraLarge
            header="Bindu Diagnostics Pvt Ltd"
            description="Allalpatti, Darbhanga, Pin - 846003"
            style={{ flex: 0, paddingTop: 0 }}
          ></HeaderListExtraLarge>

          <FlatList
            data={paths}
            renderItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: "column", margin: 1 }}>
                <Ripple
                  onPress={() => {
                    this.showImage(item.src);
                  }}
                >
                  <Image
                    resizeMode={"contain"}
                    style={{ height: 200, width: 200 }}
                    source={item.src}
                  />
                </Ripple>
              </View>
            )}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        {/* <Modal
          onBackButtonPress={() => {
            this.setState({ imageModal: false });
          }}
          animationType="slide"
          transparent={false}
          visible={this.state.imageModal}
          onRequestClose={() => {}}
        >
          <View
            style={{
              marginTop: 22,
              height: 200,
              width: 200,
              backgroundColor: "transparent"
            }}
          >
            <View>
              <Image
                resizeMode={"cover"}
                style={{ height: 200, width: 200 }}
                source={this.state.currentImage}
              />
            </View>
          </View>
        </Modal> */}

        {this.state.imageModal ? (
          <ModalBox
            style={{
              justifyContent: "center",
              borderRadius: 6,
              backgroundColor: " rgba(0, 0, 0, 0)"
            }}
            ref={"modal1"}
            swipeThreshold={200}
            isOpen={true}
            backdropPressToClose={true}
            swipeToClose={this.state.swipeToClose}
            onClosed={this.onClose}
            position={"top"}
            backdrop={true}
            backButtonClose={true}
            keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
            onOpened={this.onOpen}
            onClosingState={this.onClosingState}
          >
            <View
              style={{
                flexDirection: "column",
                margin: 8,
                backgroundColor: "transparent",
                borderRadius: 6,
                borderWidth: 0.5,
                borderColor: Color._DF
              }}
            >
              {/* <TouchableOpacity
                activeOpacity={0.4}
                onPress={() => {
                  this.onClose();
                }}
                style={{
                  paddingLeft: 18,
                  paddingTop: Global.iOSPlatform ? 38 : 18
                }}
              >
                <MaterialIcons
                  name={"close"}
                  size={28}
                  style={{
                    color: "black",
                    marginLeft: -6,
                    marginBottom: 6
                  }}
                />
              </TouchableOpacity> */}
              <Image
                resizeMode={"stretch"}
                style={{ width: Global.screenWidth - 10, height: 400 }}
                source={this.state.currentImage}
              />
            </View>
          </ModalBox>
        ) : null}
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
  demographics: state.demographics,
  currency: state.currency
});

export default connect(
  mapStateToProps,
  mapDispatchToActions
)(Gallery);
