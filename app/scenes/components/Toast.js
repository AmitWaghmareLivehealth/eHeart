import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Global from '../../utils/const/globals';

export default class Tost extends Component {
  state = {showToast: true};
  componentDidMount() {
    setTimeout(() => {
      this.setState({showToast: false});
    }, 2000);
  }

  render() {
    const {msg, type} = this.props;
    const {showToast} = this.state;
    return (
      <View>
        {showToast ? (
          <View
            style={{
              backgroundColor: type == 'error' ? 'red' : 'green',
              padding: 20,
              position: 'absolute',
              zIndex: 51,
              width: Global.screenWidth,
            }}>
            <Text style={{color: 'white', alignSelf: 'center'}}>{msg} </Text>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    );
  }
}
