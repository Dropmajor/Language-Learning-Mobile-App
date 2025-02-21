/**
 * @fileoverview This file contains the translation portion of the intent filter and translation home screens
 */
import { ThemedText } from '@/components/ThemedText';
import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ToastAndroid } from 'react-native';
import {GenerateContextExamples, TranslateText} from '@/components/APIDataHandler'
import IconButton from '@/components/IconButton';
import styles from '@/assets/styles';
import ContextElement from '@/components/contextElement';
import { CreateFlashCardEntry, DeleteFlashcard } from '@/components/LocalDataHandler';
import LoadingIndicator from '@/components/LoadingIndicator';
import { colours } from '@/assets/colours';
import RedoableInput from "@/components/RedoableInput";
import ContextTab from './BottomContextTab';

/**
 * A container component that contains the bottom part of a translation page: the translation field, result and context examples
 * @param string sourceLanguage The language to translate from
 * @param string targetLanguage The language to translate to
 * @param string initialValue The initial value to display in the translation field
 * @returns 
 */
export default function TranslationContainer({sourceLanguage, targetLanguage, initialValue})
{
  //this is used to stop the screen from moving when the keyboard is opened
  const [sourceText, SetSourceText] = useState(null)
  const [awaitingTranslation, ChangeAwaitingState] = useState(false)
  const [awaitingContext, ChangeContextAwaitingState] = useState(false)
  const [translatedText, SetTranslatedText] = useState(null)
  const [contextExamples, SetContextExamples] = useState(null)
  const [flashcardSavedID, ChangeIDSaveState] = useState(null)
  const [contextMenuShowing, SetContextMenuShowState] = useState(false)

  useEffect(() => {
    ChangeIDSaveState(null)
    const timeoutId = setTimeout(() => TranslateCurrentText(), 1000);
    return () => clearTimeout(timeoutId);
  }, [sourceText]);

  useEffect(() => {
    SetSourceText(initialValue)
  }, [initialValue])

  /**
   * Translate the current string entered into the input field into the target language
   */
  async function TranslateCurrentText() {
    ChangeAwaitingState(true)
    if(sourceText != null && sourceText.length != 0)
    {
      try{
        console.log("translating")
        var translation = await TranslateText(sourceText, sourceLanguage, targetLanguage)
        SetTranslatedText(translation)
        ChangeAwaitingState(false)
        SetContextExamples(null)
      }
      catch(err)
      {
        console.log("Translation Error: \n" + err)
      }

      //check if there is only one word in the entered translation
      try{
        if(sourceText.trim().split(" ").length == 1)
          {
            ChangeContextAwaitingState(true)
            SetContextMenuShowState(true)
            console.log("Generating context")
            SetContextExamples(await GenerateContextExamples(sourceText, sourceLanguage, targetLanguage))
            ChangeContextAwaitingState(false)
          }
      }
      catch(err)
      {
        console.log("Context Generation Error: \n" + err)
      }
    }
    else{
      SetTranslatedText("")
      SetContextExamples(null)
    }
    ChangeAwaitingState(false)
  }

  /**
   * Saves the entered value in the translation field and its translation as a flashcard
   */
  async function SaveContext()
  {
    if(flashcardSavedID == null)
    {
      ChangeIDSaveState(await CreateFlashCardEntry(sourceText, translatedText, ((sourceText.trim().split(" ").length == 1) ? "Word" : "Context")))
      ToastAndroid.show("Flashcard Created", ToastAndroid.SHORT)
    }
    else
    {
      DeleteFlashcard(flashcardSavedID)
      ChangeIDSaveState(null)
      ToastAndroid.show("Flashcard Deleted", ToastAndroid.SHORT)
    }
  }

  return(
    <View style={styles.contentContainer}>
        <RedoableInput placeholder='Enter Text To Translate...' onChangeText={(e) => SetSourceText(e)} initialFieldValue={initialValue}
        style={localStyles.TranslationContainer} inputFieldStyle={styles.subtitle}/>
        <View style={[localStyles.TranslationContainer, {flexDirection : 'row', justifyContent: 'center'}]}>
            {(awaitingTranslation) ? <View style={localStyles.loadingContainer}><LoadingIndicator/><ThemedText type='defaultBold'>Translating...</ThemedText></View> :
            <ThemedText style={{width: '90%'}} type='subtitle'>{translatedText}</ThemedText>}
            {(!awaitingTranslation && (translatedText != null && translatedText.length > 0)) ? 
            <IconButton iconName={(flashcardSavedID != null) ? "star" : "star-outline"} background={false} 
            onPress={()=> SaveContext()}></IconButton>
            : []}
        </View>
        <ContextTab showing={contextMenuShowing} onShowStateChanged={SetContextMenuShowState}>
            {(contextExamples == null && !awaitingContext) ? 
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <ThemedText type='defaultBold'>No Examples To Display Currently</ThemedText>
            <ThemedText>Enter a word into the translation field to generate context examples</ThemedText></View> : 
            (awaitingContext)?  
            <View style={localStyles.loadingContainer}>
            <LoadingIndicator/><ThemedText type='defaultBold'>Generating Context Examples...</ThemedText>
            </View> : 
            <FlatList data={contextExamples} persistentScrollbar={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <ContextElement originalContext={item.question} translatedContext={item.answer} contextWord={sourceText}/>}/>}
        </ContextTab>
    </View>)
}

const localStyles = StyleSheet.create({
  TranslationContainer : {
    height: '25%',
    width: '95%',
    alignSelf : 'center',
    borderWidth : 0,
  },
  ContextTabOpener: {
    height : 40,
    width : '100%',
    backgroundColor : colours.grey,
    borderTopLeftRadius : 15,
    borderTopRightRadius : 15,
    flexDirection : 'row',
    justifyContent : 'center',
    alignItems : 'center',
  },
  MinimisedTab : {
    position : 'absolute', 
    width: '100%',
    height : '7%'
  },
  loadingContainer : {
    justifyContent : 'center',
    alignItems : 'center',
  }
})