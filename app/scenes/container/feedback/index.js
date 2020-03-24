import React, { Component } from 'react'
import { View, Text, TextInput, ScrollView, Alert, Modal} from 'react-native'
import CheckBox from 'react-native-check-box'
import {Ripple} from '../../components'
import { URLs, Routes, Color, UserDefaults, stringsUserDefaults, NetworkRequest, CommonManager,stringfeedBack, Global,Router } from '../../../utils'
import {ProgressBar, AnimFeedback} from '../../components'
import StarRatingBar from '../../components/rating'

export default class Feedback extends Component {
  constructor(props) {
    super(props)
    this.state={
      labId: this.props.labId || 0,
      labName: this.props.labName || 'your recent lab',
      billId: this.props.billId || 0,
      rating: this.props.rating || 1,
      comment: '',
      flag : 0,
      check_1: false,
      check_2: false,
      check_3: false,
      check_4: false,
      check_5: false,
      isLoading : false,
      text1 : '',
      text2 : '',
      text3 : '',
      text4 : '',
      text5 : '',
      comment: '',
      complete_feedback: false,
      rating_text: '',
      homeFeedback: this.props.homeFeedback,
      top_text: '',
      big_comment: ''
    }

    this.submitFeedback = this.submitFeedback.bind(this)
    this.onClick = this.onClick.bind(this)
    this.loadingManipulate = this.loadingManipulate.bind(this)
    this.getComment = this.getComment.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.setRating = this.setRating.bind(this)
  }

  componentDidMount(){
    if(this.state.rating){
      if(this.state.rating > 0){
        setTimeout(() => {
          this.getText()
        },100)
      }
    }
  }

  onClick(value, flag ){
    // if(flag === 1){
    //   this.setState({
    //     check_1: value
    //   })
    // } else if(flag === 2){
    //   this.setState({
    //     check_2: value
    //   })
    // } else if(flag === 3){
    //   this.setState({
    //     check_3: value
    //   })
    // } else if(flag === 4){
    //   this.setState({
    //     check_4: value
    //   })
    // }

  }

  getComment(){
    var comment = ''
    if(this.state.check_1){
      comment += this.state.text1 + ','
    }
    if(this.state.check_2){
      comment += this.state.text2 + ','
    }
    if(this.state.check_3){
      comment += this.state.text3 + ','
    }
    if(this.state.check_4){
      comment += this.state.text4 + ','
    }
    if(this.state.check_5){
      comment += this.state.text5 + ','
    }

    if(this.props.homeFeedback){
      comment += this.state.big_comment
    }

    return comment;
  }

  checkCondition(){
    var comment = this.getComment()
    if(this.state.rating > 0 & comment !== ''){
      this.setState({
        complete_feedback: true,
        isLoading : true
      })
      setTimeout(() => {
        this.submitFeedback(comment)
      },100)
    } else {
      this.setState({
        complete_feedback: false
      })

      Alert.alert(
           'Feedback',
           'Please enter a valid feedback',
          [
            {text: 'Ok', onPress: () => {}}
          ],
          { cancelable: true }
        )
    }
  }

  loadingManipulate(flag){
    this.setState({
      isLoading: flag
    })
  }

