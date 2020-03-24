import React, {Component} from 'react';
import {View, Text} from 'react-native';

import {stringAboutUs} from '../../../utils';
import {HeaderListExtraLarge} from '../../layouts';
import CloseBar from '../../components/closebar';
import Global from '../../../utils/const/globals';

export default class AboutUs extends Component {
  constructor(props) {
    super(props);

    this.goback = this.goback.bind(this);
  }

  goback() {
    this.props.closeModal();
  }

  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <CloseBar goBack={this.goback} color={'black'} />
        <HeaderListExtraLarge
          header="About Us"
          description={Global.aboutUs}
          style={{flex: 0, paddingTop: 0}}></HeaderListExtraLarge>
      </View>
    );
  }
}
