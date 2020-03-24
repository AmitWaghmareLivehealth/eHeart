import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableHighlight, TouchableOpacity} from 'react-native'

import { Color, Global ,stringReportStages, stringReportStatus, UserDefaults, stringsUserDefaults, NetworkRequest, URLs , stringRazorPay} from '../../../utils'
import RazorpayCheckout from 'react-native-razorpay';
import { ProgressBar, Ripple} from '../../components'
import CloseBar from '../../components/closebar'
import moment from 'moment'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux'

class PendingReportView extends Component{

  constructor(props){
    super(props);
    var reportStatus = ''
    var percentage = 1
    var num_reportStatus = this.props.pending_report.reportStatus
    if(num_reportStatus === 5){
      reportStatus = stringReportStatus.report_registered
      percentage = 0.25
    } else if(num_reportStatus === 4){
      reportStatus = stringReportStatus.report_processing
      percentage = 0.5
    } else if(num_reportStatus === 3){
      reportStatus = stringReportStatus.report_pending
      percentage = 0.75
    } else if(num_reportStatus === 2){
      reportStatus = stringReportStatus.report_completed
      percentage = 1
    }
    
    this.state={
      testArray :  this.props.pending_report.pendingReports || [],
      amount : this.props.pending_report.amount || 0,
      labName : this.props.pending_report.labName || '',
      labId:  this.props.pending_report.labId || '',
      reportDate: this.props.pending_report.reportDate || '',
      billId:  this.props.pending_report.billId || 0,
      reportStatus: reportStatus || '',
      percentage: percentage,
      num_reportStatus: num_reportStatus,
      email: '',
      contact: '',
      user_id: 0,
      userDetailsId_id: 0,
      uuid: '',
      isLoading: false,
      countryCode: this.props.pending_report.pendingReports[0].labForId.countryCode || 91
    }
    this.getTest = this.getTest.bind(this)
    this.getData = this.getData.bind(this)
    this.paymentSuccess = this.paymentSuccess.bind(this)
    this.guid = this.guid.bind(this)
    this.paymentCheck = this.paymentCheck.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.getOrderId = this.getOrderId.bind(this)
    this.openRazorPay = this.openRazorPay.bind(this)
  }

  componentDidMount(){
    this.getData()
    try{
      this.props.setSwipe(false)
      this.props.setScroll(true)
      this.refs.scrollView.scrollTo({x: 0, y: 5, animated: true});
    } catch(error){console.error(error);}

  }


    onScroll (event) {
      if(event.nativeEvent.contentOffset.y  < 5){
        console.log('set swipe TRUE onScroll');
        this.props.setSwipe(true)
      }
    }

  getData(){
    UserDefaults.get(stringsUserDefaults.user).then((user) => {
      if(user){
        this.setState({
            email: user.user.email || '',
            contact: user.contact || '',
            user_id: user.user.id || 0,
            userDetailsId_id: user.id || 0
        })
      }
    }).catch((error) => {
      console.error(error);
    })

    var uuid = this.guid()
    this.setState({
      uuid: uuid
    })
  }

