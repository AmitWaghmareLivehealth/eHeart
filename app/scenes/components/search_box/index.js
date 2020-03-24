import React, {
  Component,
} from 'react';

import {
  View,
  Text,
  TextInput
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {Color, Images, Global} from '../../../utils'


export default class MyComponent extends Component {

  static defaultProps = {}

  static propTypes = {}

  constructor(props) {
    super(props);
    this.state = {
      isClose: false
    };
  }

  render() {
    return (
      <View style={{marginLeft : 24, marginRight: 24, marginBottom: 16, height: 50, borderRadius: 6, backgroundColor: '#F0F0F0', flexDirection: 'row', overflow:'hidden'}}>
        <MaterialIcons
          name={'search'}
          size={Global.iOSPlatform ? 18 : 28}
          style={{ color: '#202020', alignSelf: 'center', padding: 16, paddingRight: 0}}
        />
        <TextInput
          ref={"searchbox"}
          style={{flex :1, color : '#202020', marginLeft: 12}}
          underlineColorAndroid={'#F0F0F0'}
          onChangeText={(text) => {
            this.props.search(text)
            this.setState({
              isClose: true
            })
          }}
          placeholder = 'Search'/>

          {this.state.isClose ?
            <MaterialIcons
              name={'close'}
              size={26}
              style={{ color: '#202020', alignSelf: 'center', paddingRight: 16}}
              onPress={() => {
                this.refs.searchbox.clear()
                setTimeout(() => {
                  this.props.afterClear()
                },50)
                this.setState({
                  isClose: false
                })
              }}
          /> : null}
      </View>
    );
  }

}
