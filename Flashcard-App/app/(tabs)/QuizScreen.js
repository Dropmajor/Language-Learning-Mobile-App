/**
 * @fileoverview This file groups contains the screen for testing the user on their saved flashcards
 */
import { useState, useCallback } from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import { GetQuizCards, } from '@/components/LocalDataHandler'
import { ThemedText } from "../../components/ThemedText";
import IconButton from "@/components/IconButton";
import FlashcardFullView from "@/components/FlashcardFullView";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { colours } from '@/assets/colours';
import { QuizCompletionView } from "@/components/QuizCompletionView";

/**
 * The screen/tab from which the quiz is performed
 */
export default function QuizScreen() {
    const [quizCards, SetQuizCards] = useState([])
    const [quizCardIndex, SetIndex] = useState(0)
    const [flashcardCorrectnessCollection, SetAnswerCollection] = useState([])
    const [correctFlashcardCount, SetCorrectFlashcardCount] = useState(0)
    const [wrongFlashcardCount,   SetWrongFlashcardCount]   = useState(0)
    const windowHeight = useWindowDimensions().height;
    const { categories } = useLocalSearchParams();
    const { cardCount } = useLocalSearchParams();

    useFocusEffect(
        useCallback(() => {
            GetCards()
            async function GetCards() {
                SetQuizCards(await GetQuizCards(JSON.parse(categories), Number(cardCount)))
            }
            
            return () => {
                SetIndex(0)
                SetAnswerCollection([])
                SetCorrectFlashcardCount(0)
                SetWrongFlashcardCount(0)
            };
        }, [categories, cardCount])
    );

    /**
     * Sets count for the users right/wrong answers
     * @param boolean correct the result of the flashcard
     */
    function UpdateAnswerResult(correct)
    {
        flashcardCorrectnessCollection.push(correct)
        if(correct)
        {
            SetCorrectFlashcardCount(correctFlashcardCount + 1)
        }
        else
        {
            SetWrongFlashcardCount(wrongFlashcardCount + 1)
        }
    }

    function DisplayNextFlashcard()
    {
        SetIndex(quizCardIndex + 1)
    }

    /**
     * Create a flashcard full view component to display the current flashcard the user is being quized on
     * @returns A flashcard full view object
     */
    function DisplayFlashcard()
    {
        var flashcard = []
        if(quizCards != null && quizCards.length > 0)
        {
            if(quizCardIndex < quizCards.length)
            {
                flashcard.push(<FlashcardFullView key={quizCardIndex} flashcardData={quizCards[quizCardIndex]} 
                    answeredCallback={UpdateAnswerResult} proceedCallback={DisplayNextFlashcard} style={{alignSelf : 'center'}}/>)
            }
            else{
                flashcard.push(<QuizCompletionView flashcards={quizCards} correctnessCollection={flashcardCorrectnessCollection} key={0}/>)
            }
        }
            
        return flashcard
    }

    return(
        <View style={[styles.parentContainer, {minHeight: Math.round(windowHeight), backgroundColor : colours.blue}]}>
            <View style={{flexDirection: 'row', padding: 15}}>
                <View style={{flex: 1}}>
                    <IconButton iconName={"arrow-back"} onPress={() => router.back()}/>
                </View>
                <View style={{flex: 2, alignItems: 'center'}}>
                    <ThemedText type="subtitle" style={{color: 'white', flex: 1}}>
                        {quizCardIndex < quizCards.length ? quizCardIndex + 1 + "/" + quizCards.length : "Quiz Completed"}</ThemedText>
                </View>
                <View style={{flex: 1}}></View>
            </View>
            <View>
                {(quizCardIndex < quizCards.length) ?
                <View>
                    <View style={{backgroundColor : 'white', width : ((quizCardIndex + 1) / quizCards.length) * 100 + '%', height: 5,
                        marginBottom : 10}}/>
                </View> : []}
                {(quizCardIndex < quizCards.length) ? <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                    <View style=
                    {[localStyles.answeredResultContainer, {backgroundColor: colours.red, borderColor : 'red', 
                    borderEndStartRadius: 10, borderEndEndRadius: 10, borderLeftWidth : 0}]}>
                        <ThemedText type="defaultBold">{wrongFlashcardCount}</ThemedText>
                    </View>
                    <View style=
                    {[localStyles.answeredResultContainer, { backgroundColor: colours.green, borderColor : '#35a23b', 
                    borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderRightWidth: 0}]}>
                        <ThemedText type="defaultBold" style={{}}>{correctFlashcardCount}</ThemedText>
                    </View>
                </View> : []}
                <View style={localStyles.flashcardContainer}>
                    {DisplayFlashcard()}
                </View>
            </View>
        </View>
    )
}

const localStyles = StyleSheet.create({
    flashcardContainer : {
        justifyContent : 'center',
        alignItems : 'center',
    },
    answeredResultContainer : {
        width: '15%', 
        alignItems: 'center',
        justifyContent : 'center',
        borderWidth : 3
    },
    smallFlashcard : {
        backgroundColor: colours.lightBlue,
        borderRadius: 10,
        borderColor: colours.blue,
        borderWidth: 2,
        marginVertical : 3,
        alignSelf: 'center',
        width: '95%'
    }
})