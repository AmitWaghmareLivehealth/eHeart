// React and react native imports
import React, {
  Component
} from 'react'
import { View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'


class StarButton extends Component {

  constructor(props) {
    super(props);

    this.onButtonPress = this.onButtonPress.bind(this);
  }

  onButtonPress() {
    this.props.onStarButtonPress(this.props.rating);
  }

  render() {
    return (
      <MaterialIcons.Button
        name={this.props.starIconName}
        size={this.props.starSize}
        color={this.props.starColor}
        onPress={this.onButtonPress}
        underlayColor='transparent'
        backgroundColor='transparent'
        style={{padding: 0}}
      />
    )
  }
}

StarButton.propTypes = {
  disabled: PropTypes.bool,
  rating: PropTypes.number,
  onStarButtonPress: PropTypes.func,
  iconSet: PropTypes.string,
  starSize: PropTypes.number,
  starIconName: PropTypes.string,
  starColor: PropTypes.string,
  starStyle: ViewPropTypes.style,
  buttonStyle: ViewPropTypes.style,
}

export default StarButton
