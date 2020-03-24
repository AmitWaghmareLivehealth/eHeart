import { StyleSheet } from 'react-native'
import Color from './colors'
import Global from './globals'

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: 'white'
  },
  textHeader1: {
    fontSize: 34,
    color: '#000000',
    fontFamily: 'Arial',
    fontWeight: '900'
  },
  textDescription1: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Arial'
  },
  textHeader2: {
    fontSize: 32,
    color: '#111111',
    fontFamily: 'Arial',
    fontWeight: '900'
  },
  textDescription2: {
    fontSize: 12,
    color: '#111111',
    fontFamily: 'Arial'
  },
  textHeader3: {
    fontSize: 18,
    color: '#111111',
    fontFamily: 'Arial'
  },
  textDescription3: {
    fontSize: 14,
    color: Color._A2GrayCountryCode,
    fontFamily: 'Arial'
  },
  textHeader4: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Arial'
  },
  textDescription4: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Arial'
  },
  textHeaderReportView: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Arial'
  },
  textDescriptionReportView: {
    fontSize: 12,
    color: Color._A2GrayCountryCode,
    fontFamily: 'Arial'
  },
  textHeaderMainReportView: {
    fontSize: 26,
    color: '#000',
    fontFamily: 'Arial'
  },
  textDescriptionMainReportView: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Arial'
  },
  textSecAction: {
    fontSize: 17,
    color: Color._A2GrayCountryCode,
    fontFamily: 'Arial'
  },
  textError: {
    fontSize: 12,
    color: 'red',
    fontFamily: 'Arial',
    textAlign: 'center'
  },
  commonShadow: {
    elevation: 2,
    shadowRadius: 5,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    borderWidth: Global.iOSPlatform ? 0 : 0.5,
    borderColor: '#ccc'
  },
  commonShadowWithoutBorder: {
    elevation: 2,
    shadowRadius: 8,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black'
  },
  secondary_text_title: {
    fontSize: 20,
    paddingRight:8,
    fontWeight: '700',
    marginLeft:19,
    marginRight: 19,
    color: Color._4A,
    fontFamily: 'Arial'
  },

  secondary_text_description:{
    fontSize: 15,
    paddingTop: 4,
    marginLeft:19,
    marginRight: 19,
    marginBottom: 12,
    color: Color._9B
    , fontFamily: 'Arial'
  },

  common_header: {fontSize:22 ,fontWeight: '700', color : Color._4A, fontFamily: 'Arial', marginRight: 20, paddingRight: 8},
  listHeaderTitle:{fontSize: 18 , color: Color._54, fontFamily: 'Arial'},
  listDate:{fontSize: 12, color: Color._A3, fontFamily: 'Arial'},
  value_outer_container: {flexDirection: 'row',justifyContent: 'flex-start', alignItems: 'flex-start'},
  value_container:{flexDirection: 'row', alignItems: 'flex-end'},
  valueStyle:{fontSize: 20, color: Color._54, fontFamily: 'Arial'},
  unit_style:{paddingLeft: 4, fontFamily: 'Arial', paddingBottom: 2},
  button_style:{fontSize: 14, fontWeight: '500', fontFamily: 'Arial'},
  common_text_style: {flex : 1, height : 50,fontSize: 16 , color: Color._4A , justifyContent: 'center', alignItems: 'center',paddingLeft: 16, paddingTop : 12, fontFamily: 'Arial'}
})
export default styles
