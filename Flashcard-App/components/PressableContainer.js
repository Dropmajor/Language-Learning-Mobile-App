
/**
 * @fileoverview This file contains the pressable container component which allows for animated button presses
 */
import { Pressable, Animated } from "react-native"
import { useRef } from "react";

/**
 * Customised version of the pressable component which implements animations
 * @param function onPress A callback function to call when the component is pressed
 * @param StyleSheet style The style to use for the container
 * @param rest The children to put within the container
 * @returns 
 */
export default function PressableContainer({onPress, style, ...rest})
{
  const animationRange = useRef(new Animated.Value(1)).current;

    const pressEffect = animationRange.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    });

    const fadeOut = () => {
      Animated.timing(animationRange, {
        toValue: 0.4,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };
    const fadeIn = () => {
      Animated.timing(animationRange, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };

    return (
    <Pressable onPress={onPress} onPressIn={() => fadeOut()} onPressOut={() => fadeIn()} 
        style={style}>
        <Animated.View style={{opacity: pressEffect}}>
            {rest.children}
        </Animated.View>
    </Pressable>)
}