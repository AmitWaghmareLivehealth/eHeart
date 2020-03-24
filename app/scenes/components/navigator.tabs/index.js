
import React, {Component} from 'react'
import {StyleSheet, View, Text, Image, TouchableHighlight, Dimensions, Animated, Easing, ViewPropTypes} from 'react-native'
import Item from './item'
import styles from './styles'
import PropTypes from 'prop-types';
export default class Tabbar extends Component {

	static propTypes = {
		...ViewPropTypes,
		style: ViewPropTypes.style,
		activeColor: PropTypes.string,
		height: PropTypes.number,
	}
	static Item = Item
	constructor (props){
		super(props)
		this.state = {
			content: this.props.children,
			contentActive: this.props.index? this.props.index:0,
			contentHeight: this.props.height? this.props.height: 45,
			textActive: this.props.activeColor? this.props.activeColor: '#FE985B',
			footerMarginBottom: new Animated.Value(0),
		}
	}


	/**
	 *
	 * @param children {Array} children pages footer
	 */
	footerBar (children){
		/**
		 *
		 * @param done {function} item callback
		 * @param index {number} onpress index
		 */
		const pressHandle = (done, index) =>{
			this.setState({
				contentActive: index
			})
			done&& done()
		}

		const textBox = () =>{
		}
		return children.map((item, index) =>{
			const active = this.state.contentActive== index
			const selected = item.props.selectedIcon? item.props.selectedIcon: item.props.icon
			const box = (text, icon) =>{
				if (!text){
					return (
						<View style={styles.box}>
							<Image source={active? selected: item.props.icon}
							       style={styles.onlyIcon}
							       {...item.props.iconStyle}
							/>
						</View>
					)
				}
				if (!icon){
					return (
						<View style={styles.box}>
							<Text style={[styles.onlyText, active&& {color: this.state.textActive}, {...item.props.textStyle}]}
							>
								{text}
							</Text>
						</View>
					)
				}
				return (
					<View style={styles.box}>
						<Image source={icon}
						       style={styles.icon}
						       {...item.props.iconStyle}
						/>
						<Text style={[styles.text, active&& {color: this.state.textActive}, {...item.props.textStyle}]}
						>
							{text}
						</Text>
					</View>
				)
			}
			return (
				<TouchableHighlight key={`tabbar-item${index}`}
				                    style={styles.footerButton}
				                    onPress={() => pressHandle(item.props.onPress, index)}
				                    underlayColor={'transparent'}
				>
					{box(item.props.text, active? selected: item.props.icon)}
				</TouchableHighlight>
			)
		})
	}

	render (){
		return (
			<View style={styles.body}>
				<View style={styles.content}>
					{this.state.content[this.state.contentActive].props.children}
				</View>
				<Animated.View style={[styles.footer]}
				               {...this.props.style}
				>
					{this.footerBar(this.props.children)}
				</Animated.View>
			</View>
		)
	}

	/**
	 *
	 * @param t [{bool}] footBar show&hide
	 */
	toggleBar (t = (this.state.footerMarginBottom._value == 0 )){
		Animated.timing(
			this.state.footerMarginBottom,{
				toValue: t? -85: 0,
				duration: 190,
				easing: Easing.linear
			}
		).start()
	}

	/**
	 *
	 * @param index [{number}] screen index
	 */
	jumpToIndex (index){
		this.setState({
			contentActive: index
		})
	}


	componentWillReceiveProps(nextProps) {
		if (nextProps.index != undefined) this.jumpToIndex(nextProps.index)
		if (nextProps.toggleBar != undefined) this.toggleBar(!nextProps.toggleBar)
	}

}

