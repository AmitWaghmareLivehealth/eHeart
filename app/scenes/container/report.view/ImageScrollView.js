import React, {Component} from 'react';
import {Text, ScrollView, Image, TouchableOpacity,Linking} from 'react-native';
import Global from '../../../utils/const/globals';
import {View} from 'native-base';

export default class ImageScrollView extends Component {
  render() {
    const {images, onImageSelect} = this.props;

    return (
      <ScrollView horizontal={true} style={{flex: 1}}>
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
                }
              }}>
              <Image
                source={
                  isPDF
                    ? require('../../../assets/common/pdf.png')
                    : {uri: image.url}
                }
                style={{
                  height: 200,
                  marginTop: 20,
                  width: Global.screenWidth - 120,
                  marginLeft: 10,
                  marginBottom:20,
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
