
import React, { Component } from 'react'
import Flatpickr from 'flatpickr'
import PropTypes from 'prop-types'


import { TextInput, View } from 'react-native'


export default class DateTimePicker extends Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    options: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object
    ]),
    children: PropTypes.node
  }

  componentWillReceiveProps (props) {
    if (props.hasOwnProperty('value')) {
      this.flatpickr.setDate(props.value, false)
    }

    const optionsKeys = Object.getOwnPropertyNames(props.options)

    for (let index = optionsKeys.length - 1; index >= 0; index--) {
      const key = optionsKeys[index]
      this.flatpickr.set(key, props.options[key])
    }
  }

  componentDidMount () {
    const options = {
      ...this.props.options,
      onChange: this.props.onChange
    }

    this.flatpickr = new Flatpickr(this.node, options)

    if (this.props.hasOwnProperty('value')) {
      this.flatpickr.setDate(this.props.value, false)
    }
  }

  componentWillUnmount () {
    this.flatpickr.destroy()
  }

  render () {
    // ignore onChange
    // eslint-disable-next-line no-unused-vars
    const { onChange, options, defaultValue, value, children, ...props } = this.props
    return options.wrap
      ? (
        <View {...props} ref={node => { this.node = node }}>
          { children }
        </View>
      )
      : (
        <TextInput {...props} defaultValue={defaultValue}
          ref={node => { this.node = node }} />
      )
  }
}