  async submitFeedback(comment){
    UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
      if(!this.props.homeFeedback){
        let params = 'userToken=' + (token || '')
                   + '&labId=' + (this.state.labId || '')
                   + '&rating=' + (this.state.rating || '')
                   + '&billId=' + (this.state.billId || '')
                   + '&comments=' + (comment || '')

                   console.log('PARAMS',params);
        var _this = this
NetworkRequest(_this, 'POST', URLs.saveFeedbackURL,params).then(result => {
          if(result.success){
            if((result.response.code || 0) === 200){
              this.afterFeedback()
            } else if((result.response.code || 0) === 500){

            }
          }
          this.loadingManipulate(false)
        }).catch((error) => {
          this.loadingManipulate(false)
          console.error(error);
        })
    } else {
      let params = 'token=' + (token || '')
                 + '&rating=' + (this.state.rating || '')
                 + '&collectingPersonId=' + (this.props.collectingPersonId || '')
                 + '&homeCollectionId=' + (this.props.homecollectionId || '')
                 + '&review=' + (comment || '')

                 console.log('PARAMS',params);
      var _this = this
      NetworkRequest(_this, 'POST', URLs.ratePhlebotomist,params).then(result => {
        if(result.success){
          if((result.response.code || 0) === 200){
            this.afterFeedback1()
          } else if((result.response.code || 0) === 500){

          }
        }
        this.loadingManipulate(false)
      }).catch((error) => {
        this.loadingManipulate(false)
        console.error(error);
      })
    }
    }).catch((error) => {
      this.loadingManipulate(false)
      console.error(error);
    })
  }

  afterFeedback(){
    this.loadingManipulate(false)
    this.props.clearCard()
    this.props.closeModal()
  }

  afterFeedback1(){
    this.loadingManipulate(false)
    this.props.clearCard1()
    this.props.closeModal()
  }
  getText(){
    var text1 = ''
    var text2 = ''
    var text3 = ''
    var text4 = ''
    var text5 = ''

    if(this.state.rating === 1.0){
      text1 = (!this.props.homeFeedback) ? stringfeedBack.low_feedback_1 : stringfeedBack._low_feedback_1
      text2 = (!this.props.homeFeedback) ? stringfeedBack.low_feedback_2 : stringfeedBack._low_feedback_2
      text3 = (!this.props.homeFeedback) ? stringfeedBack.low_feedback_3 : stringfeedBack._low_feedback_3
      text4 = (!this.props.homeFeedback) ? stringfeedBack.low_feedback_4 : stringfeedBack._low_feedback_4
      text5 = (!this.props.homeFeedback) ? stringfeedBack.low_feedback_5 : stringfeedBack._low_feedback_5
    } else if (this.state.rating === 2.0) {
      text1 = (!this.props.homeFeedback) ? stringfeedBack.high_feedback_1 : stringfeedBack._high_feedback_1
      text2 = (!this.props.homeFeedback) ? stringfeedBack.high_feedback_2 : stringfeedBack._high_feedback_2
      text3 = (!this.props.homeFeedback) ? stringfeedBack.high_feedback_3 : stringfeedBack._high_feedback_3
      text4 = (!this.props.homeFeedback) ? stringfeedBack.high_feedback_4 : stringfeedBack._high_feedback_4
      text5 = (!this.props.homeFeedback) ? stringfeedBack.high_feedback_5 : stringfeedBack._high_feedback_5
    } else if (this.state.rating === 3.0) {
      text1 = (!this.props.homeFeedback) ? stringfeedBack.high_1_feedback_1 : stringfeedBack._high_1_feedback_1
      text2 = (!this.props.homeFeedback) ? stringfeedBack.high_1_feedback_2 : stringfeedBack._high_1_feedback_2
      text3 = (!this.props.homeFeedback) ? stringfeedBack.high_1_feedback_3 : stringfeedBack._high_1_feedback_3
      text4 = (!this.props.homeFeedback) ? stringfeedBack.high_1_feedback_4 : stringfeedBack._high_1_feedback_4
      text5 = (!this.props.homeFeedback) ? stringfeedBack.high_1_feedback_5 : stringfeedBack._high_1_feedback_5
    } else if (this.state.rating === 4.0) {
      text1 = (!this.props.homeFeedback) ? stringfeedBack.high_2_feedback_1 : stringfeedBack._high_2_feedback_1
      text2 = (!this.props.homeFeedback) ? stringfeedBack.high_2_feedback_2 : stringfeedBack._high_2_feedback_2
      text3 = (!this.props.homeFeedback) ? stringfeedBack.high_2_feedback_3 : stringfeedBack._high_2_feedback_3
      text4 = (!this.props.homeFeedback) ? stringfeedBack.high_2_feedback_4 : stringfeedBack._high_2_feedback_4
    } else if (this.state.rating === 5.0) {
      text1 = (!this.props.homeFeedback) ? stringfeedBack.high_3_feedback_1 : stringfeedBack._high_3_feedback_1
      text2 = (!this.props.homeFeedback) ? stringfeedBack.high_3_feedback_2 : stringfeedBack._high_3_feedback_2
      text3 = (!this.props.homeFeedback) ? stringfeedBack.high_3_feedback_3 : stringfeedBack._high_3_feedback_3
      text4 = (!this.props.homeFeedback) ? stringfeedBack.high_3_feedback_4 : stringfeedBack._high_3_feedback_4
    }

    var rating_text = ''
    var top_text = ''
    if (this.state.rating === 0) {
         rating_text = ''
         top_text = ''
     } else if (this.state.rating === 1) {
         rating_text = 'Very Poor'
         top_text = 'Sorry to hear that, what went wrong ?'
     } else if (this.state.rating === 2) {
         rating_text = 'Poor'
         top_text = 'Sorry, what went wrong ?'
     } else if (this.state.rating === 3) {
         rating_text = 'Average'
         top_text = 'What could be make it better ?'
     } else if (this.state.rating === 4) {
         rating_text = 'Good '
         top_text = 'What could be make it better ?'
     } else if (this.state.rating === 5) {
         rating_text = 'Excellent Experience'
         top_text = 'What did you like the most ?'
     }

    this.setState({
      text1 : text1,
      text2 : text2,
      text3 : text3,
      text4 : text4,
      text5: text5,
      rating_text: rating_text,
      top_text: top_text
    })
  }

  setRating(rating){
    this.setState({
      rating: rating
    })

    setTimeout(() => {
      this.getText()
    },100)
  }

  onScroll (event) {
    if(event.nativeEvent.contentOffset.y  < 5){
      console.log('set swipe TRUE onScroll');
      this.props.setSwipe(true)
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
          <ScrollView
              bounces={false}
              ref="scrollView"
              style={{backgroundColor: 'white', marginBottom: 72}}
              onScroll={this.onScroll}
              onContentSizeChange={(w, h) => {
                if (h > Global.screenHeight) {
                  if(this.props.getSwipe()){
                    this.props.setSwipe(false)
                    this.setState({
                      isVisible: true
                    })
                    this.props.setScroll(true)
                    this.refs.scrollView.scrollTo({x: 0, y: 5, animated: true});
                  }
                }
              }}>
            <View>
              <Text style={{ fontFamily: 'Arial' ,fontSize:18, textAlign: 'center',paddingTop:24, color: 'black'}}>Rate your experience with</Text>
              <Text style={{ fontFamily: 'Arial' ,fontSize:(this.props.homeFeedback )? 18 : 20, fontWeight: (this.props.homeFeedback )? '100' : '800', textAlign: 'center',paddingBottom:16,paddingTop:8, color: 'black'}}>{this.props.homeFeedback ? 'this home visit' : this.state.labName}</Text>
              <View  style={{alignItems: 'center', justifyContent: 'center', padding : 16}}>
                <AnimFeedback
                  setRating={this.setRating}
                  rating={this.props.rating}
                />

              </View>

              <Text style={{ fontFamily: 'Arial' ,textAlign: 'center', padding: 16, fontSize: 20, color: Color._4A, fontWeight: '800'}}>{this.state.rating_text}</Text>
              <Text style={{ fontFamily: 'Arial' ,textAlign: 'center', paddingTop: 8, paddingBottom: 16, fontSize: 16,color: Color._4A, fontWeight: '800'}}>{this.state.top_text}</Text>


                <View>
                  {(this.state.text1)
                  ?
                  (<CheckBox
                    style={{padding: 12, marginLeft: 16,marginRight: 16, marginTop:8, marginBottom:8, borderWidth:Global.isIphoneX ? 1 : 0.5, borderColor: Color._DF}}
                    ref={(check_1) => { this.check_1 = check_1; }}
                    onClick={() => {
                      if(this.check_1.props.isChecked){
                        this.setState({
                          check_1: false
                        })
                      } else {
                        this.setState({
                          check_1: true
                        })
                      }
                    }}
                    isChecked={this.state.check_1}
                    rightText={this.state.text1}
                  />):(null)}

                  {(this.state.text2)
                  ?
                  (<CheckBox
                    style={{padding: 12, marginLeft: 16,marginRight: 16, marginTop:8, marginBottom:8, borderWidth:Global.isIphoneX ?1 : 0.5, borderColor: Color._DF}}
                       ref={(check_2) => { this.check_2 = check_2; }}
                       onClick={() => {
                         if(this.check_2.props.isChecked){
                           this.setState({
                             check_2: false
                           })
                         } else {
                           this.setState({
                             check_2: true
                           })
                         }
                       }}
                    isChecked={this.state.check_2}
                    rightText={this.state.text2}
                  />):(null)}

                  {(this.state.text3)
                  ?
                  (<CheckBox
                    style={{padding: 12, marginLeft: 16,marginRight: 16, marginTop:8, marginBottom:8, borderWidth: Global.isIphoneX?1: 0.5, borderColor: Color._DF}}
                       ref={(check_3) => { this.check_3 = check_3; }}
                       onClick={() => {
                         if(this.check_3.props.isChecked){
                           this.setState({
                             check_3: false
                           })
                         } else {
                           this.setState({
                             check_3: true
                           })
                         }
                       }}
                    isChecked={this.state.check_3}
                    rightText={this.state.text3}
                  />):(null)}

                  {(this.state.text4)
                  ?
                  (<CheckBox
                    style={{padding: 12, marginLeft: 16,marginRight: 16, marginTop:8, marginBottom:8, borderWidth: Global.isIphoneX? 1 : 0.5, borderColor: Color._DF}}
                       ref={(check_4) => { this.check_4 = check_4; }}
                       onClick={() => {
                         if(this.check_4.props.isChecked){
                           this.setState({
                             check_4: false
                           })
                         } else {
                           this.setState({
                             check_4: true
                           })
                         }
                       }}
                    isChecked={this.state.check_4}
                    rightText={this.state.text4}
                  />):(null)}

                  {(this.state.text5)
                  ?
                  (<CheckBox
                    style={{padding: 12, marginLeft: 16,marginRight: 16, marginTop:8, marginBottom:8, borderWidth:Global.isIphoneX? 1 : 0.5, borderColor: Color._DF}}
                       ref={(check_5) => { this.check_5 = check_5; }}
                       onClick={() => {
                         if(this.check_5.props.isChecked){
                           this.setState({
                             check_5: false
                           })
                         } else {
                           this.setState({
                             check_5: true
                           })
                         }
                       }}
                    isChecked={this.state.check_5}
                    rightText={this.state.text5}
                  />):(null)}
                  {(this.state.rating < 5) ? (<TextInput style={{height: 100, margin: 16,padding:16, borderWidth: 0.5, borderColor: Color._DF, backgroundColor: 'white'}} onChangeText={(text) => {
                  this.setState({
                    big_comment: text
                  })
                }} placeholder={'Please enter comments'} underlineColorAndroid={'white'}/>)  : (<View style={{height: 100, margin: 16,padding:16}}></View>)}
                </View>
            </View>
          </ScrollView>

          <Ripple
            onPress= {() => {
              this.checkCondition()
            }}
            style={{position: 'absolute', width: Global.screenWidth, bottom: Global.isIphoneX ? 30 :0}}>
            <Text style={{ fontFamily: 'Arial' ,backgroundColor: Color.tracker_vals ,padding: 16,color: 'white',textAlign: 'center'}}>Submit</Text>
          </Ripple>
          {(this.state.isLoading) ? (<ProgressBar/>) : (null)}
      </View>
    );
  }
}
