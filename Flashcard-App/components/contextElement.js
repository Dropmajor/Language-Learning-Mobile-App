/**
 * @fileoverview This file contains the context element component
 */
import { ThemedText } from "./ThemedText"
import { View, StyleSheet, ToastAndroid } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import IconButton from "./IconButton"
import { CreateFlashCardEntry, DeleteFlashcard } from '../components/LocalDataHandler';
import { useState } from "react";
import { colours } from '@/assets/colours'

/**
 * Component that displays a context example for a translated word. See APIDatahandler to for the source of where contexts are generated
 * @param {string} contextWord The word that the context is representing
 * @param {string} originalContext The example sentence contained in the original language of the context word
 * @param {string} translatedContext The example sentence translated to a target language
 * @returns 
 */
export default function ContextElement({originalContext, translatedContext, contextWord}){
    const [SavedID, SetSavedID] = useState(null)
    contextWord = contextWord.trim()
    var originalContextWordIndex = originalContext.toLowerCase().indexOf(contextWord.toLowerCase())

    var originalContextElement = (<ThemedText type="defaultBold" style={{width: '90%', color: colours.darkBlue}}>{originalContext.substring(0, originalContextWordIndex)}
    <ThemedText style={{backgroundColor: colours.higlightYellow, color: colours.darkBlue}}>{originalContext.substring(originalContextWordIndex, originalContextWordIndex + contextWord.length)}</ThemedText>
    {originalContext.substring(originalContextWordIndex + contextWord.length)}</ThemedText>)

    /**
     * Saves the context contained in this component as a flashcard
     */
    function SaveContext()
    {
      if(SavedID == null)
      {
        SetSavedID(CreateFlashCardEntry(originalContext, translatedContext, "Context", contextWord))
        ToastAndroid.show("Context Saved", ToastAndroid.SHORT)
      }
      else
      {
        ToastAndroid.show("Context Deleted", ToastAndroid.SHORT)
        SetSavedID(null)
      }
    }
    
    return(
        <View style={localStyles.ElementContainer}>
          <View style={localStyles.ContextRow}>
            {originalContextElement}
            <IconButton iconName={(SavedID != null) ? "star" : "star-outline"} background={false} 
              onPress={()=> SaveContext()}/>
          </View>
          <View style={localStyles.ContextRow}>
            <Ionicons name='return-down-forward-sharp' size={20}/>
            <ThemedText type="defaultBold" style={{width: '95%'}}>{translatedContext}</ThemedText>
          </View>
          <View style={localStyles.BottomBorder}/>
        </View>
    )
}

const localStyles = StyleSheet.create({
  ElementContainer : {
    backgroundColor : colours.lightBlue
  },
  BottomBorder : {
    borderBottomWidth : 1,
    borderColor: 'grey',
    width : '95%',
    alignSelf : 'center',
    marginTop : 5
  },
  ContextRow : {
    flexDirection: 'row',
    paddingHorizontal: 5,
  }
})