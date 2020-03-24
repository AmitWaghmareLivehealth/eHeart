
export default async function RESTRequest (method: NetworkRequest, url:string, params:string = '', onCompletion) {
  var request = new XMLHttpRequest()
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return
    }
    if (request.status === 200 && request.readyState === 4) {
      onCompletion(true, request.responseText)
    } else {
      onCompletion(false, '')
    }
  }
  request.open('POST', url)
  request.setRequestHeader('Accept', 'application/json')
  request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  request.setRequestHeader('Content-length', params.length)
  request.setRequestHeader('Connection', 'close')
  request.send(params) 
}