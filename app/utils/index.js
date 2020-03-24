/* CONSTANTS */
import Color from './const/colors'
import Global from './const/globals'
import * as Images from './const/images'
import Routes from './const/routes'
import CommonStyles from './const/styles'
import strings,
{
  stringsAlert,
  stringsAlertFile,
  stringsAlertReports,
  stringsDesignation,
  stringsSex,
  stringsUserDefaults,
  stringsNotifications,
  stringReportStatus,
  stringfeedBack,
  stringRazorPay,
  stringsAppId,
  stringReportStages
} from './const/strings'
import { URLs } from './const/urls'

/* HANDLERS */
import DB from './handlers/db'
import * as extFile from './handlers/file'
import * as extString from './exts/strings'
import UserDefaults from './handlers/localstorage'
import NetworkRequest from './handlers/network'
import * as NetworkRequestFile from './handlers/network.image'
import * as RemoteNotification from './handlers/notification.remote'

/* MANAGERs */
import * as AlertManager from './managers/alert.manager'
import * as CommonManager from './managers/common.manager'
import * as DashboardManager from './managers/dashboard.manager'
import * as DictionaryManager from './managers/dictionary.manager'
import * as LoginManager from './managers/login.manager'
import * as ReportManager from './managers/report.manager'
import * as UnitManager from './managers/unit.manager'
import * as UserManager from './managers/user.manager'
import * as LocationManager from './managers/location.manager'

module.exports = {
  Global,
  Color,
  Images,
  Routes,
  CommonStyles,
  strings,
  stringsAlert,
  stringsAlertFile,
  stringsAlertReports,
  stringsDesignation,
  stringsSex,
  stringsUserDefaults,
  stringsNotifications,
  stringReportStatus,
  stringReportStages,
  stringfeedBack,
  stringRazorPay,
  stringsAppId,
  URLs,
  DB,
  extFile,
  extString,
  UserDefaults,
  NetworkRequest,
  NetworkRequestFile,
  RemoteNotification,
  AlertManager,
  CommonManager,
  DashboardManager,
  DictionaryManager,
  LoginManager,
  ReportManager,
  UnitManager,
  UserManager,
  LocationManager
}
