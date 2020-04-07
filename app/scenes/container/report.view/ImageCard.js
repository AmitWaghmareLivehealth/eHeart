import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import Global from '../../../utils/const/globals';
import {Card, CardItem, Body, Left, Thumbnail} from 'native-base';

export default class ImageCard extends Component {
  render() {
    const {isPDF, image} = this.props;
    return (
      <View style={{display: 'flex', flexDirection: 'column', marginLeft: 10}}>
        <Card>
          <CardItem>
            <Left>
              {/* <Thumbnail
              style={{width:30,height:30}}
                source={
                  isPDF
                    ? require('../../../assets/common/pdf.png')
                    : {uri: image.url}
                }
              /> */}

              <Body>
                <Text>{image.name}</Text>
              </Body>
            </Left>
          </CardItem>

          <Image
            source={
              isPDF
                ? require('../../../assets/common/pdf.png')
                : {uri: image.url}
            }
            style={{
              height: 200,
              width: Global.screenWidth - 120,
              flex: 1,
            }}
          />
        </Card>
      </View>
    );
  }
}
