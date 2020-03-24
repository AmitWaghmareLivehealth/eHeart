import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Globals from '../../../utils/const/globals'
import Colors from '../../../utils/const/colors'

export default class StateRepresentation extends Component {
  render () {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <MaterialIcons
          name={this.props.image}
          size={150}
          style={{
            color: Colors._DF
          }}
        />
        <Text style={{ fontFamily: 'Arial' ,alignItems:'center',textAlign: 'center',color: Colors.staterepColor }}>{this.props.description.replace("<br/>", "\n")}</Text>
      </View>
    )
  }
}
