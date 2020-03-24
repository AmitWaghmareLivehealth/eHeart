
import React, { Component } from 'react'

import MediaCameraCapture from '../../components'

export default class MediaCamera extends Component {
  render () {
    return <MediaCameraCapture
      rightButtonAction={(imagePath) => {
        const { params } = this.props.navigation.state
        params.setFinalImagePath(imagePath)
        this.props.navigation.back()
      }}
      leftButtonAction={() => {
        this.props.navigation.back()
      }}
      actions={{
        rightButtonText: 'Done',
        leftButtonText: 'Cancel'
      }}
    />
  }
}
