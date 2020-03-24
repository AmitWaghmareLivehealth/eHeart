import React, { Component } from 'react'
import { View, Text,  Modal, TouchableOpacity, ScrollView, LayoutAnimation, RefreshControl, StatusBar} from 'react-native'
import moment from 'moment'

import DialogHeader from '../../components/dialog.header'
import { URLs, Color, Global, NetworkRequest, UserDefaults, stringsUserDefaults, CommonStyles } from '../../../utils'
import { HeaderListExtraLarge, StateRepresentation } from '../../layouts'
import CloseBar from '../../components/closebar'
import {ProgressBar} from '../../components'
import Ripple from '../../components/ripple'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux'
import ListView from 'deprecated-react-native-listview';


const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
})

const ds_inner = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
})

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};


class BillingHistory extends Component {
  constructor(props) {
    super(props);

    this.state={
      passItem : '',
      dataSource: ds.cloneWithRowsAndSections([]),
      dataSource_inner: ds_inner.cloneWithRowsAndSections([]),
      selected_item: '',
      modal_visible: false,
      isLoading: false,
      isStateRepFlag : false,
      isViewFlag: true,
      refreshing: false,
    }

    this.renderInnerRow = this.renderInnerRow.bind(this)
    this.goback = this.goback.bind(this)
    this.loadingManipulate = this.loadingManipulate.bind(this)
    this.setStateRep = this.setStateRep.bind(this)
  }

  loadingManipulate(flag){
    this.setState({
      isLoading: flag
    })
  }

  componentDidMount(){
    setTimeout(() => {
      this.loadingManipulate(true)
      this.getData();
    },50)
  }

  setStateRep(msg){
    this.setState({
      isStateRepFlag : true
    })
  }

