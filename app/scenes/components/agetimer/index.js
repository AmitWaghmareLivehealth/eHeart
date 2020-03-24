import React, { Component } from 'react'
import { View, Text} from 'react-native'
import moment from 'moment'

export default class AgeTimer extends Component{
  constructor(props) {
    super(props)

    this.state={
      dateOfBirth: this.props.dateOfBirth,
      duration : ''
    }
  }

  async _getTime(){
    try{
      var startTime = moment(this.props.dateOfBirth)
      var endTime = moment()
      var duration =  moment.duration(endTime.diff(startTime));
      
      // var years = (moment().diff(startTime, 'years', true)).toFixed(10)

      setTimeout(() => {
        var duration_actual = duration._data.years + '.' + duration._data.months + duration._data.days + duration._data.hours + duration._data.minutes + duration._data.seconds +  parseInt(duration._data.milliseconds) % 100
        this.setState({
          duration: duration_actual
        })
      },100)
    } catch(error){
      console.error(error);
    }
  }

  render(){
    this._getTime()
    return(
      <View style={{paddingTop:2, paddingLeft:4, flexDirection:'column'}}>
        <Text style={{ flex:1, color:'grey', fontFamily: 'Arial' ,textAlign: 'left', fontSize: 14}}>{this.state.duration}</Text>
        <Text style={{color:'grey', fontSize: 14, fontFamily: 'Arial'}}>years old</Text>
      </View>
    )
  }
}
