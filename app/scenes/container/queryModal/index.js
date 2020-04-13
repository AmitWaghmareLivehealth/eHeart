import React, {Component} from 'react';
import {View, TextInput} from 'react-native';
import {Button, Text, Input, Item, Icon} from 'native-base';
import CloseBar from '../../components/closebar';
import UserDefaults from '../../../utils/handlers/localstorage';

export default class QueryModal extends Component {
  state = {query: ''};

  render() {
    const {closeModal, onSubmitQuery, user} = this.props;
    const {query} = this.state;

    return (
      <View>
        <View style={{display: 'flex', flexDirection: 'row',marginLeft:-10}}>
          <CloseBar goBack={closeModal} color={'black'} />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 23, fontWeight: 'bold'}}>Submit Query</Text>
          </View>
        </View>

      <View style={{backgroundColor: 'white',padding:12}}>
         
        <View >
          <LabelAndText label={'Name'} text={user.fullName} />
          <View style={{marginTop: 10}}>
            <LabelAndText label={'Email'} text={user.user.email || '-'} />
          </View>
          <View style={{marginTop: 10}}>
            <LabelAndText label={'Contact'} text={user.contact || '-'} />
          </View>
          <View style={{marginTop: 10}}>
            <LabelAndText
              label={'Address'}
              text={
                user.area || user.city ? user.area + ' , ' + user.city : '-'
              }
            />
          </View>
        </View>

        <View  style={{marginTop:20}}>
          <Item regular>
            <Input
              multiline
              placeholder="Enter your query"
              style={{paddingBottom: 120}}
              onChangeText={value => this.setState({query: value})}
              value={query}
            />
            {query ? (
              <Icon
                style={{position: 'absolute', top: 0, right: 0}}
                onPress={() => this.setState({query: ''})}
                name="close"
              />
            ) : (
              <View></View>
            )}
          </Item>
          <Button
            onPress={() => onSubmitQuery(query)}
            disabled={!query}
            block
            style={{marginTop: 30}}
            >
            <Text>Submit</Text>
          </Button>
        </View>
      </View>
      </View>
    );
  }
}

const LabelAndText = ({label, text}) => (
  <View>
    <Text style={{color: 'gray', fontSize: 13}}>{label}</Text>
    <Text>{text}</Text>
  </View>
);
