/**
 * @fileoverview This file contains the edit flashcard screen
 */
import { View, StyleSheet, Alert, ToastAndroid, useWindowDimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import CategorySelector from "@/components/CategorySelector";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { LoadFlashcard } from "@/components/LocalDataHandler"
import { useState, useCallback } from "react";
import IconButton from '@/components/IconButton'
import TextButton from '@/components/TextButton'
import { CreateFlashCardEntry, UpdateFlashcardEntry, DeleteFlashcard } from '@/components/LocalDataHandler';
import RedoableInput from "../../components/RedoableInput";
import { colours } from '@/assets/colours';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {TranslateText} from '@/components/APIDataHandler'
import PressableContainer from "@/components/PressableContainer";
import Dropdown from '@/components/Dropdown';
import languageCodes from '@/assets/languageCodes';
import { SetSettingValue, LoadSettingValue } from '@/components/LocalDataHandler';

/**
 * The screen from which new flashcards can be created and deleted from
 * @returns 
 */
export default function EditFlashcardScreen()
{
    const windowHeight = useWindowDimensions().height;
    const flashcardCategories = ["Word", "Grammer", "Context"]
    const [flashcard, SetFlashcard] = useState(null)
    const [category, SetCategory] = useState("Context")
    const [awaitingTranslation, ChangeAwaitingState] = useState(false)
    const [flashcardQuestion, SetFlashcardQuestion] = useState("")
    const [flashcardAnswer, SetFlashcardAnswer] = useState("")
    const [sourceLanguage, SetSourceLanguage] = useState("de")
    const [targetLanguage, SetTargetLanguage] = useState("en")

    const { flashcard_ID } = useLocalSearchParams();
    useFocusEffect(
        useCallback(() => {
            if(flashcard_ID != null)
            {
                SetData()
            }

            InitialiseFields()

            async function InitialiseFields() {
                var _sourceLanguage = await LoadSettingValue("sourceLanguage")
                if(_sourceLanguage != null)
                    SetSourceLanguage(_sourceLanguage)

                var _targetLanguage = await LoadSettingValue("targetLanguage")
                if(_targetLanguage != null)
                    SetTargetLanguage(_targetLanguage)
            }

            async function SetData() {
                var retrievedFlashcard = await LoadFlashcard(flashcard_ID)
                SetFlashcard(retrievedFlashcard)
                SetFlashcardQuestion(retrievedFlashcard.question)
                SetFlashcardAnswer(retrievedFlashcard.answer)
                SetCategory(retrievedFlashcard.type)
            }

            return () => {
                SetFlashcard(null)
                SetCategory("Context")
                SetFlashcardQuestion("")
                SetFlashcardAnswer("")
                ChangeAwaitingState(false)
            };
        }, [flashcard_ID])
    );

    /**
     * Translate the value in the question field
     */
    async function TranslateQuestion()
    {                                    //stops requests from being queued up
        if(flashcardQuestion.length == 0 || awaitingTranslation || (flashcardAnswer.length > 0 && await translationConfirmationAlert() == false))
            return

        try{
            console.log("translating")
            ChangeAwaitingState(true)
            SetFlashcardAnswer(await TranslateText(flashcardQuestion, sourceLanguage, targetLanguage))
            ChangeAwaitingState(false)
        }
        catch(err)
        {
          console.log("Translation Error: \n" + err)
        }

        ToastAndroid.show("Question Field Translated", ToastAndroid.SHORT)
    }

    /**
     * Save the flashcard to the sqlite database
     */
    function SaveFlashcard()
    {
        if(flashcardQuestion == null || flashcardQuestion.length == 0 || flashcardAnswer == null || flashcardAnswer.length == 0)
        {
            ToastAndroid.show("Question Field and/or Answer Field is Empty", ToastAndroid.SHORT)
            return
        }

        if(flashcard != null)
        {
            UpdateFlashcardEntry(flashcard_ID, flashcardQuestion, flashcardAnswer)
            ToastAndroid.show("Flashcard Updated", ToastAndroid.SHORT)
        }
        else
        {
            CreateFlashCardEntry(flashcardQuestion, flashcardAnswer, category)
            ToastAndroid.show("Flashcard Created", ToastAndroid.SHORT)
        }

        //return once the flashcard has been created
        router.back()
    }

    const deletionAlert = () =>
        Alert.alert('Are you sure you want to delete this flashcard?', 'The flashcard can\'t be restored', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => 
            {DeleteFlashcard(flashcard_ID), ToastAndroid.show("Flashcard Deleted", ToastAndroid.SHORT), router.back()}},
        ]);

    const translationConfirmationAlert = async () => new Promise((resolve) => {
      Alert.alert(
        "Translating will replace the contents of the answer field",
        "Are you sure you wish to proceed",
        [
          {
            text: 'Yes',
            onPress: () => {
              resolve(true);
            },
          },
          {
            text : 'Cancel',
            onPress: () => {
                resolve(false);
              },
          }
        ],
        { cancelable: false },
      );
    });

    /**
     * Swap the selected languages
     */
    function SwapLanguage()
    {
        var _sourceLanguage = targetLanguage
        var _targetLanguage = sourceLanguage
        SetSourceLanguage(_sourceLanguage)
        SetTargetLanguage(_targetLanguage) 
    }
  
    return(
        <View style={[localStyles.background, {minHeight: Math.round(windowHeight)}]}>
            <View style={localStyles.container}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 10}}>
                    <View style={{flex: 1}}>
                        <IconButton iconName={'arrow-back'} background={false} onPress={()=> router.back()}
                        buttonSize={35}/>
                    </View>
                    <View style={{flex: 2, alignItems: 'center'}}>
                    <ThemedText type="subtitle">{(flashcard != null) ? "Edit Flashcard" : "Create Flashcard"}</ThemedText>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                        {(flashcard != null) ? <IconButton iconName="trash" buttonSize={35} background={false}
                        onPress={deletionAlert}/> : <View/>}
                    </View>        
                </View>
                <View style={{flex : 9}}>
                    <ThemedText type="defaultBold">Flashcard Question:</ThemedText>
                    <RedoableInput style={{height : '25%', marginBottom: 20}} placeholder="Enter Flashcard Question..." 
                    initialFieldValue={flashcardQuestion} onChangeText={SetFlashcardQuestion}>
                        <PressableContainer onPress={() => {TranslateQuestion()}} style={{marginLeft : 15, marginRight: 5, alignItems: 'center', justifyContent : 'center'}}>
                            <MaterialCommunityIcons name="translate" size={28} style={{color : colours.darkBlue}}/>
                        </PressableContainer>
                        <View style={localStyles.translateFieldContainer}>
                            <Dropdown options={languageCodes} style={localStyles.languageDropdown}
                                selectedValue={sourceLanguage} labelType="defaultBold"
                                onChange={(value) => {SetSourceLanguage(value), SetSettingValue("sourceLanguage", value)}}/>
                            <IconButton iconName='swap-horizontal' size={25} onPress={()=> SwapLanguage()} 
                                background={false} iconStyle={{color : colours.blue}}/>
                            <Dropdown options={languageCodes} style={localStyles.languageDropdown}
                                selectedValue={targetLanguage} labelType="defaultBold"
                                onChange={(value) => {SetTargetLanguage(value), SetSettingValue("targetLanguage", value)}}/>
                        </View>
                    </RedoableInput>
                    <ThemedText type="defaultBold">Flashcard Answer:</ThemedText>
                    <RedoableInput style={{height : '25%'}} placeholder="Enter Flashcard Answer..." initialFieldValue={flashcardAnswer} onChangeText={SetFlashcardAnswer}/>
                    <ThemedText type="defaultBold" style={{marginTop: 15, marginBottom : 5}}>Flashcard Question Type:</ThemedText>
                    <CategorySelector categories={flashcardCategories} onValueChange={SetCategory} initialCategory={category}/>
                </View>
                <View style={{flex : 1, alignItems: 'center'}}>
                    <TextButton style={{height : 50, width: '80%'}} onPress={() => SaveFlashcard()}>Save Flashcard</TextButton>
                </View>
            </View>
        </View>
    )
}

const localStyles = StyleSheet.create({
    background : {
        backgroundColor: colours.blue,
        height: '100%',
        alignItems : 'center',
        justifyContent : 'center'
    },
    container : {
        backgroundColor : 'white',
        height : '99%',
        borderRadius : 50,
        padding: 5,
        width : '99%'
    },
    backButton : {
        marginTop: 10,
    },
    undoRedoContainer : {
        flexDirection : 'row'
    },
    InputField : {
        textAlignVertical: "top",
        height : '20%'
    },
    languageDropdown : {
        backgroundColor: colours.blue, 
        borderRadius: 10, 
        alignItems: 'center', 
        justifyContent: 'center',
        width : 100
    },
    translateFieldContainer : {
        flexDirection: 'row', 
        backgroundColor: colours.grey,
        alignItems: 'center',
        paddingHorizontal: 5,
        borderRadius: 10
    }
})