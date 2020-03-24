import { StyleSheet } from 'react-native'
import { Color } from '../../../utils'

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column'
  },
  headerContainerStyle:{
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 14
  },

  headerStyle:{
    fontSize: 16
  },

  iconStyle: {
    color: Color.icon_tint_color,
    marginTop: 7,
    marginBottom: 3
  },
  innerContainerStyle: {
   flexDirection: 'row',
   padding: 16
 },

 footerStyle:{
   fontSize: 12,
   paddingTop : 4
 },

  separatorStyle:{
    backgroundColor: '#DFDFDF',
    height: 0.5
  }
})
