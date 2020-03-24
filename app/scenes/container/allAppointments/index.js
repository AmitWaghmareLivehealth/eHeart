import React, { Component } from 'react'
import { View, Text,  Linking, Alert, Animated, TextInput, PermissionsAndroid, TouchableOpacity, Platform} from 'react-native'
import moment from 'moment'
import { Routes, Color, Global, URLs, NetworkRequest, UserDefaults, stringsUserDefaults, CommonStyles } from '../../../utils'
// import {Select, Option} from "react-native-chooser";
import styles from './styles'
import {CloseBar, ModalBox, ModalDropdown} from '../../components'
import { ProgressBar, Ripple, SearchBox} from '../../components'
import { HeaderListExtraLarge, StateRepresentation } from '../../layouts'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import getDirections from '../../components/getDirections/'
import DialogHeader from '../../components/dialog.header'
import PropTypes from 'prop-types';
import  ListView from 'deprecated-react-native-listview';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
})


  const MENU_OPTIONS = ['Reschedule', 'Cancel Order']



export default class AllAppointments extends Component {

  constructor (props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
    this.state = {
      isLoading: true,
      dataSource : ds.cloneWithRows([]),
      appointmentList:[],
      isStateRepFlag:false,
      cancelDialog:false,
      isAppointmentPresent:false,


    }

    this.getData = this.getData.bind(this)
    this.OnSelect = this.OnSelect.bind(this)
    this.getRoute = this.getRoute.bind(this)
    this.loadingManipulate = this.loadingManipulate.bind(this)
    this.goback = this.goback.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.onClosingState = this.onClosingState.bind(this)
    this.onDirectionPressed = this.onDirectionPressed.bind(this)
  }

  componentDidMount () {
    this.getData()
  }

  animate() {
    this.animatedValue.setValue(-100)
    Animated.spring(
      this.animatedValue,
      {
        toValue: 1,
        speed:8,
        bounciness:-10,
        velocity:0
      }
    ).start()
  }



  loadingManipulate(flag){
    this.setState({
      isLoading: flag,
    })
  }


  onDirectionPressed(location){
    try {
      if(Global.iOSPlatform){
        this.getRoute(location)
      } else {
        if(Global.osVersion){
          const granted = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          ).then((granted) => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              this.getRoute(location)
            } else {
              console.log("Location permission denied")
            }
          }).catch((error) => {
            console.error(error);
          })
        } else {
          this.getRoute(location)
        }
      }
    } catch (err) {
      console.warn(err)
    }

  }



  getData(){
    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      let params = 'userToken=' + (token || '')
      var _this = this
NetworkRequest(_this, 'POST', URLs.appointmentList,params).then(result => {
        if(result.success){
          this.animate();
          
          if((result.response.code || 0) === 200){

            if(result.response.appointments.length>0){

            this.setState({
              dataSource: ds.cloneWithRows(result.response.appointments),
              appointmentList: result.response.appointments,
              isLoading: false,
              isStateRepFlag:false,
              isAppointmentPresent:true
            })


        }else{this.setState({isStateRepFlag:true, isLoading:false})
        }
            console.log("SUCCESS");
          } else if((result.response.code || 0) === 500){
            console.log("FAILURE");
            this.setState({isStateRepFlag:true, isLoading:false})

          } else {
            this.loadingManipulate(false)
          }
        }
        else{
          this.loadingManipulate(false)
        }
      }).catch((error) => {

        this.setState({isStateRepFlag:true, isLoading:false})
        console.error(error);
      })

    }).catch((error) => {

      this.setState({isStateRepFlag:true, isLoading:false})
      console.error(error);
    })
}
goback(){
  this.props.closeModal()
}
onClose() {
  this.setState({
    cancelDialog: false
  })
  console.log('Modal just closed');
}
onOpen() {
  console.log('Modal just openned');
}
onClosingState(state) {
   console.log('the open/close of the swipeToClose just changed');
}

getRoute(location){


  let labArray = location.split(',')
  let labLati = labArray[0]
  let labLongi = labArray[1]

      navigator.geolocation.getCurrentPosition(
        (position) => {



         console.log('COORDS', labLati+' '+labLongi+' '+position.coords.latitude+' '+position.coords.longitude)


      const data = {
        source: {
         latitude: position.coords.latitude,
         longitude: position.coords.longitude
       },
       destination: {
         latitude: parseFloat(labLati),
         longitude: parseFloat(labLongi)
       },
       params: [
         {
           key: "dirflg",
           value: "c"
         }
       ]
     }
     getDirections(data)
      },
      (error) => {
        Alert.alert(
          'Location Services',
          'Your Location services are turned off, You need to enable it in order to access this feature',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
            {text: 'Settings', onPress: () => {
              Linking.openURL('app-settings:')
            }},
          ],
          { cancelable: false }
        )
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000})

    }




OnSelect(rowId){

//console.log('OnSelect:', idx+' : '+value+' : '+location)

array = this.state.appointmentList[rowId]
apptId = array.id

this.props.menu(apptId, 1)

  // switch(idx){

  //   case '0':
  //     this.props.rescheduleAppointment(apptId)
  //   break;

  //   case '1':
  //    this.props.cancelAppointment(apptId, 1)
  //   break;
  // }

}

