import {PermissionsAndroid, Alert} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';

export async function request_storage_runtime_permission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'ReactNativeCode Storage Permission',
        message:
          'ReactNativeCode App needs access to your storage to download Photos.',
      },
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Storage Permission Not Granted');
    }
  } catch (err) {
    console.warn(err);
  }
}

export const downloadImageFromURL = (image) => {
  return new Promise((resolve, reject) => {
    const date = new Date();
    const image_URL = image.url;
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then((res) => {
        Alert.alert('Image Downloaded Successfully.');
        resolve(res);
      })
      .catch((err) => {
        Alert.alert('Image Not Downloaded Successfully.');
        reject(err);
      });
  });
};

getExtention = (filename) => {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
};



export const replaceHTMLTags = (text) =>
  text.replace('<', '&lt').replace('>', '&gt');
