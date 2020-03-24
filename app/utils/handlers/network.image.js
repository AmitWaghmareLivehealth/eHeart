import RNFetchBlob from 'react-native-fetch-blob'
let dirs = RNFetchBlob.fs.dirs
const sessionName = 'LVTHFiles'
import { URLs } from '../const/urls'
import Global from '../const/globals'

function handleError (error) {
  console.log(error)
  return { success: false, response: {} }
}

export default async function downloadFile (path: string, storagePath: string) {
  return RNFetchBlob.fs.exists(storagePath)
  .then((result) => {
    if (result) {
      return { success: true, response: { path: storagePath }}
    } else {
      return RNFetchBlob.config({
      // response data will be saved to this path if it has access right.
        session: sessionName,
        path: storagePath
      }).fetch('GET', encodeURI(path), {})
      .then((res) => {
      // the path should be dirs.DocumentDir + 'path-to-file.anything'
        console.log('The file saved to ', res.path())
        return { success: true, response: { path: res.path() } }
      }).catch(handleError)
    }
  }).catch(handleError)
}

// export function removeAllFiles() {
//     RNFetchBlob.session(sessionName).dispose()
// }


export async function uploadFile (url:string, params:string = '', isPDF, filePath) {
  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data',
    'Connection': 'close',
    'Content-Disposition': 'form-data'
  }
  var finalURL = encodeURI(url + '?' + params + URLs.devId)
  console.log(finalURL)
  filePath = decodeURIComponent(filePath)
  return RNFetchBlob.fetch('POST', finalURL, headers, [
    { name: 'uploaded_file', filename: 'uploaded_file' + (isPDF ? '.pdf' : '.jpg'), data: (Global.iOSPlatform) ? RNFetchBlob.wrap(filePath) : RNFetchBlob.wrap(filePath)}
  ]).then((response) => {
    console.log(response)
    var data = response.data
    var responseJson = JSON.parse(data)
    return { success: true, response: responseJson }
  }).catch(handleError)
}
