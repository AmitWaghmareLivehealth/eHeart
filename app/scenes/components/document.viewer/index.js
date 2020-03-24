'use strict'

import {NativeModules} from "react-native"
const DocumentPicker = NativeModules.RNDocumentPicker
import { Global } from '../../../utils'

/**
 * Android requires mime types, iOS is a bit more complicated:
 *
 * @see https://developer.apple.com/library/ios/documentation/Miscellaneous/Reference/UTIRef/Articles/System-DeclaredUniformTypeIdentifiers.html
 */
class DocumentPickerUtil {
  static allFiles() {
    return (!Global.iOSPlatform) ? "*/*" : "public.content";
  }

  static images() {
    return (!Global.iOSPlatform) ? "image/*" : "public.image";
  }

  static plainText() {
    return (!Global.iOSPlatform) ? "text/plain" : "public.plain-text";
  }

  static audio() {
    return (!Global.iOSPlatform) ? "audio/*" : "public.audio";
  }

  static pdf() {
    return (!Global.iOSPlatform) ? "application/pdf" : "com.adobe.pdf";
  }
}

module.exports = {DocumentPickerUtil, DocumentPicker};