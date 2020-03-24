import React, {Component} from 'react';
import {Text, View, FlatList} from 'react-native';

export default class LazyFlatList extends Component {
    
  render() {
    const {renderItem,dataToShow,ListFooterComponent,extraData} = this.props;
      
    return (
      <View style={{display:'flex'}}>
        {dataToShow ? (
          <FlatList
            data={dataToShow}
            renderItem={renderItem}
            initialNumToRender={40}
            keyExtractor={item=>item.testID}
            windowSize={10}
            maxToRenderPerBatch={10}
            onEndReachedThreshold={0.5}
            ListFooterComponent={ListFooterComponent}
            extraData={extraData}
             
           />
        ) : (
          <View></View>
        )}
      </View>
    );
  }
}
