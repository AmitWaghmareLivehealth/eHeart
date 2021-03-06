import React, {Component} from 'react';
import {View, Image, Text, Dimensions, Alert, StyleSheet} from 'react-native';
import {Card, Right, Spinner, CardItem, Icon} from 'native-base';
import ImageZoom from 'react-native-image-pan-zoom';
 
import {
  request_storage_runtime_permission,
  downloadImageFromURL,
} from './utils';
import Global from '../../../utils/const/globals';

export default class PinchZoomView extends Component {
  state = {downloading: false};
  onDownload = async (image) => {
    try {
      this.setState({downloading: true});
      await request_storage_runtime_permission();
      await downloadImageFromURL(image);
      this.setState({downloading: false});
    } catch (err) {
      this.setState({downloading: false});
    }
  };

  render() {
    const {image} = this.props;
    const {downloading} = this.state;

    return (
      <>
        <Card>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              maxHeight: 50,
              padding: 10,
            }}>
            <Icon name="close" onPress={this.props.onClose} />

            <Text style={{marginLeft: 10}}>{image.name}</Text>
            <Right>
              {downloading ? (
                <Spinner color="black" size="large" />
              ) : (
                <Icon
                  name="download"
                  onPress={() => {
                    this.onDownload(image);
                  }}
                />
              )}
            </Right>
          </View>
        </Card>
        <ImageZoom
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height}
          imageWidth={Global.screenWidth-20}
          imageHeight={400}>
          <Image
            style={styles.imgStyleGoogle}
            source={{
              uri: image.url,
            }}
          />
        </ImageZoom>
      </>
    );
  }
}

const styles = StyleSheet.create({
  imgStyleGoogle: {
    flex: 1,
     
    resizeMode: 'contain',
  },
});
