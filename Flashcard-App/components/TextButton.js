/**
 * @fileoverview This file contains the text button component
 */
import { ThemedText } from "./ThemedText"
import { colours } from '@/assets/colours'
import PressableContainer from "./PressableContainer"

/**
 * A button that uses text as its display element
 * @param function onPress A callback function to call when the component is pressed
 * @param StyleSheet style the style of the button
 * @returns 
 */
export default function TextButton({onPress, style, ...rest})
{
    return (
    <PressableContainer style={[style, {backgroundColor : colours.blue, borderRadius: 40,
        justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10}]}
        onPress={onPress}>
        <ThemedText type="defaultBold" style={{color : 'white'}}>{rest.children}</ThemedText>
    </PressableContainer>)
}