import React, { Component } from 'react'
import { NavigationActions } from 'react-navigation'
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput
} from 'react-native'
import { StateRepresentation } from '../../layouts'
import {Ripple} from '../../components'
import ListView from 'deprecated-react-native-listview';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var countryCode = require('./../../../utils/json.sources/CountryCodes.json')
var cc = countryCode.sort(function (_a, _b) {
  let aName = _a.name.trim().replace('+', '')
  let bName = _b.name.trim().replace('+', '')
  return (aName > bName) ? 1 : (bName > aName ? -1 : 0)
})

export default class GetCountryCode extends Component {
  static navigationOptions = {
    title: 'Select your country'
  }
  constructor (props) {
    super(props)
    this.state = {
      dataSource: cc,
      dataSource2: [{"code": "", "name": "", "countryCode": ""}],
      isSearchedFlag : 0,
      isStateRepFlag: false
    }
  }

  selectedCell (cellData) {
    const { params, navigation } = this.props.navigation.state
    params.countryCodeChange(cellData.name, cellData.code)
    this.props.navigation.dispatch(NavigationActions.back())
  }



   searchTrackers(text){
    if(text){
      var tempArr = []
      cc.forEach(function(element) {
        console.log(element.name+":"+text)
        if (element.name.toLowerCase().includes(text.toLowerCase())){
          tempArr.push(element)
        }
      }, this);
      console.log(tempArr)

      if(tempArr.length>0){
        this.setState({
        dataSource2 : ds.cloneWithRows(tempArr),
        isSearchedFlag : 1,
        isStateRepFlag: false
      })

    }else{
      this.setState({
        dataSource2 : ds.cloneWithRows([]),
        isSearchedFlag : 1,
        isStateRepFlag: true
      })

      }


    } else {
      this.setState({
        dataSource2 : ds.cloneWithRows([]),
        isSearchedFlag : 0,
        isStateRepFlag: false
      })
    }
  }

  _renderRow(item,secId,rowId){
    var finalElement = this.state.isSearchedFlag === 0
      ? (<View style = {{height:0}}/>
      ) : (

        <TouchableHighlight
                onPress = {()=> this.selectedCell(item)}
                underlayColor = '#aaaaaa'>
                <View style={{flex: 1,flexDirection: 'row', height: 40, marginLeft: 16, marginRight: 16, alignItems: 'center'}}>
                  <Text style={{ fontFamily: 'Arial' ,flex: 1}}>{item.name}</Text>
                  <Text style={{ fontFamily: 'Arial' ,flex: 0.5, color: '#aaaaaa', textAlign: 'right'}}>{item.code}</Text>
                  <View style={{position: 'absolute', left: -16, right: -16, bottom: 0, height: 0.7, backgroundColor: 'lightgrey'}}/>
                </View>
              </TouchableHighlight>

      )

    return finalElement
  }

  render () {
    return (
      <View style={styles.container}>

         <TextInput
          style={{marginLeft : 16, marginRight: 16, marginBottom: 8, height: 50,  marginTop: 8}}
          onChangeText={(text) => this.searchTrackers(text)}
          placeholder = 'Choose country'/>
     { this.state.isSearchedFlag === 1
      ? <View>
        {
        (this.state.isStateRepFlag)
          ?
          (
            <StateRepresentation
            image='search'
            description= 'Could not find any country matching your text'></StateRepresentation>
          )
          :
          (
            <ListView
              bounces={false}
              enableEmptySections
              dataSource={this.state.dataSource2}
              renderRow={(item,secId,rowId) => this._renderRow(item,secId,rowId)}></ListView>
          )
        }
         </View> :
        <ListView
          bounces={false}
          style={{
            flex: 1, flexGrow: 1 }}
          dataSource = {ds.cloneWithRows(this.state.dataSource)}
          renderRow = {(rowData) => {
            return (
              <TouchableHighlight
                onPress = {()=> this.selectedCell(rowData)}
                underlayColor = '#aaaaaa'>
                <View style={{flex: 1,flexDirection: 'row', height: 40, marginLeft: 16, marginRight: 16, alignItems: 'center'}}>
                  <Text style={{ fontFamily: 'Arial' ,flex: 1}}>{rowData.name}</Text>
                  <Text style={{ fontFamily: 'Arial' ,flex: 0.5, color: '#aaaaaa', textAlign: 'right'}}>{rowData.code}</Text>
                  <View style={{position: 'absolute', left: -16, right: -16, bottom: 0, height: 0.7, backgroundColor: 'lightgrey'}}/>
                </View>
              </TouchableHighlight>
            )
          }}
          enableEmptySections = {true}>
          </ListView>
     }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
})
