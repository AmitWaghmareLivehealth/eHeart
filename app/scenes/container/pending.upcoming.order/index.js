import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableHighlight, TouchableOpacity, Linking} from 'react-native'

import { Color, Global ,stringReportStages, stringReportStatus, UserDefaults, stringsUserDefaults, NetworkRequest, URLs , stringRazorPay} from '../../../utils'
import RazorpayCheckout from 'react-native-razorpay';
import {Ripple} from '../../components'
import CloseBar from '../../components/closebar'
import moment from 'moment'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class PendingUpcomingOrder extends Component{

  constructor(props){
    super(props);
    var orderStatus = 'Order Received'
    var percentage = 0.25

    var num_orderStatus = this.props.data[0]

    if(this.props.data[0].confirmationFlag==1){
      percentage = 0.5
      orderStatus = 'Approved'
    }  if(this.props.data[0].collectingPersonId){
      percentage = 0.75
      orderStatus = 'Scheduled'
    }
      if(this.props.data[0].completeHomeCollection==1){
       percentage = 1
     }



    this.state={
      labName: (this.props.data[0].labForId)? this.props.data[0].labForId.labName : null,
      startTime:this.props.data[0].startTime,
      endTime:this.props.data[0].endTime,
      orderStatus: orderStatus || '',
      percentage: percentage,
      num_orderStatus: num_orderStatus,

    }
    //this.getTest = this.getTest.bind(this)
   // this.getData = this.getData.bind(this)
   // this.paymentSuccess = this.paymentSuccess.bind(this)
  //  this.guid = this.guid.bind(this)
  //  this.paymentCheck = this.paymentCheck.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  // componentDidMount(){
  //   try{
  //    this.props.setSwipe(true)
  //    this.props.setScroll(true)
  //    this.refs.scrollView.scrollTo({x: 0, y: 5, animated: true});
  //   } catch(error){console.error(error);}
  // }


    onScroll (event) {
      if(event.nativeEvent.contentOffset.y  < 5){
        console.log('set swipe TRUE onScroll');
        this.props.setSwipe(true)
      }
    }






  _onScroll = (event) => {
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = event.nativeEvent.contentOffset.y
    const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
      ? 'down'
      : 'up'
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionButtonVisible = direction === 'up'
    if (isActionButtonVisible && currentOffset === 0) {
      this.props.renderClose(true)
    } else {
      this.props.renderClose(false)
    }
    // Update your scroll position
    this._listViewOffset = currentOffset
  }

  render(){
    return(
      <View style={{flex : 1}}>
      <ScrollView
        bounces={false}
        ref="scrollView"
        style={{backgroundColor: 'white'}}
        onScroll={this.onScroll}
        onContentSizeChange={(w, h) => {
          if (h > Global.screenHeight) {
            if(this.props.getSwipe()){
              this.props.setSwipe(false)
              this.props.setScroll(true)
              this.refs.scrollView.scrollTo({x: 0, y: 5, animated: true});
            }
          }
        }}>
          <CloseBar
            goBack={ () => {this.props.closeModal()}}
            style={{backgroundColor: 'white', flex: 0 }}/>
          <View style={{paddingLeft: 17, paddingRight: 17, paddingBottom: 17, backgroundColor: 'white'}}>

       {(this.props.data[0].labForId)?
       <Text style={{ fontFamily: 'Arial' ,color: Color._9F, fontSize: 14, paddingTop:8, paddingBottom:8}}>Status of Upcoming order at</Text> :

       <Text style={{ fontFamily: 'Arial' ,color: Color._36, fontSize: 18, paddingBottom:8}}>Status of Upcoming order on</Text>}

           {(this.state.labName)?
             <Text style={{ fontFamily: 'Arial' ,color: Color._36, fontSize: 18, paddingBottom:8}}>{this.state.labName}</Text> :(null)}

            <Text style={{ fontFamily: 'Arial' ,color: Color._9F, fontSize: 14, paddingBottom:12, fontWeight:'500'}}>{moment.utc(this.state.startTime).local().format('dddd')

              }{'  '+moment.utc(this.state.startTime).local().format('h:mm a')}{'- '+moment.utc(this.state.endTime).local().format('h:mm a')}</Text>


            <View style={{height: 0.5, backgroundColor: Color._DF, marginTop: 12, marginBottom: 12}}></View>

            <Text style={{ fontFamily: 'Arial' ,color: Color._36, fontSize: 14, paddingBottom: 12, fontSize: 16}}>Status: {this.state.orderStatus}</Text>

            <View style = {{flex:1, flexDirection:'column'}}>
            <View style= {{flexDirection:'row'}}>
              <MaterialIcons
                name={'check-circle'}
                size={26}
                style={{
                  color: Color.appointmentBlue, paddingRight:0 
                }}
             />
             <Text style={styles.pending_header_style}>{'Order Received'}</Text>
           </View>
              <View style = {{flexDirection:'column', flex:1}}>
      <View style = {{flexDirection:'row'}}>
        <View style={{}}>     
        <Text style = {styles.dotStyle}>{(this.state.percentage >= 0.5)?'   |':'   .'}</Text>
        <Text style = {styles.dotStyle}>{(this.state.percentage >= 0.5)?'   |':'   .'}</Text>
        <Text style = {styles.dotStyle}>{(this.state.percentage >= 0.5)?'   |':'   .'}</Text>
        <Text style = {styles.dotStyle}>{(this.state.percentage >= 0.5)?'   |':'   .'}</Text>
         
          </View> 

           <Text style={styles.pending_text_style}>{'Your order has been received. This step confirms your requested tests and are ackowledged to be processed further.'}</Text>

        </View>
           <View style= {{flexDirection:'row'}}>
           <MaterialIcons
              name={(this.state.percentage >= 0.5)?'check-circle':'radio-button-unchecked'}
              size={26}
              style={{
                color: Color.appointmentBlue, paddingLeft:0 
              }}
           />
           <Text style={styles.pending_header_style}>{'Approved'}</Text>
           </View>

                <View style = {{flexDirection:'row'}}>
          <View>     
          <Text style = {styles.dotStyle}>{(this.state.percentage >= 0.75)?'   |':'   .'}</Text>
          <Text style = {styles.dotStyle}>{(this.state.percentage >= 0.75)?'   |':'   .'}</Text>
          <Text style = {styles.dotStyle}>{(this.state.percentage >= 0.75)?'   |':'   .'}</Text>
          <Text style = {styles.dotStyle}>{(this.state.percentage >= 0.75)?'   |':'   .'}</Text>
          </View> 

           <Text style={styles.pending_text_style}>{'Your order request has been approved. A Phlebotomist will be assigned at the time of home collection to collect your sample.'}</Text>

        </View>

           <View style= {{flexDirection:'row'}}>
           <MaterialIcons
              name={(this.state.percentage >= 0.75)?'check-circle':'radio-button-unchecked'}
              size={26}
              style={{
                color: Color.appointmentBlue, paddingLeft:0
              }}
           />
           <Text style={styles.pending_header_style}>{'Scheduled'}</Text>
           </View>
           <View style = {{flexDirection:'row'}}>
          <View>     
          <Text style = {styles.dotStyle}>{(this.state.percentage >= 1)?'   |':'   .'}</Text>
          <Text style = {styles.dotStyle}>{(this.state.percentage >= 1)?'   |':'   .'}</Text>
          <Text style = {styles.dotStyle}>{(this.state.percentage >= 1)?'   |':'   .'}</Text>
          <Text style = {styles.dotStyle}>{(this.state.percentage >= 1)?'   |':'   .'}</Text>
         
          </View> 

          <Text style={{fontFamily: 'Arial',marginLeft:20, color:'grey'}}>
                        <Text
                        onPress={()=>{ Linking.openURL('tel:'+this.props.data[0].collectingPersonId.mobile)}} 
                        style = {{color:Color.appointmentBlue, fontWeight:'500',textDecorationLine:
                       'underline'}}>{((this.props.data[0].collectingPersonId) ? this.props.data[0].collectingPersonId.name:'')}

                      </Text>{((this.props.data[0].collectingPersonId) ? '':'A Phlebotomist')+' has been scheduled for your home collection and will come at the requested time to collect your sample.'}</Text>

        </View>

           <View style= {{flexDirection:'row'}}>
           <MaterialIcons
              name={(this.state.percentage >= 1)?'check-circle':'radio-button-unchecked'}
              size={26}
              style={{
                color: Color.appointmentBlue, paddingLeft:0 
              }}
           />
           <Text style={styles.pending_header_style}>{'Sample Collected'}</Text>
           
           </View>
           <Text style={{fontFamily: 'Arial', marginLeft:32, color:'grey'}}>{'Your sample has been collected and will be processed once it reaches the lab.'}</Text>
              </View>  
              
              
           </View>


            {/* <View style={{marginBottom:12,flex: 1}}>
              <View style={{flexDirection :'column', height : (628 - 200)}}>
                <View style={{flex:1}}>
                  <View style={{flexDirection: 'row'}}>
                    <View>
                      <View style={{backgroundColor: (this.state.percentage >= 0.25) ? (Color.appointmentBlue) : (Color.pending_color_neutral), borderRadius: 70, height: 13, width: 13}}></View>
                      <View style={{flex:1, padding:3}}></View>
                    </View>
                    <View style={styles.pending_view_style}>
                      <Text style={styles.pending_header_style}>{'Order Received'}</Text>
                      <Text style={{fontFamily: 'Arial'}}>{'Your order has been received. This step confirms your requested tests and are ackowledged to be processed further.'}</Text>
                    </View>
                  </View>
                </View>

                <View style={{flex:1}}>
                  <View style={{flexDirection: 'row'}}>
                    <View>
                      <View style={{backgroundColor: (this.state.percentage >= 0.5) ? (Color.appointmentBlue) : (Color.pending_color_neutral), borderRadius: 70, height: 13, width: 13}}></View>
                      <View style={{flex:1, padding:3}}></View>
                    </View>
                    <View style={styles.pending_view_style}>
                      <Text style={styles.pending_header_style}>{'Approved'}</Text>
                      <Text style={{fontFamily: 'Arial'}}>{'Your order request has been approved. A Phlebotomist will be assigned at the time of home collection to collect your sample as per the order received.'}

                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{flex:1}}>
                  <View style={{flexDirection: 'row'}}>
                    <View>
                      <View style={{backgroundColor: (this.state.percentage >= 0.75) ? (Color.appointmentBlue) : (Color.pending_color_neutral), borderRadius: 70, height: 13, width: 13}}></View>
                      <View style={{flex:1, padding:3}}></View>
                    </View>
                    <View style={styles.pending_view_style}>
                      <Text style={styles.pending_header_style}>{'Scheduled'}</Text>

                      <Text style={{fontFamily: 'Arial'}}>
                        <Text
                        onPress={()=>{ Linking.openURL('tel:'+this.props.data[0].collectingPersonId.mobile)}} 
                        style = {{color:Color.appointmentBlue, fontWeight:'500',textDecorationLine:
                       'underline'}}>{((this.props.data[0].collectingPersonId) ? this.props.data[0].collectingPersonId.name:'')}

                      </Text>{((this.props.data[0].collectingPersonId) ? '':'A Phlebotomist')+' has been scheduled for your home collection and will come at the requested time to collect your sample.'}</Text>

                    </View>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{backgroundColor: (this.state.percentage >= 1) ? (Color.appointmentBlue) : (Color.pending_color_neutral), borderRadius: 70, height: 13, width: 13}}></View>
                  <View style={styles.pending_view_style}>
                    <Text style={styles.pending_header_style}>{'Sample Collected'}</Text>
                    <Text style={{fontFamily: 'Arial'}}>{'Your sample has been collected and will be processed after it reaches the lab.'}</Text>
                  </View>
                </View>
              </View>
              <View style={{height : (650 -  277), backgroundColor: Color.pending_color_neutral, padding:2,borderRadius:70,position: 'absolute', marginLeft: 4.7}}></View>
              <View style={{height : (650 -  277) * this.state.percentage, backgroundColor: Color.appointmentBlue, padding:2,alignItems: 'center',borderRadius:70,position: 'absolute', marginLeft: 4.7}}></View>
            </View> */}



          </View>
        </ScrollView>
      </View>
    )
  }
}

const  styles = StyleSheet.create({
  pending_view_style:{flex: 1, paddingLeft: 24, paddingRight:16},
  pending_header_style: {fontSize: 18,paddingBottom:0, paddingLeft:6,color: Color._36},
  dotStyle:{color:Color.appointmentBlue, fontWeight:'900', fontFamily:'Arial'},
  pending_text_style:{fontFamily: 'Arial', marginLeft:18, color:'grey', alignSelf:'flex-start', paddingRight:8}
})
