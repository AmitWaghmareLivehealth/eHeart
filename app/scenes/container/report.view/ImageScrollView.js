import React, {Component} from 'react';
import {Text, ScrollView, Image, TouchableOpacity, Linking} from 'react-native';
import Global from '../../../utils/const/globals';
import {View} from 'native-base';
import ImageCard from './ImageCard';

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
               <ImageCard image={image} isPDF={isPDF}/>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }
}
