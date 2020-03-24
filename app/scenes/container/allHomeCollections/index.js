import React, { Component } from 'react'
import { View, Text,  Linking, Animated, TextInput, Alert, TouchableOpacity} from 'react-native'
import moment from 'moment'
import { Routes, Color, Global, URLs, NetworkRequest, UserDefaults, stringsUserDefaults, CommonStyles } from '../../../utils'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import styles from './styles'
import {CloseBar, ModalBox, ModalDropdown} from '../../components'
import { ProgressBar, Ripple, SearchBox} from '../../components'
import { HeaderListExtraLarge, StateRepresentation } from '../../layouts'
import DialogHeader from '../../components/dialog.header'
import PropTypes from 'prop-types';
import ListView from 'deprecated-react-native-listview';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
})

const MENU_OPTIONS = ['Reschedule', 'Cancel Order'];

export default class AllHomeCollections extends Component {

  constructor (props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
    this.state = {
      isLoading: true,
      dataSource : ds.cloneWithRows([]),
      homeCollectionList:[],
      isStateRepFlag:false,
      isHomeCollectionPresent:false,
      cancelDialog:false,
    }

    this.getData = this.getData.bind(this)
    this.OnSelect = this.OnSelect.bind(this)
    this.loadingManipulate = this.loadingManipulate.bind(this)

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

  componentDidMount () {
    this.getData()
  }


  loadingManipulate(flag){
    this.setState({
      isLoading: flag
    })
  }

  OnSelect(rowId){

    bundle = this.state.homeCollectionList[rowId]
    referenceId = bundle.id

    this.props.menu(referenceId, 2, bundle)
  //  this.props.openTimeSlots(referenceId, bundle)
  console.log('REF', referenceId)

    //  switch(idx){
    //    case '0':
    //    this.props.openTimeSlots(referenceId, bundle)

    //    break;

    //    case '1':
    //     this.props.cancelHomecollection(referenceId, 2)
    //    break;
    //  }
  }





  getData(){
    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      let params = 'userToken=' + (token || '')
      var _this = this
NetworkRequest(_this, 'POST', URLs.homeCollectionList,params).then(result => {
        if(result.success){
          this.animate();
          if((result.response.code || 0) === 200){
            if(result.response.homeCollections.length>0){

            this.setState({
              dataSource: ds.cloneWithRows(result.response.homeCollections),
              homeCollectionList: result.response.homeCollections,
              isLoading: false,
              isStateRepFlag:false,
              isHomeCollectionPresent:true
            })

          }else{(this.setState({isStateRepFlag:true, isLoading:false}))
          }
            console.log("SUCCESS");
          } else if((result.response.code || 0) === 500){
            this.setState({isStateRepFlag:true, isLoading:false})
            console.log("FAILURE");
          } else {
            this.setState({isStateRepFlag:true, isLoading:false})
         
          }
        }else{this.loadingManipulate(false)}
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
  this.props.navigation.goBack()
}

_renderRow(item,secId,rowId){

  if(item.labForId){
    if(item.completeHomeCollection===1){
      isConfirmed = "Home collection completed"
    }    
     else if(item.confirmationFlag ===0){
        isConfirmed = "Awaiting Confirmation"
      }else{ isConfirmed = "Home Collection Confirmed"}
    }else{
      isConfirmed='Your request has been received. We will update you here for further details.'
    }

  //referenceId = item.id

  return (
    <View style = {{ flex:1}}>
    <View
    style={[CommonStyles.commonShadow,{ marginTop: 12,marginBottom: 9, borderRadius: 8 , backgroundColor: 'white', marginLeft: 18, marginRight: 18, paddingLeft: 12, paddingRight: 12, paddingTop: 18, paddingBottom:16, flexDirection:'column'}]}>


  <View style = {{flex:1, flexDirection:'row', paddingLeft:6}}>

        <Text style = {{fontWeight:(Global.iOSPlatform)?'500':'300', fontSize:22, color:Color.theme_blue, justifyContent:'center', alignItems:'center'}}>{moment.utc(item.startTime).local().format('hh:mm')} </Text>

       <View style = {{ flexDirection:'row', flex:3,  alignItems:'flex-start', paddingTop:2}}>
          <Text style = {{color:'black', fontSize:10}}>{moment.utc(item.startTime).local().format('A')} </Text>
       </View>

       <Text style = {{width:20, flexDirection:'row',fontWeight:'700'}}>__</Text>

       <Text style = {{fontWeight:(Global.iOSPlatform)?'500':'300', fontSize:22, color:Color.theme_blue}}>{moment.utc(item.endTime).local().format('hh:mm')}</Text>

       <View style = {{flexDirection:'column', paddingLeft:6, flex:10,alignItems:'flex-start'}}>
          <Text style = {{color:'black', fontSize:10,paddingTop:2}}>{moment.utc(item.endTime).local().format('A')} </Text>
           <Text style = {{color:'grey', fontSize:10}}>{moment.utc(item.startTime).local().format('Do MMM, YYYY')}</Text>
       </View>
    {   (item.completeHomeCollection===0) ?

      <TouchableOpacity 
    style ={{alignItems: 'center', height : 30, width:30}}
    onPress = {()=>{
      this.OnSelect(rowId)
      }}>

       <MaterialIcons
          name={'more-vert'}
          size={22}
          style={{color: Color._4A, position: 'absolute', textAlign:'right' }}/>
    {/* <ModalDropdown
    defaultValue=""
    style={{backgroundColor:'transparent',bottom:8, position: 'absolute'}}
    dropdownStyle={{   width: 200, height: 88}}
    dropdownTextStyle = {{fontSize:16, color:'black',fontWeight:'400', paddingLeft:16, paddingRight:12, paddingTop:12, paddingBottom:12}}
    dropdownTextHighlightStyle={{color: 'black'}}
    options={MENU_OPTIONS}
    onSelect={(idx, value) => this.selectedItem(idx, value, rowId)}
/> */}
</TouchableOpacity> :(null)
}
       


  </View>
  <View style = {{flex:1, flexDirection:'column', alignContent:'center'}}>
  {(!item.labForId)? <Text style = {{paddingLeft:6, paddingBottom:4, paddingTop:10, color:Color.starYellow, fontSize:12}}>Pending Confirmation</Text> : (null)}
 {(item.labForId) ?
  <Text style = {{paddingLeft :6, paddingTop:4, fontSize:12, color:item.confirmationFlag? Color.themeColor:Color.starYellow,}}>{isConfirmed}</Text>
:
<Text style = {{paddingLeft :6, paddingTop:4, fontSize:14, color:item.labForId? Color.starYellow:'grey',}}>{isConfirmed}</Text>

}
 
  </View>



      <Text style = {{color:'black', fontWeight:(Global.iOSPlatform)?'500':'400',paddingTop:4,  paddingLeft:6, fontSize:16}}>{(item.labForId)?(item.labForId.labName):''}</Text>

 {(item.labForId)&&(item.completeHomeCollection===0)?
  <View>

  

      <View
              style={{
              paddingTop:12,
    
              borderBottomColor: 'grey',
              borderBottomWidth: 0.2,
              }}
            />
      {item.collectingPersonId ?      
      <Text style = {{ color:'black',paddingLeft:6, paddingTop:6, fontWeight:'500'}}>{(item.collectingPersonId)?item.collectingPersonId.name.charAt(0).toUpperCase() + item.collectingPersonId.name.slice(1):(null)}</Text>:<View style = {{paddingTop:10}}/>}

      <View style = {{flexDirection:'row',  paddingTop:0, flex:1}}>

      {(item.collectingPersonId)?  
      
      <Text style = {{ paddingLeft:6, color:'grey', flex:1}}>Collecting person</Text>:
    <Text style = {{flex:1}}></Text>}

  <View>
      <Ripple
              rippleOpacity = {0.2}
              style = {{ padding:8, marginTop:-8}}
               onPress={() => {
               if(item.collectingPersonId){
                var number = item.collectingPersonId.mobile
              }else{
                var number = item.labForId.labContact
              }
                 var numArray = number.split(',')

                 Linking.openURL('tel:'+numArray[0]);

              }}>

        <Text style={[CommonStyles.button_style, { alignItems: 'flex-end',textAlign: 'right',justifyContent:'flex-end', paddingRight: 4 ,color: Color.theme_blue}]}>CALL</Text>

      </Ripple>
      </View>
      </View>
  </View>:(null)}

    {/* <View style = {{paddingLeft: 8, paddingBottom:10}}>
      <Text style = {{fontSize:18, fontWeight:'500', paddingBottom:16}}>{item.labForId.labName}</Text>
      <Text style = {styles.textMain}>Date: {moment(item.startTime).format('Do MMM, YYYY')}</Text>
      <Text style = {styles.textMain}>Preferred Time: {moment(item.startTime).format('hh:mm a')} to {moment(item.endTime).format('hh:mm a')}</Text>
      <Text style = {styles.textMain}>Collecting Person: {item.collectingPersonId.name}</Text>

          <View style = {{flexDirection:'row'}}>
            <Text >Contact Number: </Text>
            <Text style = {{color:'blue', textDecorationLine:'underline'}}>
               {item.collectingPersonId.mobile}</Text>
          </View>
      </View> */}

  </View>
</View>


  );
}

  render () {
    //const { params } = this.props.navigation.state;

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
            dataSource={this.state.dataSource}
            renderRow={(item,secId,rowId) => this._renderRow(item,secId,rowId)}></ListView>
            

        :
        <StateRepresentation
            
          description= 'Any pending orders for home collection  <br/> will be visible here'></StateRepresentation>
      }


        {(this.state.isLoading) ? (<ProgressBar/>) : (null)}
    </Animated.View>
    );
  }
}

AllHomeCollections.propTypes = {
  var1: PropTypes.string
}

AllHomeCollections.defaultProps = {
  var1: ''
}
