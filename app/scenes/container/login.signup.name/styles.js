import { StyleSheet } from 'react-native'
import { Color, Global } from '../../../utils'

export default styles = StyleSheet.create({
  containerMain: {
    backgroundColor: 'white',
    alignContent: 'center',
    justifyContent: 'flex-start'
  },
  containerSub2: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    
  },
  btnProceed: {
    marginTop: 0,
    width: Global.screenWidth * 0.8,
    borderColor: Color.greenPrimary,
    backgroundColor: Color.greenPrimary,
    borderRadius: 4
  },
  btnResendOTP: {
    borderColor: Color.blueDeepNavyOTPBtnBG,
    backgroundColor: Color.blueDeepNavyOTPBtnBG
  },
  textPass: {
    width: Global.screenWidth * 0.8,
    alignSelf: 'center',
    alignContent: 'flex-start'
  },
  containerSub3: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop:-40
    
  }
  
})
