import React, { Component } from 'react'
import { 
  View,
  Text,
  TouchableOpacity,
  Image,
  NativeModules
} from 'react-native'
import PropTypes from 'prop-types'


import Camera from 'react-native-camera'
import _ from 'lodash'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Global } from '../../../utils'

const GalleryManager = Global.iOSPlatform ? NativeModules.CKGalleryManager : NativeModules.NativeGalleryModule

const FLASH_MODE_AUTO = Camera.constants.FlashMode.auto
const FLASH_MODE_ON = Camera.constants.FlashMode.on
const FLASH_MODE_OFF = Camera.constants.FlashMode.off

import { styles } from './styles'

export default class MediaCameraCapture extends Component {

  static propTypes = {
    allowCaptureRetake: PropTypes.bool,
    rightButtonAction: PropTypes.func,
    leftButtonAction: PropTypes.func,
    actions: PropTypes.shape({
      rightButtonText: PropTypes.string,
      leftButtonText: PropTypes.string
    })
  }

  static defaultProps = {
    allowCaptureRetake: false,
    rightButtonAction: () => {},
    leftButtonAction: () => {},
    actions: {
      rightButtonText: 'Done',
      leftButtonText: 'Cancel',
    }
  }

  constructor (props) {
    super(props);
    this.currentFlashArrayPosition = 0;
    this.flashArray = [{
      mode: FLASH_MODE_AUTO,
      image: 'flash-auto'
    }, {
      mode: FLASH_MODE_ON,
      image: 'flash-on'
    }, {
      mode: FLASH_MODE_OFF,
      image: 'flash-off'
    }]

    this.state = {
      captureImages: [],
      flashData: this.flashArray[this.currentFlashArrayPosition],
      ratios: [],
      cameraOptions: {},
      ratioArrayPosition: -1,
      imageCaptured: undefined,
      captured: false,
      cameraType: Camera.constants.Type.back
    }

    this.onSetFlash = this.onSetFlash.bind(this)
    this.onSwitchCameraPressed = this.onSwitchCameraPressed.bind(this)
  }

  componentDidMount () {
    const cameraOptions = this.getCameraOptions();
    let ratios = [];
    if (this.props.cameraRatioOverlay) {
      ratios = this.props.cameraRatioOverlay.ratios || [];
    }
    this.setState({
      cameraOptions,
      ratios: (ratios || []),
      ratioArrayPosition: ((ratios.length > 0) ? 0 : -1)
    });
  }

  isCaptureRetakeMode () {
    return this.props.allowCaptureRetake && !_.isUndefined(this.state.imageCaptured)
  }

  getCameraOptions () {
    const cameraOptions = {
      flashMode: 'auto',
      focusMode: 'on',
      zoomMode: 'on'
    };
    if (this.props.cameraRatioOverlay) {
      const overlay = this.props.cameraRatioOverlay;
      cameraOptions.ratioOverlayColor = overlay.color || OVERLAY_DEFAULT_COLOR;

      if (overlay.ratios && overlay.ratios.length > 0) {
        cameraOptions.ratioOverlay = overlay.ratios[0];
      }
    }

    return cameraOptions;
  }

