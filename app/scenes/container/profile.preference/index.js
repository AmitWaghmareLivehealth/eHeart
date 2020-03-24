
import React, { Component } from 'react'
import { View, Text, Switch } from 'react-native'

import { Color } from '../../../utils'

export default class Preference extends Component {
  constructor(props) {
    super(props)
  }

  render(){
    return(
      <View style={{flexDirection: 'column',flex: 1, backgroundColor: 'white'}}>
        <Text style={{ fontFamily: 'Arial' ,color: Color.themeColor, fontWeight: '500',paddingLeft: 14,paddingTop:16}}>Settings</Text>

        <View style={{padding:16}}>
            <Text style={{fontFamily: 'Arial'}}>Location</Text>
            <Text style={{ fontFamily: 'Arial' ,color : Color.themeColor}}>Location</Text>
        </View>

        <View style={{ backgroundColor: '#DFDFDF', height: 0.5 }}></View>

        <View style={{padding:16}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column',flex: 1}}>
              <Text style={{fontFamily: 'Arial'}}>Slow Network</Text>
              <Text style={{ fontFamily: 'Arial' ,color : Color.themeColor}}>Allow networ optimization</Text>
            </View>
            <Switch/>
          </View>
        </View>

        <View style={{ backgroundColor: '#DFDFDF', height: 0.5 }}></View>

        <View style={{padding:16}}>
            <Text style={{fontFamily: 'Arial'}}>Reset Tutorial</Text>
            <Text style={{ fontFamily: 'Arial' ,color : Color.themeColor}}>This option will avail you to see tutorial</Text>
        </View>

        <View style={{ backgroundColor: '#DFDFDF', height: 0.5 }}></View>

      </View>
    )
  }
}
