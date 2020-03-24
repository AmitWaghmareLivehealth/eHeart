import { StyleSheet } from 'react-native'
import { Color, Global } from '../../../utils'

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: 'white'
  },
  containerMainRow: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    paddingBottom: 0
  },
  viewSeparator: {
    marginTop: 16
  },
  imageReport: {
    width: Global.screenWidth - 48,
    height: 200,
    backgroundColor: 'white',
    marginTop: 6
  },
  textGraphDataUnavailable: {
    fontWeight: '400',
    color: '#DFDFDF',
    fontSize: 12,
    paddingTop: 6
  },
  viewIndicator: {
    flex: 0,
    marginLeft: 3,
    width: 4,
    height: 23,
    borderRadius: 1.5,
    overflow: 'hidden'
  }
})

export default styles
