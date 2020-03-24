import React, { Component } from 'react'
import { View, FlatList, Text } from 'react-native'
import { Separator } from '../../components'
import { HeaderSignupLarge } from '../../layouts'
import { Routes, Color, Global } from '../../../utils'
import {Ripple} from '../../components'
import PropTypes from 'prop-types';
import styles from './styles'

var allFAQs = require('./../../../utils/json.sources/faqs.json')

export default class FAQListScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedFAQ: 0
    }
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({item}) => (
    <Ripple
      style={styles.containerListItem}
      activeOpacity={8.0}
      onPress={(function () {
        this.setState({ selectedFAQ: item.id })

        this.props.navigation.navigate(Routes.profileBasicDetailsScreen)
      }).bind(this)}
    >
      <Text
        id={item.id}
        style={styles.textListItem}
      >{item.question}</Text>
      <Separator style={{ marginTop: 12 }}/>
    </Ripple>
  )

  render () {
    return (
      <View style={styles.containerMain}>
        <HeaderSignupLarge
          header={'FAQs'}
          description={'Here you will find answers to all of your frequently asked questions.'}
        />
        <FlatList
          style={styles.containerList}
          data={allFAQs}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </View>
    )
  }
}

FAQListScreen.propTypes = {
  var1: PropTypes.string
}

FAQListScreen.defaultProps = {
  var1: ''
}
