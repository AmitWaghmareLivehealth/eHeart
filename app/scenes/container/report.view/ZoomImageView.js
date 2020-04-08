import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Image, Text, Dimensions, Alert} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Card, Right} from 'native-base';
import ImageZoom from 'react-native-image-pan-zoom';
import {
  request_storage_runtime_permission,
  downloadImageFromURL,
} from './utils';

export default class PinchZoomView extends Component {
  onDownload = async (image) => {
    await request_storage_runtime_permission();
    downloadImageFromURL(image);
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
