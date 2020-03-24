import { AsyncStorage } from 'react-native'

async function set (key, value) {
  return AsyncStorage.setItem(key, JSON.stringify(value))
    .then(result => result)
    .catch(error => console.log(error))
}

async function get (key) {
  return AsyncStorage.getItem(key)
    .then(result => {
      let val = JSON.parse(result)
      console.log(val)
      return val
    })
    .catch(error => console.log(error))
}

async function remove (key) {
  return AsyncStorage.removeItem(key)
    .then(result => result)
    .catch(error => console.log(error))
}

async function merge (key, value) {
  return AsyncStorage.mergeItem(key, JSON.stringify(value))
    .then(result => result)
    .catch(error => console.log(error))
}
var UserDefaults = {
  set,
  get,
  remove,
  merge
}
export default UserDefaults
