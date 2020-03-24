import { StyleSheet } from 'react-native'
import { Global } from '../../../utils'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  preview: {
    flex: 1
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 20
  },
  // New List
  textStyle: {
    color: 'white',
    fontSize: 20
  },
  ratioBestText: {
    color: 'white',
    fontSize: 18
  },
  ratioText: {
    color: '#ffc233',
    fontSize: 18
  },
  topButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    backgroundColor: '#00000079'
  },
  captureButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  captureButton: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5
  },
  captureNumber: {
    justifyContent: 'center',
    color: 'black',
    backgroundColor: 'transparent'
  },
  bottomButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  cameraContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Global.screenWidth,
    height: Global.screenHeight
  },
  bottomButtons: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#00000079'
  },
  gap: {
    flex: 10,
    flexDirection: 'column'
  },
  bottomContainerGap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10
  },
  emptyCameraWindowContainer: {
    height: Global.screenHeight - 160
  }
})
