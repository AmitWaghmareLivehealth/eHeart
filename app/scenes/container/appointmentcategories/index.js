import React, {
  Component,
  PropTypes,
} from 'react';

import {
  View,
  Text,
  TextInput,
  Image,
  PermissionsAndroid,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { ProgressBar, Ripple, SearchBox} from '../../components'
import { HeaderListExtraLarge, StateRepresentation } from '../../layouts'
import { URLs, Routes, Images, Color, Global, NetworkRequest, UserDefaults,LocationManager, stringsUserDefaults, CommonStyles} from '../../../utils'
var _ = require('lodash')
import ListView from 'deprecated-react-native-listview';
import Geolocation from '@react-native-community/geolocation';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
})

var appointment_bundle = {
  latlng : '',
  city: '',
  isHomecollection : 0,
  labTestListId : 0,
  isPayAtCenter : 0,
  isStarredLab : 0,
  paymentType : 0,
  couponCode : '',
  amountPaid : '',
  comments : '',
  totalAmount : '',
  transactions : '',
  bookingDate: '',
  token : '',
  startDate : '',
  endDate : '',
  paymentId:'',
  address : '',
  zipCode: ''
}

export default class AppointmentCategories extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataSource : ds.cloneWithRows([]),
      isSearchedFlag: false,
      selected_categoryId : 0,
      selected_categoryName: '',
      selected_description: '',
      selected_icon : '',
      dataSource: ds.cloneWithRows([]),
      categoryList: [],
      isClose: false,
      latitude: null,
      longitude: null,
      error: null,
      currentCategoryId: 0,
      currentCategoryName:'',
      currentCategoryDescription:'',
      currentCategoryicon:'',
      locationName : this.props.navigation.state.params.locationName,
      latlng : '',
      city:'',
      formattedAddress: this.props.navigation.state.params.formattedAddress,
      appointment_bundle : appointment_bundle,
      cartData: {},
      cartCount: 0,
      // query: ''
    };

    this.getData = this.getData.bind(this)
    this.searchCategory = this.searchCategory.bind(this)
    this.gotoTestScreen = _.debounce(this.gotoTestScreen.bind(this), 200)
    this.afterClear = this.afterClear.bind(this)
    this.requestLocationPermission = this.requestLocationPermission.bind(this)
    this.updateLocation = this.updateLocation.bind(this)
  }

  componentDidMount(){
    if(this.state.locationName){
      this.state.appointment_bundle.address = this.state.locationName.formattedAddress
    } else {
      this.state.appointment_bundle.address = this.state.formattedAddress
    }
    this.loadingManipulate(true)
    this.getData()
  }

  loadingManipulate(flag ){
    this.setState({
      isLoading: flag
    })
  }

  updateLocation(locationName){
    this.setState({
      locationName: locationName
    })
    console.log('FINAL RESULT : ', locationName);
  }

  async requestLocationPermission() {
    try {
      if(Global.iOSPlatform){
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
            });
            LocationManager.getNameFromLocation(position.coords.latitude, position.coords.longitude, this.updateLocation)
          },
          (error) => {
            this.setState({
            error: error.message
           })
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
        );
      } else {
        if(Global.osVersion){
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          ).then((granted) => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                  });
                  LocationManager.getNameFromLocation(position.coords.latitude, position.coords.longitude, this.updateLocation)
                },
                (error) => this.setState({ error: error.message }),
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
              );
            } else {
              console.log("Location permission denied")
            }
          }).catch((error) => {
            console.error(error);
          })
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
              });
              LocationManager.getNameFromLocation(position.coords.latitude, position.coords.longitude, this.updateLocation)
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
          );
        }
      }
    } catch (err) {
      console.warn(err)
    }
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchId);
  }

  gotoTestScreen(){
    var latlng = ''
    var locationName = this.state.locationName
    var latlng = locationName.latitude + ',' + locationName.longitude
    var city = locationName.city
    var zipCode = locationName.postalCode

    this.state.appointment_bundle.latlng = latlng
    this.state.appointment_bundle.city = city
    this.state.appointment_bundle.zipCode = zipCode
    UserDefaults.set(stringsUserDefaults.appointment_bundle, this.state.appointment_bundle)

    this.props.navigation.navigate(Routes.testScreen, {
      categoryId: this.state.selected_categoryId,
      categoryName: this.state.selected_categoryName,
      description: this.state.selected_description,
      icon: this.state.selected_icon,
      categoryList : this.state.categoryList,
      location: this.state.locationName,
      latlng: latlng,
      city: city,
      cartData: this.state.cartData,
      cartCount: this.state.cartCount
    })

  }

  async getData(){
    var locationName = this.state.locationName
    var latlng = locationName.latitude + ',' + locationName.longitude
    var city = locationName.city

    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      let params = 'token=' + (token || '')
                 + '&latlng=' + (latlng || '')
                 + '&city=' + (city || '')
      var _this = this
NetworkRequest(_this, 'POST', URLs.getBookingCategories,params).then(result => {
        if(result.success){
          if((result.response.code || 0) === 200){
            if(result.response.allCategories.length > 0){
              this.setState({
                dataSource: ds.cloneWithRows(result.response.allCategories),
                categoryList: result.response.allCategories,
                isSearchedFlag: false,
                isLoading: false,
              })
            } else {
              this.setState({
                isSearchedFlag: false,
                isStateRepFlag: true,
                isLoading: false
              })
            }

            try {
              this.state.appointment_bundle.labTestListId = result.response.labId
              this.state.appointment_bundle.isStarredLab = result.response.isStarredLab
            } catch(error){
              console.error(error);
            }

            console.log("SUCCESS");
          } else if((result.response.code || 0) === 500){
            this.setState({
              isSearchedFlag: false,
              isStateRepFlag: false
            })
            console.log("FAILURE");
            this.loadingManipulate(false)
          } else {
            this.setState({
              isSearchedFlag: false,
              isStateRepFlag: false
            })
            this.loadingManipulate(false)
          }
        }
      }).catch((error) => {
        this.setState({
          isSearchedFlag: false,
          isStateRepFlag: false
        })
        this.loadingManipulate(false)
        console.error(error);
      })

    }).catch((error) => {
      this.setState({
        isSearchedFlag: false,
        isStateRepFlag: false
      })
      this.loadingManipulate(false)
      console.error(error);
    })
  }

  searchCategory(query : String){
    if(query.length > 3){
      UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
        let params = 'token=' + (token || '')
                   + '&query=' + (query || '')
                   + '&labId=' + (this.state.appointment_bundle.labTestListId || '')
        var _this = this
NetworkRequest(_this, 'POST', URLs.searchTests,params).then(result => {
          if(result.success){
            if((result.response.code || 0) === 200){
              if(result.response.data.length > 0){
                this.setState({
                  dataSource: ds.cloneWithRows(result.response.data),
                  isSearchedFlag: true,
                  isStateRepFlag: false,
                  currentCategoryId: result.response.categoryId,
                  currentCategoryName:result.response.categoryName,
                  currentCategoryDescription:result.response.description,
                  currentCategoryicon:result.response.icon
                })
              } else {
                this.setState({
                  isSearchedFlag: true,
                  isStateRepFlag: true
                })
              }
              console.log("SUCCESS");
            } else if((result.response.code || 0) === 500){
              console.log("FAILURE");
              this.setState({
                isSearchedFlag: true,
                isStateRepFlag: true
              })
              this.loadingManipulate(false)
            } else {
              this.setState({
                isSearchedFlag: true,
                isStateRepFlag: true
              })
              this.loadingManipulate(false)
            }
          }
        }).catch((error) => {
          this.setState({
            isSearchedFlag: true,
            isStateRepFlag: true
          })
          this.loadingManipulate(false)
          console.error(error);
        })

      }).catch((error) => {
        this.setState({
          isSearchedFlag: true,
          isStateRepFlag: true
        })
        this.loadingManipulate(false)
        console.error(error);
      })
    } else {
        this.setState({
          dataSource : ds.cloneWithRows(this.state.categoryList),
          isSearchedFlag: false,
          isStateRepFlag: false
        })
    }
  }

  afterClear(){
    this.setState({
      dataSource: ds.cloneWithRows(this.state.categoryList),
      isSearchedFlag: false
    })
  }

  _renderRow(item,secId,rowId){
    return (
      (this.state.isSearchedFlag)
      ?
      (
        <Ripple

          key={rowId + secId}
          onPress={() => {
            var cartData = this.state.cartData
            var cartCount = this.state.cartCount
            var editCart = false
            var isOpen = false

            if (!(item.testID in cartData)){
              var array = []
              array.push(item)
              cartData[item.testID] = array
              cartCount += 1
            }
            this.setState({
              cartData : cartData,
              cartCount: cartCount,
              selected_categoryId : this.state.currentCategoryId,
              selected_categoryName: this.state.currentCategoryName,
              selected_description: this.state.currentCategoryDescription,
              selected_icon : this.state.currentCategoryicon
            })

            this.gotoTestScreen()
          }}>
        <View>
          <Text style={{ fontFamily: 'Arial' ,flex : 1,backgroundColor: 'white', height : 50,fontSize: 16 , justifyContent: 'center',alignItems: 'center',paddingLeft: 16, paddingTop : 12, color: Color._4A}}>{item.testName}</Text>
          <View style={{height: 0.5, backgroundColor: '#DFDFDF'}} />
        </View>
      </Ripple>
      )
      :
      (<Ripple

        key={rowId + secId}
        onPress={() => {
          this.setState({
            selected_categoryId : item.id,
            selected_categoryName: item.categoryName,
            selected_description: item.description,
            selected_icon : item.icon
          })
          this.gotoTestScreen()
        }}>
          <View style={{flexDirection:'column', padding: 8}} >
              <View style={{flexDirection:'row', flex : 1, alignItems: 'center', padding: 16}} >
                <Image
                    source={{uri: (URLs.fileDownloadPath + item.icon)}}
                    style={{ height : 50, width : 50}}
                />
                <View style={{paddingRight: 12, flex: 1}}>
                  <Text style={{fontSize: 20, color: Color._4A, paddingLeft: 16, paddingBottom : 8}}>{item.categoryName}</Text>
                  <Text style={{paddingLeft: 16, fontSize: 15}} numberOfLines={2} ellipsizeMode={'tail'}>{item.description}</Text>
                </View>
              </View>
          </View>
          <View style={{height: 0.6, backgroundColor: '#DFDFDF', marginLeft: 16, marginRight: 16}}></View>
      </Ripple>)
    )
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white',marginTop: Global.isIphoneX ? 30: 0}}>
       <ScrollView>
        <HeaderListExtraLarge
          header='Health Screenings'
          description='Select and book lab & diagnostic tests'
          style={{flex: 0}}
        ></HeaderListExtraLarge>

        <SearchBox
          search={this.searchCategory}
          afterClear={this.afterClear}
        />

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
        </ScrollView>
      </View>
    );
  }

}
