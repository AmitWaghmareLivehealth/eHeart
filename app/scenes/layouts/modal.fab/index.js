import React, { Component } from 'react'
import { View, Modal, TouchableOpacity, ScrollView } from 'react-native'
import PropTypes from 'prop-types'

import { Routes, Color, Global, CommonStyles } from '../../../utils'

import ButtonTextOnly from '../../components/button.textonly'
import Fab from '../../components/action.fab'
import DialogHeader from '../../components/dialog.header'

export default class LTHModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    isFlexibleModalContentHeight: PropTypes.bool,
    isModalBottomAlign: PropTypes.bool,
    isCloseVisible: PropTypes.bool
  }

  static defaultProps = {
    title: '',
    description: '',
    isFlexibleModalContentHeight: true,
    isModalBottomAlign: false,
    isCloseVisible: true,
    autoContentHeightSet: false
  }

  constructor (props) {
    super(props)
    var fabBottomHeight = (this.props.fabBottomHeight || (Global.screenHeight * 0.15))
    var modalHeight =  Global.screenHeight - (((fabBottomHeight * 2) + 56))
    let maxModalHeight = Global.screenHeight - ((fabBottomHeight * 2) + 120)
    if (modalHeight > maxModalHeight) {
      modalHeight = maxModalHeight
    }
    this.state = {
      fabBottomHeight: fabBottomHeight,
      modalMaxHeight: modalHeight,
      scrollContentHeight: modalHeight,
      autoContentHeightSet: false
    }

    this.handleScroll = this.handleScroll.bind(this)
  }

  handleScroll (contentWidth, contentHeight) {
    const size = 150
    var newContentHeight = this.state.modalMaxHeight - size
    if (newContentHeight > contentHeight && this.props.isFlexibleModalContentHeight) {
      newContentHeight = contentHeight + size
      this.setState({
        modalMaxHeight: newContentHeight,
        autoContentHeightSet: true
      })
    }
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
          style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#00000080', paddingBottom: ((this.state.fabBottomHeight * 2) + 40) }}
           /*onPress={() => {
            this.setState({ visible: false })
          }}*/
        >
          <View style={{ flex: 1, flexDirection: 'column', margin: 18, marginBottom: 0, backgroundColor: '#ffffff', borderRadius: 6, maxHeight: this.state.modalMaxHeight, minHeight: 20, width: Global.screenWidth - 36 }}>
            { this.props.renderHeader
              ? this.props.renderHeader()
              : <DialogHeader
                title={this.props.title}
                secondaryTitle={this.props.description}
                containerStyle={{ paddingLeft: 18, paddingRight: 18, paddingTop: 22, paddingBottom: 14 }}
              />
            }
            {/*<Separator />*/}
            <ScrollView
            bounces={false}
            onContentSizeChange={this.handleScroll}
            style={{ flex: 0, marginLeft: 18, marginRight: 18,backgroundColor: 'white'}}>
              <View style={{ flex: 1 }}>
                {this.props.children}
              </View>
            </ScrollView>
            {/*<Separator />*/}
            { this.props.actionList
            ? <View style={{ flexDirection: 'row', height: 30, justifyContent: 'flex-start', marginTop: 10, marginLeft: 18, marginBottom: 18, marginRight: 18 }}>
              {this.props.actionList.map((element, index)=> {
                return <ButtonTextOnly
                  key={element.title}
                  title={element.title}
                  style={{ width: 80 }}
                  color={element.color}
                  titleStyle={[CommonStyles.button_style, { textAlign: 'center', paddingLeft: 10 }, element.titleStyle]}
                  onPress={element.onPress}
                  isEnabled={element.enabled}
                />
              })}
            </View>
            : this.props.isCloseVisible && <ButtonTextOnly
              title={'CLOSE'}
              style={{ flex: 0, backgroundColor: 'white', height: 48, paddingTop: 18, paddingLeft: 18, paddingBottom: 18, paddingRight: 18, marginBottom: -7 }}
              titleStyle={[CommonStyles.button_style, { textAlign: 'left'} ]}
              onPress={this.props.onRequestClose}
            />
            }
          </View>
        </View>
        <Fab
          rippleStyle={{ bottom: this.state.fabBottomHeight }}
          iconName='close'
          color={'#000000'}
          onPress={this.props.onRequestClose}
        />
      </Modal>
    )
  }
}
