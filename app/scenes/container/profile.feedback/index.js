import React, {Component} from 'react';
import {View, Text, Platform} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import {Color, stringsAppId, Global} from '../../../utils';

import {HeaderListExtraLarge} from '../../layouts';
import CloseBar from '../../components/closebar';
import Intercom from 'react-native-intercom';
import {Ripple, NewRipple, AppLink} from '../../components';
import QueryModal from '../queryModal';
import {submitQuery} from '../profile.profile/utils';
 

export default class Feedback extends Component {
  state = {showQueryModal: false};
  constructor(props) {
    super(props);

    this.state = {
      playStoreId: stringsAppId.androidId,
      appStoreId: stringsAppId.iosId,
    };
    this.goback = this.goback.bind(this);
  }
  onSubmitQuery = async query => {
    try {
      const res = await submitQuery(this, query);
      this.setState({showQueryModal: false});
    } catch (err) {}
  };

  goback() {
    this.props.closeModal();
  }

  render() {
    var tintColor: '#DFDFDF';
    const {showQueryModal} = this.state;
    return (
      <View style={styles.container}>
        {showQueryModal ? (
          <QueryModal
            onSubmitQuery={this.onSubmitQuery}
            closeModal={() => this.setState({showQueryModal: false})}
            user={this.props.user}
          />
        ) : (
          <View>
            <CloseBar goBack={this.goback} color={'black'} />
            <HeaderListExtraLarge
              header="Feedback"
              description="Like our app? Tell us what you feel"
              style={{flex: 0, paddingTop: 0}}></HeaderListExtraLarge>

            <Ripple
              timeout={400}
              onPress={() => {
                this.setState({showQueryModal: true});
                // Intercom.displayMessageComposer();
              }}>
              <View style={styles.innerContainerStyle}>
                <MaterialCommunityIcons
                  name={'bug'}
                  size={28}
                  style={styles.iconStyle}
                />
                <View style={styles.headerContainerStyle}>
                  <Text style={styles.headerStyle}>Report Issue</Text>
                  <Text style={styles.footerStyle}>
                    Help us improve your experience
                  </Text>
                </View>
              </View>
            </Ripple>

            <View style={styles.separatorStyle} />

            <Ripple
              onPress={() => {
                this.setState({showQueryModal: true});

                // Intercom.displayMessageComposer();
              }}>
              <View style={styles.innerContainerStyle}>
                <MaterialCommunityIcons
                  name={'message-alert'}
                  size={28}
                  style={styles.iconStyle}
                />
                <View style={styles.headerContainerStyle}>
                  <Text style={styles.headerStyle}>Feedback</Text>
                  <Text style={styles.footerStyle}>
                    We would love to hear it from you
                  </Text>
                </View>
              </View>
            </Ripple>

            <View style={styles.separatorStyle} />

            <View style={styles.separatorStyle} />
          </View>
        )}
      </View>
    );
  }
}
