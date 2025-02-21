/**
 * @fileoverview This file contains all the button related components
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import PressableContainer from "./PressableContainer"
import { colours } from '@/assets/colours'

/**
 * Button that uses an Ionicon as its symbol
 * @param function onPress A callback function to call when the component is pressed
 * @param string iconName The ionicon name
 * @param int buttonSize The size of the button
 * @param StyleSheet style The style to use for the button
 * @param StyleSheet iconStyle The style to use for the ionicon
 * @returns 
 */
export default function IconButton({onPress, iconName, buttonSize = 28, style, iconStyle, background = true})
{
    var pressableSize = buttonSize + 10
    const backgroundColor = (background? colours.grey : "none")
    return (
    <PressableContainer onPress={onPress}
        style={[{backgroundColor : backgroundColor, borderRadius: pressableSize, height: pressableSize, width: pressableSize,
        justifyContent: 'center', alignItems: 'center'},  style]}>
          <Ionicons name={iconName} style={[{color : colours.darkBlue}, iconStyle]} size={buttonSize}/>
    </PressableContainer>)
}