  renderFlashButton () {
    return !this.isCaptureRetakeMode() &&
      <TouchableOpacity style={{ paddingHorizontal: 15 }} onPress={() => this.onSetFlash(FLASH_MODE_AUTO)}>
        <MaterialIcons
          name={this.state.flashData.image}
          size={30}
          backgroundColor={'#FFFFFFFF'}
          color={'white'}
          style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 15, paddingVertical: 4 }}
        />
      </TouchableOpacity>
  }

  renderSwitchCameraButton () {
    return !this.isCaptureRetakeMode() && //(this.props.cameraFlipImage && !this.isCaptureRetakeMode()) &&
      <TouchableOpacity style={{ paddingHorizontal: 15 }} onPress={this.onSwitchCameraPressed}>
        <Ionicons
          name={'ios-reverse-camera'}
          size={40}
          backgroundColor={'#FFFFFFFF'}
          color={'white'}
          style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 15 }}
       />
      </TouchableOpacity>
  }

  renderTopButtons () {
    return (
      <View style={styles.topButtons}>
        {this.renderFlashButton()}
        {this.renderSwitchCameraButton()}
      </View>
    );
  }

  renderCamera () {
    return (
      <View style={styles.cameraContainer}>
        {
          this.isCaptureRetakeMode() || this.state.captured ?
          <Image
            style={styles.preview}
            source={{uri: this.state.imageCaptured.path}}
          >
          {this.renderBottomButtons()}
          </Image> :
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            type={this.state.cameraType}
            flashMode={this.state.flashData.mode}
            cameraOptions={this.state.cameraOptions}>
            {this.renderTopButtons()}
            <View style={styles.emptyCameraWindowContainer}/>
            {this.renderBottomButtons()}
          </Camera>
        }
      </View>
    );
  }

  numberOfImagesTaken () {
    const numberTook = this.state.captureImages.length;
    if (numberTook >= 2) {
      return numberTook;
    } else if (this.state.captured) {
      return '1';
    } else {
      return '';
    }
  }

  renderCaptureButton () {
    return !this.isCaptureRetakeMode() &&
      <View style={styles.captureButtonContainer}>
        <TouchableOpacity
          onPress={() => this.onCaptureImagePressed()}
        >
            <Ionicons
                name={'ios-radio-button-on'}
                size={60}
                backgroundColor={'transparent'}
                color={'white'}
                style={styles.captureButton}
            />
            <Text style={styles.captureNumber}>
              {this.numberOfImagesTaken()}
            </Text>
        </TouchableOpacity>
      </View >
  }

  renderRatioStrip () {
    if (this.state.ratios.length === 0) {
      return null;
    }
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', backgroundColor: 'yellow' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10, paddingLeft: 20 }}>
          <Text style={styles.ratioBestText}>Your images look best at a {this.state.ratios[0] || ''} ratio</Text>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 8 }}
            onPress={() => this.onRatioButtonPressed()}
          >
            <Text style={styles.ratioText}>{this.state.cameraOptions.ratioOverlay}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  sendBottomButtonPressedAction (type, captureRetakeMode, image) {
    if (this.props.onBottomButtonPressed) {
      this.props.onBottomButtonPressed({ type, captureImages: this.state.captureImages, captureRetakeMode, image })
    }
  }

  async onButtonPressed (type) {
    if (type === 'left') {
      const result = await GalleryManager.deleteTempImage(this.state.imageCaptured.path)
      this.props.leftButtonAction()
      this.setState({imageCaptured: undefined, captured: false})
    } else if (type === 'right') {
      const result = await GalleryManager.saveImageURLToCameraRoll(this.state.imageCaptured.path)
      const savedImage = {...this.state.imageCaptured, id: result.id}
      this.props.rightButtonAction(this.state.imageCaptured)
      this.setState({imageCaptured: undefined, captured: false, captureImages: _.concat(this.state.captureImages, savedImage)})
    }
  }

  renderBottomButton (type) {
    let showButton = true;
    if (type === 'right') {
      showButton = this.state.captureImages.length > 0 || this.isCaptureRetakeMode();
    }
    if (showButton) {
      const buttonNameSuffix = this.isCaptureRetakeMode() ? 'CaptureRetakeButtonText' : 'ButtonText';
      const buttonText = _(this.props).get(`actions.${type}${buttonNameSuffix}`)
      return (
        <TouchableOpacity
          style={[styles.bottomButton, { justifyContent: type === 'left' ? 'flex-start' : 'flex-end' }]}
          onPress={() => this.onButtonPressed(type)}
        >
          <Text style={styles.textStyle}>{buttonText}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.bottomContainerGap} />
      );
    }
  }

  renderBottomButtons () {
    return (
      <View style={styles.bottomButtons}>
        {this.renderBottomButton('left')}
        {this.renderCaptureButton()}
        {this.renderBottomButton('right')}
      </View>
    )
  }

  onSwitchCameraPressed () {
    var newCamType = this.state.cameraType === Camera.constants.Type.back ? Camera.constants.Type.front : Camera.constants.Type.back
    this.setState({ cameraType: newCamType })
  }

  async onSetFlash () {
    this.currentFlashArrayPosition = (this.currentFlashArrayPosition + 1) % 3;
    const newFlashData = this.flashArray[this.currentFlashArrayPosition];
    this.setState({ flashData: newFlashData });
  }

  async onCaptureImagePressed () {
    const shouldSaveToCameraRoll = !this.props.allowCaptureRetake

    if (!shouldSaveToCameraRoll) {
      const options = {};
       //options.location = ...
      this.camera.capture({metadata: options})
      .then((image) => {
        this.setState({ captured: true, imageCaptured: image })
      })
      .catch(err => console.error(err));
    } else {
      const options = {};
       //options.location = ...
      this.camera.capture({metadata: options})
      .then((image) => {
        if (image) {
          this.setState({ captured: true, imageCaptured: image, captureImages: _.concat(this.state.captureImages, image) })
        }
        this.sendBottomButtonPressedAction('capture', false, image)
      })
      .catch(err => console.error(err));
    }
  }

  onRatioButtonPressed () {
    const newRatiosArrayPosition = ((this.state.ratioArrayPosition + 1) % this.state.ratios.length);
    const newCameraOptions = _.update(this.state.cameraOptions, 'ratioOverlay', (val) => this.state.ratios[newRatiosArrayPosition]);
    this.setState({ ratioArrayPosition: newRatiosArrayPosition, cameraOptions: newCameraOptions });
  }

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        {this.renderCamera()}
      </View>
    )
  }
}
