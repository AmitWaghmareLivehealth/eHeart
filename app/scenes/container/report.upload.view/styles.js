
import { StyleSheet } from 'react-native'
import { Global, Color } from '../../../utils'


export default styles = StyleSheet.create({
  scrollViewMainContainer: {
    flex: 1,
    backgroundColor: 'white',
    height: Global.screenHeight + 48
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  containerCamOrGalleryColSuper: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    height: Global.screenHeight * 0.65,
    marginTop: 10,
    marginRight: 18,
    marginLeft: 18,
    marginBottom: 10
  },
  containerCamOrGalleryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'space-around'
  },
  iconCamOrGallery: {
    margin: 20
  },
  iconRemoveImage: {
    justifyContent: 'flex-end',
    backgroundColor: 'transparent'
  },
  orTextForCamAndGallery: {
    fontSize: 20,
    marginTop: 35,
    marginBottom: 30
  },
  imageToUpload: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'flex-start',
    resizeMode: 'contain',
    width: Global.screenWidth - 36,
    alignSelf: 'center',
    alignContent: 'flex-end',
    margin: 10
  },
  buttonUploadReport: {
    backgroundColor: Color.themeColor,
    height: 40,
    borderColor: Color.themeColor,
    alignSelf: 'center'
  },
  imageReport: {
    width: Global.screenWidth - 48,
    height: 200,
    backgroundColor: 'white',
    marginTop: 6
  },
  imageToUploadPreview: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'flex-start',
    resizeMode: 'contain',
    width: Global.screenWidth ,
    alignSelf: 'center',
    alignContent: 'flex-end',
    margin: 10
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  imageDisplay: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom:10
  },

  defaultText: {
    // flex: 1,
    backgroundColor: Color.blueTrackerText,
    color:'red',
    height: 46,
    margin: 16,
    marginBottom:16,
    width: Global.screenWidth * 0.8,
    borderColor: Color.blueTrackerText,
    alignSelf: 'center',
    borderRadius: 4
  }
})
