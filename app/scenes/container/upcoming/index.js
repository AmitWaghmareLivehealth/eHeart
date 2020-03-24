import React, { Component } from 'react'
import { View, Text, StyleSheet , ScrollView, Image, ActivityIndicator, Animated} from 'react-native'

import { CommonStyles, Global , Color, Images} from '../../../utils'
import { HeaderListExtraLarge} from '../../layouts'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {Ripple} from '../../components'

export default class Upcoming extends Component {
  constructor(props){
    super(props);
    this.springValue = new Animated.Value(1)
    this.state={
    springVal: new Animated.Value(1),
    typeText : this.props.typeText,
    nameText : this.props.nameText,
    labNameText: this.props.labNameText,
    date : this.props.date,
    timing : this.props.timing,
    timingTo:this.props.timingTo,
    callBtn : this.props.callBtn,
    directionsBtn: this.props.directionsBtn,
    onPressCall: this.props.onPressCall,
    onPressDirection: this.props.onPressDirection,
    onPressAction: this.props.onPressAction,
    labNull:this.props.labNull,
    descText:this.props.descText
      
    }
  }

  spring1 () {
    this.springValue.setValue(0.99)
    //this.setState({springVal:0.97})
    Animated.spring(
      this.state.springVal,
      {       
        toValue: 0.97,
      }
    ).start()
  }
  
  spring2 () {
    this.springValue.setValue(0.97)
    //this.setState({springVal: 0.99})
    Animated.spring(
      this.state.springVal,
      {
        toValue: 1,
      }
    ).start()
  }
  
 
  render() {
    return (
      <Animated.View style={[CommonStyles.commonShadow,{ marginTop: 10,marginBottom: 10, borderRadius: 8 , backgroundColor: 'white', marginLeft: 18, marginRight: 18, paddingLeft: 18, paddingRight: 18, paddingTop: 18,transform:[{scale: this.state.springVal}]}]}>
      <Ripple
      rippleOpacity = {0.1}
      onPressIn = {this.spring1.bind(this)}
      onPressOut = {this.spring2.bind(this)}
      onPress = {()=>{this.props.onPressAction()}}
         >   
            <View style={{flexDirection: 'row'}}>
              <Image source={Images.imageBooking} style={{height:30,width:40,flex:0}}/>
              <Text style={[CommonStyles.common_header, {paddingLeft: 10, flex: 1}]}>Upcoming</Text>
          </View>

          <Text style={[CommonStyles.button_style, {paddingTop:10,color: Color.theme_blue, fontWeight:'500'}]}>{this.props.typeText}</Text>

      {(this.props.labNull)?
      <View>
       { (this.props.nameText)?  
            <Text style = {{color:'black',fontWeight:'500',fontSize:16, paddingTop:10}}>{this.props.nameText.charAt(0).toUpperCase() + this.props.nameText.slice(1)}</Text> :(null)
          }

          { (this.props.nameText)?
          <Text style = {{color:'black', fontSize:16, paddingTop:6, fontWeight:'100'}}>{this.props.labNameText}</Text>:
          <Text style = {{fontWeight:'500', fontSize:16, paddingTop:10}}>{this.props.labNameText}</Text>
          }
          <View style ={{flexDirection:'row'}}>
          
          <Text style = {{ color:Color._9F, paddingTop:10, fontWeight:(Global.iOSPlatform)?'600':'500'}}>{this.props.date} </Text>
        <View style = {{flexDirection:'row'}}>
          <Text style = {{ color:Color._9F, paddingTop:10,paddingLeft:8, fontWeight:(Global.iOSPlatform)?'600':'500'}}>{this.props.timing}  </Text>
          <Text style = {{ color:Color._9F, paddingTop:10,paddingLeft:8, fontWeight:(Global.iOSPlatform)?'600':'500'}}>{this.props.timingTo} </Text>
        </View>  
          </View>
      </View> 
      :
      <View>
<View style = {{flexDirection:'row'}}>
         <Text style = {{ color:Color._9F, paddingTop:10, fontWeight:(Global.iOSPlatform)?'600':'500'}}>{this.props.date} </Text>
        
          <Text style = {{ color:Color._9F, paddingTop:10,paddingLeft:8, fontWeight:(Global.iOSPlatform)?'600':'500'}}>{this.props.timing}  </Text>
          <Text style = {{ color:Color._9F, paddingTop:10,paddingLeft:8, fontWeight:(Global.iOSPlatform)?'600':'500'}}>{this.props.timingTo} </Text>
        </View>  
      <Text style = {{fontFamily: 'Arial' , paddingTop: 8,
       paddingBottom:(this.props.directionsBtn) ? 0 : 30, fontSize: 16,color: Color._54}}>{this.props.descText}</Text>
      </View>   
    }
  </Ripple>
      {(this.props.directionsBtn)?
          <View style={{flexDirection: 'row', justifyContent: 'flex-end',flex: 1,alignItems:'center', paddingTop:6}}>
            
          <Ripple
               onPress = {()=>{
                 if(this.props.onPressDirection){
                    this.props.onPressDirection()
                 }
              }}
               onPressIn = {this.spring1.bind(this)}
               onPressOut = {this.spring2.bind(this)}
              rippleOpacity = {0.2}>
              <View style = {{paddingRight:40, paddingTop:16, paddingBottom:16}}>
               <Text style={{ fontFamily: 'Arial' ,fontWeight:(Global.iOSPlatform)?'700':'500', color: Color._9F, marginRight: 8, alignItems:'center' }}>{this.props.directionsBtn}</Text>
              </View> 
          </Ripple>     
   
               <View style={{flex: 1}}></View>

               <Ripple
               onPress = {()=>{this.state.onPressCall()}}
               onPressIn = {this.spring1.bind(this)}
               onPressOut = {this.spring2.bind(this)}
              rippleOpacity = {0.2}>
              {this.props.callBtn ?
              
               (  <View style = {{paddingLeft:40, paddingTop:16, paddingBottom:16}}>
                 <Text style={{ fontFamily: 'Arial' ,textAlign: 'right',fontWeight:(Global.iOSPlatform)?'700':'500', color: Color.theme_blue}}>{this.props.callBtn}</Text>
                 </View>):(null)}
               </Ripple>
          </View> :(null)
        }      
             
  </Animated.View>
        
      
    );
  }
}
