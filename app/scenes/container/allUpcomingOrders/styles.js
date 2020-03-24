import { StyleSheet } from 'react-native'
import { Color } from '../../../utils'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop:0
  },
  dialog_styles: {
    paddingLeft:20,
    paddingTop:10,
    paddingBottom:8,
    fontSize:20
  },
    indicatorStyle:{
    backgroundColor:Color.appointmentBlue
  },
})

export default styles