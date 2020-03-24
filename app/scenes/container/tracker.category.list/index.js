
import React, { Component } from 'react'
import { Animated,View, Text,  Image, TextInput, ScrollView, Easing } from 'react-native'

import { URLs, Routes, UserDefaults, stringsUserDefaults, NetworkRequest, CommonStyles, Global, Color } from '../../../utils'
import { HeaderListExtraLarge, StateRepresentation } from '../../layouts'
import {ProgressBar} from '../../components'
import {Ripple} from '../../components'
import {CloseBar, ModalBox} from '../../components'
import TrackerDetails from '../tracker.details'
import { connect } from 'react-redux'
import {setUnreadFlag, setDemographics} from '../../../redux/actions/index'
import ListView from 'deprecated-react-native-listview';


const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
})

 class TrackerCategories extends Component {
  constructor() {
      super();
      this.animatedValue = new Animated.Value(0)

      this.state={
        dataSource : ds.cloneWithRows([]),
        categoryList: [],
        searchedString : '',
        selected_categoryId : 0,
        selected_description: '',
        selected_categoryName: '',
        selected_icon:  '',
        isSearchedFlag : 0,
        dictionaryId:0,
        isStateRepFlag: false,
        isLoading: false,
        swipeToClose: true,
        isOpen: false,
        isScrollable: false
      }
      this._renderRow = this._renderRow.bind(this)
      this.goToTrackerSubCat = this.goToTrackerSubCat.bind(this)
      this.gotoTrackerDetails = this.gotoTrackerDetails.bind(this)
      this.loadingManipulate = this.loadingManipulate.bind(this)
      this.goback = this.goback.bind(this)
      this.setStateRep = this.setStateRep.bind(this)

      this.onClose = this.onClose.bind(this)
      this.onOpen = this.onOpen.bind(this)
      this.onClosingState = this.onClosingState.bind(this)
      this.closeModal = this.closeModal.bind(this)
      this.setSwipe = this.setSwipe.bind(this)
      this.getSwipe = this.getSwipe.bind(this)
      this.setScroll = this.setScroll.bind(this)
  }

  componentWillMount(){
    this.animate();
  }

  componentDidMount(){
  
    this.props.setDemographics({screen:0})
    this.loadingManipulate(true)
   
    this.getData()
  }

  animate () {

    this.animatedValue.setValue(-250)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        spring:10
      }
    ).start(()=>this.animate)

  }

  componentWillUnmount(){
    this.props.setDemographics({screen:1})
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
      let params = 'token=' + token || ''
      var _this = this
NetworkRequest(_this, 'POST',URLs.getManualTrackerCategories,params).then(result => {
        if(result.success){
          if((result.response.code || '') === 200){
            this.setState({
              dataSource: ds.cloneWithRows(result.response.allCategories),
              categoryList: result.response.allCategories,
              isSearchedFlag : 0,
              isLoading: false
            })
          } else {
            this.loadingManipulate(false)
            this.setStateRep('No Results found')
          }
        } else {
          this.loadingManipulate(false)
          this.setStateRep('No Results found')
        }
      }).catch((error) => {
        this.loadingManipulate(false)
        this.setStateRep('No Results found')
        console.error(error);
      })

    }).catch((error) => {
      this.loadingManipulate(false)
      console.error(error);
    })
  }

  searchTrackers(text){
    if(text){
      if(text.length > 2){
        this.getSearchedData(text)
      } else {

      }
    } else {
      this.setState({
        dataSource : ds.cloneWithRows(this.state.categoryList),
        isSearchedFlag : 0,
        isStateRepFlag: false
      })
    }
  }

  async getSearchedData(text){
    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      let params = 'token=' + token
                  +'&query=' + text
      var _this = this
NetworkRequest(_this, 'POST',URLs.searchManualTracker,params).then(result => {
        if(result.success){
          if(result.response.code === 200){
            if(result.response.data.length > 0){
              this.setState({
                dataSource :ds.cloneWithRows(result.response.data),
                isSearchedFlag : 1,
                isStateRepFlag : false
              })
            } else {
              this.setStateRep('There are no entries for your query')
            }

          } else if (result.response.code === 500) {
            this.setStateRep('Something went wrong')
          }
        } else {
            this.setStateRep('Something went wrong')
        }

      }).catch((error) => {
        this.setStateRep('Something went wrong')
        console.error(error);
      })

    }).catch((error) => {
      console.error(error);
    })
  }

  setStateRep(msg){
    this.setState({
      isStateRepFlag : true
    })
  }

  _renderRow(item,secId,rowId){
    var finalElement = this.state.isSearchedFlag === 0
      ? (<Ripple

        key={rowId + secId}
        onPress={() => {
          this.setState({
            selected_categoryId : item.id,
            selected_categoryName: item.categoryName,
            selected_description: item.description,
            selected_icon : item.icon
          })
          this.goToTrackerSubCat()
        }}>  
          <View style={{flexDirection:'column'}} >
              <View style={{flexDirection:'row', flex : 1, alignItems: 'center', padding: 16}} >
                <Image
                    source={{uri: (URLs.fileDownloadPath + item.icon)}}
                    style={{ height : 40, width : 40}}
                />
                <Text style={[CommonStyles.common_text_style, {padding: 0}]}>{item.categoryName}</Text>
              </View>
              <View style={{height: 0.5, backgroundColor: '#DFDFDF'}}></View>
          </View>
      </Ripple>
      ) : (
        <Ripple

          key={rowId + secId}
          onPress={() => {
            this.setState({
              dictionaryId : item.id,
              isMultiValue : item.isMultiValue,
              isOpen: true
            })
            // this.gotoTrackerDetails()
          }}>
        <View>
          <Text style={{ fontFamily: 'Arial' ,flex : 1,backgroundColor: 'white', height : 50,fontSize: 16 , justifyContent: 'center',alignItems: 'center',paddingLeft: 16, paddingTop : 12, color: Color._4A}}>{item.name}</Text>
          <View style={{height: 0.5, backgroundColor: '#DFDFDF'}} />
        </View>
      </Ripple>
      )

    return finalElement
  }

  gotoTrackerDetails(){
    setTimeout(() => {this.props.navigation.navigate(Routes.trackerDetailsScreen, {
      dictionaryId : this.state.dictionaryId,
      refreshComponent: this.props.navigation.state.params.refreshComponent
    })},50)
  }

  goToTrackerSubCat(categoryId){
    setTimeout(() => {this.props.navigation.navigate(Routes.trackerSubCategoryScreen, {
      categoryId: this.state.selected_categoryId,
      categoryName: this.state.selected_categoryName,
      description: this.state.selected_description,
      icon: this.state.selected_icon,
      refreshComponent: this.props.navigation.state.params.refreshComponent
    })},50)

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
      <View style={{backgroundColor: '#FFFFFF',flex:1}}>
        <ScrollView>
       <Animated.View
       style = {{left:marginLeft, marginLeft:-5}}
       
        >   
        <CloseBar
          icon = 'arrow-back'
          goBack={this.goback}
          color={'black'}
        />
        </Animated.View>
        <HeaderListExtraLarge
          header='Health Categories'
          description='All the health parameters can be found here'
          style={{flex: 0,paddingTop: 0}}
        ></HeaderListExtraLarge>
        <TextInput
          style={{marginLeft : 16, marginRight: 16, marginBottom: 16, height: 50}}
          onChangeText={(text) => this.searchTrackers(text)}
          placeholder = 'Choose trackers'/>
        {
        (this.state.isStateRepFlag)
          ?
          (
            <StateRepresentation
            image='search'
            description= 'Could not find any categories'></StateRepresentation>
          )
          :
          (
            <ListView
              bounces={false}
              enableEmptySections
              dataSource={this.state.dataSource}
              renderRow={(item,secId,rowId) => this._renderRow(item,secId,rowId)}></ListView>
          )
        }
        {(this.state.isLoading) ? (<ProgressBar/>) : (null)}

        {(this.state.isOpen)
          ?
        (
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
      ) : (null)}
      </ScrollView>
      </View>
    )
  }


}


function mapDispatchToActions (dispatch) {
  return {
    
    setDemographics : arr => dispatch(setDemographics(arr)),
    setUnreadFlag: num => dispatch(setUnreadFlag(num)),

  }
}

const mapStateToProps = state => ({
  demographics: state.demographics,
})

export default connect(mapStateToProps, mapDispatchToActions)(TrackerCategories)

