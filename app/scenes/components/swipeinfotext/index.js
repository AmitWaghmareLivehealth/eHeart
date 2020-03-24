import React, { Component } from 'react'
import { View, Text, Image, StyleSheet} from 'react-native'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class SwipeInfoText extends Component{
  render(){
    return(
      <View style={[{paddingLeft:20,paddingRight:20, flexDirection: 'row', justifyContent: 'flex-end'}, this.props.style]}>
        <Text style={{ fontFamily: 'Arial' ,color: Color._9F}}>Swipe right to view {'the ' + this.props.text}</Text>
        <MaterialIcons
          name={'chevron-right'}
          size={22}
          style={{
            color: Color._9F
          }}
        />
      </View>
    )
  }
}
