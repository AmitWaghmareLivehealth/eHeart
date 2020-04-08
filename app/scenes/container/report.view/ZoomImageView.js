import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  PanResponder,
  ViewPropTypes,
  Image,
  Text,
  Linking,
  Dimensions,
} from 'react-native';
import Global from '../../../utils/const/globals';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Card, CardItem, Body, Right} from 'native-base';
import ImageZoom from 'react-native-image-pan-zoom';

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
    maxScale: 3,
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

  onDownload = (image) => {
    Linking.openURL(image.url).catch((err) =>
      console.error('An error occurred', err),
    );
  };
  render() {
    const {image} = this.props;
    console.log(image);
    return (
      <>
        <Card>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MaterialIcons.Button
              name={'close'}
              size={30}
              color="black"
              onPress={this.props.onClose}
              underlayColor="transparent"
              backgroundColor="transparent"
            />
            <Text>{image.name}</Text>
            <Right>
              <MaterialIcons.Button
                name={'file-download'}
                size={30}
                color="black"
                onPress={() => {
                  this.onDownload(image);
                }}
                underlayColor="transparent"
                backgroundColor="transparent"
              />
            </Right>
          </View>
        </Card>
        <ImageZoom
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height}
          imageWidth={200}
          imageHeight={200}>
          <Image
            style={{width: 200, height: 200}}
            source={{
              uri: image.url,
            }}
          />
        </ImageZoom>
      </>
    );
  }
}
 
