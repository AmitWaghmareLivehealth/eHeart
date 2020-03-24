import React, { Component } from 'react'
import { View, Text, TextInput, ScrollView, Picker } from 'react-native'
import CheckBox from 'react-native-check-box'

export default class FeedbackRating extends Component {
  constructor(props) {
    super(props)
    this.state={
      labName: this.props.labName || 'your recent lab',
      labId: this.props.labId || 0,
      billId: this.props.billId || 0,
    }

    this.getRows = this.getRows.bind(this)
  }

  getRows(){
    var rows = []
    for(i = 0 ; i < 4 ; i++){
      row.push(
          <CheckBox
            style={{flex: 1, padding: 10}}
            onClick={()=>this.onClick(data)}
            isChecked={data.checked}
            leftText={leftText}
          />
      )
    }
    return(<View>{row}</View>)
  }

  render() {
    return (
      <CheckBox
    style={{flex: 1, padding: 10}}
    onClick={()=>this.onClick(data)}
    
/>
    );
  }
}
