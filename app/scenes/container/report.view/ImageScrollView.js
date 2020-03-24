import React, {Component} from 'react';
import {Text, ScrollView,Image} from 'react-native';
import Global from '../../../utils/const/globals';

export default class ImageScrollView extends Component {
  render() {
    const {images} = this.props;
    return (
      <ScrollView horizontal={true} style={{flex: 1}}>
        {images.map(image => (
          <Image
            source={{uri: image.url}}
            style={{
              height: 200,
              marginTop: 20,
              width: Global.screenWidth - 120,
              marginLeft: 10,
              flex: 1,
            }}
          />
        ))}
      </ScrollView>
    );
  }
}
