import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {CommonStyles, Global} from '../../../utils';

export default class HeaderListExtraLarge extends Component {
  render() {
    return (
      <View style={[styles.containerMain, this.props.style]}>
        <View style={{flex: 1}}>
          <Text
            style={[
              CommonStyles.textHeader2,
              styles.textHeader,
              this.props.headerStyle,
            ]}>
            {this.props.header}
          </Text>
          {this.props.description ? (
            <ScrollView bounces={false}>
              <Text style={[CommonStyles.textDescription2, styles.textDesc]}>
                {this.props.description}
              </Text>
            </ScrollView>
          ) : (
            <View style={{padding: 4}}></View>
          )}
        </View>
        <View style={styles.containerActions}>{this.props.children}</View>
      </View>
    );
  }
}

HeaderListExtraLarge.propTypes = {
  header: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.element,
};

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingRight: 18,
    paddingLeft: 18,
    paddingTop: Global.iOSPlatform ? 38 : 18,
    paddingBottom: 18,
  },
  textHeader: {
    flexGrow: 2,
    textAlignVertical: 'bottom',
    fontSize: 32,
    color: 'black',
    fontWeight: '700',
  },
  textDesc: {
    flexGrow: 2,
    paddingTop: 10,
    fontSize: 15,
    color: '#4a4a4a',
    fontWeight: '400',
  },
  containerActions: {
    alignContent: 'flex-end',
  },
});
