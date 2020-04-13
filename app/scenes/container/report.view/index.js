import React, {Component} from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  WebView,
  Platform,
  StyleSheet,
  processColor,
  TouchableOpacity,
  ScrollView,
  Linking,
  Share,
  PanResponder,
  PixelRatio,
  Modal,
} from 'react-native';
import {connect} from 'react-redux';
import {LineChart} from 'react-native-charts-wrapper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HTMLView from 'react-native-htmlview';
// import OpenFile from "react-native-doc-viewer";
import moment from 'moment';
import _ from 'underscore';

import {
  URLs,
  Routes,
  Global,
  Color,
  UserDefaults,
  stringsUserDefaults,
  NetworkRequest,
  DictionaryManager,
  UserManager,
  ReportManager,
  CommonManager,
  extString,
  CommonStyles,
} from '../../../utils';
import {
  Separator,
  ListHeader,
  CloseBar,
  CloseBarAnimated,
  Ripple,
  Fab,
  DialogHeader,
  ButtonTextOnly,
  ProgressBar,
} from '../../components';
import {HeaderListExtraLarge, ModalWithTitleAndFab} from '../../layouts';
import Intercom from 'react-native-intercom';
import {NavigationActions} from 'react-navigation';
import ListView from 'deprecated-react-native-listview';
import styles from './styles';
import ImageScrollView from './ImageScrollView';
import PinchZoomView from 'react-native-pinch-zoom-view';
import ZoomImageView from './ZoomImageView';
import { replaceHTMLTags } from './utils';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

