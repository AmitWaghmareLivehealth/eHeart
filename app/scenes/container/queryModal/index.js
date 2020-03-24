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
      <View style={{backgroundColor: 'white'}}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <CloseBar goBack={closeModal} color={'black'} />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 23, fontWeight: 'bold'}}>Submit Query</Text>
          </View>
        </View>

        <View style={{paddingHorizontal:20}}>
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

          <View>
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
                  style={{position: 'absolute', top: 0, right: 0,color:'#b6b6b6'}}
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
              style={{marginTop: 30}}>
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
