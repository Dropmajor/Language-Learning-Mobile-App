/**
 * @fileoverview This file contains the redoable input component
 */
import { View, TextInput, StyleSheet } from "react-native"
import styles from '@/assets/styles';
import { useState, useEffect, useRef, useCallback } from 'react';
import IconButton from '@/components/IconButton'
import { useFocusEffect } from "expo-router";

/**
 * An input field with the option to redo and undo any values typed into it
 * @param string     placeholder       the placeholder text to display
 * @param StyleSheet style             style the style for the container
 * @param StyleSheet inputFieldStyle   The style for the input field
 * @param string     initialFieldValue The initial value to display in the input field
 * @param function   onChangeText      callback function for when the input field is updated
 * @param element    rest              The child elements to add to the bar at the bottom of the input field next to the redo and undo fields
 */
export default function RedoableInput({placeholder, style, inputFieldStyle, initialFieldValue = "", onChangeText, ...rest})
{
    const [inputFieldValue, SetInputFieldValue] = useState(initialFieldValue)
    const [inputHistory, SetInputHistory] = useState([])
    const [inputHistoryIndex, SetInputHistoryIndex] = useState(0)
    const inputField = useRef(null)

    //Only update the text history when the user breifly stops typing, you dont want to undo each and every letter, that is tedious
    useEffect(() => {
        const timeoutId = setTimeout(() => UpdateTextHistory(), 400);
        return () => clearTimeout(timeoutId);
    }, [inputFieldValue]);

    useEffect(() => {
        SetInputFieldValue(initialFieldValue)
    }, [initialFieldValue]);

    useFocusEffect(
      useCallback(() => {
          return () => {
                SetInputHistory([])
                SetInputFieldValue("")
                SetInputHistoryIndex(0)
          };
      }, [])
    );

    /**
     * Undoes the value typed in the input field
     */
    function Undo()
    {
        if((inputHistory.length - 1) - (inputHistoryIndex + 1) < 0)
            return
        var newIndex = inputHistoryIndex + 1
        inputField.current.setNativeProps({ text: inputHistory[(inputHistory.length - 1) - newIndex] })

        SetInputHistoryIndex(newIndex)
    }

    /**
     * Redoes the value typed in the input field
     */
    function Redo()
    {
        if(inputHistory.length - 1 - (inputHistoryIndex - 1) >= inputHistory.length)
            return
        var newIndex = inputHistoryIndex - 1

        inputField.current.setNativeProps({ text: inputHistory[(inputHistory.length - 1) - newIndex] })

        SetInputHistoryIndex(newIndex)
    }

    /**
     * Add newly typed value to the history of the input field
     */
    function UpdateTextHistory()
    {
        var newHistory = inputHistory.slice(0, inputHistory.length - inputHistoryIndex)
        newHistory.push(inputFieldValue)
        SetInputHistory(newHistory)
        SetInputHistoryIndex(0)
    }

    /**
     * Clear the input field value
     */
    function ClearInputField()
    {
        if(inputField.current)
        {
            inputField.current.clear()
            SetInputFieldValue("")
            onChangeText("")
        }
    }

    return(
        <View style={[style, {marginVertical: 5}]}>
            <View style={{height: '85%', flexDirection: 'row'}}>
                <TextInput multiline={true} ref={inputField} value={inputFieldValue} style={[styles.defaultText, localStyles.InputField, inputFieldStyle]}
                    placeholder={placeholder} onChangeText={(e) => {SetInputFieldValue(e), (onChangeText != null) ? onChangeText(e) : null}}/>
                {(inputFieldValue != "")? <IconButton iconName="close" onPress={() => ClearInputField()} background={false}/> : []}
            </View>
            <View style={localStyles.undoRedoContainer}>
                    <IconButton iconName={(inputHistory.length > 1 && !((inputHistory.length - 1) - (inputHistoryIndex + 1) < 0)) ? 'arrow-undo' : 'arrow-undo-outline'} 
                    background={false} onPress={()=> Undo()} style={localStyles.backButton}/>
                    <IconButton iconName={(inputHistory.length > 1 && !(inputHistory.length - 1 - (inputHistoryIndex - 1) >= inputHistory.length)) ? 'arrow-redo' : 'arrow-redo-outline'} 
                    background={false} onPress={()=> Redo()} style={localStyles.backButton}/>
                    {rest.children}
            </View>
        </View>
    )
}

const localStyles = StyleSheet.create({
    undoRedoContainer : {
        flexDirection : 'row'
    },
    InputField : {
        textAlignVertical: "top",
        height: '100%',
        width : '90%'
    }
})