  getTest(){
    var row = []
    var testArray = this.state.testArray
    // if ((userReportRelation_for_population.getReportStatus() == 1) || (userReportRelation_for_population.getReportStatus() == 2))
    for(i = 0 ; i < testArray.length ; i++ ){
      row.push(
        <View key={i}>
          <Text style={{ fontFamily: 'Arial' ,paddingTop: 16,paddingBottom:16}}>{testArray[i].reportName}</Text>
          <View style={{height: 0.5, backgroundColor: Color._DF}}></View>
        </View>
      )
    }
    return(<View>{row}</View>)
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  async paymentCheck(isComplete, isFailed){
    var timeStamp = moment().format(Global.LTHDateFormatMoment) + 'Z'
      UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
        let params = 'token=' + (token || '')
                  +  '&id=' + (this.state.uuid || '')
                  +  '&user_id=' + (this.state.user_id || '')
                  +  '&userDetailsId_id=' + (this.state.userDetailsId_id || '')
                  +  '&amount=' + (this.state.amount || 0)
                  +  '&labId=' + (this.state.labId || 0)
                  +  '&labName=' + (this.state.labName || '')
                  +  '&source=' + (Global.iOSPlatform ? 'iOS' : 'Android')
                  +  '&isReport=' + 1
                  +  '&isAppointment=' + 0
                  +  '&isHomeCollection=' + 0
                  +  '&isComplete=' + isComplete
                  +  '&isFailed=' + isFailed
                  +  '&activityDate=' + (timeStamp || '')


        var _this = this
        NetworkRequest(_this, 'POST', URLs.trackPayments ,params).then(result => {

        }).catch((error) => {
          console.error(error);
        })

      }).catch((error) => {
        console.error(error);
      })
  }

  async paymentSuccess(paymentId, order_id){
    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      let params = 'token=' + (token || '')
                +  '&paymentId=' + (paymentId || '')
                +  '&order_id=' + (order_id || '')
                +  '&billId=' + (this.state.billId || 0)
      var _this = this
NetworkRequest(_this, 'POST', URLs.razorpayReportCaptureApp,params).then(result => {
        if(result.success){
          if((result.response.code || 0) === 200){
            this.props.getData()
            console.log("SUCCESS")
            try {
              setTimeout(() => {
                this.props.closeModal()
              },300)
            } catch(error){console.error(error)}
          } else if((result.response.code || 0) === 500){
            if(this.props.loadingManipulate){
              this.props.loadingManipulate(false)
            }
            console.log("FAILURE");
          } else {
            if(this.props.loadingManipulate){
              this.props.loadingManipulate(false)
            }
          }
        }
      }).catch((error) => {
        if(this.props.loadingManipulate){
          this.props.loadingManipulate(false)
        }
        console.error(error);
      })

    }).catch((error) => {
      if(this.props.loadingManipulate){
        this.props.loadingManipulate(false)
      }
      console.error(error);
    })
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

  openRazorPay(order_id){
    console.log(order_id);
    var timeStamp = moment().format(Global.LTHDateFormatMoment) + 'Z'
    var options = {
      description: '',
      image: URLs.getLivehealthLogo,
      currency: 'INR',
      key: stringRazorPay.razorpayKey,
      // key: 'rzp_test_MdhWQeMJTkdfz0',
      amount: (this.state.amount * 100),
      name: this.state.labName,
      notes: {
        billId: this.state.billId,
        isProvider:'0',
        id: (this.state.uuid || ''),
        user_id: (this.state.user_id || ''),
        userDetailsId_id: (this.state.userDetailsId_id || ''),
        amount: (this.state.amount || 0),
        labId: (this.state.labId || 0),
        labName: (this.state.labName || ''),
        source: (Global.iOSPlatform ? 'iOS' : 'Android'),
        isReport: 1,
        isAppointment: 0,
        isHomeCollection: 0,
        isComplete: 0,
        isFailed: 0,
        activityDate: (timeStamp || ''),
      },
      prefill: {
        email: this.state.email,
        contact: this.state.contact,
      },
      theme: {color: Color.themeColor}
    }
    RazorpayCheckout.open(options).then((data) => {
      // handle success
      if(this.props.loadingManipulate){
        this.props.loadingManipulate(true)
      }
      this.paymentSuccess(Global.iOSPlatform ? data.razorpay_payment_id : data.details.razorpay_payment_id, order_id)
      this.paymentCheck(1,0)
      // alert(`Success: ${data.details.razorpay_payment_id}`);
    }).catch((error) => {
      // handle failure
      console.log('OPTIONS',options);
      this.paymentCheck(0,1)
      alert(`Error: ${error.code} | ${error.description}`);
    });

  }

  getOrderId(){
    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      let params = 'token=' + (token || '')
                +  '&isReport=' + 1
                +  '&amount=' + (this.state.amount || 0)
                +  '&billId=' + (this.state.billId || '')

      var _this = this
      NetworkRequest(_this, 'POST', URLs.createNewOrder ,params).then(result => {
        if(result.success){
          if((result.response.code || 0) === 200){
            this.setState({
              isLoading: false
            })
            setTimeout(() => {
              this.openRazorPay(result.response.order_id)
            },50)
          } else {
            this.setState({
              isLoading: false
            })
            this.paymentCheck(0,1)
          }
        } else {
          this.setState({
            isLoading: false
          })
          this.paymentCheck(0,1)
        }

      }).catch((error) => {
        this.setState({
          isLoading: false
        })
        console.error(error);
      })

    }).catch((error) => {
      this.setState({
        isLoading: false
      })
      console.error(error);
    })
  }

  render(){
    return(
      <View style={{flex : 1}}>
      <ScrollView
        bounces={false}
        ref="scrollView"
        onScroll={this._onScroll}
        style={{backgroundColor: 'white'}}
        onScroll={this.onScroll}>
          <CloseBar
            goBack={ () => {this.props.closeModal()}}
            style={{backgroundColor: 'white', flex: 0 }}/>
          <View style={{paddingLeft: 17, paddingRight: 17, paddingBottom: 17, backgroundColor: 'white'}}>
            <Text style={{ fontFamily: 'Arial' ,color: Color._9F, fontSize: 14, paddingTop:8, paddingBottom:8}}>Status of recently done tests</Text>
            <Text style={{ fontFamily: 'Arial' ,color: Color._36, fontSize: 18, paddingBottom:8}}>{this.state.labName}</Text>
            <Text style={{ fontFamily: 'Arial' ,color: Color._9F, fontSize: 14, paddingBottom:12}}>{this.state.reportDate}</Text>

            {(this.state.amount !== 0)
            ?
            (
                <Ripple onPress={() => {
                    this.paymentCheck(0,0)
                    this.setState({
                      isLoading: true
                    })
                    this.getOrderId()
                  }}>
                <View style={{flexDirection: 'row', borderRadius: 4, borderColor: Color.pay_orange_border, borderWidth: 1 ,padding: 12,backgroundColor: Color.pay_orange}}>
                  <Text style={{ fontFamily: 'Arial' ,flex:1}}>Payment Due of {this.props.currency.currency} {this.state.amount}</Text>
                  {this.state.countryCode == 91 ?
                    <Text style={{ fontFamily: 'Arial' ,color: Color.theme_blue, fontWeight: '700'}}>PAY NOW</Text> : (null)
                  }
                </View>
              </Ripple>
            )
            : (null)}


            <View style={{height: 0.5, backgroundColor: Color._DF, marginTop: 12, marginBottom: 12}}></View>

            <Text style={{ fontFamily: 'Arial' ,color: Color._36, fontSize: 14, paddingBottom: 12, fontSize: 16}}>Status: {this.state.reportStatus}</Text>

            <View style={{marginBottom:12,flex: 1}}>
              <View style={{flexDirection :'column', height : (650 - 200)}}>
                <View style={{flex:1}}>
                  <View style={{flexDirection: 'row'}}>
                    <View>
                      <View style={{backgroundColor: (this.state.num_reportStatus <= 5) ? (Color.pending_selected_color) : (Color.pending_color_neutral), borderRadius: 70, height: 13, width: 13}}></View>
                      <View style={{flex:1, padding:3}}></View>
                    </View>
                    <View style={styles.pending_view_style}>
                      <Text style={styles.pending_header_style}>{stringReportStatus.report_registered}</Text>
                      <Text style={{fontFamily: 'Arial'}}>{stringReportStages.txt_report_registered}</Text>
                    </View>
                  </View>
                </View>

                <View style={{flex:1}}>
                  <View style={{flexDirection: 'row'}}>
                    <View>
                      <View style={{backgroundColor: (this.state.num_reportStatus <= 4) ? (Color.pending_selected_color) : (Color.pending_color_neutral), borderRadius: 70, height: 13, width: 13}}></View>
                      <View style={{flex:1, padding:3}}></View>
                    </View>
                    <View style={styles.pending_view_style}>
                      <Text style={styles.pending_header_style}>{stringReportStatus.report_processing}</Text>
                      <Text style={{fontFamily: 'Arial'}}>{stringReportStages.txt_report_processing}</Text>
                    </View>
                  </View>
                </View>
                <View style={{flex:1}}>
                  <View style={{flexDirection: 'row'}}>
                    <View>
                      <View style={{backgroundColor: (this.state.num_reportStatus <= 3) ? (Color.pending_selected_color) : (Color.pending_color_neutral), borderRadius: 70, height: 13, width: 13}}></View>
                      <View style={{flex:1, padding:3}}></View>
                    </View>
                    <View style={styles.pending_view_style}>
                      <Text style={styles.pending_header_style}>{stringReportStatus.report_pending}</Text>
                      <Text style={{fontFamily: 'Arial'}}>{stringReportStages.txt_report_pending}</Text>
                    </View>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{backgroundColor: (this.state.num_reportStatus <= 2) ? (Color.pending_selected_color) : (Color.pending_color_neutral), borderRadius: 70, height: 13, width: 13}}></View>
                  <View style={styles.pending_view_style}>
                    <Text style={styles.pending_header_style}>{stringReportStatus.report_completed}</Text>
                    <Text style={{fontFamily: 'Arial'}}>{stringReportStages.txt_report_completed}</Text>
                  </View>
                </View>
              </View>
              <View style={{height : (650 -  277), backgroundColor: Color.pending_color_neutral, padding:2,borderRadius:70,position: 'absolute', marginLeft: 4.7}}></View>
              <View style={{height : (650 -  277) * this.state.percentage, backgroundColor: Color.pending_selected_color, padding:2,alignItems: 'center',borderRadius:70,position: 'absolute', marginLeft: 4.7}}></View>
            </View>

            <Text style={{ fontFamily: 'Arial' ,fontSize: 18, color: Color._36,paddingTop:16, paddingBottom:8}}>Tests Requested</Text>
            {this.getTest()}
          </View>
        </ScrollView>
        {(this.state.isLoading) ? (<ProgressBar/>) : (null)}
      </View>
    )
  }
}

const  styles = StyleSheet.create({
  pending_view_style:{flex: 1, paddingLeft: 24, paddingRight:16},
  pending_header_style: {fontSize: 18,paddingBottom:8, color: Color._36}
})


const mapStateToProps = state => ({
  currency: state.currency
})

export default connect(mapStateToProps)(PendingReportView)
