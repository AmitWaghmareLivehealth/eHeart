import React, { Component } from 'react'
import { View, StyleSheet , TouchableOpacity, Image} from 'react-native'
import PropTypes from 'prop-types'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Global, Images } from '../../../utils'

export default class CloseBar extends Component {
  render () {
    var iconSize = 28
    var defaultIconColor = 'black'
    return (
      <View
        style={[styles.opacityStyle, this.props.style]}
        >

          <MaterialIcons.Button
            name={this.props.icon ? this.props.icon :'close'}
            size={this.props.size || iconSize}
            color={this.props.color || defaultIconColor}
            style={{ padding: 5 }}
            onPress={this.props.goBack}
            underlayColor='transparent'
            backgroundColor='transparent'
          />
        <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
          {
              this.props.actionArray.map(function (element, index) {
                return(
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
                   style={{ padding: 16}}>
                     <Image
                        source={Images.imageDownload}
                        style={{tintColor : '#565656'}}/>
                 </TouchableOpacity>
                )
              })
          }
        </View>
      </View>
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
    paddingTop: Global.iOSPlatform ? 32 : 12,
    paddingLeft: 12,
    paddingRight: 0
  }
})
