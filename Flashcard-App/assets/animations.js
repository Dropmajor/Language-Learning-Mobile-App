import { View, StyleSheet, Animated } from "react-native";

const openFlashcard = animationRange.interpolate({
  inputRange: [0, 1],
  outputRange: [-750, 750]
});

const openAnimation = 
Animated.timing(animationRange, {
  toValue: 0.5,
  duration: 300,
  useNativeDriver: true,
})