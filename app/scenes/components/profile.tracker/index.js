
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet, processColor, Modal, Alert, Image, LayoutAnimation, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import moment from 'moment'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-charts-wrapper';
import { URLs, Routes, Global, Color, UserDefaults, stringsUserDefaults, NetworkRequest, CommonStyles, Images} from '../../../utils'
import { StateRepresentation } from '../../layouts'
import ListHeader from '../listheader'
import DialogHeader from '../dialog.header'
import CloseBar from '../closebar'
import ProgressBar from '../progressbar/'
import Ripple from '../ripple/'
import ModalBox from '../modal.dropdown/'
import Demographics from '../demographics/'
import { stringDictId } from '../../../utils/const/strings';
import ListView from 'deprecated-react-native-listview';

const data = [
];

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ProfileTracker extends Component {


  constructor (props) {
    super(props)
    
    this.state = {
     
     currentLevel: this.props.flag == 1 ?
      (this.props.activenessLevel[0]) ? this.props.activenessLevel[0].value :''
     :(this.props.stressLevel[0]) ? this.props.stressLevel[0].value : '',

     currentDate: this.props.flag == 1 ? 
     (this.props.activenessLevel[0])?this.props.activenessLevel[0].reportDate:''
     :(this.props.stressLevel[0])? this.props.stressLevel[0].reportDate:'',

     dataSource: this.props.flag== 1 ? ds.cloneWithRows(data): ds.cloneWithRows(data),

     headerText: this.props.flag== 1 ?'Activeness Level':'Stress Level',
     descriptionText:this.props.flag == 1 ?
     'Activeness Level is a way to express your daily physical activity as a number, and is used to estimate your total energy expenditure.':
     
     'Stress is a physical, mental or emotional factor that causes bodily or mental tension. Stresses can be external or internal.',
     //#009688
     //#0097a7
     theme: this.props.flag==1 ? Color.themeColor:'#fb8c00',
     isActionButtonVisible:true,
     showModal:false,
     stateRep:false,
     addModal:false,
     infoModal:false,
     selectedDateTime:'',
     selectedLevel:'',
     isLoading:false,
     activenessLevel : this.props.activenessLevel,
     stresslevel : this.props.stressLevel,
     rowId:0,
     emptyDataSource:false,
     dataArray:[],
     changesMadeTracker:0
    
    }
    this.renderRow = this.renderRow.bind(this)
    this.submitResponse = this.submitResponse.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this.getData = this.getData.bind(this)
    this.renderModal = this.renderModal.bind(this)
    this.renderInfoModal = this.renderInfoModal.bind(this)
    this.goBack  = this.goBack.bind(this)
    this.loadingManipulate = this.loadingManipulate.bind(this)
    this.deleteEntry = this.deleteEntry.bind(this)
  }

  componentDidMount(){

    this.getData()
}

  loadingManipulate(flag){
    this.setState({
      isLoading:flag
    })
  }
  getData(){
    (this.props.flag == 1) ? 
    UserDefaults.get(stringsUserDefaults.activenessLevel).then((activenessLevel) => {
      if(activenessLevel){
      if(activenessLevel.length!=0){
       
       this.setState({
         dataSource:ds.cloneWithRows(activenessLevel),
         dataArray: activenessLevel
       })
      }
      else{
        this.setState({
          stateRep:true,
          emptyDataSource:true
        })
      }
    }
      else{
        this.setState({
          stateRep:true,
          emptyDataSource:true
        })
      }
    }).catch((error) => {
      console.error(error);
    })
:
    UserDefaults.get(stringsUserDefaults.stressLevel).then((stressLevel) => {
     if(stressLevel){ 
      if(stressLevel.length!=0){
        this.setState({
       dataSource: ds.cloneWithRows(stressLevel),
       dataArray:stressLevel
      })
      }
      else{
        this.setState({
          stateRep:true,
          emptyDataSource:true
        })
      }
     }else{
        this.setState({
          stateRep:true,
          emptyDataSource:true
        })
      }
    }).catch((error) => {
      console.error(error);
    })
    
  }

  

  goBack(){
    this.props.closeModal()
  }

  componentWillUnmount(){
    this.props.changesMadeTracker(this.state.changesMadeTracker)
  }


  deleteEntry (){
    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      var params = 'token=' + token
                  + '&trackerId=' + this.state.selectedId
      var _this = this
      NetworkRequest(_this, 'POST', URLs.deleteTracker, params).then(result => {
        if (result.success){
          if ((result.response.code || 0) === 200){
            this.setState({
              showModal: false,
              infoModal: false,
              isLoading:false,
              changesMadeTracker:1
            })

             //Save in async
          if( this.props.flag == 1 ) {
            
                      UserDefaults.get(stringsUserDefaults.activenessLevel).then((activenessLevel)=> {
                        
                        arr = activenessLevel ? activenessLevel : [];
                                
                        arr.splice(this.state.rowId, 1)
            
                        UserDefaults.set(stringsUserDefaults.activenessLevel,
                          arr || '')
                     
                        })
                      }

                      else if( this.props.flag == 2 ){
                        UserDefaults.get(stringsUserDefaults.stressLevel).then((stressLevel)=> {
                          
                            arr = stressLevel ? stressLevel : [];
            
                            arr.splice(this.state.rowId, 1)

                          UserDefaults.set(stringsUserDefaults.stressLevel,
                            arr || '')
                       
                          })
            
                        }
         
            setTimeout(() => {
              this.props.getData(1)
            },500)
             this.props.closeModal()
          } else {
            this.loadingManipulate(false)
          }
        } else {
          this.loadingManipulate(false)
        }
      }).catch((error) => {
        this.loadingManipulate(false)
        console.error(error);
      })

    }).catch((error) => {
      this.loadingManipulate(false)
      console.error(error);
    })
  }
  
  renderModal(){

    this.setState({
      showModal:true,
      infoModal:true,
    })
  }
  
  renderRow(data, sectionId, rowId, highlightRow){
      
    return (
      <View style = {{flex:1}}>
         <Ripple                                         
            onPress={() => {
           this.setState({
             showModal:true,
             infoModal:true,
             selectedLevel:data.value,
             selectedDateTime:data.reportDate,
             selectedId: data._id,
             rowId:rowId
           })
            }}>
            <View style={{flexDirection: 'column', flex: 1}}>
            <View style={{flexDirection: 'row', flex: 1, padding: 16}}>
              <View style={{flex : 1}}>
                <Text style={{ fontFamily: 'Arial', fontSize: 16, color: '#515151'}}> {data.value}</Text>
                
              </View>
              <Text style={{ fontFamily: 'Arial', fontSize: 13}}>{moment(data.reportDate).format('Do MMM, YYYY')}</Text>
            </View>
            <View style={{height: 0.5, backgroundColor: '#DFDFDF'}}></View>
          </View>
      </Ripple>
      </View>

  )
}

    renderInfoModal(){

      return(
        <View style={{flexDirection: 'column', backgroundColor: '#ffffff', borderRadius: 6, padding: 24, margin: 40}}>
        <DialogHeader
        title={this.state.headerText}
        secondaryTitle={'Recorded Value'}/>
        <View>
          <View style={{paddingTop: 8, paddingBottom: 8}}>
            <View style={{paddingTop: 8, paddingBottom: 8}}>
              <Text style={{ fontFamily: 'Arial' ,fontSize: 16, color: this.state.theme}}>{this.state.selectedLevel}</Text>
              <Text style={{ fontFamily: 'Arial' ,fontSize: 12, paddingTop: 4}}>Value</Text>
            </View>
            <View style={{paddingTop: 8, paddingBottom: 8}}>
              <Text style={{ fontFamily: 'Arial' ,fontSize: 16, color: '#212121'}}>{moment(this.state.selectedDateTime).format('Do MMM, YYYY')}</Text>
              <Text style={{ fontFamily: 'Arial' ,fontSize: 12, paddingTop: 4}}>Date</Text>
            </View>
            <View style={{paddingTop: 8, paddingBottom: 8}}>
              <Text style={{ fontFamily: 'Arial' ,fontSize: 16, color: '#212121'}}>{moment(this.state.selectedDateTime).format('hh:mm a')}</Text>
              <Text style={{ fontFamily: 'Arial' ,fontSize: 12, paddingTop: 4}}>Time</Text>
            </View>

          </View>

          <View style={{flexDirection: 'row'}}>

            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showModal: false,
                  infoModal: false,
                })
              }}
              >
              <Text style={[CommonStyles.button_style, { paddingTop: 12, paddingBottom: 12, fontSize: 12}]}>CANCEL</Text>
            </TouchableOpacity>

            <TouchableOpacity

              onPress={() => {
              
                Alert.alert(
                     'Delete',
                     'Are you sure you want to delete this entry?',
                  [
                      {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: 'Yes', onPress: () => {
                        this.setState({
                          showModal: false,
                          infoModal: false,
                         
                          isLoading: true
                        })
                        setTimeout(() => {
                          this.deleteEntry()
                        }, 5000)
                      }}
                  ],
                    { cancelable: true }
                  )
              }}>
              <Text
                style={[CommonStyles.button_style, {
                  justifyContent: 'center',
                  paddingTop: 12,
                  paddingLeft:12,
                  paddingBottom: 12,
                  alignItems: 'center',
                  fontSize: 12
                }]}
              >DELETE</Text>
            </TouchableOpacity>
            <View style={{flex:1}}>
            </View>

            {(this.state.dialogAutomated === 1) ? (
              // <Text onPress={() => {
              //
              // }}  style={{flex:1, paddingTop: 12}}>View in Reports</Text>
              null
              )
              :
              (
              <View
                style={{paddingTop: 12, paddingBottom: 12, paddingLeft: 12}}></View>
              )
            }

          </View>

        </View>
      </View>
      )
    }

  render (){

    return (
   
   <View style = {{flex:1, bottom:Global.isIphoneX ? 35 : 0}}>
  <ScrollView 
   ref="scrollView"
   onScroll={this._onScroll}
   onContentSizeChange={(w, h) => {
    if (h > Global.screenHeight) {
      if(this.props.getSwipe){
        if(this.props.getSwipe()){
          this.props.setSwipe(false)
          this.setState({
            isVisible: true,
          })
          this.props.setScroll(true)
          this.refs.scrollView.scrollTo({x: 0, y: 6, animated: true});
          this.refs.scrollView.scrollTo({x: 0, y: 4, animated: true});
        }
      }
    }
  }}

  style={{flexDirection: 'column', backgroundColor: 'white'}}>
{/* HERE */}

<View style = {{ alignSelf:'center', marginTop:0,backgroundColor:this.state.theme, height:210, width:210, borderBottomLeftRadius:105,borderBottomRightRadius:105,transform:[{scaleX:3}]}}></View>

    <View style={{backgroundColor: this.state.theme, paddingBottom: 65, position:'absolute', width:Global.screenWidth }}>

      <CloseBar
        goBack={this.goBack}
        color={'white'}/>
          <Text style={{ fontFamily: 'Arial' ,fontSize: 32, fontWeight: 'bold', color: 'white', paddingLeft: 17, paddingRight: 17}}>{this.state.headerText}</Text>
          
    </View>

    

    <View style = {[{height:145, width:145, flex: 0, marginLeft: 20, marginRight: 20, marginBottom: 16, marginTop: -65, padding: 14, backgroundColor: 'white', borderRadius: 100, elevation: 2, borderColor:'#dfdfdf', borderWidth: 0.5, alignSelf:'center'}, CommonStyles.commonShadow]}>


    {(!this.state.stateRep) ?
  <View>
    <Text style={{ fontFamily: 'Arial' ,color: this.state.theme, fontSize: 18, textAlign:'center', marginTop:30, backgroundColor: 'rgba(0,0,0,0)'}}>{this.state.currentLevel}</Text>
    
    <View style={{height: 1, marginLeft: 0, marginRight: 0, marginTop: 15, marginBottom: 0,  backgroundColor: '#DFDFDF'}}/>

    <Text style={{color:'grey', fontFamily: 'Arial' ,fontSize: 16, paddingTop: 10,textAlign:'center', backgroundColor: 'rgba(0,0,0,0)'}}>{this.state.dataArray.length!=0? moment(this.state.dataArray[0].reportDate).format('Do MMM YYYY'): (null)}</Text>
  </View>
    :
   <View style = {{justifyContent:'center', alignSelf:'center', alignItems:'center', alignContent:'center'}}>
      <MaterialIcons
       name={(this.props.flag==1)?'directions-run':'whatshot'}
       size={90}
       style={{
         color: this.state.theme, backgroundColor:'rgba(0,0,0,0)', marginTop:10
       }}
     />
  </View>
}
    <View>      
      </View>  
        </View>
 
                      
                    <Text style={[styles.stats_header, {paddingTop: 0}]}>Description</Text>
                    <Text style={{paddingLeft: 16, paddingTop: 6, paddingRight: 16, paddingBottom: 6, color:'grey'}}>{this.state.descriptionText}</Text>

                      <View style = {{ marginTop:20, flex:1}}>  
                      
                        <ListHeader 
                        headerText= {'Your Recorded Levels'}/>
                        {(!this.state.emptyDataSource)?
                          <ListView
                          bounces={false}
                          style={{flexDirection: 'column', backgroundColor: 'white'}}
                          dataSource={this.state.dataSource}
                          renderRow={this.renderRow}/>
                        :

                        <View style = {{flex:1, alignItems:'center', margin:80}}>
                          <Text style = {{ fontSize:18, color:'grey'}}>No Recorded Data</Text>
                        </View>
                        }
                          
                        {/* <View style={{flex: 1}}></View> */}
                      </View>

                        
{(this.state.isLoading) ? (<ProgressBar/>) : (null)}

</ScrollView>

{this.state.isActionButtonVisible ?

  (<Ripple
    activeOpacity={0.7}
     style={{
       width: 60,
       height: 60,
       bottom:0.1,
       borderRadius: 30,
       position: 'absolute',
       bottom: 20,
      // right: 140,
       elevation:2,
       alignItems: 'center',
       justifyContent: 'center',
       alignSelf:'center',
      
     }}
    onPress={() => {
    //  this.checkCondition(0)
    this.setState({
      showModal:true,
      addModal:true
    })
    }}>
   <View style={[{
     width: 60,
     height: 60,
     borderRadius: 30,
     backgroundColor: this.state.theme,
     position: 'absolute',
     alignItems: 'center',
     justifyContent: 'center',
     elevation:2,
     bottom:0.1,
     borderColor:'#dfdfdf', borderWidth: 0, alignSelf:'center'}, CommonStyles.commonShadow]
   }>
     <MaterialIcons
       name={'add'}
       size={28}
       style={{
         color: 'white',
       }}
     />
   </View>
 </Ripple>) : (null) }  

 {(this.state.showModal)?
       <Modal
       style={{justifyContent: 'center', borderRadius: 6,backgroundColor: ' rgba(0, 0, 0, 0)'}}
       visible = {this.state.showModal}
       transparent = {true}
       animationType = {'fade'}
       >

    <View
    style= {{flex: 1, justifyContent: 'center',backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }}>

      {(this.state.infoModal) ?
          this.renderInfoModal()
              :
              (null)
            }

    {(this.state.addModal)?

    <View
    style= {{alignItems:'center',flex: 1, justifyContent: 'center'
    }}>
       <Demographics
       headerText = {(this.props.flag==1) ? 'Activeness Level' : 'Stress Level'}
       actualType= {(this.props.flag==1) ? 
        'Track your daily Activeness Level' : 'Track your daily Stress Level'}
       type = {( this.props.flag==1 ) ? 2 : 3}
       indicatorText = {(this.props.flag==1) ? 'Sedentary' : 'Rarely'}
       onPressAction={this.submitResponse}
       nextValue = {false}
       />   
     </View>  
      :
      (null)
    }
  {(this.state.addModal)?
    <TouchableOpacity
            activeOpacity={1.9}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              position: 'absolute',
              bottom: 20,
              backgroundColor:'red',
              elevation:2,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf:'center',

            }}
            onPress={() => {
            //  this.checkCondition(0)
            this.setState({
              showModal:false,
              addModal:false,
            })
            }}>
          <View style={[{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: this.state.theme,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            elevation:2,
            
            borderColor:'#dfdfdf', borderWidth: 0, alignSelf:'center'}, CommonStyles.commonShadow]
          }>
            <MaterialIcons
              name={'close'}
              size={24}
              style={{
                color: 'white'
              }}
            />
          </View>
        </TouchableOpacity>  :(null)}

    </View>

           </Modal>
           :
           (null)
           }

