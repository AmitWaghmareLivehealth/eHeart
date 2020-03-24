/**
 * Created by WittBulter on 16/9/5.
 */

import React, {Component} from 'react'
import {View, StyleSheet, Text} from 'react-native'

export default class TabbarItem extends Component {
	constructor (props){
		super(props)
		this.state = {}
	}

	render (){
		return (
			<View>
				{this.props.children}
			</View>
		)
	}
}