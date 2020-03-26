import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  PanResponder,
  ViewPropTypes,
  Image,
} from 'react-native';
import Global from '../../../utils/const/globals';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const viewPropTypes = ViewPropTypes || View.propTypes;

export default class PinchZoomView extends Component {
  static propTypes = {
    ...viewPropTypes,
    scalable: PropTypes.bool,
    minScale: PropTypes.number,
    maxScale: PropTypes.number,
  };

  static defaultProps = {
    scalable: true,
    minScale: 0.5,
    maxScale: 2,
  };

  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      lastScale: 1,
      offsetX: 0,
      offsetY: 0,
      lastX: 0,
      lastY: 0,
      lastMovePinch: false,
    };
    this.distant = 150;
  }

  componentWillMount() {
    this.gestureHandlers = PanResponder.create({
      onStartShouldSetPanResponder: false,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: evt => false,
      onShouldBlockNativeResponder: evt => false,
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    });
  }

  _handleStartShouldSetPanResponder = (e, gestureState) => {
    return false;
  };

  _handleMoveShouldSetPanResponder = (e, gestureState) => {
    return true;
  };

  _handlePanResponderGrant = (e, gestureState) => {
    if (gestureState.numberActiveTouches === 2) {
      let dx = Math.abs(
        e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX,
      );
      let dy = Math.abs(
        e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY,
      );
      let distant = Math.sqrt(dx * dx + dy * dy);
      this.distant = distant;
    }
  };

  _handlePanResponderEnd = (e, gestureState) => {
    this.setState({
      lastX: this.state.offsetX,
      lastY: this.state.offsetY,
      lastScale: this.state.scale,
    });
  };

  _handlePanResponderMove = (e, gestureState) => {
    // zoom
    if (gestureState.numberActiveTouches === 2) {
      let dx = Math.abs(
        e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX,
      );
      let dy = Math.abs(
        e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY,
      );
      let distant = Math.sqrt(dx * dx + dy * dy);
      let scale = (distant / this.distant) * this.state.lastScale;
      //check scale min to max hello
      if (scale < this.props.maxScale && scale > this.props.minScale) {
        this.setState({scale, lastMovePinch: true});
      }
    }
    // translate
    else if (gestureState.numberActiveTouches === 1) {
      if (this.state.lastMovePinch) {
        gestureState.dx = 0;
        gestureState.dy = 0;
      }
      let offsetX = this.state.lastX + gestureState.dx / this.state.scale;
      let offsetY = this.state.lastY + gestureState.dy / this.state.scale;
      // if ( offsetX < 0  || offsetY <  0 )
      this.setState({offsetX, offsetY, lastMovePinch: false});
    }
  };

  render() {
    const {image} = this.props;
    return (
      <>
        <MaterialIcons.Button
          name={'close'}
          size={30}
          color="black"
          onPress={this.props.onClose}
          underlayColor="transparent"
          backgroundColor="transparent"
        />
        <View
          {...this.gestureHandlers.panHandlers}
          style={[
            styles.container,
            this.props.style,
            {
              transform: [
                {scaleX: this.state.scale},
                {scaleY: this.state.scale},
                {translateX: this.state.offsetX},
                {translateY: this.state.offsetY},
              ],
            },
          ]}>
          <Image
            style={{
              width: Global.screenWidth - 20,
              height: Global.screenHeight / 2,
              marginTop: '40%',
              marginLeft: 10,
            }}
            source={{uri: image.url}}
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
