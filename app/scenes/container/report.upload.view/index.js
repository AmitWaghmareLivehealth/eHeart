import React, { Component } from 'react'
import { View, Text, ScrollView, Image, WebView, StyleSheet, Alert, Linking, TouchableWithoutFeedback, Modal } from 'react-native'

import Entypo from 'react-native-vector-icons/Entypo'
import ImagePicker from 'react-native-image-crop-picker'
import RNFetchBlob from 'react-native-fetch-blob'
import moment from 'moment'

import { TextField, Button, TextView, TagInput, TextInputHeader, CloseBar, ProgressBar, ListHeader } from '../../components'

import { Color, Global,URLs, stringsAlertReports, extFile, CommonManager, AlertManager, ReportManager, CommonStyles } from '../../../utils'

import { HeaderListExtraLarge } from '../../layouts'
import styles from './styles'

const dirs = RNFetchBlob.fs.dirs
export default class ReportUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      date: '',
      comments: '',
      tags: [],
      isPDF: false,
      isImageLoaded: null,
      imageToBeUploaded: undefined,
      imageToBeUploadedPath: '',
      isViewOnly: false,
      notReadyToUpload: true,
      isLoading: false,
      modalVisible: false,
      headerText: 'Report Preview',
      isPreview: false
    }

    this.checkUploadButton = this.checkUploadButton.bind(this)
    this.removeImage = this.removeImage.bind(this)
    this.downloadReportImage = this.downloadReportImage.bind(this)
    this.downloadIMAGE = this.downloadIMAGE.bind(this)
  }

  componentDidMount() {
    const params = this.props
    this.setState({ isViewOnly: (params.isViewOnly) })
    if (params.isViewOnly || false) {
      let tagList = (params.reportListObject.tags || '').split(/[.]*,[.]*/)
      tagList.forEach(function (element, index, arrayBeingProcessed) {
        let tag = element.trim()
        if (tag.length > 0) {
          element = tag
        } else {
          arrayBeingProcessed.pop(index)
        }
      })

      var regDate = moment((params.reportListObject.reportDateString || {}), Global.LTHDateFormatMoment + 'Z').format(Global.dateFormatDisplay) || ''

      this.setState({
        title: params.reportListObject.title,
        date: regDate,
        comments: params.reportListObject.comments,
        tags: tagList,
        isViewOnly: true,
        path: params.reportListObject.filePath,
      })


      this.downloadReportImage(params.reportListObject.filePath || '', params.reportListObject.id)


    }
  }

  setModalVisible(visible) {

    this.setState({ modalVisible: true })

  }


  async downloadReportImage(filePath, reportId) {
    this.setState({ isPreview: true })
    ReportManager.downloadReportImage(filePath, reportId)
      .then((result) => {
        this.setState({ isLoading: false })
        if (result.success) {
          RNFetchBlob.fs.exists(result.response.path)
            .then((exist) => {

              var str = result.response.path
              var substr = '.pdf'

              {
                (str.includes(substr)) ?

                this.setState({
                  isPDF: true,
                  isPreview: true,
                  isImageLoaded: false,
                  // imageToBeUploadedPath: 'file://' + result.response.path,
                  imageToBeUploadedPath: URLs.fileDownloadPath + filePath,
                  headerText: 'Pdf Download'
                })


                : this.setState({
                  isImageLoaded: true,
                  imageToBeUploadedPath: URLs.fileDownloadPath + filePath
                })
              }
              console.log(result.response.path)

            }).catch(error => {
              CommonManager.handleErrorWithMsg(error)
              console.log('This' + error)
            })
        }
      }).catch(error => {
        this.setState({ isLoading: false })
        CommonManager.handleErrorWithMsg(error, stringsAlertReports.unableToRetrive.header, stringsAlertReports.unableToRetrive.message)
      })
  }

  removeImage() {
    this.setState({
      isImageLoaded: false,
      imageToBeUploadedPath: 'new'
    })
  }

  setFinalImagePath(image) {
    RNFetchBlob.fs.exists(image.path || '')
      .then((exist) => {
        var ext = extFile.getFileExtFromMIME(image.mime || '')
        if (ext !== '.tmp') {
          RNFetchBlob.fs.readFile(image.path || '', 'base64')
            .then((imageDataBase64) => {
              console.log(image.path)
              this.setState({
                isPDF: (ext === '.pdf'),
                isImageLoaded: true,
                imageToBeUploaded: imageDataBase64,
                imageToBeUploadedPath: image.path
              })
              this.checkUploadButton()
            }).catch(CommonManager.handleError)
        } else {
          AlertManager.AlertGeneric(stringsAlertReports.unknownFileType.header, stringsAlertReports.unknownFileType.message)
        }
      }).catch((error) => CommonManager.handleErrorWithMsg(error, stringsAlertReports.unknownFileType.header, stringsAlertReports.unknownFileType.message))

  }

  getIcon(name, title, action) {
    return (
      <Entypo.Button
        name={name}
        size={40}
        backgroundColor={'#FFFFFFFF'}
        color={Color._75}
        style={styles.iconCamOrGallery}
        onPress={action}
        underlayColor='#F5F5F5'
      >{title}</Entypo.Button>
    )
  }

  getRemoveReportButton() {
    return (
      <Entypo.Button
        name={'cross'}
        size={30}
        backgroundColor={'#0005'}
        style={styles.iconRemoveImage}
        onPress={this.removeImage}
        underlayColor='#F5F5F5'
        iconStyle={{ backgroundColor: '#0005' }}
      />
    )
  }

  checkUploadButton() {
    let needsEnableing = (this.state.title.trim().length > 3 && this.state.imageToBeUploadedPath.length > 4)
    this.setState({ notReadyToUpload: !needsEnableing })
    return needsEnableing
  }

  downloadIMAGE() {

    Linking.openURL(URLs.fileDownloadPath + this.state.path)
      .catch(err => console.error('An error occurred', err))
  }
  _OnImagePreview() {
    this.setModalVisible(true);
  }

  goBack() {
    this.setState({ modalVisible: false })
  }


  render() {
    var actionArray = []
    actionArray.push({
      name: 'file-download',
      size: 28,
      color: 'black',
      onPress: () => this.downloadIMAGE()
    })

    // let comment = this.state.comments;
    // if(comment ==''){this.setState({comments:'Comments not added'})}

    return (
      <ScrollView bounces={false} style={styles.scrollViewMainContainer}>
        <CloseBar goBack={() => this.props.closeModal()} color={'black'} actionArray={actionArray} />
        {/* { this._renderCloseBar() } */}

        <HeaderListExtraLarge
          header={(this.state.title || '').trim()}
          description={'Report uploaded on ' + this.state.date}
          style={{ alignItems: 'flex-start', paddingTop: 0, paddingBottom: 18 }}
          headerStyle={[CommonStyles.textHeaderMainReportView, { width: Global.screenWidth * 0.89 }]}
          descriptionStyle={StyleSheet.flatten(CommonStyles.textDescriptionMainReportView)}
        />

        {/* <ListHeader
           headerText={'Report Preview'}/>
            */}
        {this.state.isPDF ? (<ListHeader
          headerText={'PDF Report'} />) :
          (null)}

        {this.state.isImageLoaded ? (<ListHeader
          headerText={'Report Preview'} />) :
          (null)}

        {

          this.state.isImageLoaded
            ? <View style={styles.containerCamOrGalleryColSuper}>

              <TouchableWithoutFeedback
                onPress={this._OnImagePreview.bind(this)}
                style={[styles.imageToUpload]}
              >
                <Image style={[styles.imageToUpload]}
                  source={{ uri: this.state.imageToBeUploadedPath }}>
                  {
                    !this.state.isViewOnly && this.getRemoveReportButton()
                  }
                </Image>

              </TouchableWithoutFeedback>


            </View>
            :

            this.state.isPDF
              ?

              <View>

                <TouchableWithoutFeedback
                  onPress={this.downloadIMAGE}>
                  <Text style={[CommonStyles.button_style,
                  {
                    textAlign: 'center',
                    paddingTop: 16,
                    paddingBottom: 16,
                    paddingRight: 4,
                    color: Color.theme_blue
                  }]}>DOWNLOAD PDF</Text>
                </TouchableWithoutFeedback>

              </View>

              :
              <View style={[styles.containerCamOrGalleryColSuper, { paddingBottom: 20 }]}>
                <Text style={{ fontFamily: 'Arial', textAlign: 'center' }}>{this.state.isPreview ? 'Loading Preview...' : 'Report preview unavailable'}</Text>
              </View>
        }
        <ListHeader headerText={'Comments'} />
        <TextView
          focusOnComponentMount={false}
          showSeparator={false}
          //  title={''}
          // onChangeText={comments => this.setState({ comments: comments })}
          placeholder={'Comments not added'}
          value={this.state.comments}
          numberOfLines={5}
          maxHeight={152}
          initialHeight={20}
          placeholderTextColor={'black'}
          editable={false}
          style={{ flex: 0, width: Global.screenWidth - 36, marginLeft: 18, marginRight: 18 }}
          headerStyle={{ height: 0 }}
        />

        {(this.state.tags.length > 0) && <TagInput
          focusOnComponentMount={false}
          value={this.state.tags}
          onChange={(tags) => {
            this.setState({
              tags: tags
            })
          }}
          tagColor={Color.themeColor}
          tagTextColor='white'
          numberOfLines={2}
          maxTagCount={10}
          title=''
          inputProps={{
            placeholder: 'Enter tags'
          }}
          readOnly={this.state.isViewOnly}
          style={{ marginLeft: 18, marginRight: 18 }}
        />}
        {this.state.isLoading && <ProgressBar />}
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setState({ modalVisible: false }) }}
        >
          <View style={styles.overlay}>

            <CloseBar goBack={this.goBack.bind(this)} color={'white'} />
            <Image style={[styles.imageDisplay]}
              source={{ uri: this.state.imageToBeUploadedPath }}>
            </Image>

          </View>
        </Modal>
      </ScrollView>
    )
  }

}
