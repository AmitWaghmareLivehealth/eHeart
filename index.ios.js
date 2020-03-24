import { AppRegistry } from 'react-native'
import setup from './app/setup'
import strings from './app/utils/const/strings'

AppRegistry.registerComponent(strings.appName, () => setup)
