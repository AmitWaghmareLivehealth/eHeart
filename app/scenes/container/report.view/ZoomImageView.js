import React, {Component} from 'react';
import {View, Image, Animated, Text} from 'react-native';
import Global from '../../../utils/const/globals';
import PinchZoomView from 'react-native-pinch-zoom-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class ZoomImageView extends Component {
  pinZoomLayoutRef = React.createRef();
  render() {
    const {image} = this.props;
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
            name={ 'close'}
            size={30}
            color='black'
            style={{ padding: 5 }}
            onPress={this.props.onClose}
            underlayColor='transparent'
            backgroundColor='transparent'
          />
        </View>
        <PinchZoomView>
          <Image
            style={{
              width: Global.screenWidth - 20,
              height: Global.screenHeight / 2,
              marginTop: '40%',
              marginLeft: 10,
            }}
            source={{uri: image.url}}
          />
        </PinchZoomView>
      </View>
    );
  }
}
