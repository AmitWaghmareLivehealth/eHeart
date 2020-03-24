import React, {Component} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';

export default class ListFooter extends Component {
  render() {
    return (
      <View>
        <ActivityIndicator color="black"   />
      </View>
    );
  }
}
