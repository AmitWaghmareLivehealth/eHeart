import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class DialogHeader extends Component{
  render(){
    return(
      <View style={this.props.containerStyle}>
        <Text style={[styles.title_style,this.props.style]}>{this.props.title}</Text>
        <Text style={[styles.secondary_title_style]}>{this.props.secondaryTitle}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title_style: {fontSize: 24, color:'black', fontWeight: '700'},
  secondary_title_style:{fontSize: 14, paddingLeft:24}
})
