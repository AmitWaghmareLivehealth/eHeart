import React, { Component } from 'react'
import Ripple from './react-native-material-ripple'
import PropTypes from 'prop-types';

export default class NewRipple extends Component {
  static propTypes = {
    timeout: PropTypes.number,
    onPress: PropTypes.func
  }

  static defaultProps = {
    timeout: 10,
    onPress: () => {}
  }

  constructor (props) {
    super(props)
    this._onPress = this._onPress.bind(this)
  }

  _onPress () {
    this.props.onPress()
    // setTimeout((() => {
    // }).bind(this), (this.props.timeout))
  }

  render () {
    return (
      <Ripple
        {...this.props}
        onPress={this._onPress}
      />
    )
  }
}
