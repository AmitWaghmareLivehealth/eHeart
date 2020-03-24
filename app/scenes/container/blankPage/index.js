
import React, { Component } from 'react'

import { View, Text } from 'react-native'
import styles from './styles'


class BlankScreen extends Component {

  // static propTypes = {
  //   name: React.PropTypes.string,
  //   index: React.PropTypes.number,
  //   list: React.PropTypes.arrayOf(React.PropTypes.object),
  //   openDrawer: React.PropTypes.func,
  //   popRoute: React.PropTypes.func,
  //   navigation: React.PropTypes.shape({
  //     key: React.PropTypes.string,
  //   }),
  // }

  // popRoute() {
  //   this.props.popRoute(this.props.navigation.key);
  // }

  render() {
    const { props: { name, index, list } } = this;

    return (
      <View style={styles.container}>
        <Text> Hellosdfg </Text>
      </View>
    );
  }
}

export default BlankScreen
