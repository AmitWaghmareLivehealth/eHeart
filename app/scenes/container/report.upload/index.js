import React, { Component } from "react";
import {
  Alert,
  View,
  Text,
  ScrollView,
  Image,
  WebView,
  TouchableOpacity,
  KeyboardAvoidingView,
  KeyboardAvoidingViewStatic,
  Linking
} from "react-native";
import PropTypes from "prop-types";
import Entypo from "react-native-vector-icons/Entypo";
import ImagePicker from "react-native-image-crop-picker";
import RNFetchBlob from "react-native-fetch-blob";
import moment from "moment";

import {
  TextField,
  Button,
  TextView,
  TagInput,
  TextInputHeader,
  CloseBar,
  Separator,
  ProgressBar,
  Ripple
} from "../../components";
import DatePicker from "../../components/datepicker";
import { HeaderListExtraLarge, ModalNormal } from "../../layouts";
import {
  Color,
  Global,
  stringsAlertReports,
  extFile,
  CommonManager,
  AlertManager,
  ReportManager,
  CommonStyles,
  Images
} from "../../../utils";
import styles from "./styles";

import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
var RNGRP = require("react-native-get-real-path");

export default class ReportUpload extends Component {
  static propTypes = {
    dateVisible: PropTypes.bool
  };

