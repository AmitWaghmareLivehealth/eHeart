import { StyleSheet } from 'react-native'
import { Global } from '../../../utils'

const styles = StyleSheet.create({
	body: {
		flex: 1,
		width: 500,
		overflow: 'hidden',
		height: 500,
		flexDirection: 'column',
        backgroundColor: 'pink'
	},
	content: {
		flex: 1,
		backgroundColor: '#456723'
	},
	box: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#456799'
	},
	footer: {
		width: 500,
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderTopWidth: 1,
		marginBottom: 5,
		height: 45,
		borderTopColor: '#E5E5E5',
	},
	footerButton: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 5,
		paddingBottom: 5,
		backgroundColor: 'pink'
	},
	icon: {
		width: Global.iOSPlatform ? 22 : 18,
		height: Global.iOSPlatform ? 22 : 18,
		alignItems: 'center',
		backgroundColor: '#456723'	
	},
	onlyIcon: {
		width: 27,
		height: 27,
		alignItems: 'center',
		marginTop: 5,
		marginBottom: 5,
		backgroundColor: '#456723'
	},
	text: {
		fontSize: 12,
		color: '#9B9DB0',
		paddingTop: 3,
		textAlign: 'center',
				backgroundColor: '#456723'	
	},
	onlyText: {
		fontSize: 16,
		color: '#9B9DB0',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 8,
		marginBottom: 8,
	},
})

module.exports = styles