import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Color } from '../../../utils'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ripple from '../ripple'

export default class Fab extends Component {
  render () {
    return (
      <View
        style={[styles.containerMainRipple, this.props.rippleStyle]}>
        <Ripple
          activeOpacity={0.5}
          onPress={this.props.onPress}
          style={[styles.containerFab, { backgroundColor: this.props.color || Color.fab_color }]}
        >
          <MaterialIcons
            name={this.props.iconName}
            size={28}
            style={[{ color: 'white' }, this.props.iconStyle]}
          />
        </Ripple>
      </View>
    )
  }
}

Fab.propTypes = {
  iconName: PropTypes.string,
  onPress: PropTypes.func,
  rippleStyle: PropTypes.object,
  iconStyle: PropTypes.object
}

Fab.defaultProps = {
  iconName: 'add',
  onPress: () => {},
  rippleStyle: {},
  iconStyle: {}
}

const styles = StyleSheet.create({
  containerMainRipple: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 16,
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  containerFab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Color.fab_color,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }
})
