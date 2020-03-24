import React, {Component} from 'react';
import {Text, View} from 'react-native';

export default class RoundBatch extends Component {
  render() {
    const {backgroundColor,txt} = this.props;
    return (
      <View
        style={{
          borderRadius: 60,
          marginRight: 12,
          backgroundColor: backgroundColor,
          height: 24,
          width: 24,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 4,
          paddingBottom: 4,
          marginLeft: 12,
          marginTop: 12,
        }}>
        <Text style={{color: 'white', fontSize: 11, textAlign: 'center'}}>
          {txt}
        </Text>
      </View>
    );
  }
}
