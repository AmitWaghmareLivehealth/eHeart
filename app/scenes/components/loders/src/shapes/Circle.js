import React, { Component } from 'react';
import { ART } from 'react-native';
const { Shape, Path } = ART;
import PropTypes from 'prop-types'


export default class Circle extends Component {
  static propTypes = {
    radius: PropTypes.number.isRequired,
    opacity: PropTypes.number
  };

  render() {
    const { radius } = this.props;

    const path = Path()
      .moveTo(0, -radius)
      .arc(0, radius * 2, radius)
      .arc(0, radius * -2, radius)
      .close();

    return <Shape {...this.props} d={path}/>;
  }
}
