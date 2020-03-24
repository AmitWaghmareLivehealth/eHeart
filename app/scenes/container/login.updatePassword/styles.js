import { StyleSheet } from 'react-native'
import { Global } from '../../../utils'

var imageWidth = Global.screenWidth * (3 / 4)
var imageHeight = imageWidth * (173 / 612)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    width: Global.screenWidth,
    height: Global.screenHeight,
    backgroundColor: 'white',
  },
  btnProceed: {
    marginTop: 0,
    width: Global.screenWidth * 0.8,
    borderColor: Color.greenPrimary,
    backgroundColor: Color.greenPrimary,
    borderRadius: 4,
    alignSelf:'center'
  },
})

export default styles
