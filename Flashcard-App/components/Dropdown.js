/**
 * @fileoverview This file contains the dropdown component
 */
import { View } from "react-native";
import Picker from 'react-native-picker-select';
import { ThemedText } from '@/components/ThemedText';
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Dropdown element.
 * @param {options} A list that contains the options for the dropdown
 * @param {selectedValue} The selected value in options
 * @param {onChange} The function to carry out when the dropdowns value is changed  
 * @param {style} The style of the component
 * @returns 
 */
export default function Dropdown({ options, selectedValue, onChange, style, labelType = "subtitle" })
{
    var label = options[0].label
    for(var i = 0; i < options.length; i++)
    {
        if(options[i].value == selectedValue)
        {
            label = options[i].label
            break
        }
    }

    return(
        <Picker
            placeholder={{}}
            items={options}
            onValueChange={onChange}
            value={selectedValue}
            fixAndroidTouchableBug={true}//needed as true as only the text will be touchable when set false which is far too little space
        >
            <View style={[style, {flexDirection: 'row'}]}>
                <View style={{width: '80%', justifyContent: 'center', alignItems: 'center'}}>
                    <ThemedText type={labelType} style={{color: 'white'}}>{label}</ThemedText>    
                </View>
                <Ionicons name="caret-down" style={{color: 'grey'}} size={14}></Ionicons>
            </View>
        </Picker>
    )
}