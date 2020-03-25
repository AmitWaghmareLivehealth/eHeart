import React, {Component} from 'react';
import {View, Image, Animated, Text} from 'react-native';
import Global from '../../../utils/const/globals';
import PinchZoomView from 'react-native-pinch-zoom-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PinchZoomResponder from 'react-native-pinch-zoom-responder';
import MatrixMath from 'react-native/Libraries/Utilities/MatrixMath';
export default class ZoomImageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1,
      height: 1,
    };
    const options = {
      transformX: true,
      transformY: true,
    };
    this.pinchZoomResponder = new PinchZoomResponder(
      {
        onPinchZoomStart: e => {
          console.log('pinch started');
        },

        onPinchZoomEnd: e => {
          console.log('pinch ended');
        },

        onResponderMove: (e, gestureState) => {
          if (gestureState) {
            console.log('GestureState is ', gestureState);
            this.setState({scaleX: gestureState.scaleX});
            let transform = this._applyOriginTransform(gestureState.transform);
            this._setTransform(transform);
          }
        },
      },
      options,
    );
  }

  _onLayout(event) {
    this.setState({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  }

  _setTransform(matrix) {
    this.transformView.setNativeProps({
      style: {transform: [{perspective: 1000}, {matrix: matrix}]},
    });
  }

  _applyOriginTransform(matrix) {
    var translate = MatrixMath.createIdentityMatrix();
    var copy = matrix.slice();
    MatrixMath.reuseTranslate2dCommand(
      translate,
      this.state.width / 2.0,
      this.state.height / 2.0,
    );

    MatrixMath.multiplyInto(copy, matrix, translate);
    MatrixMath.reuseTranslate2dCommand(
      translate,
      -(this.state.width / 2.0),
      -(this.state.height / 2.0),
    );
    MatrixMath.multiplyInto(copy, translate, copy);
    return copy;
  }

  render() {
    const {image} = this.props;
    const {width, height} = this.state;
    console.log({width}, {height});
    return (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          width: Global.screenWidth,
          backgroundColor: 'white',
          height: Global.screenHeight,
        }}>
        <View>
          <MaterialIcons.Button
            name={'close'}
            size={30}
            color="black"
            style={{padding: 5}}
            onPress={this.props.onClose}
            underlayColor="transparent"
            backgroundColor="transparent"
          />
        </View>
        <View
          
          style={{backgroundColor:'red'}}
          >
          <Image
           {...this.pinchZoomResponder.handlers}
           onLayout={e => this._onLayout(e)}
            ref={ref => {
              this.transformView = ref;
            }}
            style={{
              width: 300,
              height: 300,
              marginTop: '40%',
              marginLeft: 10,
            }}
            source={{uri: image.url}}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }
}