let currentMove = 0;
let scrollControl = 0;
var count = 0;
export default class ReportView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: new Array(),
      selectedImage: null,
      dataSource: ds.cloneWithRowsAndSections([]),
      reportObj: {},
      isLoading: true,
      isReportLoaded: false,
      isReportDescVisible: true,
      reportData: {
        headerSection: [],
        dictionaryDesc: [],
        reportSection: [],
        lastSection: [],
        manualDictId: 0,
      },
      reportLevel: 0,
      // 0 - No State, 1 - Green - Normal, 2 - Yellow - Need Attention, 3 - red - critical
      reportLevelIndicatorColor: 'transparent',
      isRelatedReportDialogVisible: false,
      report: {},
      animatedScrollOffsetY: 0,
      scrollContentHeight: Global.screenHeight,
      isDownloadActionVisible: true,
      topReached: false,
      scroll: true,
      panResponse: false,
      isVisible: false,
      dicId: 0,
      name: '',
      description: '',
      userReportId: 0,
      selected_automated_item: [],
      attachments: [],
    };
    this.getData = this.getData.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._downloadPDF = this._downloadPDF.bind(this);
    this._renderReportHeader = this._renderReportHeader.bind(this);
    this._renderReportFooter = this._renderReportFooter.bind(this);
    this._renderReportLevel = this._renderReportLevel.bind(this);
    this.loaderVisibility = this.loaderVisibility.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this._renderAnimatedCloseBar = this._renderAnimatedCloseBar.bind(this);

    this.downloadFileType = this.downloadFileType.bind(this);
    this.gotoTrackers = this.gotoTrackers.bind(this);
    // this.populateGraphData = this.populateGraphData.bind(this)
  }

  componentDidMount() {
    const params = this.props;
    if (params.reportListObject) {
      this.setState({reportListObject: params.reportListObject});
      setTimeout(() => this.getData(params.reportListObject.userReportId), 50);
    } else {
      setTimeout(() => this.getData(params.reportId), 50);
    }
  }

  loaderVisibility(visible = false) {
    this.setState({isLoading: visible});
  }

  // populateGraphData(val){

  //   var autoDictionaryMap = {}
  //   var autoTrackerList = []
  //   if(!(this.state.dicId in autoDictionaryMap)){
  //     if (!isNaN(val.val)){
  //       var graphdata = []
  //       graphdata.push({
  //         y: Number(val.val)
  //       })
  //       autoDictionaryMap[this.state.dicId] = {
  //         graphdata : graphdata,
  //         value: val.val
  //       }
  //     }
  //   }

  //   for(keys in autoDictionaryMap){
  //     let dataSets = []
  //     dataSets.push({
  //       values: autoDictionaryMap[keys].graphdata,
  //       // values: [, , , , , , , , , , , , ,{x: 251, y: 100}, {y: 110}, {y: 105}, {y: 115}],
  //       label: 'Company Dashed',
  //       config: {
  //         color: Color.appointmentBlue,
  //         drawFilled: true,
  //         fillColor: Color.themeColor,
  //         fillAlpha: 99,
  //         lineWidth: 0.2,
  //         drawCubicIntensity: 0.2,
  //         circleRadius: 4,
  //         drawValues: false,
  //         drawCircles: false,
  //         mode: 'CUBIC_BEZIER',
  //         drawCubicIntensity: 0.2,
  //         circleColor: processColor('#2D74A2'),
  //         drawCircleHole: false,
  //       }
  //     })

  //     var isSingleVal = false;
  //     if(autoDictionaryMap[keys].graphdata.length === 1){
  //        isSingleVal = true
  //     }
  //     autoTrackerList.push({
  //       dataSets: {dataSets: dataSets},
  //       value: autoDictionaryMap[keys].value,
  //       isSingleVal : isSingleVal
  //     })
  //   }

  //   // this.setState({
  //   //   autoTrackerList:autoTrackerList
  //   // })
  // }

  async getData(reportId) {
    // 1146941
    if (this.props.setReportReadCount) {
      this.props.setReportReadCount(reportId);
    }
    if (!Object.keys(this.state.reportObj).includes[reportId]) {
      this.loaderVisibility(true);

      var _this = this;
      ReportManager.getReportDetails(reportId, _this)
        .then(result => {
          if (result.success) {
            let oldObj = this.state.reportObj;
            oldObj[reportId] = result.response;
            const {attachments = []} = result.response;
            this.loaderVisibility(false);
            this.setState({
              reportObj: oldObj,
              report: result.response,
              isReportLoaded: true,
              isLoading: false,
              attachments: attachments,
            });

            this.renderReportView(result.response);

            if (this.props.getData) {
              this.props.getData();
            }
          }
        })
        .catch(() => {
          this.loaderVisibility(false);
          CommonManager.handleError();
        });
    } else {
      var reportData = this.state.reportObj[reportId];
      this.setState({
        report: reportData,
        isReportLoaded: true,
        isLoading: false,
      });
      this.renderReportView(reportData);
    }
  }

  gotoTrackers(val) {
    var autoDictionaryMap = {};
    var autoTrackerList = [];
    if (!(this.state.dicId in autoDictionaryMap)) {
      if (!isNaN(val.val)) {
        var graphdata = [];
        graphdata.push({
          y: Number(val.val),
        });
        autoDictionaryMap[this.state.dicId] = {
          graphdata: graphdata,
          value: val.val,
        };
      }
    }

    for (keys in autoDictionaryMap) {
      let dataSets = [];
      dataSets.push({
        values: autoDictionaryMap[keys].graphdata,
        // values: [, , , , , , , , , , , , ,{x: 251, y: 100}, {y: 110}, {y: 105}, {y: 115}],
        label: 'Company Dashed',
        config: {
          color: Color.appointmentBlue,
          drawFilled: true,
          fillColor: Color.themeColor,
          fillAlpha: 99,
          lineWidth: 0.2,
          drawCubicIntensity: 0.2,
          circleRadius: 4,
          drawValues: false,
          drawCircles: false,
          mode: 'CUBIC_BEZIER',
          drawCubicIntensity: 0.2,
          circleColor: Color.appointmentBlue,
          drawCircleHole: false,
        },
      });

      var isSingleVal = false;
      if (autoDictionaryMap[keys].graphdata.length === 1) {
        isSingleVal = true;
      }
      autoTrackerList.push({
        dataSets: {dataSets: dataSets},
        value: autoDictionaryMap[keys].value,
        isSingleVal: isSingleVal,
      });
    }

    //HERE
    UserDefaults.get(stringsUserDefaults.userToken)
      .then(token => {
        let params =
          'token=' + (token || '') + '&dictionaryId=' + this.state.dicId;

        var _this = this;
        NetworkRequest(_this, 'POST', URLs.dictionaryDetails, params)
          .then(result => {
            if (result.success) {
              if ((result.response.code || 0) === 200) {
                console.log('Data: ', result);
                this.setState({isLoading: false});

                this.props.closeModal();
                this.props.navigation.navigate(Routes.trackerAutomatedScreen, {
                  dictionaryId: this.state.dicId,
                  name: this.state.name,
                  description: this.state.description,
                  userReportId: this.state.userReportId,
                  refreshComponent: this.refreshComponent,
                  selected_ref: result.response,
                  item: autoTrackerList,
                });
                // this.props.navigation.navigate(Routes.trackerNav, {fromReport: true})
              } else if ((result.response.code || 0) === 500) {
                this.setState({isLoading: false});
                this.setState({isStateRepFlag: true});
              } else {
                this.setState({isLoading: false});
                this.setState({isStateRepFlag: true});
              }
            } else {
              this.setState({isLoading: false});
            }
          })
          .catch(error => {
            this.setState({
              isLoading: false,
            });
            console.error(error);
          });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
        console.error(error);
      });
  }

  async getImages(value) {
    setTimeout(() => {
      value.downloadFileInProgress = true;
      NetworkRequest.ImageDownloader(
        URLs.awsMediaPath + value.originalFilesPath,
        value.filePath,
        success => {
          value.downloadFileInProgress = false;
          if (success) {
            this.render();
          }
        },
      );
    }, 2000);
  }

  setList(list: array) {
    this.props.setList(list);
  }

  renderGraph(val) {
    let arrayOfValues = JSON.parse(val.val) || [];
    let requiredArrayOfObjects = [];
    if (arrayOfValues.length > 2) {
      arrayOfValues.forEach(val => {
        if (val.length > 1) {
          requiredArrayOfObjects.push({
            x: Number(val[0]) || 0,
            y: Number(val[1]) || 0,
          });
        }
      });
    }
    let rawXYStructure = [];
    rawXYStructure = requiredArrayOfObjects;

    var dataSets = [
      {
        values: rawXYStructure,
        // values: [, , , , , , , , , , , , ,{x: 251, y: 100}, {y: 110}, {y: 105}, {y: 115}],
        label: 'Company Dashed',
        config: {
          color: processColor(Color.tracker_vals),
          drawFilled: true,
          fillColor: processColor(Color.tracker_vals),
          fillAlpha: 50,
          lineWidth: 2.5,
          drawCubicIntensity: 0.2,
          circleRadius: 5,
          drawCircles: false,
          circleColor: processColor(Color.tracker_vals),
          drawCircleHole: true,
        },
      },
    ];
    var data = {dataSets: dataSets};
    var xAxis = {
      startAtZero: true,
      position: 'BOTTOM',
      drawGridLines: false,
    };
    if (arrayOfValues.length > 2) {
      return (
        <View style={{height: 250}}>
          <LineChart
            style={{height: 250}}
            data={data}
            description={{text: ''}}
            chartDescription={{text: ''}}
            legend={{enabled: false}}
            marker={{enabled: false}}
            xAxis={xAxis}
            axisRight={{enable: false, drawGridLines: false}}
            yAxis={{
              startAtZero: true,
              drawGridLines: false,
              position: 'INSIDE_CHART',
            }}
            drawGridBackground={false}
            borderColor={processColor('teal')}
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
        </View>
      );
    } else {
      return null;
    }
  }

  async _downloadPDF(needToShare = false) {
    this.setState({isLoading: true});
    ReportManager.downloadPDF(this.state.report.reportData.userReportId)
      .then(result => {
        if (result.success) {
          var fileURL = result.response.path;
          if (Global.iOSPlatform) {
            this.setState({downloadPDFProgress: false, isLoading: false});
          } else {
            setTimeout(() => {
              this.setState({downloadPDFProgress: false, isLoading: false});
            }, 5000);
          }
          if (needToShare) {
            return fileURL;
          } else {
            setTimeout(() => {
              // this.props.navigation.navigate(Routes.reportPDFScreen, {
              //   url: fileURL
              // })
              if (Platform.Version > 22) {
                Linking.openURL(fileURL);
              } else {
                // OpenFile.openDoc([{
                //   url: fileURL,
                //   fileName: 'Report'
                UserDefaults.get(stringsUserDefaults.userToken)
                  .then(token => {
                    Linking.openURL(
                      URLs.mobilePDFReportDownload +
                        '?userToken=' +
                        token +
                        '&userReportId=' +
                        this.state.report.reportData.userReportId,
                    );
                  })
                  .catch(error => {
                    console.log(error);
                  });

                // }], (error, url) => {
                //   console.log(error + ' ' + url)
                // })
              }
            }, 50);
          }
        } else {
          this.setState({downloadPDFProgress: false, isLoading: false});
        }
      })
      .catch(error => {
        this.setState({downloadPDFProgress: false, isLoading: false});
        CommonManager.handleError(error);
        if (needToShare) {
          return '';
        }
      });
  }

  _downloadPDFAndShare() {
    this._downloadPDF(true)
      .then(fileURL => {
        if (fileURL.length > 4) {
          var shareTitle =
            'Report : ' +
            (this.state.report.reportData.reportName || '').trim();
          let shareOptions = {
            title: shareTitle,
            message: '',
            url: fileURL,
            subject: 'Medical ' + shareTitle, //  for email
          };
          // Share.open(shareOptions).catch(err => console.log(err))
        }
      })
      .catch(error => console.log(error));
  }

  async renderReportView(data) {
    try {
      //HERE
      console.log('Datatatatatata: ', data);
      if (data.isTrackStop == 0 && data.reportData.isReferral == 0) {
        // if(data.isTrackStop==0 ){

        for (i = 0; i < data.valueData.length; i++) {
          if (data.valueData[i].dictionaryId) {
            if (data.valueData[i].dictionaryId.isDisabled == 0) {
              console.log('Trackable', data);

              this.setState({
                manualDictId: data.valueData[i].dictionaryId.id,
                dicId: data.valueData[i].dictionaryId.id,
                name: data.reportData.reportName,
                description: data.valueData[i].dictionaryId.description,
                userReportId: data.reportData.userReportId,
              });
              // console.log('Trackable',  data.valueData[i].value)
            }
          }
        }
      }

      var valuesToRepresent = [];
      var newDS = {
        headerSection: [],
        descriptionSection: [],
        reportSection: valuesToRepresent,
        lastSection: [{}],
      };

      var reportLevel = 0;
      var reportLevelIndicatorColor = 'transparent';
      data.valueData.sort((a, b) => a.order - b.order);
      var isFileInput =
        data.reportData.fileInputReport === 1 ||
        data.reportData.fileInputReport === '1';
      var isNotCollectionOnly =
        (data.reportData.isCollectionOnly || 0) === 0 ||
        data.reportData.isCollectionOnly === '0';
      if (isNotCollectionOnly && !isFileInput) {
        data.valueData.forEach(valInData => {
          var formatMatchedArray =
            data.formatData.filter(x => x.index === valInData.index) || [];
          if (formatMatchedArray.length > 0) {
            var format = formatMatchedArray[0];
            var value = {};
            value.reportId = data.reportData.userReportId || 0;
            value.index = valInData.index || 0;
            value.order = valInData.order || 0;
            value.title = (format.testName || '')
              .trim()
              .replace(Global.regexMultiSpace, ' ');
            value.val = (valInData.value || '')
              .trim()
              .replace(Global.regexMultiSpace, ' ');
            value.unit = (format.testUnit || '')
              .trim()
              .replace(Global.regexMultiSpace, ' ');
            value.filePath = '';
            value.dictionaryDesc = '';
            value.dictionaryId = 0;
            value.isHeader = false;
            value.isValueVisible = true;
            value.isUnitVisible = false;
            // value.isDescVisible = false - removed redundant assignment
            value.isRefRangePresentInDesc = false;
            value.isIndicatorVisible = false;
            value.isHighlight = false;
            value.isHighlightName = false;
            value.isGraph = false;
            value.isImage = false;
            value.isFile = false;
            value.isPDF = false;
            value.isDictionaryDisabled = true;
            value.downloadFileInProgress = false;
            value.indicatorColour = Color.clearColor;
            value.isCollectionOnly = false;
            value.isFileInput = false;

            // conditions
            if (
              ((format.styleFlag || 0) === 1 &&
                ['#', '##'].includes(value.unit)) ||
              valInData.index !== format.index
            ) {
              return;
            } else if (
              (format.styleFlag || 0) === 1 &&
              ['*', '**', '***'].includes(value.unit)
            ) {
              value.isHeader = true;
            } else if ((format.fileInput || 0) === 1) {
              if (value.val.length > 4) {
                value.filePath =
                  strings.Image_TestOrPDFPath +
                  data.reportData.userReportId +
                  '_' +
                  valInData.index;
                value.isFile = true;
                value.originalFilesPath = value.val;
                if (value.val.toLowerCase().includes('.pdf')) {
                  value.filePath += '.pdf';
                  value.isPDF = true;
                } else {
                  value.filePath += '.jpg';
                  value.isImage = true;
                }
                this.getImages(value);
              } else {
                return;
              }
            } else if ((format.isGraph || 0) === 1) {
              if (value.val.trim().length > 5) {
                value.filePath = value.val;
                value.isGraph = true;
              } else {
                return;
              }
            } else if (
              (format.descriptionFlag || 0) === 1 ||
              (value.unit === '-' && value.val.length > 15)
            ) {
              value.desc = value.val;
              value.val = '';
              value.isDesc = true;
            } else {
              value.isRefRangePresentInDesc = true;
              value.isIndicatorVisible = true;

              var valString = '';

              if ((data.reportData.sex || '').toLowerCase() === 'male') {
                if (
                  format.lowerBoundMale === '-' ||
                  format.lowerBoundMale === '' ||
                  format.upperBoundMale === '-' ||
                  format.upperBoundMale === '' ||
                  format.otherFlag === 1
                ) {
                  if (format.otherMale !== '-' || format.otherMale !== '') {
                    valString = 'Reference Range : ' + format.otherMale;
                  } else {
                    valString = '';
                    value.isDescVisible = false;
                    value.isRefRangePresentInDesc = false;
                  }
                } else {
                  valString =
                    'Reference Range : ' +
                    format.lowerBoundMale +
                    ' - ' +
                    format.upperBoundMale;
                }

                let indicator = DictionaryManager.IndicatorCalculator(
                  value.val,
                  format.upperBoundMale,
                  format.lowerBoundMale,
                );
                value.indicatorColour = indicator.color;
                value.isIndicatorVisible = indicator.visibility;
              } else {
                // Check for Female
                if (
                  format.lowerBoundFemale === '-' ||
                  format.lowerBoundFemale === '' ||
                  format.upperBoundFemale === '-' ||
                  format.upperBoundFemale === '' ||
                  format.otherFlag === 1
                ) {
                  if (format.otherFemale !== '-' || format.otherFemale !== '') {
                    valString = 'Reference Range : ' + format.otherFemale;
                  } else {
                    valString = '';
                    value.isDescVisible = false;
                    value.isRefRangePresentInDesc = false;
                  }
                } else {
                  valString =
                    'Reference Range : ' +
                    format.lowerBoundFemale +
                    ' - ' +
                    format.upperBoundFemale;
                }

                let indicator = DictionaryManager.IndicatorCalculator(
                  value.val,
                  format.upperBoundFemale,
                  format.lowerBoundFemale,
                );
                value.indicatorColour = indicator.color;
                value.isIndicatorVisible = indicator.visibility;
              }

              if (value.isRefRangePresentInDesc) {
                //KEEP TestRef hidden if male / female / other does not have values
                value.desc = valString.replace(Global.regexMultiSpace, ' ');
              }

              if (value.unit !== '-' && value.unit !== '') {
                value.isUnitVisible = true;
              } else {
                if (value.val === '-') {
                  value.isValueVisible = false;
                }
              }

              if (valInData.highlight === 1) {
                value.isHighlight = true;
              }

              if (format.highlightFlag === 1) {
                value.isHighlightName = true;
              }

              if (format.dictionaryId !== null) {
                value.dictionaryDesc = format.dictionaryId.description || '';
                value.dictionaryId = format.dictionaryId.id || 0;
                if (
                  format.dictionaryId.isDisabled === 0 &&
                  value.dictionaryId > 0 &&
                  data.reportData &&
                  data.reportData.isReferral === 0 &&
                  data.isTrackStop === 0
                ) {
                  value.isDictionaryDisabled = true;
                }
              }
            }
            var newDesc = value.desc || '';
            newDesc = newDesc
              .replace('Reference Range :', '')
              .replace('-', '')
              .trim();
            value.isDescVisible = newDesc.length > 0 ? true : false;
            valuesToRepresent.push(value);
            newDS.reportSection = valuesToRepresent;

            if (
              value.indicatorColour === Color.greenBright &&
              reportLevel < 1
            ) {
              reportLevel = 1;
              reportLevelIndicatorColor = Color.greenBright;
            } else if (
              value.indicatorColour === Color.yellow &&
              reportLevel < 2
            ) {
              reportLevel = 2;
              reportLevelIndicatorColor = Color.yellow;
            } else if (
              value.indicatorColour === Color.redExit &&
              reportLevel < 3
            ) {
              reportLevel = 3;
              reportLevelIndicatorColor = Color.redExit;
            }

            this.setState({
              isLoading: false,
              reportData: newDS,
              dataSource: ds.cloneWithRowsAndSections(newDS),
              reportLevel: reportLevel,
              reportLevelIndicatorColor: reportLevelIndicatorColor,
              isReportLoaded: true,
              isDownloadActionVisible: true,
            });
          }
          // valuesToRepresent.sort((a, b) => a.order - b.order)

          // this.setState({ reportData: newDS })
          // this.setState({ dataSource: ds.cloneWithRowsAndSections(newDS) })
        });
      } else {
        var value = {};
        value.reportId = data.reportData.userReportId || 0;
        value.index = 0;
        value.order = 0;
        value.title = '';
        value.val = '';
        value.unit = '';
        value.filePath = '';
        value.dictionaryDesc = '';
        value.dictionaryId = 0;
        value.isHeader = false;
        value.isValueVisible = true;
        value.isUnitVisible = false;
        // value.isDescVisible = false - removed redundant assignment
        value.isRefRangePresentInDesc = false;
        value.isIndicatorVisible = false;
        value.isHighlight = false;
        value.isHighlightName = false;
        value.isGraph = false;
        value.isImage = false;
        value.isFile = false;
        value.isPDF = false;
        value.isDictionaryDisabled = true;
        value.downloadFileInProgress = false;
        value.indicatorColour = Color.clearColor;

        value.isCollectionOnly = !isNotCollectionOnly;

        var isDownloadActionVisible = false;
        if (value.isCollectionOnly) {
          value.isFileInput = false;
        } else {
          value.isFileInput = isFileInput;
          if (isFileInput) {
            isDownloadActionVisible = false;
          } else {
            isDownloadActionVisible = true;
          }
        }

        valuesToRepresent.push(value);
        newDS.reportSection = valuesToRepresent;
        this.setState({
          isLoading: false,
          reportData: newDS,
          dataSource: ds.cloneWithRowsAndSections(newDS),
          reportLevel: reportLevel,
          reportLevelIndicatorColor: reportLevelIndicatorColor,
          isReportLoaded: true,
          isDownloadActionVisible: isDownloadActionVisible,
        });
      }
      // this.setList(allReportSorted)
    } catch (error) {
      this.setState({
        dataSource: ds.cloneWithRowsAndSections([]),
        isLoading: false,
      });
      CommonManager.handleError(error);
    }
  }

  downloadFileType() {
    try {
      this.setState({isLoading: true});
      let urlForReportPDFDownload =
        URLs.fileDownloadPath + this.state.report.valueData[0].value;

      if (false) {
        return downloadFile(
          urlForReportPDFDownload,
          strings.labReportPDFPath + reportId + '.pdf',
        )
          .then(result => {
            Linking.openURL(result.response.path);
            this.setState({isLoading: false});
          })
          .catch(error => {
            this.setState({isLoading: false});
            console.error(error);
          });
      } else {
        Linking.openURL(urlForReportPDFDownload);
        setTimeout(() => {
          this.setState({isLoading: false});
        }, 200);
      }
    } catch (error) {
      this.setState({isLoading: false});
      console.error(error);
    }
  }

  // ***** Render Functions *********
  _renderRow(val, sec, row) {
    //console.log('datatata', val)
    // var reportDate = moment(val.reportDate, Global.LTHDateFormatMoment).utc().local().startOf('day').format(Global.dateFormatDisplay)
    // var sampleDate = moment(val.detailValue, Global.LTHDateFormatMoment).utc().local().startOf('day').format(Global.dateFormatDisplay)
    var _renderValTitle = function(
      title,
      style = {},
      weightTitle = '400',
      color = 'black',
      fontSize = 16,
    ) {
      let newTitle = function(text) {
        var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
        var translate = {
          nbsp: ' ',
          amp: '&',
          quot: "'",
          lt: '<',
          gt: '>',
        };
        let newString = text.replace(translate_re, function(match, entity) {
          return translate[entity];
        });
        return newString;
      };
      return (
        <HTMLView
          value={'<p>' + newTitle(title) + '</p>'}
          style={[style]}
          stylesheet={StyleSheet.create({
            p: {
              fontWeight: weightTitle,
              color: color,
              fontSize: fontSize,
              fontFamily: 'Arial',
            },
          })}
        />
      );
    };

    switch (sec) {
      case 'reportSection':
        // ***** FILE INPUT REPORT CELL **********
        if (val.isCollectionOnly || val.isFileInput) {
          var msg =
            'This is file based report. Please click below to download.';
          if (val.isCollectionOnly) {
            msg =
              'This report is not viewable in app. Please visit the centre to get a hard copy of the reports. Apologies for the inconvenience.';
          }
          return (
            <View key={row + sec} style={styles.containerMainRow}>
              {_renderValTitle(msg)}
              {!val.isCollectionOnly && (
                <Ripple
                  activeOpacity={0.4}
                  onPress={this.downloadFileType}
                  style={{flexDirection: 'row', marginBottom: 0}}>
                  <Text
                    style={{
                      fontFamily: 'Arial',
                      flex: 1,
                      marginTop: 16,
                      marginBottom: 8,
                      textAlign: 'center',
                      fontWeight: '700',
                      color: '#1988F3',
                    }}>
                    Download Report
                  </Text>
                </Ripple>
              )}
              <Separator style={StyleSheet.flatten(styles.viewSeparator)} />
            </View>
          );
        }
        if (val.isHeader) {
          return <ListHeader headerText={val.title} />;
        }
        if (val.isImage || val.isPDF || val.isGraph) {
          console.log(val.filePath);
          return (
            <View style={styles.containerMainRow}>
              {_renderValTitle(val.title)}
              {val.isImage ? (
                <Image
                  source={{uri: 'file://' + val.filePath}}
                  style={styles.imageReport}
                />
              ) : val.isPDF ? (
                // ***** PDF CELL **********
                Global.iOSPlatform ? (
                  <WebView
                    source={{uri: 'file://' + val.filePath}}
                    style={styles.imageReport}
                  />
                ) : (
                  <TouchableOpacity
                    activeOpacity={1.0}
                    onPress={this._downloadPDF}
                    style={{flexDirection: 'row', marginBottom: 0}}>
                    <Text
                      style={{
                        fontFamily: 'Arial',
                        flex: 1,
                        marginTop: 16,
                        marginBottom: 8,
                        textAlign: 'center',
                        fontWeight: '700',
                        color: '#1988F3',
                      }}>
                      Download PDF
                    </Text>
                  </TouchableOpacity>
                )
              ) : val.isGraph ? (
                // ***** GRAPH CELL **********
                this.renderGraph(val)
              ) : (
                <Text style={styles.textGraphDataUnavailable}>
                  Data not available.
                </Text>
              )}
              <Separator style={StyleSheet.flatten(styles.viewSeparator)} />
            </View>
          );
        }

        // ***** NORMAL CELL **********
        var weightTitle = val.isHighlightName ? '700' : '400';
        var weightValAndUnit = val.isHighlight ? '700' : '400';

        //this.renderGraph(val)
        return (
          // <TouchableOpacity
          //   activeOpacity={1}
          //   key={row + sec}
          //   style={styles.containerMainRow}
          // >
          <View key={row + sec} style={styles.containerMainRow}>
            <View
              style={{
                flexDirection: 'row',
                paddingBottom: val.isDescVisible ? 10 : 0,
                alignItems: 'flex-start',
              }}>
              {_renderValTitle(
                val.title,
                {flexGrow: 3, flexShrink: 0.5},
                weightTitle,
              )}
              {val.isValueVisible &&
                _renderValTitle( replaceHTMLTags( val.val), {paddingRight: 4}, weightValAndUnit)}
              {val.isUnitVisible &&
                _renderValTitle(val.unit, {paddingRight: 4}, '400')}
              <View
                style={[
                  styles.viewIndicator,
                  {backgroundColor: val.indicatorColour},
                ]}></View>
            </View>
            {val.isDescVisible &&
              _renderValTitle(
                val.desc,
                {marginTop: -3},
                '400',
                Color._61GrayIcon,
                12,
              )}
            {val.dictionaryId == this.state.manualDictId ? (
              <Ripple
                onPress={() => {
                  this.gotoTrackers(val);
                }}
                style={{
                  alignItems: 'center',
                  padding: 6,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                <MaterialIcons
                  name={'info'}
                  size={24}
                  backgroundColor={'transparent'}
                  style={{padding: 0, paddingLeft: 0, paddingRight: 5}}
                  color={Color.appointmentBlue}
                  onPress={() => {}}
                  underlayColor="transparent"
                />
                <Text style={{fontWeight: 'bold', color: Color.theme_blue}}>
                  Know more>
                </Text>
              </Ripple>
            ) : null}
            <Separator style={StyleSheet.flatten(styles.viewSeparator)} />
          </View>
          // </TouchableOpacity>
        );
      case 'lastSection':
        return (
          <View
            style={{
              padding: 20,
              paddingTop: 0,
              paddingBottom: 50,
              backgroundColor: Color._EEGrayTableHeader,
            }}
            key={row + sec}>
            <Text style={{fontFamily: 'Arial'}}>
              This report has been authorized
              {this.state.report.reportData.reportMetaId ? (
                <Text style={{fontFamily: 'Arial'}}>
                  {' '}
                  by Dr.{' '}
                  <Text
                    style={{
                      fontFamily: 'Arial',
                      textDecorationLine: 'underline',
                    }}>
                    {(
                      (this.state.report.reportData.reportMetaId || {})
                        .signingDoctor.docFullName || ''
                    ).trim()}
                  </Text>
                </Text>
              ) : null}{' '}
              from{' '}
              {(this.state.report.reportData.labForId.labName || '').trim()}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Ripple
                onPress={() => {
                  setTimeout(() => {
                    Intercom.displayMessageComposer();
                  }, 500);
                }}
                style={{marginTop: 10}}>
                <MaterialIcons.Button
                  name={'flag'}
                  size={18}
                  backgroundColor={'transparent'}
                  style={{paddingLeft: 0, marginTop: 10, marginBottom: 10}}
                  color={Color._9F}
                  onPress={() => {}}
                  underlayColor="#e9e9e9">
                  <Text style={[CommonStyles.textSecAction, {fontSize: 12}]}>
                    {'Report an issue'}
                  </Text>
                </MaterialIcons.Button>
              </Ripple>
              <View style={{flex: 1}}></View>
            </View>
          </View>
        );
      default:
        return <View />;
    }
  }

  _renderSection(secData, cat) {
    return cat === 'lastSection' ? (
      <View style={{backgroundColor: Color._EEGrayTableHeader, height: 16}} />
    ) : cat === 'headerSection' ? (
      <ImageScrollView
        images={this.state.attachments}
        onImageSelect={selectedImage =>
          this.setState({selectedImage: selectedImage})
        }
      />
    ) : (
      <View></View>
    );
  }

  _renderReportHeader() {
    if (this.state.report.reportData) {
      var reportDate = moment(
        this.state.report.reportData.reportDate,
        Global.LTHDateFormatMoment,
      )
        .utc()
        .local()
        .startOf('day')
        .format(Global.dateFormatDisplay);
      let name = (this.state.userName || '').trim();

      return (
        <View
          style={[
            {paddingBottom: 7, backgroundColor: 'white'},
            CommonStyles.commonShadow,
            {borderWidth: Global.iOSPlatform ? 1 : 0.5},
          ]}>
          {this.state.isVisible ? <View style={{height: 5}}></View> : null}
          {this._renderCloseBar()}
          <View
            style={{
              flex: 0,
              backgroundColor: 'white',
              paddingRight: 17,
              paddingLeft: 17,
              paddingTop: 10,
              paddingBottom: 12,
            }}>
            <Text style={{fontFamily: 'Arial'}}>
              {(this.state.report.reportData.labForId.labName || '').trim()}
            </Text>
            <HeaderListExtraLarge
              header={(this.state.report.reportData.reportName || '').trim()}
              description={reportDate}
              style={{
                alignItems: 'flex-start',
                paddingRight: 0,
                paddingLeft: 0,
                paddingTop: 7,
                paddingBottom: 7,
              }}
              headerStyle={[
                CommonStyles.textHeaderMainReportView,
                {width: Global.screenWidth * 0.89},
              ]}
              descriptionStyle={StyleSheet.flatten(CommonStyles.commonShadow)}
            />
            {name.length > 2 && (
              <Text style={{fontFamily: 'Arial', fontWeight: '700'}}>
                Report of {name}
              </Text>
            )}
            {this.state.reportLevel > 0 && this._renderReportLevel()}
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  _renderReportFooter() {
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
          paddingTop: 0,
          paddingBottom: 50,
          backgroundColor: Color._EEGrayTableHeader,
        }}>
        <Text style={{fontFamily: 'Arial'}}>
          This report has been authorized
          {this.state.report ? (
            this.state.report.reportData.reportMetaId ? (
              <Text style={{fontFamily: 'Arial'}}>
                {' '}
                by Dr.{' '}
                <Text
                  style={{
                    fontFamily: 'Arial',
                    textDecorationLine: 'underline',
                  }}>
                  {(
                    ((this.state.report || {}).reportData.reportMetaId || {})
                      .signingDoctor.docFullName || ''
                  ).trim()}
                </Text>{' '}
              </Text>
            ) : null
          ) : null}
          from{' '}
          {(this.state.report || {}.reportData.labForId.labName || '').trim()}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Ripple
            onPress={() => {
              setTimeout(() => {
                Intercom.displayMessageComposer();
              }, 500);
            }}>
            <MaterialIcons.Button
              name={'flag'}
              size={18}
              backgroundColor={'transparent'}
              style={{paddingLeft: 0, marginTop: 20}}
              color={Color._9F}
              onPress={() => {}}
              underlayColor="#e9e9e9">
              <Text style={[CommonStyles.textSecAction, {fontSize: 12}]}>
                {'Report an issue'}
              </Text>
            </MaterialIcons.Button>
          </Ripple>
          <View style={{flex: 1}}></View>
        </View>
      </View>
    );
  }

  _renderReportLevel() {
    var iconName = 'check-circle';
    var message =
      'Your report looks normal. Please consult a your physician if this was prescribed to you.';
    if (this.state.reportLevel === 2) {
      iconName = 'lightbulb-outline';
      message =
        'Your report looks normal. However, We advise you to check your reports with your primary doctor.';
    } else if (this.state.reportLevel === 3) {
      iconName = 'error-outline';
      message =
        'Few parameters seem out of range. We advise you to correlate clinically with your doctor.';
    }
    return (
      <View
        style={[{flexDirection: 'row', alignItems: 'center', marginTop: 15}]}>
        <MaterialIcons
          name={iconName}
          size={28}
          backgroundColor={'transparent'}
          style={{padding: 3, paddingLeft: 0, paddingRight: 10}}
          color={this.state.reportLevelIndicatorColor}
          onPress={() => {}}
          underlayColor="transparent"
        />
        <Text
          style={{
            fontFamily: 'Arial',
            fontSize: 13,
            fontFamily: 'Arial',
            width: Global.screenWidth - 75,
          }}>
          {message}
        </Text>
      </View>
    );
  }

  _renderModal() {
    const params = this.props;
    var currentUserId = this.state.report.reportData.userReportId || 0;
    var userName = (this.state.report.reportData.fullName || '').trim();
    if (userName.length < 2) {
      userName = params.userName || '';
    }
    if (Array.isArray(params.reportSectionObject)) {
      var reportSectionObject = params.reportSectionObject;
      return (
        <ModalWithTitleAndFab
          visible={this.state.isRelatedReportDialogVisible}
          title={userName}
          description={'Other related reports from same visit'}
          onRequestClose={() => {
            this.setState({isRelatedReportDialogVisible: false});
          }}
          fabBottomHeight={16}
          isFlexibleModalContentHeight={true}>
          {reportSectionObject.map((element, index) => {
            let isNotCurrentReport = element.userReportId !== currentUserId;
            return (
              <TouchableOpacity
                key={index}
                style={{flex: 1}}
                onPress={() => {
                  if (isNotCurrentReport) {
                    this.setState({isRelatedReportDialogVisible: false});
                    setTimeout(
                      (() => {
                        this.getData(element.userReportId);
                      }).bind(this),
                      200,
                    );
                  } else {
                    this.setState({isRelatedReportDialogVisible: false});
                  }
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    margin: 15,
                    marginLeft: 0,
                    marginRight: 0,
                  }}>
                  <Text style={{flex: 1}} numberOfLines={3}>
                    {element.reportName.trim()}
                  </Text>
                  <MaterialIcons
                    name={'done'}
                    size={24}
                    color={isNotCurrentReport ? 'white' : Color.greenDark}
                    style={{
                      flex: 0,
                      alignSelf: 'flex-start',
                      width: 24,
                      height: 24,
                      paddingBottom: -2,
                    }}
                  />
                </View>
                <Separator />
              </TouchableOpacity>
            );
          })}
        </ModalWithTitleAndFab>
      );
    }
  }

  _renderAnimatedCloseBar() {
    var actionArray = [];
    if (this.state.isDownloadActionVisible) {
      actionArray.push({
        name: 'file-download',
        size: 28,
        onPress: () => {
          this._downloadPDF();
        },
      });
    }
    if (this.state.isDownloadActionVisible) {
      return (
        <CloseBarAnimated
          goBack={() => this.props.closeModal()}
          actionArray={actionArray}
          title={((this.state.report || {}).reportData || {}).reportName || ''}
          animatedMaxHeight={this.state.animatedScrollOffsetY}
          style={{backgroundColor: 'white', top: Global.isIphoneX ? 20 : 0}}
        />
      );
    } else {
      return (
        <CloseBarAnimated
          goBack={() => this.props.closeModal()}
          title={((this.state.report || {}).reportData || {}).reportName || ''}
          animatedMaxHeight={this.state.animatedScrollOffsetY}
          style={{backgroundColor: 'white'}}
        />
      );
    }
  }

  _renderCloseBar() {
    var actionArray = [];
    if (this.state.isDownloadActionVisible) {
      actionArray.push({
        name: 'file-download',
        size: 28,
        onPress: () => {
          this._downloadPDF();
        },
      });
    }
    if (this.state.isDownloadActionVisible) {
      return (
        <CloseBar
          goBack={() => this.props.closeModal()}
          actionArray={actionArray}
          style={{backgroundColor: 'white'}}
        />
      );
    } else {
      return (
        <CloseBar
          goBack={() => this.props.closeModal()}
          style={{backgroundColor: 'white'}}
        />
      );
    }
  }

  onScroll(event) {}

  render() {
    const {selectedImage} = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          height: this.state.scrollContentHeight,
        }}>
        {/*<Pdf />*/}
        {selectedImage && (
          <Modal onRequestClose={() => this.setState({selectedImage: null})}>
            <ZoomImageView
              onClose={() => this.setState({selectedImage: null})}
              image={selectedImage}
            />
          </Modal>
        )}
        {this.state.isReportLoaded && (
          <ListView
            bounces={false}
            ref="scrollView"
            enableEmptySections
            dataSource={this.state.dataSource}
            style={{backgroundColor: Color._EEGrayTableHeader}}
            renderRow={this._renderRow}
            renderSectionHeader={(sectionData, category) => {
              return this._renderSection(sectionData, category);
            }}
            renderHeader={this._renderReportHeader}
            onScroll={this.onScroll}
          />
        )}

        {this.state.isReportLoaded &&
          this.props.reportSectionObject.length > 1 && (
            <Fab
              rippleStyle={{bottom: Global.isIphoneX ? 32 : 16}}
              iconName="format-line-spacing"
              onPress={() => {
                this.setState({isRelatedReportDialogVisible: true});
              }}
            />
          )}
        {this.state.isRelatedReportDialogVisible && this._renderModal()}
        {this._renderAnimatedCloseBar()}
        {this.state.isLoading && <ProgressBar />}
      </View>
    );
  }
}