  async getData(){
    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      let params = 'userToken=' + (token || '')
      var _this = this
NetworkRequest(_this, 'POST',URLs.billingHistory,params).then(result => {
        if(result.success){
          if((result.response.code || 0) === 200){
            this.loadingManipulate(false)
            this._filterData(result.response);
          } else {
            this.loadingManipulate(false)
            this.setStateRep('Could not find any Transactions')
          }
        } else {
          this.loadingManipulate(false)
          this.setStateRep('Could not find any Transactions')
        }
      }).catch((error) => {
        this.loadingManipulate(false)
        this.setStateRep('Could not find any Transactions')
        console.error(error);
      })

    }).catch((error) => {
      this.loadingManipulate(false)
      this.setStateRep('Could not find any Transactions')
      console.error(error);
    })

  }

  async _filterData(response){

    console.log('BILL RESPONSE: ', response)
    
    try{
        var billingMap = {}
        var transactionArray = []
        var finalbillingMap = {}
        if(response.transactions.length > 0){
            response.transactions.forEach(valInData => {
            if(valInData.transactionId.id in billingMap){
              billingMap[valInData.transactionId.id].value.push(valInData)
            } else {
            if(valInData.transactionId.labId){
              var transaction = []
              transaction.push(valInData)
              billingMap[valInData.transactionId.id] = {
                value: transaction,
                labId : valInData.transactionId.labId.labId,
                labName : valInData.transactionId.labId.labName,
                isHomeCollection: valInData.isHomeCollection,
                isReport: 0,
                totalAmount : valInData.transactionId.txnAmount,
                transactionDate : this._getReportDate(valInData.transactionId.txnDate),
                sortingDate: valInData.transactionId.txnDate,
                transactionKey : valInData.transactionId.transactionKey,
                paymentType : valInData.transactionId.paymentType,
                id : valInData.transactionId.id
              };
            }
          }
        })
      }
      if(response.reportTransactions.length > 0){
        response.reportTransactions.forEach(valInData => {
          if(valInData.transactionDetails.labId){
            let transaction = valInData.reportNames.split(',')
            transactionArray.push({
                value: transaction.clean(""),
                labId : valInData.transactionDetails.labId.labId,
                labName : valInData.transactionDetails.labId.labName,
                isHomeCollection: 0,
                isReport: valInData.transactionDetails.isReport,
                totalAmount : valInData.transactionDetails.txnAmount,
                transactionDate : this._getReportDate(valInData.transactionDetails.txnDate),
                sortingDate: valInData.transactionDetails.txnDate,
                transactionKey : valInData.transactionDetails.transactionKey,
                paymentType : valInData.transactionDetails.paymentType,
                id : valInData.transactionDetails.id
              });
          }
        })
      }

      for(valInData in billingMap){
        transactionArray.push(billingMap[valInData])
      }

//Date wise sorting
      transactionArray.sort((a, b) =>{
        return new Date(a.sortingDate) - new Date(b.sortingDate)
      }).reverse()

      finalbillingMap = {
        billingData : transactionArray
      }

      var isStateRepFlag = false
      if(transactionArray.length > 0){
        isStateRepFlag = false
      } else {
        isStateRepFlag = true
      }
      this.setState({
        dataSource : ds.cloneWithRowsAndSections(finalbillingMap),
        isStateRepFlag: isStateRepFlag
      })
    } catch (error) {
      console.error(error);
    }
  }

  _getReportDate(param_date){
    try{
      var dateFormat = 'YYYY-MM-DDTHH:mm:ssZ'
      var dateFormatDisplay = 'Do MMM'
      var reportDate = moment(param_date, dateFormat).utc().format(dateFormatDisplay)
      return reportDate
    } catch (error) {
        console.error(error)
    }
  }

  renderInnerRow(item, secId, rowId){

    return(
      <View style={{flexDirection:'row' , padding: 16}}>
        <Text style={{ fontFamily: 'Arial' ,paddingRight: 8}}>{Number(rowId) + 1}</Text>
        {(this.state.selected_item.isReport === 1)? (<Text style={{ fontFamily: 'Arial' ,flex: 1}}>{item}</Text>):
                                (item.isTest === 1) ? (<Text style={{ fontFamily: 'Arial' ,flex: 1}}>{item.testId.testName}</Text>) : (<Text style={{fontFamily: 'Arial'}}>{item.promoId.promoName}</Text>)}
        {(this.state.selected_item.isReport === 1) ? (<Text style={{fontFamily: 'Arial'}}></Text>):
                                       (item.isTest === 1) ?
                                                    (<Text style={{ fontFamily: 'Arial' ,textAlign : 'right' , flex: 1}}>{this.props.currency.currency} {item.testId.testAmount}</Text>) :
                                                    ((item.isPackage === 1) ?
                                                                              (<Text style={{ fontFamily: 'Arial' ,textAlign : 'right' }}>{this.props.currency.currency} {item.promoId.actualPrice}</Text>) :
                                                                              (<Text style={{ fontFamily: 'Arial' ,textAlign : 'right' }}>{this.props.currency.currency} {item.promoId.offerPrice}</Text>))
        }
      </View>
    )
  }

  _renderModal(item){
    if(item === ''){
      this.setState({
        selected_item : '',
        modal_visible: false
      })
    } else {
      var billingDetails = {
        billing_details : item.value
      }
      this.setState({
        selected_item : item,
        dataSource_inner : ds_inner.cloneWithRowsAndSections(billingDetails),
        modal_visible: true
      })
    }

  }

  goback(){
    this.props.closeModal()
  }

  renderRow(item,secId,rowId){
    return(
      <View>
        <Ripple
          activeOpacity={0.4}
          onPress={() => {
            this._renderModal(item)
          }}
          >
          <View style={{flexDirection : 'column'}}>
            <View style={{flexDirection : 'row', padding: 8, marginTop: 8, marginBottom: 8}}>
              {(item.paymentType !== 0) ?
                                        (<View style={{backgroundColor: '#33B622' , width: 5, marginTop : 2, marginBottom: 2, borderRadius:4}}></View>) :
                                        (<View style={{backgroundColor: Color.yellow , width: 5, marginTop : 2, marginBottom: 2, borderRadius:4}}></View>)}
              <View style={{flex: 3, paddingLeft: 12}}>
                <Text style={{ fontFamily: 'Arial' , fontSize: 14, color : '#000000', fontWeight: '700'}}>Bill Id : {item.transactionKey}</Text>
                <Text style={{ fontFamily: 'Arial' , fontSize: 14, color : '#000000',paddingTop: 8}}>{item.labName}</Text>
                {(item.isReport === 1)? (<Text style={{ fontFamily: 'Arial' , fontSize: 10, color : Color.red}}>Type : Report</Text>):
                                        (item.isHomeCollection === 1) ?
                                                                      (<Text style={{ fontFamily: 'Arial' , fontSize: 10, color : Color.red}}>Type : Home Collection</Text>) :
                                                                      (<Text style={{ fontFamily: 'Arial' , fontSize: 10, color : Color.red}}>Type : Appointment</Text>)}
              </View>

              <View style={{flex: 0.8, paddingRight: 8}}>
                <Text style={{ fontFamily: 'Arial' ,fontSize : 10 , color: Color.black_overlay}}>Total Amount</Text>
                <Text style={{ fontFamily: 'Arial' ,fontSize : 14 , color: '#000000',paddingTop: 8, fontWeight: '300'}}>{this.props.currency.currency} {item.totalAmount}</Text>
                <Text style={{ fontFamily: 'Arial' ,fontSize : 10 , color: Color.black_overlay}}>{item.transactionDate}</Text>
              </View>
            </View>
              <View style={{height: 0.5, backgroundColor: '#DFDFDF'}} ></View>
          </View>
        </Ripple>
      </View>
    )
  }

  render(){
    return(
      <View style={{flex: 1}}>
        <View style={{backgroundColor: '#ffffff', flex: 1}}>
        {(this.state.isViewFlag) ? (<View style={{height: 1}}></View>) :(null)}
        {(this.state.isStateRepFlag)
          ?
          (
            <View style={{flex: 1}}>
              <TouchableOpacity
                activeOpacity={0.4}
                onPress={() => {
                  this.props.closeModal()
                }}
                style={{paddingLeft: 18, paddingTop: Global.iOSPlatform ?  38 : 18,paddingBottom:-16}}
                >
                <MaterialIcons
                  name={'close'}
                  size={28}
                  style={{
                    color: 'black',
                    marginLeft: -6,
                    marginBottom: 6,
                  }}
                />
              </TouchableOpacity>
            <StateRepresentation
              image='search'
              description= 'Could not find any Transactions'></StateRepresentation>
            </View>
          )
          :
          (<ListView
            bounces={false}
            dataSource={this.state.dataSource}
            renderRow={(item,secId,rowId) => this.renderRow(item,secId,rowId)}
            renderHeader={() => {
              return(
                <View>
                  <TouchableOpacity
                    activeOpacity={0.4}
                    onPress={() => {
                      this.props.closeModal()
                    }}
                    style={{paddingLeft: 18, paddingTop: Global.iOSPlatform ?  38 : 18,paddingBottom:6}}
                    >
                    <MaterialIcons
                      name={'close'}
                      size={28}
                      style={{
                        color: 'black',
                        marginLeft: -6,
                        marginBottom: 6,
                      }}
                    />
                  </TouchableOpacity>
                  <HeaderListExtraLarge
                    header='Billing History'
                    description='All your transaction history will be visible here'
                    style={{flex:0,paddingTop:0}}
                    ></HeaderListExtraLarge>
                </View>
              )
            }}
          />)}

          <Modal
             animationType={'none'}
             transparent={true}
             visible={this.state.modal_visible}
             onRequestClose = {() => {
               this._renderModal('')
             }}

             >
              {
                <View style={{flex:1,flexDirection: 'row',alignItems:'center', justifyContent:'center' ,  backgroundColor: '#00000080'}}>
                  <View  style={{flex:1 ,flexDirection:'column', margin: 40, backgroundColor: '#ffffff',borderRadius: 6, borderWidth: 0.5, borderColor: Color._DF}}>
                    <View>
                      <DialogHeader
                        style={{padding:16}}
                        title={'Particulars'}/>
                      <ListView
                        bounces={false}
                        dataSource={this.state.dataSource_inner}
                        renderRow={(item, secId, rowId) => this.renderInnerRow(item,secId,rowId)}
                      />
                      <View style={{height:0.5, backgroundColor:Color._DF}}>
                      </View>
                      <View style={{flexDirection:'row'}}>
                        <Ripple
                          onPress={() => {
                            this._renderModal('')
                          }}
                          style={{justifyContent:'center'}}
                          >
                          <View style={{justifyContent: 'center'}}>
                            <Text style={[CommonStyles.button_style, {paddingLeft: 16,paddingRight:12}]}>CLOSE</Text>
                          </View>
                        </Ripple>
                        <View style={{flex:1}}></View>
                        <View style={{paddingRight:16}}>
                          <Text style={{ fontFamily: 'Arial' ,textAlign : 'center',paddingTop:8 }}>Total Amount</Text>
                          <Text style={{ fontFamily: 'Arial' ,color: '#212121',fontSize:16,fontWeight:'300' , textAlign : 'center' ,paddingBottom:8}}>{this.props.currency.currency} {this.state.selected_item.totalAmount}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              }
            </Modal>
            {(this.state.isLoading) ? (<ProgressBar/>) : (null)}
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  currency: state.currency
})

export default connect(mapStateToProps)(BillingHistory)
