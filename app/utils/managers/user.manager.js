import { stringsUserDefaults } from '../const/strings'
import UserDefaults from '../handlers/localstorage'

function handleError (error) {
  console.log(error)
}
export const basicUserDetails = async function getBasicUserDetials() {
  return {
    userToken: UserDefaults.get(stringsUserDefaults.userToken)
      .then(result => result).catch(handleError),
    userDetailsId: UserDefaults.get(stringsUserDefaults.userDetailsId)
      .then(result => result).catch(handleError),
    userName: UserDefaults.get(stringsUserDefaults.userName)
      .then(result => result).catch(handleError),
    userDesignation: UserDefaults.get(stringsUserDefaults.userDesignation)
      .then(result => result).catch(handleError),
    userCountryCode: UserDefaults.get(stringsUserDefaults.userCountryCode)
      .then(result => result).catch(handleError),
    userContact: UserDefaults.get(stringsUserDefaults.userContact)
      .then(result => result).catch(handleError),
    userEmail: UserDefaults.get(stringsUserDefaults.userEmail)
      .then(result => result).catch(handleError),
    userAddress: UserDefaults.get(stringsUserDefaults.userAddress)
      .then(result => result).catch(handleError),
    userSex: UserDefaults.get(stringsUserDefaults.userSex)
      .then(result => result).catch(handleError),
    userDateOfBirth: UserDefaults.get(stringsUserDefaults.userDateOfBirth)
      .then(result => result).catch(handleError),
    currentProfilePicURLFromWeb: UserDefaults.get(stringsUserDefaults.currentProfilePicURLFromWeb)
      .then(result => result).catch(handleError)
  }
}