</View>
)
}


submitResponse(data){

  this.setState({isLoading:true})

  time = moment().format()
  currentTime = String(moment(time).utc().format(Global.LTHDateFormatMoment) + 'Z')

  dictId = (this.props.flag == 1) ? stringDictId.activenessLevel : stringDictId.stressLevel

  label = (this.props.flag == 1) ? 'activenessLevel':'stresslevel'



  UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
    var params = 'token='+ token
               + '&dictionaryId=' +  dictId
               + '&label=' + label
               + '&reportDate=' + currentTime
               + '&value=' + data
               + '&unit=' + '-'

    NetworkRequest(this, 'POST',URLs.saveTrackerData,params).then(result => {
      if(result.success){
        if((result.response.code || 0) === 200){
         
          this.setState({
            showModal:false, 
            isLoading:false,
            changesMadeTracker:1
          })
  
          //Save in async
          if(dictId  == stringDictId.activenessLevel) {

          UserDefaults.get(stringsUserDefaults.activenessLevel).then((activenessLevel)=> {
            
              arr = activenessLevel ? activenessLevel : [];
              obj = {reportDate: currentTime, value: data, _id: result.response._id}

            arr.splice(0, 0, obj)

            UserDefaults.set(stringsUserDefaults.activenessLevel,
              arr || '')
         
            })
          }

          else if(dictId == stringDictId.stressLevel ){
            UserDefaults.get(stringsUserDefaults.stressLevel).then((stressLevel)=> {
              
                arr =  stressLevel ? stressLevel : [];
                obj = {reportDate: currentTime, value: data}

              arr.splice(0, 0, obj)

              UserDefaults.set(stringsUserDefaults.stressLevel,
                arr || '')
           
              })

            }
            setTimeout(()=>{
          this.props.getData(1)
        }, 500)

          this.props.closeModal()
          console.log('Tracker Data saved')
        } else {
          this.loadingManipulate(false)
        }
      } else {
        this.loadingManipulate(false)
      }
    }).catch((error) => {
      this.loadingManipulate(false)
      console.error(error);
    })

  }).catch((error) => {
    this.loadingManipulate(false)
    console.error(error);
  })

      //   this.setState({
      //    
      //   })
      // 
    }
  
  
      _onScroll = (event) => {
        // Simple fade-in / fade-out animation
        const CustomLayoutLinear = {
          duration: 100,
          create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
          update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
          delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
        }
        // Check if the user is scrolling up or down by confronting the new scroll position with your own one
        var currentOffset = event.nativeEvent.contentOffset.y
        if(currentOffset < 5){
          this.props.setSwipe(true)
        }
        //  else {
        //   this.props.setSwipe(false)
        // }
        const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
          ? 'down'
          : 'up'
        // If the user is scrolling down (and the action-button is still visible) hide it
        const isActionButtonVisible = direction === 'up'
        if (isActionButtonVisible !== this.state.isActionButtonVisible) {
          LayoutAnimation.configureNext(CustomLayoutLinear)
          this.setState({ isActionButtonVisible })
        }
        // Update your scroll position
        this._listViewOffset = currentOffset
      }
  
}




const styles = StyleSheet.create({


  stats_header: {
   fontFamily: 'Arial',
   fontSize: 16,
   paddingLeft: 16,
   paddingTop: 0,
   fontWeight: '600',
   color: Color._4A
  },
 
});

