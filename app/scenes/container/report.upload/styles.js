
import { StyleSheet } from 'react-native'
import { Global, Color } from '../../../utils'


export default styles = StyleSheet.create({
  scrollViewMainContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 17,
    marginTop: 0,
    marginBottom: 0
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
    height: Global.screenHeight * 0.55
  },
  containerCamOrGalleryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'space-around'
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
    width: Global.screenWidth * 0.603,
    alignSelf: 'center',
    alignContent: 'flex-end',
    margin: 10
  },
  buttonUploadReport: {
    flex: 0,
    borderColor: 'transparent',
    backgroundColor: Color.theme_dark_blue,
    borderRadius: 0,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    marginTop: 30,
    marginBottom: Global.isIphoneX ? 30 : 0,
    height: 50
  }
})
