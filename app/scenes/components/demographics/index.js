import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, Animated, Slider, ActivityIndicator} from 'react-native'
import { Color, CommonStyles, Global} from '../../../utils'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SliderCustom from '../slider.custom'
import Ripple from '../ripple/'


export default class Demographics extends Component {
  constructor(props) {
    super(props)
    this.springValue = new Animated.Value(1)
    this.state={
      springVal: new Animated.Value(1),
      headerText: this.props.headerText,
      subheaderText: this.props.subheaderText,
      actualType: this.props.actualType,
      onPressAction: this.props.onPressAction || '',
      type: this.props.type,
      value:0,
      indicatorText:this.props.indicatorText,
      nextValue : this.props.nextValue
      
    }

    // Type 1 : For Health Checkup
    // Type 2 : For Active
    // Type 3 : For Stress
    // Type 4 : For Insurance
    // Type 5 : For Medication

    this.onValueChange = this.onValueChange.bind(this)
    this.value = this.value.bind(this)
  }


  
  spring1 () {
    this.springValue.setValue(0.99)
    //this.setState({springVal:0.97})
    Animated.spring(
      this.state.springVal,
      {

        toValue: 0.97,
      //  springVal:0.97
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
        //springVal:1
      }
    ).start()
  }

  // componentDidMount(){
  //   indicatorText = 
  //   this.props.type == 1 ?'Weekly':
  //   this.props.type == 2 ? 'Sedentary':
  //   this.props.type == 3 ? 'Rarely': (null)
  
  // this.setState({indicatorText:indicatorText})
  // }

  // componentWillReceiveProps(){

  //   this.setState({
  //     indicatorText:this.props.indicatorText
  //   })
//}

  onValueChange(val){
    
 indicatorText = ""

     if (val == null && this.state.nextValue ){
      indicatorText = 
      //this.props.type == 1 ?'Weekly':
      this.props.type == 1 ? 'Sedentary':
      this.props.type == 2 ? 'Rarely': (null)
     }

       if(val<=2 && val!=null){
       indicatorText = 
       this.props.type == 1 ?'Weekly':
       this.props.type == 2 ? 'Sedentary':
       this.props.type == 3 ? 'Rarely': (null)
       }
       else if(val<=5 && val!=null){
        indicatorText = 
        this.props.type == 1 ?'Monthly':
        this.props.type == 2 ? 'Lightly Active':
        this.props.type == 3 ? 'Sometimes': (null)
       }
       else if (val<=8 && val!=null){
        indicatorText = 
        this.props.type == 1 ?'Quarterly':
        this.props.type == 2 ? 'Active':
        this.props.type == 3 ? 'Often': (null)
       }
       else if(val<=10 && val!=null){
        indicatorText = 
        this.props.type == 1 ?'Annually':
        this.props.type == 2 ? 'Very Active':
        this.props.type == 3 ? 'Very Often': (null)
       }
 

    this.setState({
      indicatorText:indicatorText,
      value: (val==null)? null : 0
    })
    
  }
  
  value(){

  }
  

