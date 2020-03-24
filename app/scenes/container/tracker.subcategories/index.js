
import React, { Component } from 'react'
import { Animated, Easing, View, Text,  ScrollView, Image, Modal} from 'react-native'
import { Global, Routes, NetworkRequest, URLs, UserDefaults, stringsUserDefaults} from '../../../utils'
import {ProgressBar} from '../../components'
import {Ripple, ModalBox} from '../../components'
import { CommonStyles } from '../../../utils'
import { HeaderListExtraLarge , StateRepresentation} from '../../layouts'
import {CloseBar} from '../../components'
import TrackerDetails from '../tracker.details'

import ListView from 'deprecated-react-native-listview';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
})

export default class TrackerSubCategories extends Component{
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0)
    this.state = {
      dataSource :  ds.cloneWithRows([]),
      dictionaryId : '',
      indexArray : [],
      isMultiValue: 0,
      categoryName: this.props.navigation.state.params.categoryName,
      description:  this.props.navigation.state.params.description,
      icon: this.props.navigation.state.params.icon,
      isStateRepFlag: false,
      isLoading: false,
      swipeToClose: true,
      isOpen: false,
      isScrollable: false
    }

    this.loadingManipulate = this.loadingManipulate.bind(this)
    this.setStateRep = this.setStateRep.bind(this)
    this.goback = this.goback.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onOpen = this.onOpen.bind(this)
    this.onClosingState = this.onClosingState.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.setSwipe = this.setSwipe.bind(this)
    this.getSwipe = this.getSwipe.bind(this)
    this.setScroll = this.setScroll.bind(this)
  }


  animate () {

    this.animatedValue.setValue(-250)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }
    ).start(()=>this.animate)

  }

  componentWillMount(){
    this.animate();
  }

  componentDidMount(){
    this.loadingManipulate(true)
    this.getData()
  }

  loadingManipulate(flag){
    this.setState({
      isLoading: flag
    })
  }

  goback(){
    this.props.navigation.goBack()
  }

  async getData(){
    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      let params = 'token=' + token
                  +' &categoryId=' + this.props.navigation.state.params.categoryId
      var _this = this
NetworkRequest(_this, 'POST',URLs.getManualTrackerSubCategories,params).then(result => {
        if(result.success){
          if((result.response.code || '') === 200) {
            this.setState({
              dataSource: ds.cloneWithRows(result.response.dictionaryList),
              isLoading: false
            })
          } else {
            this.loadingManipulate(false)
            this.setStateRep('Could not find any subcategories')
          }
        } else {
          this.loadingManipulate(false)
          this.setStateRep('Could not find any subcategories')
        }
      }).catch(error => {
        this.loadingManipulate(false)
        this.setStateRep('Could not find any subcategories')
        console.error(error);
      })

    }).catch((error) => {
      this.loadingManipulate(false)
      console.error(error);
    })
  }

  _renderRow(item,secId,rowId){
    return (
      <Ripple
        activeOpacity={0.4}
        onPress={() => {
          for(i = 0 ; i < item.referenceDict.length; i++){
            this.state.indexArray.push(item.referenceDict[i].index)
          }
          this.setState({
            dictionaryId: item.testDict.id,
            isMultiValue : item.testDict.isMultiValue,
            isOpen: true
          })
          // this.gotoTrackerDetails()
        }}>
        <View style={{justifyContent: 'center'}}>
          <Text style={{padding:16, color: Color._4A}}>{item.testDict.name}</Text>
        </View>
         <View style={{height : 0.5, backgroundColor : '#DFDFDF'}}></View>
      </Ripple>
    )
  }

  gotoTrackerDetails(){
    setTimeout(() => {this.props.navigation.navigate(Routes.trackerDetailsScreen, {
      dictionaryId : this.state.dictionaryId,
      indexArray: this.state.indexArray,
      isMultiValue : this.state.isMultiValue,
      refreshComponent: this.props.navigation.state.params.refreshComponent
    })},50)
  }

  setStateRep(msg){
    this.setState({
      isStateRepFlag : true
    })
  }

  onClose() {
    this.closeModal()
    console.log('Modal just closed');
  }
  onOpen() {
    console.log('Modal just openned');
  }
  onClosingState(state) {
     console.log('the open/close of the swipeToClose just changed');
  }

  closeModal(){
    this.setState({
      isOpen: false,
      isScrollable: false,
      swipeToClose: true
    })
  }

  getSwipe(){
    return this.state.swipeToClose
  }

  setSwipe(flag){
    this.setState({
      swipeToClose: flag
    })
  }

  setScroll(flag){
    this.setState({
      isScrollable: flag
    })
  }


  render(){

    const marginLeft = this.animatedValue.interpolate({
      inputRange: [0, 3],
      outputRange: [0, 2]
    })
    
    return(
      <ScrollView
        bounces={false}>
        <View style={{backgroundColor: '#FFFFFF', height :Global.screenHeight}}>
        <Animated.View
          style = {{left:marginLeft, marginLeft:-5}}
       
        >   
        <CloseBar
          icon = 'arrow-back'
          goBack={this.goback}
          color={'black'}
        />
        </Animated.View>
        {(this.state.isStateRepFlag)
          ?
          (
            <StateRepresentation
            image='search'
            description= 'Could not find any subcategories'></StateRepresentation>
          )
          :
          (
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', flex: 0,alignItems: 'center',paddingRight: 16,justifyContent: 'center'}}>
              <HeaderListExtraLarge
                header={this.state.categoryName}
                description={this.state.description}
                style={{paddingTop: 0}}
              ></HeaderListExtraLarge>
              <Image
                  source={{uri: (URLs.fileDownloadPath + this.state.icon)}}
                  style={{ height : 60, width : 60}}
              />
            </View>
            <ListView
              bounces={false}
              style={{flex:1}}
              enableEmptySections={true}
              dataSource={this.state.dataSource}
              renderRow={(item,secId,rowId) => this._renderRow(item,secId,rowId)}></ListView>
            </View>
            )
        }
            {(this.state.isLoading) ? (<ProgressBar/>) : (null)}

            {(this.state.isOpen)
              ?
            (
              // <Modal
              //  animationType={'none'}
              //  transparent={true}
              //  visible={this.state.isOpen}
              //  onRequestClose = {() => {
              //    this.closeModal()
              //  }}
              //  >
              <ModalBox
                 style={[styles.modal, styles.modal1]}
                 ref={"modal1"}
                 swipeThreshold={200}
                 swipeArea={Global.screenHeight}
                 isOpen={this.state.isOpen}
                 swipeToClose={this.state.swipeToClose}
                 onClosed={this.onClose}
                 position={'top'}
                 keyboardTopOffset={Global.iOSPlatform ? 22 : 0}
                 onOpened={this.onOpen}
                 onClosingState={this.onClosingState}
                 setSwipe={this.setSwipe}
                 getSwipe={this.getSwipe}
                 coverScreen={true}
                 isScrollable={this.state.isScrollable}>

                 <TrackerDetails
                   dictionaryId= {this.state.dictionaryId}
                   indexArray= {this.state.indexArray}
                   isMultiValue= {this.state.isMultiValue}
                   refreshComponent= {this.props.navigation.state.params.refreshComponent}
                   closeModal={this.closeModal}
                   setScroll={this.setScroll}
                   getSwipe={this.getSwipe}
                   setSwipe = {this.setSwipe}/>

              </ModalBox>
            // </Modal>
          ) : (null)}
        </View>
      </ScrollView>
    )
  }
}
