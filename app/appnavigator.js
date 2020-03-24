import React, {  Component } from 'react'
import PropTypes from 'prop-types';
import { BackHandler, StatusBar, View, Dimensions, Animated, Text, Vibration, Image, TouchableWithoutFeedback, AsyncStorage,  AppState } from 'react-native'
import { connect } from 'react-redux'
import { addNavigationHelpers, StackNavigator, NavigationActions } from 'react-navigation'
// import NotificationsIOS from 'react-native-notifications';
import NetInfo from "@react-native-community/netinfo";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

// utils import
import { Routes, Global, LoginManager, stringsUserDefaults, stringsNotifications, Images, UserDefaults } from './utils'
import { AppNavigatorStack } from './scenes/container/router'
import {  setNotification } from './redux/actions/index';
import { setUnreadFlag } from './redux/actions/index'
import {setDemographics } from './redux/actions/index'

let mainScreen;

//const { navigate } = this.props.navigation;

class AppNavigator extends Component {
  constructor(props){
    super(props)
    this.animatedValueNotification = new Animated.Value(0)
    this.animatedValueIndicator = new Animated.Value(0)

    this.state={
     showNotification:false,
     notification:{},
     header:'Sample',
     subText:'test',
     user:'',
     demographics:'',
     isConnection:true
    }

    if(Global.iOSPlatform){
    //  NotificationsIOS.addEventListener('notificationReceivedForeground', this.onNotificationReceivedForeground.bind(this));

   }

    this.callNotification = this.callNotification.bind(this)
    this.closeNotification  = this.closeNotification.bind(this)
    this.onNotificationOpenedForeground = this.onNotificationOpenedForeground.bind(this)
    this.checkConnection = this.checkConnection.bind(this)
    this.getData = this.getData.bind(this)

   }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      key: PropTypes.string,
      screen: PropTypes.Component
    })
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
     this.checkConnection();

    }
  }

  checkConnection(){

    NetInfo.isConnected.fetch().then(isConnected => {

      this.setState({
        isConnection:isConnected
      })
    });
  }

  callNotification(header, subText) {
    this.setState({
      notificationHeader:header,
      notificationSubText:subText
    })

    Vibration.vibrate()
    Animated.timing(
      this.animatedValueNotification,
      {
        toValue: 0,
        duration: 350
      }).start(this.closeNotification())
  }

  closeNotification() {
    setTimeout(() => {
      Animated.timing(
      this.animatedValueNotification,
      {
        toValue: -100,
        duration: 350
      }).start()
    }, 3000)

    setTimeout(() => {
      this.setState({showNotification:false})
    }, 3500)
  }

  onNotificationOpenedForeground(){
    notification = this.state.notification
  }

  componentWillMount(){

    NetInfo.isConnected.addEventListener('change', this._handleConnectivityChange);
    AppState.addEventListener('change', this._handleAppStateChange);

  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({isConnection:isConnected})
}

