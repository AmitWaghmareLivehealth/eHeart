import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, Animated} from 'react-native'
import {Images, Color, CommonStyles} from '../../../utils'
import {Ripple} from '../../components'

export default class DummyCard extends Component {
  constructor(props) {
    super(props)
    this.springValue = new Animated.Value(1)
    this.state={
      springVal: new Animated.Value(1),
      headerText: this.props.headerText,
      subheaderText: this.props.subheaderText,
      image: this.props.image,
      actualType: this.props.actualType,
      onPressAction: this.props.onPressAction || '',
      animated: this.props.animated
    }
  }


  spring1 () {
    this.springValue.setValue(0.99)
    //this.setState({springVal:0.97})
    Animated.spring(
      this.state.springVal,
      {

        toValue: 0.97,
      //  springVal:0.97
      }
    ).start()
  }

  spring2 () {
    this.springValue.setValue(0.97)
    //this.setState({springVal: 0.99})
    Animated.spring(
      this.state.springVal,
      {
        toValue: 1,
        //springVal:1
      }
    ).start()
  }



  render(){
    var imageUrl = this.state.image
    var image = Image.imageUrl
    return(
        <Animated.View style={[{transform:[{scale: this.state.springVal}]},styles.container , CommonStyles.commonShadow, this.props.styles]}>
          <Ripple
            rippleOpacity = {0.2}
            onPressIn = {this.spring1.bind(this)}
            onPressOut = {this.spring2.bind(this)}
            onPress={() => {
              if(this.state.onPressAction){
                this.state.onPressAction()
              }
            }}>
            <View style={{paddingLeft: 17, paddingRight: 17, paddingTop: 17}}>
              <View style={styles.innerContainer}>
                <Image source={imageUrl} style={{height:35,width:35,flex:0}}/>
                {(this.state.headerText) ? (<Text style={[CommonStyles.common_header, {paddingLeft: 16}]}>{this.state.headerText}</Text>) : (null)}
              </View>
              {this.state.subheaderText ? <Text style={{ fontFamily: 'Arial' ,color: Color._54, fontSize: 16,paddingTop: 4}}>{this.state.subheaderText}</Text> :null}
              <Text style={{ fontFamily: 'Arial' ,color: Color._A3, fontSize: 13, fontWeight: '400', paddingBottom: this.state.actualType ? 17 :12}}>{this.state.actualType}</Text>
            </View>
      </Ripple>
    </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: { marginTop: 10,marginBottom: 10, borderRadius: 8 , backgroundColor: 'white', elevation: 6, marginLeft: 18, marginRight: 18},
  innerContainer:{flexDirection: 'row', alignItems:'center'},

})
