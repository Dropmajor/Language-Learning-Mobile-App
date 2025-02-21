/**
 * @fileoverview This file contains the screen from which a user starts a quiz from
 */
import { useCallback, useState } from "react";
import { View, StyleSheet, useWindowDimensions, Alert, TextInput } from "react-native";
import { GetCardAmount } from '@/components/LocalDataHandler'
import { ThemedText } from "../../components/ThemedText";
import TextButton  from "@/components/TextButton";
import { router, useFocusEffect } from "expo-router";
import { colours } from '@/assets/colours';
import CategorySelectorComponent from "@/components/CategorySelector";
import styles from '@/assets/styles';

/**
 * This is the tab from which the user starts a flashcard quiz/test
 * @returns 
 */
export default function QuizInitialisationScreen() {
    const windowHeight = useWindowDimensions().height;
    const flashcardCategories = ["Context", "Word", "Grammer"]
    const [cardCount, SetCardCount] = useState("10")
    const [selectedCategories, SetSelectedCategories] = useState([...flashcardCategories])
    const [availableCardCount, SetAvailableCount] = useState(0)

    useFocusEffect(
            useCallback(() => {
                GetCount()
                async function GetCount() { SetAvailableCount(await GetCardAmount(selectedCategories))}

                return () => {
                    SetSelectedCategories([...flashcardCategories])
                    SetCardCount("10")
                };
            }, [])
        );

    /**
     * Starts the quiz
     */
    async function StartQuiz() {
        if(availableCardCount > 0 && Number(cardCount) > 0)
            router.push({pathname: '/(tabs)/QuizScreen', params: {categories: JSON.stringify(selectedCategories), cardCount: Number(cardCount)}})
        else
            Alert.alert("No Flashcards available", "You can create some in the flashcards tab or by translating some text and pressing the star")
    }

    /**
     * Update the selected categories to be quized
     * @param string addedCategory the category that has been added/removed
     */
    async function UpdateSelected (addedCategory){
        if(selectedCategories.includes(addedCategory))
            selectedCategories.splice(selectedCategories.indexOf(addedCategory), 1)
        else
            selectedCategories.push(addedCategory)
        SetAvailableCount(await GetCardAmount(selectedCategories))
    }

    return(
        <View style={[styles.parentContainer, {minHeight: Math.round(windowHeight)}]}>
            <View style={styles.headingContainer}>
                <ThemedText type="subtitle" style={{color: 'white'}}>Start Quiz</ThemedText>
            </View>
            <View style={styles.contentContainer}>
                <View style={{padding: 10, flex: 10}}>
                    <View style={{height: '15%'}}>
                        <ThemedText type="defaultBold" style={{marginBottom: 10}}>Select Categories to be Quized on:</ThemedText>
                        <CategorySelectorComponent onValueChange={UpdateSelected} categories={flashcardCategories} multiSelect={true}/>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <ThemedText type="defaultBold" style={{width: '75%'}}>Quiz count ({availableCardCount} cards available):</ThemedText>
                        <TextInput style={[styles.defaultText, localStyles.countInput]}
                        keyboardType='numeric' onChangeText={(e) => SetCardCount(e)}
                        value={cardCount} maxLength={2}  //setting limit of input
                        />
                    </View>
                </View>
                <View style={styles.bottomButtonContainer}>
                    <TextButton onPress={() => StartQuiz()} style={{width : '80%', height: 50}}>Start Quiz</TextButton>
                </View>
            </View>
        </View>
    )
}

const localStyles = StyleSheet.create({
    countInput : {
        width: '20%',
        textAlign: 'center',
        borderColor : colours.darkBlue,
        borderRadius : 5,
        borderWidth : 1.5
    }
})