_renderRow(item,secId,rowId){
  key = rowId + secId+'1'
    if(item.labForId){
      if(item.completeAppointment === 1){ isConfirmed = "Appointment Completed"}
      else if(item.confirmedAppointment === 0){
        isConfirmed = "Awaiting Confirmation"
      }
      else{ isConfirmed = "Confirmed"}
    }
    else{
  //    isConfirmed = 'Your order request for '+ moment.utc(item.userAppointmentDate).local().format('Do MMMM, YYYY') +' has been received. We will update you here for further details.'
      isConfirmed = 'Your request has been received. We will update you here for further details.'

    }


var location = (item.labForId)? item.labForId.location:'';

  return (
    <View style = {{ flex:1}}>
    <View
    style={[CommonStyles.commonShadow,{ marginTop: 12,marginBottom: 9, borderRadius: 8 , backgroundColor: 'white', marginLeft: 18, marginRight: 18, paddingLeft: 18, paddingRight: 18, paddingTop: 18, paddingBottom:6, flexDirection:'column'}]}>


      <View style = {{flex:1, flexDirection:'row', paddingLeft:6, alignItems:'flex-start', justifyContent:'center'}}>

        <Text style = {{textAlign:'center',fontWeight:(Global.iOSPlatform)?'500':'300', fontSize:22, color:Color.theme_blue}}>{moment.utc(item.userAppointmentDate).local().format('Do MMM, YYYY')}</Text>

       <View style = {{flexDirection:'column', flex:10}}>
          <Text style = {{color:'black', fontSize:12}}></Text>
          <Text style = {{color:'grey', fontSize:12}}></Text>
       </View>
{(item.completeAppointment===0)?

    <TouchableOpacity
    style ={{alignItems: 'flex-end', height : 30, width:40}}
    onPress = {()=>{
      this.OnSelect(rowId)
      }}>


    <MaterialIcons
          name={'more-vert'}
          size={22}
          style={{color: Color._4A, position: 'absolute', textAlign:'right' }}
        />

    {/* <ModalDropdown style={{ flex: 1,
    top: 2,
    left: 10,
    right:30,
    backgroundColor: 'transparent'
    }}
    defaultValue=""
    dropdownStyle={{  width: 200, height: 88}}
    dropdownTextStyle = {{fontSize:16, color:'black',fontWeight:'400', paddingLeft:16, paddingRight:12, paddingTop:12, paddingBottom:12}}
    dropdownTextHighlightStyle={{color: 'black'}}
    options={MENU_OPTIONS}
    onSelect={(idx, value) => this.OnSelect(idx, value, location, rowId)}

/> */}
    </TouchableOpacity>

:(null)}

    </View>
      <View style = {{paddingLeft:6, paddingTop:10}}>
       {(!item.labForId)? <Text style = {{paddingBottom:4, color:Color.starYellow, fontSize:12}}>Pending Confirmation</Text> : (null)}

       {(item.labForId) ?
  <Text style = {{ paddingTop:4, fontSize:12, color:item.confirmationFlag? Color.themeColor:Color.starYellow,}}>{isConfirmed}</Text>
:
<Text style = {{ paddingTop:2, fontSize:14, color:item.labForId? Color.starYellow:'grey',}}>{isConfirmed}</Text>

}
       </View>

            <Text style = {{ fontWeight:(Global.iOSPlatform)?'500':'400',fontSize:16, flex:1, paddingTop:4,  paddingLeft:6, color:'black'}}>{(item.labForId)?(item.labForId.labName):''}</Text>
           
            {(item.labForId)?
           <View>

           {(item.completeAppointment===0)?<View>
             <View
              style={{
                paddingBottom:12,
              borderBottomColor: 'grey',
              borderBottomWidth: 0.2,
              }}
            />

  <View style ={{flexDirection:'row', justifyContent: 'center'}}>


  <Ripple
              rippleOpacity = {0.2}
              style = {{paddingLeft: 8, paddingRight: 8}}
              onPress={() => {
                  this.onDirectionPressed(location)


              }}>

    <Text style={[CommonStyles.button_style, {flex:1,justifyContent: 'flex-end', alignItems: 'flex-end',textAlign: 'right', paddingRight: 4 ,paddingTop:16,paddingBottom:10,color: Color._9F}]}>DIRECTIONS</Text>

    </Ripple>

    <View style ={{flex:1}}/>
    <Ripple
              rippleOpacity = {0.2}
              style = {{paddingLeft: 8, paddingRight: 8}}
              onPress={() => {

                var number =  item.labForId.labContact
                var numArray = number.split(',')

                 Linking.openURL('tel:'+numArray[0]);

              }}>



    <Text style={[CommonStyles.button_style, {flex:1,justifyContent: 'flex-end', alignItems: 'flex-end',textAlign: 'right', paddingRight: 4 ,paddingTop:16,paddingBottom:10,color: Color.theme_blue}]}>CALL</Text>

    </Ripple>

    </View></View>:<View style = {{paddingBottom:16}}/>}
    </View> :(null)}

  <View style = {{width:20}}>
</View>
  {/* </View>   */}
</View>


</View>
  );


}

  render() {
    const anim = this.animatedValue.interpolate({
      inputRange: [0.5, 3],
      outputRange: [-100, 400]
    })
    return (

      <Animated.View style={{flex: 1, backgroundColor: 'white', bottom:anim}}>
         {!this.state.isStateRepFlag ?

           <ListView
            bounces={true}
            enableEmptySections
            removeClippedSubviews={false}
            automaticallyAdjustContentInsets={false}
            stickySectionHeadersEnabled={false}
            dataSource={this.state.dataSource}
            style={{flex: 1}}
            renderRow={(item,secId,rowId) => this._renderRow(item,secId,rowId)}></ListView>




      :<StateRepresentation

              description= 'Any pending orders for appointments <br/> will be visible here'></StateRepresentation>
              }


              {(this.state.isLoading) ? (<ProgressBar/>) : (null)}
    </Animated.View>

    );
  }
}

AllAppointments.propTypes = {
  var1: PropTypes.string
}

AllAppointments.defaultProps = {
  var1: ''
}
