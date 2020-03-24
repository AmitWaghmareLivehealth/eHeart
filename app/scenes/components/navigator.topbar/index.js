import React, { Component } from 'react'
import { 
    View,
    Text,
    Image,
    TouchableHighlight,
    ViewPropTypes
} from 'react-native'
import PropTypes from 'prop-types';
import { Global } from '../../../utils'

export default class NavigatorTopbar extends Component {

  static propTypes = {
    ...ViewPropTypes,
    style: ViewPropTypes.style,
    lblLeft: PropTypes.string,
    lblRight: PropTypes.string,
    lblHeader: PropTypes.string,
    iconLeft: PropTypes.string,
    iconRight: PropTypes.string,
    barHeight: PropTypes.number,
    btnLHSEnabled: PropTypes.bool,
    btnRHSEnabled: PropTypes.bool
  }

    state = {  }

    constructor (props) {
        super(props)
        this.state = {
            btnLHSEnabled: this.props.btnLHSEnabled ? this.props.btnLHSEnabled : true,
            btnRHSEnabled: this.props.btnRHSEnabled ? this.props.btnRHSEnabled : true
        }

        this.btnLeft = this.btnLeft.bind(this)
        this.lblHeader = this.btnLeft.bind(this)
        this.btnRight = this.btnLeft.bind(this)
        this.btnWithImageAndTitle = this.btnWithImageAndTitle.bind(this)
        this.btnWithTitle = this.btnWithTitle.bind(this)
        this.btnWithImage = this.btnWithImage.bind(this)
    }

    btnLeft () {
        return () => {
            if (this.state.btnLHSEnabled && this.props.lblLeft && this.props.iconLeft) {
                return (btnWithImageAndTitle(this.props.lblLeft, this.props.iconLeft, this.props.actionBtnLeft))
            }
            if (this.state.btnLHSEnabled && this.props.iconLeft) {
                return (btnWithImage(this.props.iconLeft, this.props.actionBtnLeft))
            }
            if (this.state.btnLHSEnabled && this.props.lblLeft) {
                return (btnWithTitle(this.props.lblLeft, this.props.actionBtnLeft))
            }
        }
    }

    lblHeader () {
        return (
            <View style={ { flex: 0.6, width:45, height: 45, alignItems: 'center',
		justifyContent: 'center', padding: 5} }>
                <Image source={icon}/>
                <Text>{text}</Text>
            </View>
        )
    }

    btnRight () {
        return () => {
            if (this.state.btnRHSEnabled && this.props.lblRight && this.props.iconRight) {
                return (btnWithImageAndTitle(this.props.lblRight, this.props.iconRight, this.props.actionBtnRight))
            }
            if (this.state.btnRHSEnabled && this.props.iconRight) {
                return (btnWithImage(this.props.iconRight, this.props.actionBtnRight))
            }
            if (this.state.btnRHSEnabled && this.props.lblRight) {
                return (btnWithTitle(this.props.lblRight, this.props.actionBtnRight))
            }
        }
    }

    btnWithImageAndTitle(text, icon, action) {
        return (
            <TouchableHighlight 
            onPress={() => { action }}
            style={ { flex: 0.2, width:45, height: 45, alignItems: 'center',
		justifyContent: 'center', padding: 5} }>
                <Image source={icon}/>
                <Text>{text}</Text>
            </TouchableHighlight>
        )
    }

    btnWithTitle(text, action) {
        return (
            <TouchableHighlight 
            onPress={() => { action }}
            style={ { flex: 0.2, width:45, height: 45, alignItems: 'center',
		justifyContent: 'center', padding: 5} }>
                <Text>{text}</Text>
            </TouchableHighlight>
        )
    }
    
    btnWithImage(icon, action) {
        return (
            <TouchableHighlight 
            onPress={() => { action }}
            style={ { flex: 0.2, width: 45, height: 45, alignItems: 'center',
		justifyContent: 'center', padding: 5} }>
                <Image source={icon}/>
            </TouchableHighlight>
        )
    }

    render() {
        return (
            <View style={[{...this.props.style}, {flex:1, flexDirection: 'row', alignItems: 'center',
		justifyContent: 'space-between', height: this.props.barHeight, width: Global.width}]}>
                {this.btnLeft}
                {this.lblHeader}
                {this.btnRight}
            </View>
        )
    }
}