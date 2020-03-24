import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, Animated, Easing,TouchableWithoutFeedback, Image } from 'react-native';
import { Color, Global, Images } from '../../../utils'
import PropTypes from 'prop-types'


const TUTORIALS = [

    {
      'header':'Dashboard',
      'description':'This is your Dashboard, here you can find all your booked appointments, pending reports, favourite trackers etc.',
      'icon':Images.imageTab1,
      'label': Global.iOSPlatform ?'Home': 'HOME',
      'outputRange':0
    },
    {
      'header':'Reports',
      'description':'This is Reports, here you can find all your reports as well as your family reports.',
      'icon':Images.imageTab2,
      'label':Global.iOSPlatform ?'Reports': 'REPORTS',
      'outputRange':0
    },
    {
      'header':'Health Trackers',
      'description':'Here you can track your Body Measurements, Activity, Vitals like Blood Pressure and glucose etc.',
      'icon':Images.imageTab3,
      'label':Global.iOSPlatform ?'Trackers':'TRACKERS',
      'outputRange': Global.screenWidth / 4 //95
    },

    {
      'header':'Profile',
      'description':'Here you can update your basic profile, lifestyle details, view your transactions, get support, and edit settings.',
      'icon':Images.imageTab4,
      'label':Global.iOSPlatform ?'Profile':'PROFILE',
      'outputRange':Global.screenWidth / 2 //190
    },
  ]

export default class Tutorial extends Component {

  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0)
    this.state = {
      tutorials: TUTORIALS,
      count:0,
      showTutorials:true,
    };

    this.next = this.next.bind(this)
    this.animationCallback = this.animationCallback.bind(this)
  }

  animate () {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 400,
        easing: Easing.linear
      }
    ).start(this.animationCallback)
  }

  animationCallback(){

      //this.animate()
      // this.setState({

      // })
  }

  next(){
   
   
  count = this.state.count

  this.animate()

  if(count<3){
    count++
   
    
    this.setState({
      count:count
    })
  }else{

    this.setState({showTutorials:false})
    }
  }

  render() {

    
    count = this.state.count

    const animLeft = this.animatedValue.interpolate({
      inputRange: [0, 1],
     // outputRange:[this.state.opR1, this.state.opR2]
      //outputRange:[outputRange1, outputRange2]
      outputRange: [this.state.tutorials[count].outputRange, this.state.tutorials[count].outputRange+Global.screenWidth/4]
    })

    return (
      <Modal
         animationType={'none'}
         transparent={true}
         visible={this.state.showTutorials}
         onRequestClose = {() => { }}
         >
        
    <TouchableWithoutFeedback 
    onPress = {this.next}
    style = {{flex:1,}}>
      <View style= {styles.mainContainer}>    
         <View style = {styles.messageContainer}>      
            <Text style = {styles.headerStyle}>{this.state.tutorials[count].header}</Text>

            <Text style = {styles.descriptionStyle}>{this.state.tutorials[count].description}</Text>

         </View>


         <Animated.View 
         style = {[ styles.arrowIndicator,{
          marginLeft: animLeft}]
          }/>

         {/* <View style = {{height: 30, width: 30, borderRadius: 60,  backgroundColor: 'white' , position: 'absolute', bottom : 80, left: 56, borderWidth:2, borderColor:'#ffffff', justifyContent :'center', alignItems: 'center'}}/>

         <View style = {{height: 20, width: 20, borderRadius: 60,  backgroundColor: 'white' , position: 'absolute', bottom : 115, left: 76, borderWidth:2, borderColor:'#ffffff', justifyContent :'center', alignItems: 'center'}}/> */}
          
       <Animated.View style={[ styles.circle, {marginLeft: animLeft} ]}>
         
              <Image
              source={this.state.tutorials[count].icon}
              style={{tintColor: Color.themeColor}}
              />
            <View style = {styles.labelStyle}>  
                <Text style = {{fontSize:11, color:Color.themeColor}}>{this.state.tutorials[count].label}</Text>
            </View>  
      </Animated.View>
         </View> 
          </TouchableWithoutFeedback>

       {/* {(count>0)?
          <View style = {{height: 80, width: 80, borderRadius: 60,  backgroundColor: 'transparent' , position: 'absolute', bottom : 0, left: 6,  justifyContent :'center', alignItems: 'center'}}>
          <Image
              source={Images.imageTab1}
              style={{tintColor: 'black'}}
              />

            <View style = {styles.labelStyle}>  
                <Text style = {{fontSize:11, color:'black'}}>Home</Text>
            </View> 
          </View> : (null)
       } */}

      </Modal>
    );
  }
}

const styles = StyleSheet.create({

  mainContainer:{
    flex:1,
    backgroundColor:'#00000090',
    position:'absolute',
    left:0,
    right:0,
    top:0,
    bottom:0,
    alignItems:'center'
  },

  messageContainer:{
    backgroundColor:'#ffffff', 
    height:120, 
    width:Global.screenWidth - 50,
    borderRadius:10,
    padding:10,
    position:'absolute',
    bottom:100,//90
    
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 5,
    shadowOpacity: 0.4
  },

  headerStyle:{
    fontFamily:'Arial', 
    fontWeight:'bold', 
    color:'grey', 
    fontSize:18
  },

  descriptionStyle:{
    fontFamily:'Arial', 
    color:'grey',
    marginTop:8
  },

  labelStyle:{
    position:'absolute', 
    bottom:Global.iOSPlatform ? 6 : 13
  },

  arrowIndicator:{
    width: 0,
    height: 0,
    position:'absolute',
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 50,
    bottom:80,
    left:25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
    transform: [{rotate: '180deg'}]
  },

  circle:{
    height: (Global.screenWidth / 4) - 20, 
    width: (Global.screenWidth / 4) - 20, 
    borderRadius: 60,  
    backgroundColor: '#ffffff', 
    position: 'absolute', 
    bottom : 0, 
    left: 6, 
    borderWidth:2, 
    borderColor:'#ffffff',   
    justifyContent :'center', 
    alignItems: 'center'
  }

})

