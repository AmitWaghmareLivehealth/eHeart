import React, {Component} from 'react';
import {Text, ScrollView, Image, TouchableOpacity, Linking} from 'react-native';
import Global from '../../../utils/const/globals';
import {View} from 'native-base';

export default class ImageScrollView extends Component {
  render() {
    const {images, onImageSelect} = this.props;

    return (
      <ScrollView horizontal={true} style={{flex: 1, marginVertical: 20}}>
        {images.map(image => {
          if (!image || !image.url) {
            return (
              <View>
                <Text>Invalid URL</Text>
              </View>
            );
          }
          const isPDF = image.url.split('.').pop() === 'pdf';
          return (
            <TouchableOpacity
              onPress={() => {
                if (!isPDF) {
                  onImageSelect(image);
                  return
                }
                Linking.openURL(image.url).catch(err =>
                  console.error('An error occurred', err),
                );
              }}>
              <Image
                source={
                  isPDF
                    ? require('../../../assets/common/pdf.png')
                    : {uri: image.url}
                }
                style={{
                  height: 200,
                  width: Global.screenWidth - 120,
                  marginLeft: 10,
                  flex: 1,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }
}
