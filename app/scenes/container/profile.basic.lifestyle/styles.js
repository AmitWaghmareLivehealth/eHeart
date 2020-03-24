import { StyleSheet } from 'react-native'
import { Color } from '../../../utils'

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  
  },
  headerStyle:{
    paddingLeft:8,
    color : 'grey'
  },
  footerStyle:{
    paddingLeft:8,
    color : 'black'
  },
  innerContainerStyle: {
    padding:17
  },

  separatorStyle:{
    backgroundColor: '#DFDFDF',
    height: 0.5,
    marginLeft:16,
    marginRight:16,
  },

  error_style : {
    paddingTop:4,
    color : 'red',
    fontSize: 12
  },
  dialog_styles: {
    paddingLeft:20,
    paddingTop:20,
    paddingBottom:8
  },
  tabContainer:{
   
      flex: 1,
      backgroundColor: 'white',
      marginTop:-10
  
  }
})