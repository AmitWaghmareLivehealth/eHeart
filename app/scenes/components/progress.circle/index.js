import React from 'react'
import {
  Easing,
  Animated,
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
} from 'react-native'
import PropTypes from 'prop-types'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { URLs, Routes, Global, Color, UserDefaults, stringsUserDefaults, NetworkRequest, CommonStyles, Images} from '../../../utils'

const ViewPropTypesStyle = ViewPropTypes
  ? ViewPropTypes.style
  : null


function calcInterpolationValuesForHalfCircle1(animatedValue, { shadowColor }) {
  const rotate = animatedValue.interpolate({
    inputRange: [0, 50, 50, 100],
    outputRange: ['0deg', '180deg', '180deg', '180deg'],
  })

  const backgroundColor = shadowColor
  return { rotate, backgroundColor }
}

function calcInterpolationValuesForHalfCircle2(
  animatedValue,
  { color, shadowColor },
) {
  const rotate = animatedValue.interpolate({
    inputRange: [0, 50, 50, 100],
    outputRange: ['0deg', '0deg', '180deg', '360deg'],
  })

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 50, 50, 100],
    outputRange: [color, color, shadowColor, shadowColor],
  })
  return { rotate, backgroundColor }
}

// function getInitialState(props) {
//   const circleProgress = new Animated.Value(0)
//   return {
//     flag: this.props.flag,
//     tickColor:'#ccc',
//     isComplete: false,
//     circleProgress,
//     secondsElapsed: 0,
//     interpolationValuesHalfCircle1: calcInterpolationValuesForHalfCircle1(
//       circleProgress,
//       props,
//     ),
//     interpolationValuesHalfCircle2: calcInterpolationValuesForHalfCircle2(
//       circleProgress,
//       props,
//     ),
//   }
// }

export default class ProgressCircle extends React.PureComponent {

  static propTypes = {
    seconds: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    color: PropTypes.string,
    shadowColor: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    bgColor: PropTypes.string,
    borderWidth: PropTypes.number,
    containerStyle: ViewPropTypesStyle,
    updateText: PropTypes.func,
    onTimeElapsed: PropTypes.func,
    flag: PropTypes.number
  };

  static defaultProps = {
    color: '#f00',
    shadowColor: '#999',
    bgColor: '#e9e9ef',
    borderWidth: 2,
    seconds: 1,
    children: null,
    containerStyle: null,

    onTimeElapsed: () => null,
    updateText: (elapsedSeconds, totalSeconds) =>
      (totalSeconds - elapsedSeconds).toString(),
  };

  constructor(props) {
    super(props)
    const circleProgress = new Animated.Value(0)
    const tickAnim = new Animated.Value(20)


    this.state = {
      flag: this.props.flag,
      showText:false,
      tickColor:'#ccc',
      isComplete: false,
      circleProgress,
      tickAnim,
      secondsElapsed: 0,
      interpolationValuesHalfCircle1: calcInterpolationValuesForHalfCircle1(
        circleProgress,
        props,
      ),
      interpolationValuesHalfCircle2: calcInterpolationValuesForHalfCircle2(
        circleProgress,
        props,
      ),
}
  //  this.state = getInitialState(props)
    
    this.restartAnimation()

   // this.animate()
  }

  componentWillReceiveProps(nextProps) {
    if (
      Object.keys(nextProps).some(
        field => nextProps[field] !== this.props[field],
      )
    ) {
      this.state.circleProgress.stopAnimation()
   //   this.setState(getInitialState(nextProps), this.restartAnimation)
    }
  }

  onAnimationCompleted(){
   //here on animation complete logic

   this.setState({
     isComplete:true
   })
  }

  onCircleAnimated = ({ finished }) => {
    // if animation was interrupted by stopAnimation don't restart it.
    if (!finished) return

    const secondsElapsed = this.state.secondsElapsed + 1
    const callback = secondsElapsed < this.props.seconds
      ? this.restartAnimation
      : //this.onAnimationCompleted
      this.props.onTimeElapsed

    const updatedText = this.props.updateText(
      secondsElapsed,
      this.props.seconds,
    )
    this.setState(
      {
        showText:true,
      //  ...getInitialState(this.props),
        secondsElapsed,
      },
      callback,
    )
  };

  restartAnimation = () => {
    this.state.circleProgress.stopAnimation()
    this.state.tickAnim.setValue(0)

    Animated.sequence([    
      
      Animated.timing(this.state.circleProgress, {
      toValue: 100,
      duration: 1000,
      easing: Easing.linear,
    }),

    Animated.timing(
      this.state.tickAnim,
      {
        toValue:50,
        duration:500,
        easing:Easing.linear
        
      }
    )

  ]).start(this.onCircleAnimated)



  };

  animate(){
    this.state.tickAnim.setValue(0)

    Animated.timing(
      this.state.tickAnim,
      {
        toValue:50,
        duration:1000,
        easing:Easing.linear
        
      }
    ).start()
  }

  renderHalfCircle({ rotate, backgroundColor }) {
    const { radius } = this.props

    return (
      <View
        style={[
          styles.leftWrap,
          {
            width: radius,
            height: radius * 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.halfCircle,
            {
              width: radius,
              height: radius * 2,
              borderRadius: radius,
              backgroundColor,
              transform: [
                { translateX: radius / 2 },
                { rotate },
                { translateX: -radius / 2 },
              ],
            },
          ]}
        />
      </View>
    )
  }

  renderInnerCircle() {
    const radiusMinusBorder = this.props.radius - this.props.borderWidth
    return (
      <View
        style={[
          styles.innerCircle,
          {
            width: radiusMinusBorder * 2,
            height: radiusMinusBorder * 2,
            borderRadius: radiusMinusBorder,
            backgroundColor: this.props.bgColor,
            ...this.props.containerStyle,
          },
        ]}
      >

     
        <MaterialIcons
         name='check'
         size={55}
         style={{
           color:Color.themeColor
         }}
        />
         <Animated.View style = {[{transform:[{translateX: this.state.tickAnim}],backgroundColor:'white', position:'absolute', height:50, width:50, borderTopLeftRadius:25, borderBottomLeftRadius:25}]}>
      </Animated.View>  
      </View>
    )
  }

  render() {
    const {
      interpolationValuesHalfCircle1,
      interpolationValuesHalfCircle2,
    } = this.state
    return (
    <View style = {{backgroundColor:'transparent', flex:0, justifyContent:'center', alignItems:'center'}}>
      <View
        style={[
          styles.outerCircle,
          {
            width: this.props.radius * 2,
            height: this.props.radius * 2,
            borderRadius: this.props.radius,
            backgroundColor: this.props.color,
          },
        ]}
      >
        {this.renderHalfCircle(interpolationValuesHalfCircle1)}
        {this.renderHalfCircle(interpolationValuesHalfCircle2)}
        {this.renderInnerCircle()}
      </View>

      {(this.props.flag == 1 && this.state.showText)?
      <Text style = {{paddingTop:15, fontSize:16, fontWeight:'bold', color:Color.themeColor}}>Booking successful!</Text>
      :<Text style = {{paddingTop:20, fontSize:16, fontWeight:'bold', color:Color.themeColor}}></Text>
    }
    </View>  
    )
  }
}

const styles = StyleSheet.create({
  outerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
  },
  innerCircle: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  leftWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  halfCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#f00',
  },
})
