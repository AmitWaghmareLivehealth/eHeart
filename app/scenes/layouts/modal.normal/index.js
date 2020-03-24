import React, { Component } from 'react'
import { View, Modal, TouchableOpacity, ScrollView } from 'react-native'
import PropTypes from 'prop-types'

import { Routes, Color, Global, CommonStyles } from '../../../utils'
//import { DialogHeader, Fab, Separator, ButtonTextOnly } from '../../components'


import DialogHeader from '../../components/dialog.header'
import Fab from '../../components/action.fab'
import Separator from '../../components/seperator'
import ButtonTextOnly from '../../components/button.textonly'

export default class LTHModalNormal extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    isFlexibleModalContentHeight: PropTypes.bool
  }

  static defaultProps = {
    title: '',
    description: '',
    isFlexibleModalContentHeight: true
  }

  constructor (props) {
    super(props)
    var fabBottomHeight = (this.props.fabBottomHeight || Global.screenHeight * 0.15)
    var modalHeight =  Global.screenHeight - ((fabBottomHeight + 50) * 2)
    this.state = {
      fabBottomHeight: fabBottomHeight,
      modalHeight: modalHeight,
      scrollContentHeight: modalHeight
    }

    this.btnClose = this.btnClose.bind(this)
  }

  btnClose () {
    return <ButtonTextOnly
      title={'CLOSE'}
      style={{ flex: 0, backgroundColor: 'white', height: 56, paddingTop: 10, paddingLeft: 24, paddingBottom: 18, paddingRight: 24 }}
      titleStyle={[CommonStyles.button_style, { textAlign: 'left' } ]}
      onPress={this.props.onRequestClose}
    />
  }

  render () {
    /**
     * fabBottomHeight = Global.screenHeight * 0.15 + 60 Fab Size + 15 Top Margin
     * ModalMaxHeight =
     * Global.screenHeight - fabBottomHeight  + 60 (Fab Height) +
     * 20(Fab to modal margin) * 2
     * fabBottomHeight = Modal startPoint
     * *
     * title
     * description
     * content
    */

    return (
      <Modal
        {...this.props}
        ref='modal'
        animationType={'none'}
        transparent={true}
        onRequestClose={this.props.onRequestClose}
      >
        <View
          activeOpacity={1}
          style={{ flex: 1, flexGrow: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000080' }}
           /*onPress={() => {
            this.setState({ visible: false })
          }}*/
        >
          <View style={{ flex: 1, flexGrow: 1, flexShrink: 0.5, flexDirection: 'column', marginLeft: 24, marginRight: 24, backgroundColor: '#ffffff', borderRadius: 6, minHeight: 20, maxHeight: Global.screenHeight - 48 }}>
            <View>
              {this.props.children}
            </View>
            { this.props.actionList
            ? <View style={{ flexDirection: 'row', height: 30, justifyContent: 'flex-end', marginTop: 10, marginLeft: 24, marginBottom: 18, marginRight: 24 }}>
              {this.btnClose()}
              {this.props.actionList.map((element, index)=> {
                return <ButtonTextOnly
                  key={element.title}
                  title={element.title.toUpperCase()}
                  style={{ width: 80 }}
                  color={element.color}
                  titleStyle={[CommonStyles.button_style, { textAlign: 'center', paddingLeft: 15 }, element.titleStyle]}
                  onPress={element.onPress}
                  isEnabled={element.enabled}
                />
              })}
            </View>
            : this.btnClose()
            }
          </View>
        </View>
      </Modal>
    )
  }
}
