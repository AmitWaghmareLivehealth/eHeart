import { StyleSheet } from 'react-native'
import Color from '../../../utils/const/colors'

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column'
  },
  textStyle:{
    color: Color._4A,
    fontSize:16,
    alignItems: 'center'
  },
  iconStyle: {
    color: Color.icon_tint_color,
    paddingTop: 4
  },
  innerContainerStyle: {
    flexDirection: 'row',
    alignItems:'center',
    paddingLeft:17,
    paddingRight:17,
    paddingTop:13,
    paddingBottom:13,
    backgroundColor: '#FFFFFF',
    flex:1
  },

  iconStyle_profile: {
    color: Color.icon_tint_color,
  },

  profile_container : {
    paddingTop:28,
    paddingBottom:12,
    paddingLeft:18,
    paddingRight:18,
    alignItems: 'center'
  },

  profile_name: {
    flex: 1,
    fontSize: 20,
    fontWeight : '500',
    color: Color._75,
  },

  separator_style:{
    backgroundColor: Color.android_default_color ,
    paddingLeft: 28,
    paddingRight:28,
    paddingTop:28,
    paddingBottom:12,
    fontSize: 17
  },

  line_separator:{
    height:0.5,
    backgroundColor: Color._DF,
    marginLeft:17,
    marginRight:17
  },

  textDate:{
    fontSize:20,
    paddingHorizontal:10,
    paddingVertical:16,
    fontWeight:'bold'
  },

  textDate2:{
    fontSize:14,
    paddingHorizontal:6,
    paddingVertical:0,
    fontWeight:'bold',
    color:'#ccc'
  }

})
