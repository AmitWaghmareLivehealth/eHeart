import React, { Component } from 'react'
import { View, Text, StyleSheet , ScrollView, Image, ActivityIndicator, Animated} from 'react-native'

import { CommonStyles, Global , Color, Images} from '../../../utils'
import { HeaderListExtraLarge} from '../../layouts'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {Ripple} from '../../components'

export default class TipsTricks extends Component {
  constructor(props){
    super(props);
    this.springValue = new Animated.Value(1)
    this.state={
      springVal: new Animated.Value(1),
      isLoading: false
      
    }
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
  

  render() {
    return (
        <Animated.View style={[CommonStyles.commonShadow,{ marginTop: 10,marginBottom: 10, borderRadius: 8 , backgroundColor: 'white', marginLeft: 18, marginRight: 18, paddingLeft: 18, paddingRight: 18, paddingTop: 18, transform:[{scale: this.state.springVal}]}]}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Image source={Images.imageCardio} style={{height:40,width:40,flex:0}}/>
              <Text style={[CommonStyles.common_header, {paddingLeft: 10, flex: 1}]}>Tips & Tricks</Text>
          </View>

            {(this.props.counter === 1) ?(
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{ fontFamily: 'Arial' ,fontSize: 20, fontWeight: '300', color : Color._36}}>Mark Favourite trackers</Text>
                <MaterialIcons
                  name={'star-border'}
                  size={24}
                  color={Color.tracker_vals}
                  style={{padding:4}}
                />
              </View>
              <Text style={{ fontFamily: 'Arial' , paddingTop: 8, fontSize: 16,color: Color._54}}>You can add your favourite trackers by just clicking on the star icon in the trackers</Text>
            </View>) : (null)}

            {(this.props.counter === 2) ?(
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{ fontFamily: 'Arial' ,fontSize: 20, fontWeight: '300', color : Color._36}}>Report's color indicator</Text>
              </View>
              <View style={{flexDirection:'row'}}></View><Text style={{ fontFamily: 'Arial' , paddingTop: 2, fontSize: 16,color: Color._54}}>These colors indicate the danger levels of your values</Text>
              <View style={{flexDirection:'row'}}>
                <View style={{width: 4,height: 16,borderRadius: 1.5,overflow: 'hidden',backgroundColor: Color.greenBright,marginTop:7, justifyContent: 'center'}}></View>
                <Text style={{ fontFamily: 'Arial' ,paddingLeft: 12, paddingTop: 2, fontSize: 16,color: Color._54, marginRight:16}}>Green : The value is between the desirable range</Text>
              </View>

              <View style={{flexDirection:'row'}}>
                <View style={{width: 4,height: 16,borderRadius: 1.5,overflow: 'hidden',backgroundColor: Color.yellow,marginTop:7, justifyContent: 'center'}}></View>
                <Text style={{ fontFamily: 'Arial' ,paddingLeft: 12, paddingTop: 2, fontSize: 16,color: Color._54, marginRight:16}}>Yellow : The value is just above or below the desirable range</Text>
              </View>

              <View style={{flexDirection:'row'}}>
                <View style={{width: 4,height: 16,borderRadius: 1.5,overflow: 'hidden',backgroundColor: Color.redExit,marginTop:7, justifyContent: 'center'}}></View>
                <Text style={{ fontFamily: 'Arial' ,paddingLeft: 12, paddingTop: 2, fontSize: 16,color: Color._54, marginRight:16}}>Red : The value is out of the desirable range</Text>
              </View>
            </View>) : (null)}


            {(this.props.counter === 3) ?(
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{ fontFamily: 'Arial' ,fontSize: 20, fontWeight: '300', color : Color._36}}>Relative's Reports</Text>
              </View>
              <Text style={{ fontFamily: 'Arial' ,paddingTop: 8, fontSize: 16,color: Color._54}}>You can view the reports of your relatives and friends those are registered under your number</Text>
            </View>) : (null)}


            {(this.props.counter === 4) ?(
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{ fontFamily: 'Arial' ,fontSize: 20, fontWeight: '300', color : Color._36}}>Live Tracking</Text>
              </View>

              <View style={{justifyContent: 'center',marginLeft: 18,marginRight: 18,marginTop:16, marginBottom: 16}}>
                <View style={{flex:1,flexDirection :'row'}}>
                  <View style={{backgroundColor: Color.pending_selected_color, borderRadius: 70, height: 12, width: 12}}></View>
                  <View style={{flex:1, padding:3}}></View>
                  <View style={{backgroundColor: Color.pending_selected_color, borderRadius: 70, height: 12, width: 12}}></View>
                  <View style={{flex:1, padding:3}}></View>
                  <View style={{backgroundColor: Color.pending_color_neutral, borderRadius: 70, height: 12, width: 12}}></View>
                  <View style={{flex:1, padding:3}}></View>
                  <View style={{backgroundColor: Color.pending_color_neutral, borderRadius: 70, height: 12, width: 12}}></View>
                </View>
                <View style={{width : (Global.screenWidth - (110)), backgroundColor: Color.pending_color_neutral, padding:1.7,alignItems: 'center',borderRadius:70,position: 'absolute'}}></View>
                <View style={{width : (Global.screenWidth - (110)) * 0.6, backgroundColor: Color.pending_selected_color, padding:1.7,alignItems: 'center',borderRadius:70,position: 'absolute'}}></View>
              </View>

              <Text style={{ fontFamily: 'Arial' ,paddingTop: 8, fontSize: 16,color: Color._54}}>You can view the live status of your reports from here</Text>
            </View>) : (null)}
            <View style={{flexDirection: 'row'}}>
              <View style={{flex:1}}></View>
              <Ripple
              rippleOpacity = {0.2}
             onPressIn = {this.spring1.bind(this)}
             onPressOut = {this.spring2.bind(this)}
               onPress={() => {
                this.setState({
                  isLoading: true
                })
                this.props.onPressAction()

                setTimeout(() => {
                  this.setState({
                    isLoading: false
                  })
                },800)
              }}>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                {(this.state.isLoading) ?
                 (<ActivityIndicator
                    color={Color.themeColor}
                    size={Global.iOSPlatform ? 1 : 18}
                    style={{paddingRight: Global.iOSPlatform ? 16 : 8}}/> ): (null)}
                <Text style={[CommonStyles.button_style, {textAlign: 'right', paddingTop: 16,paddingBottom: 16, paddingRight: 4 ,color: Color.theme_blue}]}>NEXT TIP</Text>
              </View>
              </Ripple>
            </View>
          </View>
        </Animated.View>
    );
  }
}
