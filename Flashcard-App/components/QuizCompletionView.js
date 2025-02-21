/**
 * @fileoverview This file contains the component that displays the results of a flashcard quiz
 */
import { useRef, useEffect } from "react";
import { View, Animated, ScrollView, StyleSheet } from "react-native";
import FlashcardFullViewSmall from "@/components/FlashcardSmallFullView";
import { ThemedText } from "@/components/ThemedText";
import TextButton from "@/components/TextButton";
import { router } from "expo-router";

/**
 * A view that displays the results of a flashcard quiz
 * @param Array<Json> flashcards An array containing the flashcards that were part of the quiz
 * @param Array<bool> correctnessCollection An array containing bools that maps to the flashcards and tells if they were answered correctly or not
 * @returns 
 */
export function QuizCompletionView({flashcards, correctnessCollection})
{
    const animationRange = useRef(new Animated.Value(0)).current;

    const viewLocation = animationRange.interpolate({
        inputRange: [0, 1],
        outputRange: [750, 0]
    });
  
    const enterAnimation = 
    Animated.timing(animationRange, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
    })

    useEffect(() => {
        enterAnimation.start()
    }, [])

    function CreateFlashcardViews()
    {
        var viewCollection = []

        for(var i = 0; i < flashcards.length; i++)
        {
            viewCollection.push(
                <FlashcardFullViewSmall flashcardData={flashcards[i]} wasCorrect={correctnessCollection[i]} onDelete={RemoveFlashcard} key={i}/>
            )
        }
        return viewCollection
    }

    function RemoveFlashcard(flashcard_ID)
    {
        var found = false
        console.log(flashcard_ID)
        for(var i = 0; i < flashcards.length && !found; i++)
        {
            if(flashcards[i].id == flashcard_ID)
            {
                flashcards.splice(i, 1)
                correctnessCollection.splice(i, 1)
                found = true;
            }   
        }
    }

    return (
        <Animated.View style={[localStyles.viewContainer, {transform: [{ translateY: viewLocation }]}]}>
            <View style={{flex: 5}}>
                <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
                    <ThemedText type="subtitle">Quiz Results: </ThemedText>
                </View>
                <ScrollView>
                    {CreateFlashcardViews()}
                </ScrollView>
            </View>
            <View style={{alignItems: 'center', flex : 1, paddingTop: 10}}>
                <TextButton onPress={() => router.back()} style={{width : '80%', height : 50}}>Return</TextButton>
            </View>
        </Animated.View>
    )
}

const localStyles = StyleSheet.create({
    viewContainer : {
        flex: 0, 
        backgroundColor: 'white', 
        borderTopLeftRadius : 30, 
        borderTopRightRadius : 30, 
        paddingTop: 10,
        width: '100%', height: '100%'
    },
})