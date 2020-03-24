import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { Color } from '../../../utils'

export default class ListHeader extends Component {
  constructor(props) {
    super(props);

    this.state= {
      headerText : this.props.headerText
    }
  }

  render(){
    return(
      <Text style={{ fontFamily: 'Arial' ,
        backgroundColor: Color._EEGrayTableHeader,
        color: Color._4A,
        padding: 16,
      }}>{this.state.headerText}</Text>
    )
  }
}
