import React, { Component } from 'react'
import { Animated, View, StyleSheet, Text, TouchableOpacity , Image} from 'react-native'
import PropTypes from 'prop-types'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { Global, CommonStyles, Images } from '../../../utils'
export default class CloseBar extends Component {

  constructor (props) {
    super(props)
    this.state = {
      fadeAnim: new Animated.Value(0)  // Initial value for opacity: 0
    }
    this.fadeIn = this.fadeIn.bind(this)
    this.fadeOut = this.fadeOut.bind(this)
  }

  fadeIn () {
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 10000            // Make it take a while
      }
    ).start()
  }

  fadeOut () {
    this.
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 0,                   // Animate to opacity: 1 (opaque)
        duration: 10000             // Make it take a while
      }
    ).start()
  }

  render () {
    var iconSize = 28
    var defaultIconColor = 'black'

    var val = (((this.props.animatedMaxHeight - 50) / 100)) * 7

    return (
      <Animated.View
        style={[styles.opacityStyle, CommonStyles.commonShadowWithoutBorder, { ...this.props.style, opacity: val }]}
        >
        <MaterialIcons.Button
          name={'close'}
          size={this.props.size || iconSize}
          color={this.props.color || defaultIconColor}
          style={{ padding: 5 }}
          onPress={this.props.goBack}
          underlayColor='transparent'
          backgroundColor='transparent'
        />
        <Text numberOfLines={1} style={[CommonStyles.textHeaderReportView, { flex: 1, textAlign: 'center', backgroundColor: 'white', alignSelf: 'center', fontWeight: '700' }]}>{this.props.title || ''}</Text>
        <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
          {
              this.props.actionArray.map(function (element, index) {
                return (
                element.name !== 'file-download'
                ?
                <MaterialIcons.Button
                  key={element.name + index}
                  name={element.name}
                  size={element.size || iconSize}
                  color={element.color || defaultIconColor}
                  onPress={element.onPress}
                  underlayColor='transparent'
                  backgroundColor='transparent'
                  style={{ padding: 5, marginLeft: 4 }}
                />
                :
                <TouchableOpacity
                  activeOpacity={0.4}
                  onPress={element.onPress}
                  style={{ padding:16}}>
                    <Image
                       source={Images.imageDownload}
                       style={{tintColor : '#565656'}}/>
                </TouchableOpacity>
               )
              })
          }
        </View>
      </Animated.View>
    )
  }
}

CloseBar.propTypes = {
  style: PropTypes.object,
  size: PropTypes.number,
  color: PropTypes.string,
  actionArray: PropTypes.array,
  goBack: PropTypes.func
}

CloseBar.defaultProps = {
  actionArray: [],
  goBack: () => {}
}

const styles = StyleSheet.create({
  opacityStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 9,
    paddingTop: Global.iOSPlatform ? 21 : 12,
    paddingLeft: 12,
    paddingRight: 0,
    position: 'absolute',
    left: 0,
    top: 0,
    height: Global.iOSPlatform ? 65 : 58,
    width: Global.screenWidth,
    backgroundColor: 'red'
  }
})
