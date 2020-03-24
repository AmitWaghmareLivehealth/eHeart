import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import { Global, CommonStyles } from '../../../utils'

export default class HeaderListExtraLarge extends Component {
  ViewPropTypes = {

  }

  render () {
    var headerStyle = [CommonStyles.textHeader2,  styles.textHeader]
    if (Array.isArray(this.props.headerStyle)) {
      headerStyle = headerStyle.push.apply(headerStyle, this.props.headerStyle)
    } else {
      headerStyle.push(this.props.headerStyle)
    }
    return (
      <View style={[styles.descContainer, this.props.style]}>
        <Text style={headerStyle}>{this.props.header}</Text>
        {(this.props.description.length > 2) && <Text style={[CommonStyles.textDescription2, styles.textDescription, this.props.descriptionStyle]} numberOfLines={4}>{this.props.description}</Text>}
      </View>
    )
  }
}

// HeaderListExtraLarge.propTypes = {
//   header: PropTypes.string,
//   description: PropTypes.string,
//   style: PropTypes.object,
//   headerStyle: PropTypes.oneOfType([
//     PropTypes.object,
//     PropTypes.array
//   ]),
//   descriptionStyle: PropTypes.object,
//   children: PropTypes.element
// }

HeaderListExtraLarge.defaultProps = {
  header: '',
  description: '',
  style: {},
  headerStyle: {},
  descriptionStyle: {}
}


const styles = StyleSheet.create({
  descContainer: {
    alignItems: 'flex-start',
    paddingRight: 17,
    paddingLeft: 17,
    paddingTop: 45,
    paddingBottom: 20
  },
  textHeader: {
    width: Global.screenWidth * 0.8,
    color: 'black'
  },
  textDescription: {
    width: Global.screenWidth * 0.8,
    marginTop: 5
  }
})
