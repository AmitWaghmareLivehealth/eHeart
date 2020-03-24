import { StyleSheet } from 'react-native'
import { Global, Color } from '../../../utils'


const styles = StyleSheet.create({
  bar: {
  marginTop: 50,
  height: 32,
  alignItems: 'center',
  justifyContent: 'center',
},
  header: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: '#03A9F4',
  overflow: 'hidden',
},

  containerIndirectHeader: {flex: 1, flexDirection: 'row', alignItems: 'stretch', padding: 16, paddingBottom: 12, paddingLeft: 32, backgroundColor: '#FFFFFF'},

  textIndirectHeader: {
    fontWeight: '700',
    marginRight: 10
  },
  containerDateAndLabNameHeader: {
    flex: 1,
    padding: 20,
    paddingBottom: 10,
    paddingTop: 6,
    backgroundColor: Color._EEGrayTableHeader,
    justifyContent: 'space-between'
  },
  textDateAndLabNameHeader: { width: Global.screenWidth * 0.8, marginTop: 7 },

  containerRowMain: { flex: 1, flexDirection: 'row', padding: 24, paddingTop: 16, paddingBottom: 16 },

  textReportName: { flex: 0.95, fontWeight: '400' },
  iconAttachment: { flex: 0.07, color: '#898989' },
  iconIsRead: { flex: 0.07, color: '#1988F3', marginTop: 3, marginLeft: 10 },

  title_style: { marginBottom: 7 },
  secondary_title_style:{ marginLeft: 24, marginRight: 24, marginBottom: 10, color: '#000' }
})

export default styles