async getData(){
  user = ''
  demographics = ''

  UserDefaults.get(stringsUserDefaults.user).then((user) => {
    if(user){
     
      if(user.user.email){
        email=1
      }
      if(user.fullName){
        fullName=1
      }
      if(user.profilepic){
        profilePic=1
      }
      if(user.dateOfBirth){
        dateOfBirth=1
      }
      if(user.sex){
        sex=1
      }
      
    }
  })

  UserDefaults.get(stringsUserDefaults.demographics
  ).then((demographics) => {
    if(demographics){

      if(demographics._source){

        if(demographics._source.industryType && demographics._source.occupation){
        industryType = 1
        occupation = 1 
        }
   
         if(demographics._source.isDiabetic === 0 || demographics._source.isDiabetic === 1){
          isDiabetic=1
         }
         if(demographics._source.isChronic === 0 || demographics._source.isChronic === 1){
           isChronic=1
         }
         if(demographics._source.isSmoker){
          isSmoker=1
        }
         if(demographics._source.consumesAlcohol){
           consumesAlcohol=1
         }
         if(demographics._source.bloodGroup){
           bloodGroup=1
         }

        

         this.props.dispatch(setDemographics({
           industryType:industryType,
           occupation:occupation,
           isDiabetic:isDiabetic,
           isChronic:isChronic,
           isSmoker:isSmoker,
           consumesAlcohol:consumesAlcohol,
           bloodGroup:bloodGroup,
          

           email:email,
           fullName:fullName,
           profilePic:profilePic,
           dateOfBirth:dateOfBirth,
           sex:sex

           
          }))
       }

       UserDefaults.get(stringsUserDefaults.height
       ).then((height) => {
          if(height > 0){
   
          this.props.dispatch(setDemographics({height:1}))
         }
       })

       UserDefaults.get(stringsUserDefaults.weight
       ).then((weight) => {
          if(weight > 0){
   
            this.props.dispatch(setDemographics({weight:1}))
          }
       }).catch((error) => {
         console.error(error);
       })


      UserDefaults.get(stringsUserDefaults.activenessLevel).then((activenessLevel) => {
        if(activenessLevel.length>0){
          this.props.dispatch(setDemographics({activenessLevel:1}))
        }
      })
  
      UserDefaults.get(stringsUserDefaults.stressLevel).then((stressLevel) => {
        if(stressLevel.length>0){
          this.props.dispatch(setDemographics({stressLevel:1}))
        }
      })

      UserDefaults.get(stringsUserDefaults.hasInsurance).then((hasInsurance) => {
        if(hasInsurance== 0 || hasInsurance ==1){
          this.props.dispatch(setDemographics({hasInsurance:1}))
        }
      })

      UserDefaults.get(stringsUserDefaults.insuranceName).then((insuranceName) => {
        if(insuranceName){
          this.props.dispatch(setDemographics({insuranceName:1}))
        }
      })
      

      // if (demographics._source.hasInsurance){
      //   hasInsurance = 1
      // }
      // if(demographics._source.insuranceName){
      //   insuranceName = 1
      // }
    }
  })

  
}


  componentDidMount () {
    this.getData()
  //  this.props.dispatch(setUnreadFlag(1))
   
    BackHandler.addEventListener('hardwareBackPress', (function () {
      const routes = this.props.navigation.routes
      try {
        if (routes[routes.length - 1].index === 0 && routes[routes.length - 1].routes[0].index === 0) {
          return false
        }
      }catch(error){console.error(error);}

      if ([Routes.loginIntroScreen].includes(routes[routes.length - 1].routeName) || routes.length === 0) {
        return false
      }
      if ([Routes.loginScreen].includes(routes[routes.length - 1].routeName) || routes.length === 0) {
        return false
      }
      this.props.dispatch(NavigationActions.back())
      return true
    }.bind(this)))
  }


  componentWillUnmount(){
    if(Global.iOSPlatform){
      // NotificationsIOS.removeEventListener('notificationReceivedForeground', this.onNotificationReceivedForeground.bind(this));
      // NotificationsIOS.removeEventListener('notificationReceivedBackground', this.onNotificationReceivedBackground.bind(this));
      // NotificationsIOS.removeEventListener('notification')

      NetInfo.isConnected.removeEventListener('change', this._handleConnectivityChange);
      AppState.removeEventListener('change', this._handleAppStateChange);

    }
  }

  onNotificationReceivedForeground(notification){

            this.setState({
              showNotification:true,
              notification:notification
            })

        if(notification._data.category === stringsNotifications.GCMCAT_NEW_REPORT)  {
          this.callNotification(stringsNotifications.GCMCAT_NEW_REPORT, notification._data.message)
        } else if(notification._data.category === stringsNotifications.GCMCAT_APP_UPDATE){
          this.callNotification('App Update', notification._data.message)
        }
        else if(notification._data.category === stringsNotifications.GCMCAT_ALL_APPOINTMENTS){
          this.callNotification('Appointment', notification._data.message)
       } else if(notification._data.category === stringsNotifications.GCMCAT_ALL_HOMECOLLECTION){
        this.callNotification('Homecollection', notification._data.message)

       } else if(notification._data.category === stringsNotifications.GCMCAT_ALL_PHLEBO){
        this.callNotification('Homecollection', notification._data.message)

       }

       }

  render () {

    const width = Global.screenWidth
    const part = width/4
    const margin = part/5
    const formula = 2*part + margin
    const formula2 = margin

    const { navigate } = this.props.navigation;
    return (
    <View style = {{flex:1}}>

        <AppNavigatorStack
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.navigation
        })}
        />

    {/* <View style = {{height:Global.screenHeight, width:Global.screenWidth, backgroundColor:'rgba(0,0,0,0.2)', position:'absolute' }}> */}

    {/* <View style = {{height:70, width:70, backgroundColor:'transparent', position:'absolute', bottom:2, left:12, borderRadius:70/2, borderColor:'grey',borderWidth:1, overflow:'hidden',}}>
      </View> */}

    {/* </View> */}

    {/* #e53935 */}
     {!(this.state.isConnection)?
         <Animated.View style = {{transform: [{ translateY:this.animatedValueIndicator }],backgroundColor:'#e53935', height:20, width:Global.screenWidth, position:'absolute',left:0, right:0, top:Global.iOSPlatform ? 20 : 0, bottom:0 }}>
         <Text  style = {{ fontFamily: 'Arial', alignSelf:'center', color:'white', backgroundColor:'rgba(0,0,0,0)', fontWeight:'bold',}}>{'Offline'}</Text>
          </Animated.View>:(null)

  }

       { (this.state.showNotification)?
          <Animated.View
          style={{ transform: [{ translateY: this.animatedValueNotification }], height: 100, backgroundColor:'white',  justifyContent:  'center',  position:'absolute', left:5, right:5, top:0, bottom:0, borderRadius:10, marginTop:Global.isIphoneX ? 24 : 10,
          elevation:2, shadowRadius:5, shadowOpacity:0.2, shadowOffset: { width: 0, height: 0 }, shadowColor: 'black',borderColor:'#ccc', borderWidth:0, }}>
            <TouchableWithoutFeedback
            onPress = {
              ()=>{
                this.props.dispatch(setNotification(this.state.notification))

              }
            }>
            <View>
                <View
                style = {{marginLeft:10, marginRight:10, flexDirection:'row',paddingTop:20}}>

                <Image

                source = {Images.livehealth_icon}
                style = {{height:28, width:28, borderRadius:8, marginBottom:4}}/>

                  <Text
                  style={{ color: 'black',  fontSize:15, fontWeight: '500', marginLeft:5,marginBottom:5, flex:1, alignSelf:'center'}}>
                    {this.state.notificationHeader}
                  </Text>
                </View>

                <View style={{height: 0.5, marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0,  backgroundColor: '#DFDFDF'}}/>

                  <Text style ={{marginLeft:20, paddingTop:4, marginBottom:10, marginRight:15}}>{this.state.notificationSubText}</Text>
            </View>
            </TouchableWithoutFeedback>
        </Animated.View>
              :(null)}

            {(!this.props.demographics.demographics.show && this.props.demographics.demographics.screen)?
                <MaterialIcons
              name={'error-outline'}
              size={16}
              style={{color:(true)? Color.starYellow : '#1988F3',  position:'absolute', bottom:Global.isIphoneX ? 60: 46, right:formula2, backgroundColor:'transparent'}}
            />

            :
            (null)
            }

            {(this.props.unread.flag && this.props.demographics.demographics.screen)?
                   <MaterialIcons
              name={'brightness-1'}
              size={12}
              style={{flex: 0.07, color: '#1988F3',  position:'absolute', bottom:Global.isIphoneX ? 60: 46, right:formula, backgroundColor:'transparent' }}
            /> 
              :(null)
            }

     </View>
    )
  }
}

const mapStateToProps = state => ({
  navigation: state.navigation,
  unread:state.unread,
  demographics:state.demographics
})


export default connect(mapStateToProps)(AppNavigator)