  static defaultProps = {
    dateVisible: false
  };

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      date: "",
      dateInDisplayFormat: "",
      comments: "",
      tags: [],
      isPDF: false,
      isImageLoaded: false,
      imageToBeUploaded: undefined,
      imageToBeUploadedPath: "",
      notReadyToUpload: true,
      isModalPickerVisible: false,
      isReportImageSelected: false,
      dateVisible: false,
      isUploading: false
    };

    this.uploadReport = this.uploadReport.bind(this);
    this.checkUploadButton = this.checkUploadButton.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChangeDate1 = this.onChangeDate1.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.loaderVisibility = this.loaderVisibility.bind(this);
    this.renderPickerModal = this.renderPickerModal.bind(this);
    this.setFinalPdfPath = this.setFinalPdfPath.bind(this);
    this.setFinalPdfPath2 = this.setFinalPdfPath2.bind(this);
    this.setFinalPdfPath3 = this.setFinalPdfPath3.bind(this);
  }

  async downloadReportImage(filePath, reportId) {
    ReportManager.downloadReportImage(filePath, reportId)
      .then(result => {
        if (result.success) {
          RNFetchBlob.fs
            .exists(result.response.path)
            .then(exist => {
              console.log(result.response.path);
              this.setState({
                isImageLoaded: true,
                imageToBeUploadedPath: "file://" + result.response.path
              });
            })
            .catch(error => CommonManager.handleErrorWithMsg(error));
        }
      })
      .catch(error => {
        CommonManager.handleErrorWithMsg(
          error,
          stringsAlertReports.unableToRetrive.header,
          stringsAlertReports.unableToRetrive.message
        );
      });
  }

  uploadReport() {
    // if(!Global.iOSPlatform){
    this.loaderVisibility(true);
    // }
    ReportManager.uploadReport(
      this.state.isPDF,
      this.state.title.trim(),
      this.state.date,
      this.state.tags.join(),
      this.state.comments.trim(),
      this.state.imageToBeUploadedPath
    )
      .then(result => {
        // this.loaderVisibility(false)
        if (result.success) {
          AlertManager.AlertGeneric(
            stringsAlertReports.reportUploadSuccess.header,
            stringsAlertReports.reportUploadSuccess.message,
            [
              {
                text: "Done",
                onPress: (() => {
                  this.loaderVisibility(false);
                  this.props.refreshReportList();
                  this.props.closeModal();
                }).bind(this)
              }
            ]
          );
        } else {
          //this.setState({ isUploading: false })
          Alert.alert(
            "Something went wrong",
            "Please try again later",
            [
              {
                text: "OK",
                onPress: () => this.setState({ isUploading: false })
              }
            ],
            { cancelable: false }
          );

          // CommonManager.handleErrorWithMsg('error', stringsAlertReports.reportUploadFailure.header, stringsAlertReports.reportUploadFailure.message)
        }
      })
      .catch(error => {
        // this.setState({isUploading:false});
        // this.setTimeout(()=>{
        //   Alert.alert('Something  went wrong', 'Please try again later.');
        // },200)
        Alert.alert(
          "Something went wrong",
          "Please try again later",
          [
            { text: "OK", onPress: () => this.setState({ isUploading: false }) }
          ],
          { cancelable: false }
        );
        // CommonManager.handleErrorWithMsg(error, stringsAlertReports.reportUploadFailure.header, stringsAlertReports.reportUploadFailure.message)
      });
  }

  loaderVisibility(visible = false) {
    this.setState({ isUploading: visible });
  }

  removeImage() {
    this.setState({
      isImageLoaded: false,
      imageToBeUploadedPath: "new"
    });
  }

  setFinalImagePath(image) {
    RNFetchBlob.fs
      .exists(image.path || "")
      .then(exist => {
        var ext = extFile.getFileExtFromMIME(image.mime || "");
        if (ext !== ".tmp") {
          RNFetchBlob.fs
            .readFile(image.path || "", "base64")
            .then(imageDataBase64 => {
              this.loaderVisibility(false);
              console.log(image.path);
              this.setState({
                isPDF: ext === ".pdf",
                isImageLoaded: true,
                imageToBeUploaded: imageDataBase64,
                imageToBeUploadedPath: image.path,
                isReportImageSelected: true
              });
              this.checkUploadButton(this.state.title);
            })
            .catch(error => {
              this.loaderVisibility(false);
              CommonManager.handleError;
            });
        } else {
          this.loaderVisibility(false);
          AlertManager.AlertGeneric(
            stringsAlertReports.unknownFileType.header,
            stringsAlertReports.unknownFileType.message
          );
        }
      })
      .catch(error => {
        this.loaderVisibility(false);
        CommonManager.handleErrorWithMsg(
          error,
          stringsAlertReports.unknownFileType.header,
          stringsAlertReports.unknownFileType.message
        );
      });
  }

  setFinalPdfPath(url) {
    if (url) {
      var output = url.uri + "/" + url.fileName;

      RNFetchBlob.fs
        .exists(url.uri || "")
        .then(exist => {
          var ext = extFile.getFileExtFromMIME(url.type || "");
          if (ext !== ".tmp") {
            RNFetchBlob.fs
              .readStream(url.uri || "", "base64")
              .then(imageDataBase64 => {
                this.loaderVisibility(false);
                this.setState({
                  isPDF: ext === ".pdf",
                  isImageLoaded: true,
                  imageToBeUploaded: imageDataBase64,
                  imageToBeUploadedPath: output,
                  isReportImageSelected: true
                });
                console.log("THE PATH", imageDataBase64);
                this.checkUploadButton(this.state.title);
              })
              .catch(error => {
                this.loaderVisibility(false);
                CommonManager.handleError;
              });
          } else {
            this.loaderVisibility(false);
            AlertManager.AlertGeneric(
              stringsAlertReports.unknownFileType.header,
              stringsAlertReports.unknownFileType.message
            );
          }
        })
        .catch(error => {
          this.loaderVisibility(false);
          CommonManager.handleErrorWithMsg(
            error,
            stringsAlertReports.unknownFileType.header,
            stringsAlertReports.unknownFileType.message
          );
        });
    }
  }

  setFinalPdfPath2(url) {
    if (url) {
      var str = url.uri;
      var res = str.replace("content://", "file://");
      console.log("YE" + res);

      RNFetchBlob.fs
        .exists(res || "")
        .then(exist => {
          // var ext = extFile.getFileExtFromMIME(url.type || '')
          // if (ext !== '.tmp') {
          RNFetchBlob.fs
            .readStream(res || "", "base64")
            .then(imageDataBase64 => {
              this.loaderVisibility(false);
              this.setState({
                isPDF: true,
                isImageLoaded: true,
                imageToBeUploaded: imageDataBase64,
                imageToBeUploadedPath: res,
                isReportImageSelected: true
              });
              this.checkUploadButton(this.state.title);
            })
            .catch(error => {
              this.loaderVisibility(false);
              CommonManager.handleError;
            });
          // } else {
          //   this.loaderVisibility(false)
          //   AlertManager.AlertGeneric(stringsAlertReports.unknownFileType.header, stringsAlertReports.unknownFileType.message)
          // }
        })
        .catch(error => {
          this.loaderVisibility(false);
          CommonManager.handleErrorWithMsg(
            error,
            stringsAlertReports.unknownFileType.header,
            stringsAlertReports.unknownFileType.message
          );
        });
    }
  }

  setFinalPdfPath3(url) {
    if (url) {
      var str = url.uri;
      var res = str.replace("file://", "");
      console.log("YE" + res);
      let filePath = "";
      RNGRP.getRealPathFromURI(url.uri).then(filePath =>
        //console.log('FINALLY',filePath)

        RNFetchBlob.fs
          .readFile(url.uri, "base64")
          // files will an array contains filenames
          .then(files => {
            this.loaderVisibility(false);
            this.setState({
              isPDF: true,
              isImageLoaded: true,
              imageToBeUploaded: files,
              imageToBeUploadedPath: filePath,
              isReportImageSelected: true
            });
            this.checkUploadButton(this.state.title);
          })
      );
    }
  }

  setModalVisible(flag = false) {
    this.setState({
      dateVisible: flag
    });
  }

  onChangeDate1(dateInYYYYMMDDFormat) {
    let dateInDateFormat = moment(dateInYYYYMMDDFormat, "YYYY/MM/DD");
    let date =
      moment(dateInDateFormat).format(Global.LTHDateFormatMoment) + "Z";
    let dateInDisplayFormat = moment(dateInDateFormat).format(
      Global.dateFormatDisplay
    );
    this.setState({ date: date, dateInDisplayFormat: dateInDisplayFormat });
    setTimeout(
      (() => {
        this.checkUploadButton(this.state.title);
      }).bind(this),
      50
    );
  }

  getIcon(name, title, size = 17, action, style) {
    return name !== "upload" ? (
      <Entypo.Button
        name={name}
        size={size}
        backgroundColor={"#FFFFFFFF"}
        color={Color._75}
        onPress={action}
        underlayColor="#F5F5F5"
        style={{ marginRight: 24, marginLeft: 16 }}
      >
        {title}
      </Entypo.Button>
    ) : (
      <Ripple onPress={action}>
        <View style={{ flexDirection: "row", paddingTop: 8, paddingBottom: 8 }}>
          <Image
            source={Images.imageUpload}
            style={{
              height: 17,
              width: 17,
              marginTop: 4,
              marginRight: 12,
              marginLeft: 24,
              tintColor: Color._72
            }}
          />
          <Text style={{ fontWeight: "600" }}>{title}</Text>
        </View>
      </Ripple>
    );
  }

  getRemoveReportButton() {
    return (
      <Entypo.Button
        name={"cross"}
        size={30}
        backgroundColor={"#0005"}
        style={styles.iconRemoveImage}
        onPress={this.removeImage}
        underlayColor="#F5F5F5"
        iconStyle={{ backgroundColor: "#0005" }}
      />
    );
  }

  checkUploadButton(text) {
    let needToEnable =
      text.trim().length > 3 &&
      this.state.imageToBeUploadedPath.length > 4 &&
      this.state.dateInDisplayFormat.length > 5;
    this.setState({ notReadyToUpload: !needToEnable, title: text });
    return needToEnable;
  }

  renderHeader() {
    return (
      <View style={{ flex: 0 }}>
        <CloseBar goBack={() => this.props.closeModal()} color={"black"} />
        <HeaderListExtraLarge
          header="Upload Report"
          description="Upload a photo or a pdf of your previous reports on cloud to access it from anywhere."
          style={{
            flex: 0,
            backgroundColor: "white",
            marginTop: 0,
            paddingTop: 0
          }}
          headerStyle={{ flex: 0, backgroundColor: "white" }}
        />
      </View>
    );
  }

  renderGetFileState() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          width: Global.screenWidth
        }}
      >
        {this.renderHeader()}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <TouchableOpacity activeOpacity={1.0} onPress={this.closeModal}>
            {/* <View style={{ borderWidth: 2.0, borderRadius: 50, width: 100, height: 100, overflow: 'hidden', backgroundColor: '#F7FBFF', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}> */}
            {/* <Entypo
              name={'arrow-up'}
              size={35}
              backgroundColor={'#FFFFFFFF'}
              color={'#000'}
              style={{ marginBottom: -4, marginTop: -10 }}
              onPress={() => this.closeModal(true)}
              underlayColor='#FFF'
            /> */}
            <TouchableOpacity
              activeOpacity={0.4}
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => this.closeModal(true)}
            >
              <Image
                source={Images.imageUpload_new}
                style={{
                  height: 100,
                  width: 100,
                  tintColor: "#565656",
                  marginTop: 12
                }}
              />
            </TouchableOpacity>
            {/* <View style={{ backgroundColor: '#000', width: 27, height: 4 }} /> */}
            {/* </View> */}
            <Text
              style={{
                fontFamily: "Arial",
                textAlign: "center",
                padding: 20,
                fontSize: 18
              }}
            >
              Tap to select file
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderGetReportDetails() {
    var fileNamePathArray = this.state.imageToBeUploadedPath.split("/");
    var fileName = decodeURIComponent(
      fileNamePathArray[fileNamePathArray.length - 1]
    );
    return (
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        contentContainerStyle={{ flex: 1 }}
      >
        {this.renderHeader()}
        <KeyboardAvoidingView style={styles.scrollViewMainContainer}>
          <Separator />
          <Text
            style={{ fontFamily: "Arial", marginTop: 17, marginBottom: 10 }}
          >
            File Name
          </Text>
          <Text style={{ fontFamily: "Arial", marginBottom: 17 }}>
            {fileName}
          </Text>
          <TextField
            focusOnComponentMount={false}
            title={"Enter Title"}
            height={60}
            onChangeText={text => {
              this.checkUploadButton(text);
            }}
            value={this.state.title}
            placeholder={""}
            style={{ width: Global.screenWidth - 34, marginBottom: 17 }}
            inputStyle={{ height: 38, paddingTop: 3, flex: 0, paddingLeft: 0 }}
          />
          <TouchableOpacity
            activeOpacity={1.0}
            style={{ marginBottom: -10 }}
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <TextField
              title="Pick Date"
              focusOnComponentMount={false}
              value={this.state.dateInDisplayFormat}
              height={60}
              placeholder=""
              editable={false}
              style={{
                flex: 0,
                width: Global.screenWidth - 34,
                marginBottom: 17
              }}
              inputStyle={{
                height: 38,
                paddingTop: 3,
                flex: 0,
                paddingLeft: 0
              }}
            />
          </TouchableOpacity>
          <TextView
            focusOnComponentMount={false}
            title={"Comments"}
            onChangeText={comments => {
              this.checkUploadButton(this.state.title);
              this.setState({ comments: comments });
            }}
            showSeparator
            placeholder={""}
            value={this.state.comments}
            numberOfLines={5}
            maxHeight={152}
            initialHeight={20}
          />
          <TagInput
            value={this.state.tags}
            onChange={tags => {
              this.checkUploadButton(this.state.title);
              this.setState({
                tags: tags
              });
            }}
            tagColor={Color.themeColor}
            tagTextColor="white"
            numberOfLines={2}
            maxTagCount={10}
            title="Tags"
            inputProps={{
              placeholder: ""
            }}
          />
          <Separator style={{ marginTop: 0, marginBottom: 20 }} />
        </KeyboardAvoidingView>
        <View style={{ flex: 1, flexGrow: 0.4, justifyContent: "flex-end" }}>
          <Button
            title="Upload Report"
            color={Color.themeColor}
            accessibilityLabel="Upload Report"
            isDisabled={this.state.notReadyToUpload}
            onPress={this.uploadReport}
            style={[styles.buttonUploadReport]}
          />
        </View>
      </ScrollView>
    );
  }

  renderPickerModal() {
    return (
      <ModalNormal
        showWithCloseAction={false}
        visible={this.state.isModalPickerVisible}
        onRequestClose={this.closeModal}
      >
        <View>
          <Text
            style={[CommonStyles.textHeader4, { margin: 24, marginBottom: 15 }]}
          >
            Select Source
          </Text>
          {this.getIcon("camera", "Camera", 17, () => {
            this.loaderVisibility(true);

            ImagePicker.openCamera({
              compressImageQuality: 0.5,
              width: 1200,
              height: 1800,
              cropping: true,
              mediaType: "photo"
            })
              .then(image => {
                //console.log('IMAGE PATH', image+'');
                this.closeModal();
                this.setFinalImagePath(image);
              })
              .catch(error => {
                if (Global.iOSPlatform) {
                  if (
                    String(error).includes(
                      "User did not grant camera permission."
                    )
                  ) {
                    Alert.alert(
                      "Camera",
                      "You need to grant camera permission from settings",
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed")
                        },
                        {
                          text: "Settings",
                          onPress: () => {
                            Linking.openURL("app-settings:");
                            this.setState({
                              modal_visible: false
                            });
                          }
                        }
                      ],
                      { cancelable: false }
                    );
                  }
                } else {
                  this.setState({
                    isUploading: false
                  });
                }
              });
          })}
          <Separator
            style={{
              marginTop: 10,
              marginBottom: 10,
              marginRight: 24,
              marginLeft: 24
            }}
          />
          {this.getIcon("images", "Pick up from gallery", 17, () => {
            ImagePicker.openPicker({
              compressImageQuality: 0.5,
              width: 1200,
              height: 1600,
              cropping: true,
              mediaType: "any"
            })
              .then(image => {
                console.log("IMAGE" + JSON.stringify(image));
                this.closeModal();
                this.setFinalImagePath(image);
              })
              .catch(error => {
                if (Global.iOSPlatform) {
                  if (
                    String(error).includes(
                      "Cannot access images. Please allow access if you want to be able to select images."
                    )
                  ) {
                    Alert.alert(
                      "Photos",
                      "You need to grant permission to access photos from settings",
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed")
                        },
                        {
                          text: "Settings",
                          onPress: () => {
                            Linking.openURL("app-settings:");
                            this.setState({
                              modal_visible: false
                            });
                          }
                        }
                      ],
                      { cancelable: false }
                    );
                  }
                } else {
                  this.setState({
                    isUploading: false
                  });
                }
              });
          })}

          <Separator
            style={{
              marginTop: 10,
              marginBottom: 10,
              marginRight: 24,
              marginLeft: 24
            }}
          />
          {this.getIcon("upload", "Upload a pdf Report", 17, () => {
            DocumentPicker.show(
              {
                filetype: [DocumentPickerUtil.pdf()]
              },
              (error, url) => {
                console.log("THIS IS THE PDF URL: " + JSON.stringify(url));
                this.closeModal();

                {
                  Global.iOSPlatform
                    ? this.setFinalPdfPath2(url)
                    : this.setFinalPdfPath3(url);
                }
              }
            );
          })}
        </View>
      </ModalNormal>
    );
  }

  closeModal(isModalPickerVisible = false) {
    this.setState({ isModalPickerVisible: isModalPickerVisible });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {this.state.isReportImageSelected
          ? this.renderGetReportDetails()
          : this.renderGetFileState()}
        {this.state.isModalPickerVisible && this.renderPickerModal()}
        {this.state.dateVisible && (
          <DatePicker
            dialog_visible={this.setModalVisible}
            setTime={this.onChangeDate1}
            isSkipButtonVisible={false}
          />
        )}
        {this.state.isUploading && <ProgressBar />}
      </View>
    );
  }
}
