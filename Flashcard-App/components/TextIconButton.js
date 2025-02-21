/**
 * @fileoverview This file contains the text icon button component
 */
import { View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from "./ThemedText"
import PressableContainer from "./PressableContainer"

/**
 * A button that combines text with an ionicon 
 * @param function onPress A callback function to call when the component is pressed
 * @param string iconName The name of the Ionicon image that should be used
 * @param StyleSheet style the style of the button
 * @returns 
 */
export default function TextIconButton({onPress, iconName, style, ...rest})
{
    return (
    <PressableContainer style={[style, {borderRadius: 40, justifyContent: 'center', 
      alignItems: 'center', paddingHorizontal: 10}]} onPress={onPress}>
        <View style={{flexDirection: 'row'}}>
          <ThemedText type="defaultBold" style={{color: 'white'}}>{rest.children}</ThemedText>
          <Ionicons name={iconName} color='white' size={25}/>
        </View>
    </PressableContainer>)
}