  render(){
    var imageUrl = this.state.image
    var image = Image.imageUrl

    if (this.props.type == 1){
      questionText = 'How frequently do you routine health checks?'
    }

    if (this.props.type == 2){
      questionText = 'How active are you?'
    }

    if (this.props.type == 3){
      questionText = 'Do you feel stressed often?'
    }

    if (this.props.type == 4){
      questionText = 'Do you have Health Insurance?'
    }

    if (this.props.type == 5){
      questionText = 'Are you on Medications?'
    }

    return(
        <Animated.View style={[{transform:[{scale: this.state.springVal}]},styles.container , CommonStyles.commonShadow, this.props.styles]}>
            <View style={{paddingLeft: 17, paddingRight: 17, paddingTop: 17}}>
              <View style={styles.innerContainer}>
              <MaterialIcons
                        name={'announcement'}
                        size={38}
                        style={{
                          color: '#253F8B'
                        }}
                      />
                {(this.state.headerText) ? (<Text style={[CommonStyles.common_header, {paddingLeft: 16}]}>{this.state.headerText}</Text>) : (null)}
              </View>

              <Text style={{ fontFamily: 'Arial' ,color: Color._54, fontSize: 16,marginTop: 4}}>{questionText}</Text>
              <Text style={{ fontFamily: 'Arial' ,color: Color._A3, fontSize: 13, fontWeight: '400', marginTop:4}}>{this.state.actualType}</Text>

  {(this.props.type <=3) ?
    <View>
      {(this.state.indicatorText) ?
      <Text style={{ fontFamily: 'Arial' ,color: Color._54, fontSize: 16, marginTop:10, fontWeight:'bold', alignSelf:'center'}}> 
    
      {this.state.indicatorText}</Text>     

      :
      <Text style={{ fontFamily: 'Arial' ,color: Color._54, fontSize: 16, marginTop:10, fontWeight:'bold', alignSelf:'center'}}> 
      
      {'   '}</Text> 
      }

          <View style = {{alignItems:'center'}}>
              <SliderCustom
              value = {this.state.value}//{this.state.value}
              minimumTrackTintColor= {Color.appointmentBlue}
              maximumTrackTintColor = {'#ccc'}
              style={styles.slider}
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
              vertical = {false}
              // value={parseInt(input.value)}
              minimumValue={0}
              maximumValue={10}
              onValueChange={this.onValueChange}            
              />
          </View>
      <View style = {{flexDirection:'row', justifyContent:'center'}}>
    
     {(this.props.processing == 1) ? 
    
    <Text style={[styles.textStyle, {color:'#ccc'}]}>SUBMIT</Text>
    :
        <Ripple
            rippleOpacity = {0.2}
            onPressIn = {this.spring1.bind(this)}
            onPressOut = {this.spring2.bind(this)}
            onPress={() => {
              if(this.props.onPressAction){
                this.props.onPressAction(this.state.indicatorText)
         
                this.onValueChange(null)
               
              }
            }}>

              <Text style={[styles.textStyle, {color:'#A9A9A9'}]}>
              SUBMIT</Text>
       </Ripple>      
      }

 {(this.props.processing == 1)?
       <ActivityIndicator
                    color='#ccc'
                    size={Global.iOSPlatform ? 1 : 18}
                    style={{marginLeft: Global.iOSPlatform ? 16 : 8, paddingBottom:10}}/> : (null)}
                    
      </View>  
    </View>   
    :
    <View style = 
    {{ 
    flexDirection:'row', 
    justifyContent:'space-between',
    marginLeft:40,
    marginRight:40,
    marginTop:10
    }}>

     <Ripple
            onPressIn = {this.spring1.bind(this)}
            onPressOut = {this.spring2.bind(this)}
            style = {{paddingLeft:10, paddingRight:20}}
            onPress={() => {
              if(this.state.onPressAction){
                this.state.onPressAction(0)
              }
            }}>
              <Text style={styles.textStyle}>
                  NO</Text>
      </Ripple> 

      <Ripple
           
            onPressIn = {this.spring1.bind(this)}
            onPressOut = {this.spring2.bind(this)}
            style = {{paddingLeft:20, paddingRight:10}}
            onPress={() => {
              if(this.state.onPressAction){
                this.state.onPressAction(1)
              }
            }}>       
            <Text style={styles.textStyle}>
                    YES</Text>
      </Ripple>              
    </View>
  
}
            </View>

    </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: { 
    marginTop: 10,
    marginBottom: 10, 
    borderRadius: 8 , 
    backgroundColor: 'white', 
    elevation: 6, 
    marginLeft: 18, 
    marginRight: 18
  },

  innerContainer:{
    flexDirection: 'row', 
    alignItems:'center'
  },

  slider: {
   width:245 
  },

  track:{
    height: 2,
    borderRadius: 4,
  },

  thumb:{
    width: 22,
    height: 22,
    borderRadius: 22 / 2,
    backgroundColor: 'white',
    borderWidth: 0,
    elevation:2,
    backgroundColor:Color.appointmentBlue
  },
  textStyle:{
    fontFamily: 'Arial',
    color:'#A9A9A9',
    fontSize: 14, 
    paddingTop:10, 
    fontWeight:'bold', 
    alignSelf:'center', 
    paddingBottom:20
  }


})