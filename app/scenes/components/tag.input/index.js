// @flow

import React, { Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import PropTypes from 'prop-types'


import TextInputHeader from '../text.input.header'

const { width } = Dimensions.get('window');

type Props = {
  /**
   * A handler to be called when array of tags change
   */
    onChange: (items: Array<any>) => void,
  /**
   * An array of tags
   */
    value: Array<any>,
  /**
   * An array os characters to use as tag separators
   */
    separators: Array<string>,
  /**
   * A RegExp to test tags after enter, space, or a comma is pressed
   */
    regex?: Object,
  /**
   * Background color of tags
   */
    tagColor?: string,
  /**
   * Text color of tags
   */
    tagTextColor?: string,
  /**
   * Styling override for container surrounding tag text
   */
    tagContainerStyle?: Object,
  /**
   * Styling overrride for tag's text component
   */
    tagTextStyle?: Object,
  /**
   * Color of text input
   */
    inputColor?: string,
  /**
   * TextInput props Text.propTypes
   */
    inputProps?: Object,
  /**
   * path of the label in tags objects
   */
    labelKey?: string,
  /**
   *  maximum number of lines of this component
   */
    numberOfLines: number,
  /**
   * whether tag list act as input or view only
   */
    readOnly?: boolean
}

type State = {
  text: string,
  inputWidth: ?number,
  lines: number,
};

type NativeEvent = {
  target: number,
  key: string,
  eventCount: number,
  text: string,
};

type Event = {
  nativeEvent: NativeEvent,
};

const DEFAULT_SEPARATORS = [',', ' ', ';', '\n'];
const DEFAULT_TAG_REGEX = /(.+)/gi

class TagInput extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
    regex: PropTypes.object,
    tagColor: PropTypes.string,
    tagTextColor: PropTypes.string,
    inputColor: PropTypes.string,
    inputProps: PropTypes.object,
    labelKey: PropTypes.string,
    numberOfLines: PropTypes.number,
    maxTagCount: PropTypes.number
  };

  props: Props;
  state: State = {
    text: '',
    inputWidth: null,
    lines: 1,
  };

  wrapperWidth = width;

  // scroll to bottom
  contentHeight: 0;
  scrollViewHeight: 0

  static defaultProps = {
    tagColor: '#dddddd',
    tagTextColor: '#777777',
    inputColor: '#777777',
    numberOfLines: 1
  };

  measureWrapper = () => {
    if (!this.refs.wrapper)
      return;

    this.refs.wrapper.measure((ox, oy, w, /*h, px, py*/) => {
      this.wrapperWidth = w;
      this.setState({ inputWidth: this.wrapperWidth });
    });
  };

  calculateWidth = () => {
    setTimeout(() => {
      if (!this.refs['tag' + (this.props.value.length - 1)])
        return;

      this.refs['tag' + (this.props.value.length - 1)].measure((ox, oy, w, /*h, px, py*/) => {
        const endPosOfTag = w + ox;
        const margin = 3;
        const spaceLeft = this.wrapperWidth - endPosOfTag - margin - 10;

        const inputWidth = (spaceLeft < 100) ? this.wrapperWidth : spaceLeft - 10;

        if (spaceLeft < 100) {
          if (this.state.lines < this.props.numberOfLines) {
            const lines = this.state.lines + 1;

            this.setState({ inputWidth, lines });
          } else {
            this.setState({ inputWidth }, () => this.scrollToBottom());
          }
        } else {
          this.setState({ inputWidth });
        }
      });
    }, 0);
  };

  componentDidMount () {
    setTimeout(() => {
      this.calculateWidth();
    }, 100);
  }

  componentDidUpdate (prevProps: Props, /*prevState*/) {
    if (prevProps.value.length != this.props.value.length || !prevProps.value) {
      this.calculateWidth();
    }
  }

  onChange = (event: Event) => {
    if (!event || !event.nativeEvent)
      return;

    const text = event.nativeEvent.text
    this.setState({ text: text });
    const lastTyped = text.charAt(text.length - 1);

    const parseWhen = this.props.separators || DEFAULT_SEPARATORS;

    if (parseWhen.indexOf(lastTyped) > -1) {
      this.parseTags()
    }
    this.focus()
  };

  onBlur = (event: Event) => {
    if (!event || !event.nativeEvent || !this.props.parseOnBlur) {
      return null
    }

    const text = event.nativeEvent.text;
    this.setState({ text: text });
    this.parseTags();
  };

  parseTags = () => {
    const { text } = this.state;
    const { value } = this.props;

    const regex = this.props.regex || DEFAULT_TAG_REGEX;
    const results = text.trim().match(regex)

    if (results && results.length > 0) {
      this.setState({ text: '' })
      this.props.onChange([...new Set([...value, ...results])]);
    }
  }

  onKeyPress = (event: Event) => {
    if (this.state.text === '' && event.nativeEvent && event.nativeEvent.key == 'Backspace') {
      this.pop();
    }
  };

  focus = () => {
    if (this.refs.tagInput)
      this.refs.tagInput.focus();
  };

  pop = () => {
    const tags = [...this.props.value];
    tags.pop();
    this.props.onChange(tags);
    // this.focus();
  };

  removeIndex = (index: number) => {
    const tags = [...this.props.value];
    tags.splice(index, 1);
    this.props.onChange(tags);
    // this.focus()
  };

  _getLabelValue = (tag) => {
    const { labelKey } = this.props;

    if (labelKey) {
      if (labelKey in tag) {
        return tag[labelKey].trim()
      }
    }

    return tag.trim();
  };

  _renderTag = (tag, index) => {
    const { tagColor, tagTextColor, readOnly } = this.props
    var isReadOnly = (readOnly || false)
    return (
      <TouchableOpacity
        key={index}
        ref={'tag' + index}
        style={[styles.tag, { backgroundColor: tagColor }, this.props.tagContainerStyle]}
        activeOpacity={ isReadOnly ? 1.0 : 0.6 }
        onPress={(() => {
          if (!isReadOnly) {
            this.removeIndex(index)
          }
        })}
      >
        <Text style={[styles.tagText, { color: tagTextColor, fontSize: 17 }, this.props.tagTextStyle]}>
          {this._getLabelValue(tag)}&nbsp;&times;
        </Text>
      </TouchableOpacity>
    )
  }

  scrollToBottom = (animated: boolean = true) => {
    if (this.contentHeight > this.scrollViewHeight) {
      this.refs.scrollView.scrollTo({
        y: this.contentHeight - this.scrollViewHeight,
        animated
      });
    }
  };

  render () {
    const { text, inputWidth, lines } = this.state;
    const { value, inputColor, maxTagCount } = this.props;

    const defaultInputProps = {
      autoCapitalize: 'none',
      autoCorrect: false,
      placeholder: 'Enter tag and hit space',
      returnKeyType: 'done',
      keyboardType: 'default',
      underlineColorAndroid: 'rgba(0,0,0,0)'
    }

    const inputProps = { ...defaultInputProps, ...this.props.inputProps };

    const wrapperHeight = (lines - 1) * 40

    const width = inputWidth ? inputWidth : 400

    const showInput = (maxTagCount > value.length) && !(this.props.readOnly || false)
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (showInput) {
            this.refs.tagInput.focus()
          }
        }}
        onLayout={this.measureWrapper}
        style={[styles.container, this.props.style]}>
        <View
          style={[styles.wrapper, this.props.style]}
          ref="wrapper"
          onLayout={this.measureWrapper}>
          <KeyboardAvoidingView
            ref='scrollView'
            style={styles.tagInputContainerScroll}
            onContentSizeChange={(w, h) => this.contentHeight = h}
            onLayout={ev => this.scrollViewHeight = ev.nativeEvent.layout.height}
          >
            <TextInputHeader>{this.props.title || 'Title'}</TextInputHeader>
            <View style={styles.tagInputContainer}>
              {value.map((tag, index) => this._renderTag(tag, index))}
            { showInput ?
                <View style={[styles.textInputContainer, { width: this.state.inputWidth }]}>
                  <TextInput
                    ref="tagInput"
                    blurOnSubmit={false}
                    onKeyPress={this.onKeyPress}
                    value={text}
                    style={[styles.textInput, {
                      width: width,
                      color: inputColor,
                      fontSize: 17
                    }]}
                    onBlur={this.onBlur}
                    onChange={this.onChange}
                    onSubmitEditing={() => {
                      Keyboard.dismiss()
                      this.parseTags()
                    }}
                    {...inputProps}
                  />
                </View> : null
            }
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  wrapper: {
    flex: 0,
    flexDirection: 'row',
    marginTop: 3,
    marginBottom: 0,
    alignItems: 'flex-start',
  },
  tagInputContainerScroll: {
    flex: 0,
  },
  tagInputContainer: {
    flex: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 6
  },
  textInput: {
    height: 30,
    fontSize: 14,
    flex: .6,
    marginBottom: 0,
    padding: 0,
  },
  textInputContainer: {
    height: 30,
  },
  tag: {
    justifyContent: 'center',
    marginTop: 4,
    marginRight: 4,
    padding: 8,
    height: 26,
    borderRadius: 3
  },
  tagText: {
    padding: 0,
    margin: 0,
  }
});

export default TagInput;

export { DEFAULT_SEPARATORS, DEFAULT_TAG_REGEX }
