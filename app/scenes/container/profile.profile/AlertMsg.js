import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Global from '../../../utils/const/globals';

export default class AlertMsg extends Component {
  state = {showMsg: true};
  componentDidMount() {
    setTimeout(() => this.props.onEnd(), 1000);
  }
  render() {
    const {msg, alertType = 'success'} = this.props;

    return (
      <View
        style={{
          position: 'absolute',
          backgroundColor: alertType == 'success' ? 'green' : 'red',
          width: Global.screenWidth,
          padding: 10,
          zIndex: 51,
          bottom: 0,
        }}>
        <Text style={{alignSelf: 'center', color: 'white'}}>{msg}</Text>
      </View>
    );
  }
}
