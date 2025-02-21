/**
 * @fileoverview This file contains the Flashcard minimal view component which is used in the FlashcardManagement page tab
 */
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { router } from 'expo-router';
import { colours } from "../assets/colours";
import { useEffect, useState } from "react";
import PressableContainer from '@/components/PressableContainer'
import styles from '@/assets/styles'

/**
 * Component to display the question of a flashcard as part of the listed view in flashcard management
 * @param {JSON} flashcardData The data of the flashcard to display
 * @returns 
 */
export default function FlashcardMinimalView({flashcardData}) {
    const [flashcardLabel, SetLabel] = useState(flashcardData.question)
    const [flashcardAnswer, SetAnswer] = useState(flashcardData.answer)
    useEffect(() => {
        if(flashcardData.question.length > 75)
            SetLabel(flashcardData.question.substring(0, 50) + "...")
        if(flashcardData.answer.length > 75)
            SetAnswer(flashcardData.answer.substring(0, 50) + "...")
    }, [])

    return(
        <View>
            <PressableContainer style={localStyles.FlashcardContainer} 
            onPress={() => router.push({pathname: '/(tabs)/EditFlashcardScreen', params: {flashcard_ID: flashcardData.id}})}>
                <View style={{height: '50%'}}>
                    <ThemedText type="defaultBold" style={{}}>{flashcardLabel}</ThemedText>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 4}}>
                        <ThemedText type="default">{flashcardAnswer}</ThemedText>
                    </View>
                    <View style={[styles.CategoryContainer, {backgroundColor: colours.blue, width: '20%', marginLeft: 15}]}>
                        <ThemedText type="defaultBold" style={{color: 'white'}}>{flashcardData.category}</ThemedText>
                    </View>
                </View>
            </PressableContainer>
        </View>
        
    )
}

const localStyles = StyleSheet.create({
    FlashcardContainer : {
        width: '95%',
        height: 115,
        marginVertical : 5,
        borderRadius: 5,
        padding: 5,
        backgroundColor: 'white',
        borderColor: colours.darkBlue,
        borderWidth: 2,
        alignSelf: 'center',
        elevation: 5, 
        shadowColor: "#000", 
    }
})